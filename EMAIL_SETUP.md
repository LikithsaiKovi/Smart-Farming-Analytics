# 📧 Email Setup Guide

## 🔧 **Required: Email Configuration for Real OTP**

To enable real OTP authentication, you need to configure SMTP settings.

### **Step 1: Create Environment File**

Create a `.env` file in the `server` directory:

```bash
# Navigate to server directory
cd server

# Create .env file
touch .env  # Linux/Mac
# or
echo. > .env  # Windows
```

### **Step 2: Add Email Configuration**

Add the following to your `server/.env` file:

```env
# Email Configuration (REQUIRED)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# OpenWeather API
OPENWEATHER_API_KEY=2170cf9f72b3eee31fdac25765223afd

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-for-agroanalytics-2024

# Server Configuration
PORT=5000
NODE_ENV=development
```

### **Step 3: Gmail Setup (Recommended)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password as `SMTP_PASS`

### **Step 4: Alternative Email Providers**

#### **Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

#### **Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

### **Step 5: Test Email Configuration**

1. **Start the backend server:**
   ```bash
   cd server
   node server.js
   ```

2. **Test registration:**
   - Go to `http://localhost:3001`
   - Register with your email
   - Check your email for OTP

## 🚨 **Important Security Notes**

- ✅ **Never commit `.env` file to version control**
- ✅ **Use app passwords, not your main password**
- ✅ **Keep your JWT secret secure**
- ✅ **Use HTTPS in production**

## 🔧 **Troubleshooting**

### **"Authentication failed" error:**
- Check your email and app password
- Ensure 2FA is enabled on Gmail
- Verify app password is correct

### **"Connection timeout" error:**
- Check your internet connection
- Verify SMTP host and port
- Try different email provider

### **"OTP not received":**
- Check spam/junk folder
- Verify email address is correct
- Check SMTP configuration

## 🎯 **Quick Test**

1. **Configure email settings**
2. **Start backend server**
3. **Register with your email**
4. **Check email for OTP**
5. **Login with received OTP**

**Your real-time authentication system is now ready!** 🎉
