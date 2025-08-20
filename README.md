# 🚀 Royal Nano Backend API

Backend API for Royal Nano Angular frontend with MongoDB Atlas integration and Vercel deployment support.

## ✨ Features

- **Contact Form API** - للتواصل العام والاستفسارات
- **Join Form API** - نموذج التقديم للوظائف
- **MongoDB Atlas Integration** - تخزين البيانات في قاعدة بيانات MongoDB
- **Health Check Endpoint** - فحص حالة الخادم وقاعدة البيانات
- **CORS Enabled** - دعم الواجهات الأمامية
- **Vercel Ready** - جاهز للنشر على Vercel

## 🗄️ Database Schemas

### Contact Form Schema (نموذج التواصل)

```javascript
{
  contactName: String,        // اسم صاحب الاستفسار *
  contactEmail: String,       // البريد الإلكتروني *
  contactPhone: String,       // رقم الهاتف (اختياري)
  contactSubject: String,     // موضوع الاستفسار *
  contactMessage: String,     // الرسالة *
  contactType: String,        // نوع الاستفسار (general, support, partnership, other)
  createdAt: Date            // تاريخ الإنشاء
}
```

### Join Form Schema (نموذج التوظيف)

```javascript
{
  fullName: String,           // الاسم الكامل *
  phoneNumber: String,        // رقم الهاتف *
  email: String,              // البريد الإلكتروني (اختياري)
  jobPosition: String,        // الوظيفة المطلوبة *
  experience: String,         // الخبرة السابقة (اختياري)
  additionalMessage: String,  // رسالة إضافية (اختياري)
  cvFileName: String,         // اسم ملف السيرة الذاتية (اختياري)
  cvPath: String,             // مسار ملف السيرة الذاتية (اختياري)
  status: String,             // حالة الطلب (pending, reviewed, accepted, rejected)
  createdAt: Date            // تاريخ الإنشاء
}
```

## 🚀 API Endpoints

### Health Check

```
GET /api/health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "mongodb": "connected",
  "timestamp": "2025-08-20T11:40:50.217Z"
}
```

**MongoDB Status Values:**

- `"connected"` - متصل (readyState === 1)
- `"disconnected"` - غير متصل (readyState === 0, 2, 3)

### Contact Form

```
POST /api/contact
```

**Required Fields:** `contactName`, `contactEmail`, `contactSubject`, `contactMessage`

```
GET /api/contact
```

**Returns:** جميع رسائل التواصل مرتبة حسب التاريخ

### Join Form (Job Applications)

```
POST /api/join
```

**Required Fields:** `fullName`, `phoneNumber`, `jobPosition`

```
GET /api/join
```

**Returns:** جميع طلبات التوظيف مرتبة حسب التاريخ

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Vercel account (for deployment)

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd Royal-nano-backend

# Install dependencies
npm install

# Create .env file
cp env.example .env

# Update MongoDB connection string in .env
MONGO_URI=mongodb+srv://admin:ahmed123@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan

# Start development server
npm run dev

# Or start local server (no MongoDB required)
npm run local
```

### Environment Variables

```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://admin:ahmed123@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan

# Optional: Port for local development
PORT=3000
```

## 🧪 Testing

### Test All Endpoints

```bash
npm test
```

### Manual Testing

```bash
# Health Check
curl http://localhost:3000/api/health

# Submit Contact Form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"contactName":"أحمد حسن","contactEmail":"ahmed@example.com","contactSubject":"استفسار","contactMessage":"مرحباً"}'

# Submit Join Form
curl -X POST http://localhost:3000/api/join \
  -H "Content-Type: application/json" \
  -d '{"fullName":"محمد علي","phoneNumber":"+966501234567","jobPosition":"سائق"}'
```

## 🚀 Deployment

### Vercel Deployment

1. **Push code to GitHub**
2. **Connect repository to Vercel**
3. **Add environment variables:**
   - `MONGO_URI`: MongoDB Atlas connection string
4. **Deploy!**

### Vercel Configuration

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

## 📊 Current Status

- ✅ **MongoDB Atlas**: متصل ويعمل
- ✅ **Contact Form**: يعمل مع النموذج الجديد
- ✅ **Join Form**: يعمل مع النموذج الجديد
- ✅ **Health Check**: يعرض حالة MongoDB بدقة
- ✅ **API Endpoints**: جميع النقاط تعمل
- ✅ **Data Storage**: البيانات تُخزن في قاعدة البيانات
- ✅ **Ready for Vercel**: جاهز للنشر

## 🔧 Troubleshooting

### MongoDB Connection Issues

- تأكد من أن MongoDB Atlas cluster يعمل
- تحقق من أن IP address مسموح به في Network Access
- تأكد من صحة connection string

### Port Already in Use

```bash
# Windows
Get-Process -Name "node" | Stop-Process -Force

# Linux/Mac
pkill node
```

## 📝 Scripts

```json
{
  "start": "node server.js", // Production server
  "dev": "nodemon server.js", // Development server with auto-reload
  "local": "node server-local.js", // Local server (no MongoDB)
  "local:dev": "nodemon server-local.js", // Local development
  "test": "node test-api.js" // Test all endpoints
}
```

## 🌟 Key Improvements

1. **MongoDB Status Tracking**: استخدام `mongoose.connection.readyState` للحصول على الحالة الفعلية
2. **Enhanced Schemas**: نماذج منفصلة وواضحة للتواصل والتوظيف
3. **Better Error Handling**: معالجة أفضل للأخطاء وحالة الاتصال
4. **Comprehensive Testing**: اختبار شامل لجميع النقاط
5. **Production Ready**: جاهز للنشر على Vercel

## 📞 Support

For support or questions, please contact the development team.

---

**Built with ❤️ for Royal Nano**
