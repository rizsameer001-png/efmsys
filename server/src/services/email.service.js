// server/src/services/email.service.js
const { sendEmail } = require('../config/mailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

class EmailService {
  constructor() {
    this.templates = {};
    this.loadTemplates();
  }

  loadTemplates() {
    const templateDir = path.join(__dirname, '../templates/email');
    const templates = ['welcome', 'reset-password', 'user-invite', 'account-created'];

    templates.forEach((template) => {
      const filePath = path.join(templateDir, `${template}.hbs`);
      if (fs.existsSync(filePath)) {
        const source = fs.readFileSync(filePath, 'utf8');
        this.templates[template] = handlebars.compile(source);
      }
    });
  }

  async sendWelcomeEmail(user, password) {
    const html = this.templates.welcome({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      password: password,
      loginUrl: `${process.env.FRONTEND_URL}/login`,
    });

    return await sendEmail({
      to: user.email,
      subject: 'Welcome to FMS Enterprise',
      html,
    });
  }

  async sendUserInvite(user, invitedBy) {
    const inviteToken = Buffer.from(JSON.stringify({
      email: user.email,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })).toString('base64');

    const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}`;

    const html = this.templates['user-invite']({
      name: `${user.firstName} ${user.lastName}`,
      inviter: invitedBy,
      inviteUrl,
      company: process.env.COMPANY_NAME,
    });

    return await sendEmail({
      to: user.email,
      subject: `You've been invited to join ${process.env.COMPANY_NAME}`,
      html,
    });
  }

  async sendAccountCreatedEmail(user, password) {
    const html = this.templates['account-created']({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      password: password,
      loginUrl: `${process.env.FRONTEND_URL}/login`,
    });

    return await sendEmail({
      to: user.email,
      subject: 'Your account has been created',
      html,
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = this.templates['reset-password']({
      resetUrl,
      expiryHours: 1,
    });

    return await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html,
    });
  }
}

module.exports = new EmailService();