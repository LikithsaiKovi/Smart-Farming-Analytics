import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'P0-bYcvuPvgZC67Ik';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_5dmvdp8';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_yx88nmf';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

interface EmailParams {
  email: string;
  passcode: string;
  time?: string;
}

export const emailService = {
  async sendOTP(email: string, otp: string, name: string = 'User'): Promise<{ success: boolean; error?: string }> {
    try {
      const templateParams: EmailParams = {
        email: email,
        passcode: otp,
        time: '15 minutes'
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('OTP email sent successfully via EmailJS');
      return { success: true };
    } catch (error: any) {
      console.error('Failed to send OTP email:', error);
      return { 
        success: false, 
        error: error?.text || error?.message || 'Failed to send email' 
      };
    }
  },

  async sendRegistrationOTP(email: string, name: string, otp: string): Promise<{ success: boolean; error?: string }> {
    try {
      const templateParams: EmailParams = {
        email: email,
        passcode: otp,
        time: '15 minutes'
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Registration OTP email sent successfully via EmailJS');
      return { success: true };
    } catch (error: any) {
      console.error('Failed to send registration OTP email:', error);
      return { 
        success: false, 
        error: error?.text || error?.message || 'Failed to send email' 
      };
    }
  }
};
