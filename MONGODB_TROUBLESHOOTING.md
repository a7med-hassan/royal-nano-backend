# حل مشاكل الاتصال مع MongoDB Atlas

## 🚨 المشكلة الحالية

MongoDB Atlas غير متصل بسبب مشكلة في كلمة المرور التي تحتوي على رموز خاصة.

## 🔍 المشكلة

كلمة المرور `royalnano$12#` تحتوي على رموز خاصة:

- `$` - رمز الدولار
- `#` - رمز الهاش

هذه الرموز تحتاج إلى encoding خاص في connection string.

## ✅ الحلول

### الحل الأول: تغيير كلمة المرور (الأفضل)

1. اذهب إلى MongoDB Atlas Dashboard
2. اذهب إلى "Database Access"
3. ابحث عن المستخدم `admin`
4. اضغط على "Edit"
5. اضغط على "Edit Password"
6. أدخل كلمة مرور جديدة بدون رموز خاصة، مثال:
   - `royalnano123`
   - `RoyalNano2024`
   - `admin123456`

### الحل الثاني: Encoding كلمة المرور

إذا كنت تريد الاحتفاظ بكلمة المرور الحالية، قم بتحويلها:

**الكلمة الأصلية**: `royalnano$12#`
**بعد Encoding**:

- `$` → `%24`
- `#` → `%23`

**Connection String الجديد**:

```
mongodb+srv://admin:royalnano%2412%23@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan
```

### الحل الثالث: استخدام Environment Variable

1. أنشئ ملف `.env` في مجلد المشروع
2. أضف:
   ```
   MONGO_URI=mongodb+srv://admin:royalnano%2412%23@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan
   ```

## 🔧 تحديث الكود

### في server.js

```javascript
const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://admin:royalnano%2412%23@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan";
```

## 🧪 اختبار الاتصال

### 1. اختبار Health Check

```bash
curl http://localhost:3000/api/health
```

**النتيجة المتوقعة**:

```json
{
  "success": true,
  "message": "Server is running",
  "mongodb": "connected",
  "timestamp": "2025-08-20T10:52:34.849Z"
}
```

### 2. اختبار Contact Form

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"أحمد حسن","email":"test@example.com","message":"مرحباً"}'
```

## 🌐 إعداد Vercel

### 1. إضافة Environment Variable

```bash
vercel env add MONGO_URI
```

### 2. القيمة المطلوبة

```
mongodb+srv://admin:royalnano%2412%23@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan
```

## 🔒 أمان MongoDB Atlas

### 1. Network Access

- اذهب إلى "Network Access"
- أضف IP Address: `0.0.0.0/0` (للسماح لجميع IPs)

### 2. Database Access

- تأكد من أن المستخدم `admin` لديه صلاحيات "Read and write to any database"

## 📱 اختبار Frontend

### في Angular Service

```typescript
export class ApiService {
  // للتطوير
  private apiUrl = "http://localhost:3000/api";

  // للإنتاج (Vercel)
  // private apiUrl = 'https://your-app.vercel.app/api';

  submitContact(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }
}
```

## 🎯 الخطوات التالية

1. **حل مشكلة كلمة المرور** (اختر أحد الحلول أعلاه)
2. **اختبر الاتصال محلياً**
3. **انشر على Vercel**
4. **اختبر API من Frontend**

## 🆘 إذا استمرت المشكلة

1. تأكد من أن MongoDB Atlas cluster يعمل
2. تحقق من Network Access
3. تحقق من Database Access
4. راجع logs في Vercel Dashboard
5. استخدم `npm run local` للاختبار المحلي
