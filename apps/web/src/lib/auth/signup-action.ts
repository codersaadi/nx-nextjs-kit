'use server';
import { authEmail } from './auth-email';
import { hashMyPassword } from './common';
import { MessageResponse } from '@org/shared/types';
import { userRepository } from '../../data/users/users';
import { saveProfile } from '../../data/user-profile/user-profile';
import { createVerificationToken } from '../../data/verification-token/verification-token';
import { SignupSchema, SignupSchemaType } from '@org/shared/schema/auth.schema';

export async function signUpAction(
  data: SignupSchemaType
  // captchaOptions: CaptchaActionOptions,
): Promise<MessageResponse> {
  const validate = SignupSchema.safeParse(data);

  if (!validate.success) {
    return {
      message: validate.error.errors[0].message || 'Invalid credentials',
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

  const { email, password, name } = validate.data;
  try {
    const userExists = await userRepository.getUserByEmail(email);
    if (userExists)
      return {
        message: 'User already exists',
        success: false,
      };

    // Hash the password
    const hashedPassword = await hashMyPassword(password);
    const user = await userRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });
    if (!user) return { message: 'error creating user', success: false };
    await saveProfile(user.id, {
      displayName: user.name || undefined,
      image: user.image || undefined,
    });

    const token = await createVerificationToken(email);
    if (!token) return { message: 'Something went wrong!', success: false };
    await authEmail(email, 'verify', token?.token);
    return { message: 'Confirmation Email Sent', success: true };
  } catch (error) {
    console.error(error);
    return {
      message: 'An error occurred during sign up',
      success: false,
    };
  }
}
