import { resend } from '../email-send';

type SendAuthEmailType = 'reset' | 'verify' | 'confirmation';
export const authEmail = async (
  email: string,
  type: SendAuthEmailType,
  token: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: [email],
    subject: type === 'verify' ? 'Email Verification' : 'Resetting Email',
    //     @ts-expect-error : we will create this verify email template later
    react: VerifyEmailTemplate({
      link:
        type === 'verify'
          ? `${process.env.HOST}/auth/email_verify?token=${token}`
          : `${process.env.HOST}/auth/new-password?token=${token}`,
    }),
  });
  return { data, error };
};
