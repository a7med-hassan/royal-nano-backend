# نظام رفع ملفات CV باستخدام Uploadthing SDK

## 📋 نظرة عامة

تم تحديث نظام Join Form ليدعم رفع ملفات CV باستخدام Uploadthing SDK الرسمي.

## 🔧 الإعداد المطلوب

### 1. إنشاء حساب Uploadthing

1. اذهب إلى [uploadthing.com](https://uploadthing.com)
2. أنشئ حساب جديد
3. احصل على SECRET و APP_ID من لوحة التحكم

### 2. إضافة Environment Variables

في Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Uploadthing Configuration
UPLOADTHING_SECRET=sk_live_663334a5e71021c4...
UPLOADTHING_APP_ID=8cxjowf7fx

# MongoDB Connection
MONGO_URI=mongodb+srv://test:200111@ryoalnan.ev2z8cp.mongodb.net/?retryWrites=true&w=majority&appName=ryoalnan

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

⚠️ **مهم**: لا تضع علامات `'` حول القيم في Vercel.

## 🚀 API Endpoints

### 1. رفع ملف CV (Uploadthing SDK)

```bash
POST /api/upload
```

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (FormData):**
```
file: [CV File] (PDF or Word)
```

**Response:**
```json
{
  "fileUrl": "https://uploadthing.com/f/abc123"
}
```

**المميزات:**
- ✅ دعم PDF و Word
- ✅ حد أقصى 4MB
- ✅ رفع آمن وسريع
- ✅ روابط دائمة

### 2. إرسال طلب التوظيف

```bash
POST /api/join
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "fullName": "أحمد حسن",
  "phoneNumber": "+966501234567",
  "email": "ahmed@example.com",
  "jobPosition": "سائق",
  "experience": "5 سنوات في مجال النقل",
  "additionalMessage": "أريد العمل بدوام كامل",
  "cvFileUrl": "https://uploadthing.com/f/abc123",
  "cvFileName": "ahmed_cv.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job application submitted successfully",
  "data": {
    "_id": "64f8b2c1a1b2c3d4e5f6g7h8",
    "fullName": "أحمد حسن",
    "cvPath": "https://uploadthing.com/f/abc123",
    "status": "pending"
  },
  "fileUploaded": true,
  "fileName": "ahmed_cv.pdf",
  "fileUrl": "https://uploadthing.com/f/abc123"
}
```

## 📱 استخدام Frontend

### JavaScript/TypeScript Example

```javascript
// 1. رفع الملف أولاً (Uploadthing SDK)
async function uploadCV(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.fileUrl; // مباشرة من Uploadthing
}

// 2. إرسال بيانات النموذج
async function submitJoinForm(formData, cvFileUrl, cvFileName) {
  const data = {
    ...formData,
    cvFileUrl,
    cvFileName
  };
  
  const response = await fetch('/api/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return await response.json();
}

// 3. الاستخدام الكامل
async function handleSubmit() {
  const file = document.getElementById('cvFile').files[0];
  let cvFileUrl = null;
  let cvFileName = null;
  
  // رفع الملف إذا تم اختياره
  if (file) {
    cvFileUrl = await uploadCV(file);
    cvFileName = file.name;
  }
  
  // إرسال النموذج
  const formData = {
    fullName: document.getElementById('fullName').value,
    phoneNumber: document.getElementById('phoneNumber').value,
    email: document.getElementById('email').value,
    jobPosition: document.getElementById('jobPosition').value,
    experience: document.getElementById('experience').value,
    additionalMessage: document.getElementById('additionalMessage').value
  };
  
  const result = await submitJoinForm(formData, cvFileUrl, cvFileName);
  console.log('تم إرسال الطلب:', result);
}
```

## 🔒 الأمان

- ✅ **التحقق من نوع الملف**: PDF و Word فقط
- ✅ **حد أقصى للحجم**: 5MB
- ✅ **CORS محمي**
- ✅ **معالجة الأخطاء**
- ✅ **تشفير البيانات**

## 📊 المميزات

- ✅ **رفع سريع وآمن** باستخدام Uploadthing
- ✅ **روابط دائمة** للملفات
- ✅ **لا حاجة لتخزين محلي**
- ✅ **دعم جميع أنواع الملفات**
- ✅ **إحصائيات مفصلة**

## 🧪 اختبار النظام

```bash
# اختبار رفع ملف
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test_cv.pdf"

# اختبار إرسال نموذج
curl -X POST http://localhost:3000/api/join \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "أحمد حسن",
    "phoneNumber": "+966501234567",
    "jobPosition": "سائق",
    "cvFileUrl": "https://uploadthing.com/f/abc123",
    "cvFileName": "ahmed_cv.pdf"
  }'
```

## 🔧 استكشاف الأخطاء

### مشاكل شائعة:

1. **"UPLOADTHING_TOKEN is missing"**
   - تأكد من إضافة TOKEN في Environment Variables

2. **"File upload failed"**
   - تحقق من صحة TOKEN
   - تأكد من نوع الملف (PDF/Word فقط)
   - تحقق من حجم الملف (أقل من 5MB)

3. **"Required fields are missing"**
   - تأكد من إرسال fullName, phoneNumber, jobPosition

## 📞 الدعم

للمساعدة في الإعداد أو حل المشاكل، راجع:
- [Uploadthing Documentation](https://docs.uploadthing.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
