# حل مشكلة "Cannot GET /api/contact" في Vercel

## 🎯 المشكلة الأصلية

كان لديك خطأ "Cannot GET /api/contact" في Vercel، وكنت تريد تخزين بيانات الفورمات (Contact + Join) في MongoDB Atlas.

## ✅ الحل المطبق

### 1. إصلاح مشكلة API Endpoints

- **المشكلة**: كان لديك فقط POST endpoints
- **الحل**: أضفت GET endpoints لاسترجاع البيانات
- **النتيجة**: الآن يمكنك استخدام:
  - `GET /api/contact` - لاسترجاع جميع رسائل التواصل
  - `GET /api/join` - لاسترجاع جميع طلبات الانضمام

### 2. تكامل MongoDB Atlas

- **المشكلة**: لم يكن لديك اتصال بقاعدة البيانات
- **الحل**: أضفت:
  - اتصال MongoDB Atlas
  - نماذج البيانات (Schemas)
  - معالجة الأخطاء
  - تخزين البيانات في قاعدة البيانات

### 3. ملفات الحل

#### `server.js` - السيرفر الرئيسي مع MongoDB

```javascript
// يتضمن:
- اتصال MongoDB Atlas
- نماذج Contact و Join
- API endpoints كاملة
- معالجة الأخطاء
```

#### `server-local.js` - سيرفر محلي للاختبار

```javascript
// يتضمن:
- تخزين مؤقت في الذاكرة
- لا يحتاج MongoDB
- مثالي للاختبار المحلي
```

#### `vercel.json` - إعدادات Vercel

```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

## 🚀 كيفية الاستخدام

### للتطوير المحلي (بدون MongoDB)

```bash
npm run local        # تشغيل السيرفر المحلي
npm run local:dev    # تشغيل مع nodemon
```

### للإنتاج (مع MongoDB Atlas)

```bash
npm start           # تشغيل السيرفر الرئيسي
npm run dev         # تشغيل مع nodemon
```

### اختبار API

```bash
npm test            # تشغيل اختبارات API
```

## 📱 API Endpoints

### Contact Form

- **POST** `/api/contact` - إرسال رسالة تواصل
- **GET** `/api/contact` - استرجاع جميع الرسائل

### Join Form

- **POST** `/api/join` - إرسال طلب انضمام
- **GET** `/api/join` - استرجاع جميع الطلبات

### Health Check

- **GET** `/api/health` - حالة السيرفر

## 🗄️ قاعدة البيانات

### Contact Collection

```javascript
{
  fullName: String (مطلوب),
  email: String (مطلوب),
  message: String (مطلوب),
  createdAt: Date (تلقائي)
}
```

### Join Collection

```javascript
{
  fullName: String (مطلوب),
  phoneNumber: String (مطلوب),
  carType: String (مطلوب),
  createdAt: Date (تلقائي)
}
```

## 🌐 النشر على Vercel

### 1. إعداد MongoDB Atlas

- إنشاء حساب في [mongodb.com](https://mongodb.com)
- إنشاء cluster جديد
- إنشاء مستخدم قاعدة البيانات
- الحصول على connection string

### 2. إعداد Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# إضافة متغيرات البيئة
vercel env add MONGODB_URI

# النشر
vercel --prod
```

### 3. متغيرات البيئة

في Vercel Dashboard:

- **Name**: `MONGODB_URI`
- **Value**: `mongodb+srv://username:password@cluster.mongodb.net/royal-nano?retryWrites=true&w=majority`

## 🔧 اختبار الحل

### اختبار محلي

```bash
# تشغيل السيرفر المحلي
npm run local

# اختبار Health Check
curl http://localhost:3000/api/health

# اختبار Contact Form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"أحمد حسن","email":"test@example.com","message":"مرحباً"}'
```

### اختبار Vercel

```bash
# اختبار Health Check
curl https://your-app.vercel.app/api/health

# اختبار Contact Form
curl -X POST https://your-app.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"أحمد حسن","email":"test@example.com","message":"مرحباً"}'
```

## 📱 ربط مع Angular Frontend

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

  submitJoin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/join`, data);
  }
}
```

## 🎉 النتيجة النهائية

✅ **تم حل مشكلة "Cannot GET /api/contact"**
✅ **تم إضافة MongoDB Atlas integration**
✅ **الفورمات تتخزن في قاعدة البيانات**
✅ **API يعمل محلياً وعلى Vercel**
✅ **يمكن استرجاع البيانات المخزنة**

## 📚 الملفات المهمة

- `server.js` - السيرفر الرئيسي للإنتاج
- `server-local.js` - السيرفر المحلي للاختبار
- `vercel.json` - إعدادات Vercel
- `VERCEL_DEPLOYMENT.md` - دليل النشر المفصل
- `env.example` - مثال لمتغيرات البيئة
- `test-api.js` - سكريبت اختبار API

## 🆘 الدعم

إذا واجهت أي مشاكل:

1. تأكد من إعداد متغير `MONGODB_URI` في Vercel
2. تأكد من إضافة IP address في MongoDB Atlas Network Access
3. استخدم `npm run local` للاختبار المحلي أولاً
4. راجع logs في Vercel Dashboard
