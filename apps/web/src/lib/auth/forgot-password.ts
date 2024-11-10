'use server';

import { createResetPasswordToken, deleteResetTokenByEmail, getResetPasswordTokenByToken } from '../../data/reset-token/reset-token';
import { userRepository } from '../../data/users/users';
import {
  ForgotPasswordSchema,
  type ForgotPasswordSchemaType,
  ResetPasswordSchema,
  type ResetPasswordSchemaType,
} from '@org/shared/schema/auth.schema';

import { hashMyPassword } from './common';
import { MessageResponse } from '@org/shared/types';
import { authEmail } from './auth-email';

export async function forgotPasswordAction(
  data: ForgotPasswordSchemaType
  // captchaOptions: CaptchaActionOptions,
): Promise<MessageResponse> {
  try {
    const validate = ForgotPasswordSchema.safeParse(data);
    if (!validate.success) {
      return {
        message: validate.error.errors[0].message || 'Invalid email',
        success: false,
      };
    }
    // const googleResponse = await reCaptchaSiteVerify(captchaOptions)

    // if (!googleResponse.success) {
    //   return {
    //     message: googleResponse.message,
    //     success: false,
    //   }
    // }
    const { email } = validate.data;
    // send email with reset password link
    const existingUser = await userRepository.getUserByEmail(email);
    if (!existingUser) {
      return {
        message: 'user may not exist or verified',
        success: false,
      };
    }
    if (!existingUser?.password) {
      // means the user signed up with social media
      return {
        message:
          'this account requires social media login or it does not exist',
        success: false,
      };
    }
    const token = await createResetPasswordToken(email);
    if (!token) {
      return {
        message: 'Something went wrong',
        success: false,
      };
    }
    // await sendResetPasswordEmail(email, token?.token);
    const { data: authEmailResponseData, error } = await authEmail(
      email,
      'reset',
      token.token
    );
    console.log(authEmailResponseData, error);

    return {
      message: 'Email Sent Successfully',
      success: true,
    };
  } catch (error) {
    console.log(
      'error ocurred while forgetting password :',
      error instanceof Error ? error.message : error
    );
    return {
      message: 'Something went wrong',
      success: false,
    };
  }
}

export async function resetPasswordAction(
  data: ResetPasswordSchemaType,
  token?: string
): Promise<MessageResponse> {
  try {
    if (!token) {
      return {
        message: 'Invalid Request',
        success: false,
      };
    }
    const validate = ResetPasswordSchema.safeParse(data);
    if (!validate.success) {
      return {
        message: validate.error.errors[0].message || 'Invalid password',
        success: false,
      };
    }
    const { password, confirmPassword } = validate.data;

    if (password !== confirmPassword) {
      return {
        message: 'Passwords do not match',
        success: false,
      };
    }
    const tokenExists = await getResetPasswordTokenByToken(token);

    if (!tokenExists) {
      return {
        message: 'Invalid token',
        success: false,
      };
    }

    // update password
    const user = await userRepository.getUserByEmail(tokenExists.email);
    if (!user)
      return {
        message: 'user may not exist or verified',
        success: false,
      };

    if (new Date(tokenExists.expires) > new Date()) {
      return {
        message: 'Token Expired',
        success: false,
      };
    }

    const hashedPassword = await hashMyPassword(password);
    await userRepository.updateUserPassword(tokenExists.email, hashedPassword);
    deleteResetTokenByEmail(tokenExists.email);
    return {
      message: 'Password Updated Successfully',
      success: true,
    };
  } catch (error) {
    console.log(
      'error ocurred while resetting password :',
      error instanceof Error ? error.message : error
    );
    return {
      message: 'Something went wrong',
      success: false,
    };
  }
}
