import { IEmailTemplate } from '../interfaces';

const SENDER_NAME = 'Ases';
const SENDER_EMAIL = 'contact@asses.com.br';

export const forgotPasswordEmailTemplate = (
  user: { userName: string; email: string },
  url: string,
): IEmailTemplate => ({
  from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
  to: user.email,
  subject: 'Redefinição de Senha',
  text: `Olá, ${user.userName}! Você pediu para redefinir sua senha. 
    Use o link a seguir para trocar a sua senha: ${url}`,
  html: `<h1>Olá!</h1> Você pediu para redefinir sua senha. 
  Use o link a seguir para trocar a sua senha: <a href="${url}" target="_blank">resetar senha</a>`,
});
