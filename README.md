# 🚀 Royal Nano Backend API

Backend API for Royal Nano Angular frontend with MongoDB Atlas integration and Vercel deployment support.

## ✨ Features

- **Car Protection Service API** - نموذج طلب خدمة حماية السيارة
- **Join Form API** - نموذج التقديم للوظائف
- **MongoDB Atlas Integration** - تخزين البيانات في قاعدة بيانات MongoDB
- **Health Check Endpoint** - فحص حالة الخادم وقاعدة البيانات
- **CORS Enabled** - دعم الواجهات الأمامية
- **Vercel Ready** - جاهز للنشر على Vercel

## 🗄️ Database Schemas

### Car Protection Service Schema (نموذج خدمة حماية السيارة)

```javascript
{
  fullName: String,           // الاسم الكامل *
  phoneNumber: String,        // رقم الهاتف *
  carType: String,            // نوع السيارة *
  carModel: String,           // موديل السيارة *
  additionalNotes: String,    // ملاحظات إضافية (اختياري)
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

### Car Protection Service

```
POST /api/contact
```

**Required Fields:** `fullName`, `phoneNumber`, `carType`, `carModel`

```
GET /api/contact
```

**Returns:** جميع طلبات خدمات حماية السيارة مرتبة حسب التاريخ

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
MONGO_URI=mongodb+srv://test:200111@ryoalnan.ev2z8cp.mongodb.net/?retryWrites=true&w=majority&appName=ryoalnan

# Start development server
npm run dev

# Or start local server (no MongoDB required)
npm run local
```

### Environment Variables

```env
# MongoDB Atlas Connection String
MONGO_URI=mongodb+srv://test:200111@ryoalnan.ev2z8cp.mongodb.net/?retryWrites=true&w=majority&appName=ryoalnan

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

# Submit Car Protection Service Request
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"أحمد حسن","phoneNumber":"+966501234567","carType":"سيدان","carModel":"2023","additionalNotes":"أريد حماية كاملة للسيارة"}'

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
- ✅ **Car Protection Service**: يعمل مع النموذج الجديد
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
2. **Car Protection Service Schema**: نموذج مخصص لخدمات حماية السيارة
3. **Enhanced Join Schema**: نموذج واضح للتوظيف
4. **Better Error Handling**: معالجة أفضل للأخطاء وحالة الاتصال
5. **Comprehensive Testing**: اختبار شامل لجميع النقاط
6. **Production Ready**: جاهز للنشر على Vercel

## 📞 Support

For support or questions, please contact the development team.

---

**Built with ❤️ for Royal Nano**
