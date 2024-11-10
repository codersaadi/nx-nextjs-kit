'use server';
import { AuthError } from 'next-auth';

import { signOut } from '@web/auth';
import { signIn } from '@web/auth';

import { userRepository } from '@web/data/users/users';
import { MessageResponse } from '@org/shared/types';
import { LoginSchema, LoginSchemaType } from '@org/shared/schema/auth.schema';
import { createVerificationToken } from '@web/data/verification-token/verification-token';
export { signOut };
// import { sendEmailVerification } from "./common";

export async function signInAction(
  data: LoginSchemaType
  // captchaOptions: CaptchaActionOptions,
): Promise<MessageResponse> {
  const validate = await LoginSchema.safeParseAsync(data);
  if (!validate.success) {
    return {
      message: validate.error.errors[0].message,
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
  const { email, password } = validate.data;
  const user = await userRepository.getUserByEmail(email);
  const ERROR_INVALID_CREDENTIALS = 'Invalid credentials';
  // if user is not found or email or password is not provided
  if (!user || !user.email || !user.password) {
    return {
      message: ERROR_INVALID_CREDENTIALS,
      success: false,
    };
  }
  // if user is not verified
  if (!user.emailVerified) {
    const token = await createVerificationToken(email);
    if (!token) return { message: 'Something went wrong!', success: false };
    // await sendEmailVerification(email, token?.token);
    return {
      message: 'Confirmation Email Sent',
      success: true,
    };
  }
  try {
    await signIn('credentials', {
      email,
      password,
    });

    return {
      message: 'Sign In Sucessfully',
      success: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: ERROR_INVALID_CREDENTIALS, success: false };
        default:
          return { message: 'Something went wrong!', success: false };
      }
    }
    throw error;
  }
}
