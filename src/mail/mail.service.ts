import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 8_000,
  });

  async sendMail(dto: SendMailDto) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: dto.to,
        subject: dto.subject,
        html: dto.message,
      });
      return { messageId: info.messageId };
    } catch (error) {
      console.error('Error enviando correo (SMTP no disponible o credenciales inválidas):', error);
      return null;
    }
  }
}