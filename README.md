# Royal Nano Backend API

Backend API مخصص لـ Angular frontend الخاص بـ Royal Nano، مبني باستخدام Node.js و Express.

## 🚀 المميزات

- ✅ API endpoint للتواصل (`/api/contact`)
- ✅ API endpoint للانضمام مع رفع ملف CV (`/api/join`)
- ✅ معالجة الملفات باستخدام Multer
- ✅ CORS مفعل للـ frontend
- ✅ تحقق من صحة البيانات
- ✅ معالجة الأخطاء
- ✅ جاهز للنشر على Vercel
- ✅ جاهز للنشر على GitHub

## 📋 المتطلبات

- Node.js (v16 أو أحدث)
- npm أو yarn

## 🛠️ التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
git clone https://github.com/YOUR_USERNAME/royal-nano-backend.git
cd royal-nano-backend
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. تشغيل السيرفر

```bash
# للتطوير (مع nodemon)
npm run dev

# للإنتاج
npm start
```

السيرفر سيعمل على المنفذ 5000 (أو المنفذ المحدد في متغير البيئة PORT).

## 🌐 API Endpoints

### 1. Contact Form - `/api/contact`

**POST** `/api/contact`

**Body:**

```json
{
  "fullName": "أحمد حسن",
  "phoneNumber": "+966501234567",
  "carType": "سيدان",
  "carModel": "2023",
  "notes": "ملاحظات إضافية"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Contact form received"
}
```

### 2. Join Form - `/api/join`

**POST** `/api/join`

**Body (multipart/form-data):**

- `fullName`: الاسم الكامل
- `phoneNumber`: رقم الهاتف
- `email`: البريد الإلكتروني
- `position`: المنصب المطلوب
- `experience`: الخبرة (اختياري)
- `message`: رسالة (اختيارية)
- `cv`: ملف CV (PDF, DOC, DOCX)

**Response:**

```json
{
  "success": true,
  "message": "Join form received",
  "cv": "cv-1234567890-123456789.pdf"
}
```

### 3. Health Check - `/api/health`

**GET** `/api/health`

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 📁 متطلبات الملفات

- **CV Files**: PDF, DOC, DOCX فقط
- **حجم الملف**: أقصى 5MB
- **المجلد**: يتم حفظ الملفات في `uploads/`

## 🔧 متغيرات البيئة

- `PORT`: منفذ السيرفر (افتراضي: 5000)

## 🚀 النشر

### النشر على Vercel

المشروع جاهز للنشر على Vercel مع ملف `vercel.json` المكون مسبقاً.

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel
```

### النشر على GitHub

```bash
# إضافة remote origin
git remote add origin https://github.com/YOUR_USERNAME/royal-nano-backend.git

# رفع الكود
git push -u origin master
```

## 🔗 ربط مع Angular Frontend

### في Angular Service:

```typescript
// للتطوير
private apiUrl = 'http://localhost:5000/api';

// للإنتاج (Vercel)
private apiUrl = 'https://your-vercel-app.vercel.app/api';
```

## 📂 هيكل المشروع

```
royal-nano-backend/
├── server.js          # الملف الرئيسي للسيرفر
├── package.json       # تبعيات المشروع
├── vercel.json        # إعدادات Vercel
├── .gitignore         # ملفات Git
├── README.md          # هذا الملف
└── uploads/           # مجلد حفظ الملفات (يتم إنشاؤه تلقائياً)
```

## 🛡️ الأمان

- CORS مفعل للـ frontend
- تحقق من نوع وحجم الملفات
- معالجة الأخطاء
- تحقق من صحة البيانات المدخلة

## 📝 التطوير

### تشغيل في وضع التطوير

```bash
npm run dev
```

### تشغيل في وضع الإنتاج

```bash
npm start
```

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

لأي استفسارات أو مشاكل، يرجى التواصل مع فريق التطوير أو فتح issue على GitHub.

---

⭐ إذا أعجبك المشروع، لا تنسى إعطاءه نجمة على GitHub!
