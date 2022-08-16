export interface IMailerService {
  sendResetPasswordEmail(
    user: { userName: string; email: string },
    token: string,
  ): Promise<void>;
}

export interface IEmailTemplate {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface IMailerOptions {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}
