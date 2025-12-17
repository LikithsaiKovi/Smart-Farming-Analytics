const nodemailer = require('nodemailer');
const axios = require('axios');
const config = require('./config');

class EmailService {
  constructor() {
    this.transporterPromise = null;
    this.lastError = null;
  }

  buildTransportOptions() {
    return {
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass
      },
      // Conservative timeouts so failures don't hang/crash
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
      // Keep TLS lenient to avoid PaaS proxy issues
      tls: { rejectUnauthorized: false }
    };
  }

  async createTransporter() {
    try {
      console.log('SMTP Config:', {
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass ? '***hidden***' : 'NOT SET'
      });

      if (!config.smtp.host || !config.smtp.auth.user || !config.smtp.auth.pass) {
        const msg = 'SMTP config incomplete (host/user/pass missing)';
        console.log('❌', msg);
        this.lastError = new Error(msg);
        return { transporter: null, isReady: false };
      }

      const transporter = nodemailer.createTransport(this.buildTransportOptions());

      // Verify but DO NOT throw fatally on failure
      await transporter.verify();
      console.log('✅ SMTP Server is ready to send emails');
      this.lastError = null;
      return { transporter, isReady: true };
    } catch (error) {
      console.log('❌ SMTP Error:', error.message);
      console.log('📧 Please configure SMTP:');
      console.log('   1) Provider examples:');
      console.log('      - Mailgun: host=smtp.mailgun.org, user=postmaster@YOUR_DOMAIN, pass=SMTP_PASSWORD');
      console.log('      - Brevo:   host=smtp-relay.brevo.com, user=YOUR_LOGIN, pass=SMTP_KEY');
      console.log('      - AWS SES: host=email-smtp.<region>.amazonaws.com, user=SES_SMTP_USER, pass=SES_SMTP_PASS');
      console.log('   2) Set SMTP_FROM_EMAIL to a verified sender');
      console.log('   3) For port 587 set SMTP_SECURE=false; for 465 set true');
      this.lastError = error;
      // Return a non-fatal state so server keeps running
      return { transporter: null, isReady: false };
    }
  }

  async getTransporter() {
    // Lazily (re)create the transporter if needed
    if (!this.transporterPromise) {
      this.transporterPromise = this.createTransporter();
    }
    const state = await this.transporterPromise;
    if (state.transporter) return state.transporter;

    // Retry once on-demand when first send happens
    this.transporterPromise = this.createTransporter();
    const retryState = await this.transporterPromise;
    return retryState.transporter || null;
  }

  async sendOTP(email, otp) {
    try {
      console.log('Attempting to send OTP to:', email);

      // If EmailJS provider is selected, send via EmailJS REST API (no SMTP)
      if ((config.email && config.email.provider) === 'emailjs') {
        const payload = {
          service_id: config.email.emailjs.serviceId,
          template_id: config.email.emailjs.templateId,
          user_id: config.email.emailjs.publicKey,
          template_params: {
            to_email: email,
            otp,
            name: 'User',
            from_name: config.email.emailjs.fromName || 'AgroAnalytics',
            subject: 'Your OTP for AgroAnalytics Login'
          }
        };

        const resp = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        });
        console.log('OTP email sent via EmailJS:', resp.status);
        return { success: true, provider: 'emailjs' };
      }

      // Fallback to SMTP transporter
      const transporter = await this.getTransporter();
      if (!transporter) {
        const msg = 'Email transport not available. Check SMTP connectivity from the server.';
        console.error('❌ Error sending OTP email:', { message: msg, lastError: this.lastError && this.lastError.message });
        return { success: false, error: msg };
      }

      const mailOptions = {
        from: `"AgroAnalytics" <${config.smtp.from}>`,
        to: email,
        subject: 'Your OTP for AgroAnalytics Login',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">AgroAnalytics</h1>
              <p style="color: white; margin: 5px 0 0 0;">Smart Agriculture Platform</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Your One-Time Password</h2>
              
              <p style="color: #6b7280; margin-bottom: 20px;">
                Use the following code to complete your login to AgroAnalytics:
              </p>
              
              <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #10b981; font-size: 32px; letter-spacing: 5px; margin: 0; font-family: monospace;">
                  ${otp}
                </h1>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © 2024 AgroAnalytics. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error sending OTP email:', {
        message: error.message,
        code: error.code,
        response: error.response,
        command: error.command
      });
      return { success: false, error: error.message };
    }
  }

  async sendRegistrationOTP(email, name, otp) {
    try {
      // EmailJS path
      if ((config.email && config.email.provider) === 'emailjs') {
        const payload = {
          service_id: config.email.emailjs.serviceId,
          template_id: config.email.emailjs.templateId,
          user_id: config.email.emailjs.publicKey,
          template_params: {
            to_email: email,
            otp,
            name,
            from_name: config.email.emailjs.fromName || 'AgroAnalytics',
            subject: 'Verify Your Email - AgroAnalytics'
          }
        };
        const resp = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        });
        console.log('Registration OTP sent via EmailJS:', resp.status);
        return { success: true, provider: 'emailjs' };
      }

      const transporter = await this.getTransporter();
      if (!transporter) {
        const msg = 'Email transport not available. Check SMTP connectivity from the server.';
        console.error('Error sending registration OTP email:', { message: msg, lastError: this.lastError && this.lastError.message });
        return { success: false, error: msg };
      }

      const mailOptions = {
        from: `"AgroAnalytics" <${config.smtp.from}>`,
        to: email,
        subject: 'Verify Your Email - AgroAnalytics Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">AgroAnalytics</h1>
              <p style="color: white; margin: 5px 0 0 0;">Smart Agriculture Platform</p>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome ${name}!</h2>
              
              <p style="color: #6b7280; margin-bottom: 20px;">
                Thank you for signing up for AgroAnalytics! To complete your account creation, please verify your email address using the code below:
              </p>
              
              <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #10b981; font-size: 32px; letter-spacing: 5px; margin: 0; font-family: monospace;">
                  ${otp}
                </h1>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                This verification code will expire in 10 minutes. If you didn't create an account with AgroAnalytics, please ignore this email.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  © 2024 AgroAnalytics. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Registration OTP email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending registration OTP email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      // EmailJS path
      if ((config.email && config.email.provider) === 'emailjs') {
        const payload = {
          service_id: config.email.emailjs.serviceId,
          template_id: config.email.emailjs.templateId,
          user_id: config.email.emailjs.publicKey,
          template_params: {
            to_email: email,
            name,
            from_name: config.email.emailjs.fromName || 'AgroAnalytics',
            subject: 'Welcome to AgroAnalytics!'
          }
        };
        const resp = await axios.post('https://api.emailjs.com/api/v1.0/email/send', payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        });
        console.log('Welcome email sent via EmailJS:', resp.status);
        return { success: true, provider: 'emailjs' };
      }

      const transporter = await this.getTransporter();
      if (!transporter) {
        const msg = 'Email transport not available. Check SMTP connectivity from the server.';
        console.error('Error sending welcome email:', { message: msg, lastError: this.lastError && this.lastError.message });
        return { success: false, error: msg };
      }

      const mailOptions = {
        from: `"AgroAnalytics" <${config.smtp.from}>`,
        to: email,
        subject: 'Welcome to AgroAnalytics!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">Welcome to AgroAnalytics!</h1>
            </div>
            
            <div style="padding: 30px; background: #f9fafb;">
              <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${name}!</h2>
              
              <p style="color: #6b7280; margin-bottom: 20px;">
                Welcome to the future of smart agriculture! You now have access to:
              </p>
              
              <ul style="color: #6b7280; margin-bottom: 20px;">
                <li>Real-time weather monitoring</li>
                <li>Soil health analytics</li>
                <li>Crop performance tracking</li>
                <li>Market trend analysis</li>
                <li>AI-powered insights</li>
              </ul>
              
              <p style="color: #6b7280;">
                Start exploring your dashboard to make data-driven decisions for your farm.
              </p>
            </div>
          </div>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = EmailService;
