import { User } from '@prisma/client';
import nodeMailer from 'nodemailer';

import { mailerConfig } from '../../config/mailer';
import { LoggerFactory } from '../../factories/LoggerFactory';
import { ILogger } from '../../interfaces/logger/ILogger';
import MailerError from '../errors/MailerError';
import { IMailerOptions, IMailerService } from './interfaces';
import { forgotPasswordEmailTemplate } from './templates/forgotPassword';

export class MailerService implements IMailerService {
  constructor(private logger: ILogger = LoggerFactory.create()) {}

  public async sendResetPasswordEmail(
    user: Pick<User, 'userName' | 'email'>,
    token: string,
  ): Promise<void> {
    try {
      const emailConfig = this.createEmailConfig();
      const transporter = nodeMailer.createTransport({
        ...emailConfig,
      });
      const email = forgotPasswordEmailTemplate(
        user,
        `${emailConfig.resetPasswordBaseUrl}/reset-password?token=${token}`,
      );
      const info = await transporter.sendMail(email);

      this.logger.info({ msg: `URL: ${nodeMailer.getTestMessageUrl(info)}` });
    } catch (error) {
      throw new MailerError((error as Error).message);
    }
  }

  private createEmailConfig(): IMailerOptions {
    const {
      MAILER_HOST,
      MAILER_PASSWORD,
      MAILER_PORT,
      MAILER_USERNAME,
      RESET_PASSWORD_BASE_URL,
    } = mailerConfig();
    return {
      host: MAILER_HOST,
      port: MAILER_PORT,
      auth: {
        user: MAILER_USERNAME,
        pass: MAILER_PASSWORD,
      },
      resetPasswordBaseUrl: RESET_PASSWORD_BASE_URL,
    };
  }
}
