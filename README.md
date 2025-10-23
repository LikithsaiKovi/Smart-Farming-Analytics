# 🌾 Smart Farming Analytics

A modern, responsive web application for agricultural data analysis and monitoring with real-time weather integration and OTP authentication.

## 🚀 Quick Start

### **Option 1: Automatic Start (Recommended)**
```bash
start.bat
```

### **Option 2: Manual Start**
```bash
# Terminal 1 - Backend
cd server
node server.js

# Terminal 2 - Frontend
npm run dev
```

### **Option 3: Check Status**
```bash
check-status.bat
```

## 🌟 Features

### 🔐 Authentication
- **OTP-based Login**: Secure email authentication
- **User Registration**: Complete signup with farm details
- **Demo Mode**: Works without email configuration
- **Real Email**: Configure SMTP for actual emails

### 🌤️ Weather Integration
- **Real-time Weather**: Live weather data from OpenWeather API
- **Location-based**: Accurate weather for your area
- **Weather Trends**: Historical and current conditions

### 📱 Responsive Design
- **Mobile-first**: Optimized for all devices
- **Tablet Support**: Perfect for field use
- **Desktop Experience**: Full-featured dashboard

## 🎯 How to Use

### **Step 1: Start the Application**
```bash
start.bat
```

### **Step 2: Access the Application**
- **Frontend**: `http://localhost:3001`
- **Backend**: `http://localhost:5000`

### **Step 3: Test Authentication**
1. **Sign Up**: Fill in your details
2. **Login**: Use any email + OTP "123456" (demo mode)
3. **Dashboard**: Explore all features

## 🔧 Configuration

### **Email Setup (Optional)**
To enable real email OTP:
1. **Create `server/.env` file**
2. **Add your SMTP credentials**
3. **Restart backend server**

### **Environment Variables**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
OPENWEATHER_API_KEY=2170cf9f72b3eee31fdac25765223afd
```

## 🎉 Success!

**Your Smart Farming Analytics application includes:**
- ✅ **Real-time Weather Data**
- ✅ **OTP Authentication**
- ✅ **Responsive Design**
- ✅ **Weather API Integration**
- ✅ **User Management**
- ✅ **Database Storage**

**Access your application at: `http://localhost:3001`**

## 📧 Support

For issues or questions:
1. **Check Status**: Run `check-status.bat`
2. **Restart Servers**: Run `start.bat`
3. **Check Logs**: Look at terminal output

**Your Smart Farming Analytics application is ready!** 🌾🚀