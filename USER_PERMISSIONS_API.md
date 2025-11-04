# 👤 User Permissions API - دليل استخدام API صلاحيات المستخدمين

## 📋 نظرة عامة

هذا الـ API يسمح لك بالحصول على صلاحيات المستخدم بناءً على Firebase Token. يتم استخدام Firebase Authentication للتحقق من هوية المستخدم، ثم يتم جلب صلاحياته من قاعدة بيانات MongoDB.

## 🔧 الإعداد الأولي

### 1. تثبيت Firebase Admin SDK

```bash
npm install firebase-admin
```

### 2. إعداد Firebase Service Account

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. اذهب إلى **Project Settings** > **Service Accounts**
4. اضغط على **Generate New Private Key**
5. سيتم تحميل ملف JSON
6. انسخ محتوى الملف وضعه في متغير البيئة `FIREBASE_SERVICE_ACCOUNT`

### 3. إضافة متغيرات البيئة

أضف في ملف `.env`:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
```

## 🚀 استخدام الـ API

### Endpoint

```
GET /api/user/permissions
```

### Headers

```
Authorization: Bearer <firebase_token>
```

### مثال على الطلب (Request)

```javascript
// في Angular أو أي Frontend Framework
const token = await firebase.auth().currentUser.getIdToken();

const response = await fetch('https://your-backend.vercel.app/api/user/permissions', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### مثال على الاستجابة الناجحة (Success Response)

```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "firebaseUid": "abc123xyz456",
    "email": "user@example.com",
    "fullName": "أحمد حسن",
    "role": "admin",
    "permissions": {
      "canAccessDashboard": true,
      "canViewContacts": true,
      "canEditContacts": true,
      "canDeleteContacts": false,
      "canViewJoinRequests": true,
      "canEditJoinRequests": true,
      "canDeleteJoinRequests": false,
      "canManageAdmins": false,
      "canManageSettings": true,
      "canViewReports": true,
      "canExportData": true
    },
    "isActive": true,
    "lastLogin": "2025-10-15T10:30:00.000Z"
  }
}
```

## 📊 User Schema - هيكل بيانات المستخدم

```javascript
{
  firebaseUid: String,        // Firebase UID (فريد)
  email: String,              // البريد الإلكتروني
  fullName: String,           // الاسم الكامل
  phoneNumber: String,        // رقم الهاتف
  role: String,               // الدور: "user", "admin", "super_admin"
  isActive: Boolean,          // حالة الحساب
  lastLogin: Date,            // آخر تسجيل دخول
  
  permissions: {
    // Dashboard
    canAccessDashboard: Boolean,
    
    // Contacts Management
    canViewContacts: Boolean,
    canEditContacts: Boolean,
    canDeleteContacts: Boolean,
    
    // Join Requests Management
    canViewJoinRequests: Boolean,
    canEditJoinRequests: Boolean,
    canDeleteJoinRequests: Boolean,
    
    // Admin Management
    canManageAdmins: Boolean,
    
    // Settings
    canManageSettings: Boolean,
    
    // Reports
    canViewReports: Boolean,
    canExportData: Boolean
  }
}
```

## 🎯 حالات الاستجابة (Response Status Codes)

### ✅ 200 OK
المستخدم موجود وتم جلب الصلاحيات بنجاح

### ❌ 401 Unauthorized
- لا يوجد Token
- Token غير صالح
- Token منتهي الصلاحية

```json
{
  "success": false,
  "message": "No token provided"
}
```

### ❌ 403 Forbidden
الحساب غير نشط

```json
{
  "success": false,
  "message": "User account is inactive"
}
```

### ❌ 404 Not Found
المستخدم غير موجود في قاعدة البيانات

```json
{
  "success": false,
  "message": "User not found in database",
  "hint": "User needs to be registered in the system first"
}
```

### ❌ 500 Internal Server Error
خطأ في السيرفر

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## 🔐 كيفية إنشاء مستخدم جديد في قاعدة البيانات

يمكنك إنشاء مستخدم جديد باستخدام MongoDB Compass أو من خلال API منفصل:

```javascript
// مثال على إنشاء مستخدم
const User = require('./models/User');

const newUser = new User({
  firebaseUid: 'abc123xyz456',  // من Firebase
  email: 'user@example.com',
  fullName: 'أحمد حسن',
  phoneNumber: '+966501234567',
  role: 'admin',
  isActive: true,
  permissions: {
    canAccessDashboard: true,
    canViewContacts: true,
    canEditContacts: true,
    canDeleteContacts: false,
    canViewJoinRequests: true,
    canEditJoinRequests: true,
    canDeleteJoinRequests: false,
    canManageAdmins: false,
    canManageSettings: true,
    canViewReports: true,
    canExportData: true
  }
});

await newUser.save();
```

## 🧪 اختبار الـ API

### باستخدام Postman أو Thunder Client

1. احصل على Firebase Token من تطبيق الـ Frontend
2. أضف الـ Token في الـ Headers:
   ```
   Authorization: Bearer <your_firebase_token>
   ```
3. أرسل GET request إلى `/api/user/permissions`

### باستخدام cURL

```bash
curl -X GET \
  https://your-backend.vercel.app/api/user/permissions \
  -H 'Authorization: Bearer YOUR_FIREBASE_TOKEN' \
  -H 'Content-Type: application/json'
```

## 📱 استخدام في Angular Frontend

```typescript
// في Service
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://your-backend.vercel.app/api';

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth
  ) {}

  async getUserPermissions(): Promise<Observable<any>> {
    const user = await this.afAuth.currentUser;
    const token = await user?.getIdToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/user/permissions`, { headers });
  }
}
```

## 🔒 الأمان (Security)

1. **Firebase Token Verification**: يتم التحقق من صحة الـ Token باستخدام Firebase Admin SDK
2. **Token Expiration**: الـ Tokens تنتهي صلاحيتها تلقائياً بعد ساعة واحدة
3. **HTTPS Only**: استخدم HTTPS في الإنتاج دائماً
4. **Rate Limiting**: يُنصح بإضافة Rate Limiting لحماية الـ API

## 🚀 النشر على Vercel

1. أضف متغير البيئة `FIREBASE_SERVICE_ACCOUNT` في Vercel:
   - اذهب إلى Project Settings > Environment Variables
   - أضف متغير جديد باسم `FIREBASE_SERVICE_ACCOUNT`
   - الصق محتوى ملف Service Account JSON

2. أعد نشر المشروع:
   ```bash
   git push origin main
   ```

## 📝 ملاحظات مهمة

1. **Firebase UID**: يجب أن يكون Firebase UID فريداً لكل مستخدم
2. **User Registration**: يجب إنشاء المستخدم في قاعدة البيانات قبل أن يتمكن من استخدام الـ API
3. **Permissions Update**: يمكن تحديث الصلاحيات من خلال MongoDB مباشرة أو من خلال Admin Panel
4. **Last Login**: يتم تحديث `lastLogin` تلقائياً عند كل طلب ناجح

## 🆘 استكشاف الأخطاء (Troubleshooting)

### المشكلة: "Firebase initialization failed"
**الحل**: تأكد من إضافة `FIREBASE_SERVICE_ACCOUNT` في متغيرات البيئة

### المشكلة: "User not found in database"
**الحل**: أنشئ المستخدم في قاعدة البيانات أولاً

### المشكلة: "Token expired"
**الحل**: احصل على Token جديد من Firebase

### المشكلة: "Invalid token"
**الحل**: تأكد من إرسال Token صحيح في الـ Headers

## 📚 موارد إضافية

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [MongoDB Mongoose Documentation](https://mongoosejs.com/docs/)









