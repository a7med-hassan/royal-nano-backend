# نظام الإدارة - Royal Nano Backend

## 📋 نظرة عامة

نظام إدارة كامل مع JWT authentication و MongoDB للتحكم في بيانات الموقع.

## 🔐 نظام المصادقة

- **JWT Tokens** - آمن ومؤقت (7 أيام)
- **bcrypt** - تشفير كلمات المرور
- **MongoDB** - تخزين بيانات الإدمن

## 🚀 API Endpoints

### 1. إنشاء Super Admin (مرة واحدة فقط)

```bash
POST /api/admin/create-super-admin
```

**Body:**

```json
{
  "username": "admin",
  "password": "admin123456"
}
```

### 2. تسجيل إدمن جديد

```bash
POST /api/admin/register
```

**Headers:**

```
Authorization: Bearer <super_admin_token>
```

**Body:**

```json
{
  "username": "newadmin",
  "password": "password123",
  "role": "admin"
}
```

### 3. تسجيل الدخول

```bash
POST /api/admin/login
```

**Body:**

```json
{
  "username": "admin",
  "password": "admin123456"
}
```

### 4. لوحة التحكم (البيانات)

```bash
GET /api/admin/dashboard
```

**Headers:**

```
Authorization: Bearer <admin_token>
```

## 📊 البيانات المتاحة

- **Contacts** - طلبات حماية السيارات
- **Joins** - طلبات التوظيف
- **إحصائيات** - عدد الطلبات والإحصائيات

## 🔧 التثبيت

### 1. تثبيت Dependencies

```bash
npm install
```

### 2. إضافة Environment Variables

```bash
# في Vercel
JWT_SECRET=your-secret-key-here
MONGO_URI=your-mongodb-connection-string
```

### 3. إنشاء Super Admin

```bash
curl -X POST https://your-domain.vercel.app/api/admin/create-super-admin \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123456"
  }'
```

## 🛡️ الأمان

- كلمات المرور مشفرة بـ bcrypt
- JWT tokens آمنة
- التحقق من الصلاحيات
- CORS محمي

## 📱 استخدام الفرونت إند

```javascript
// تسجيل الدخول
const loginResponse = await fetch("/api/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});

const { data } = await loginResponse.json();
const token = data.token;

// استخدام البيانات
const dashboardResponse = await fetch("/api/admin/dashboard", {
  headers: { Authorization: `Bearer ${token}` },
});
```

## 🎯 المميزات

- ✅ نظام مصادقة آمن
- ✅ إدارة المستخدمين
- ✅ لوحة تحكم شاملة
- ✅ إحصائيات مفصلة
- ✅ API محمي
- ✅ MongoDB integration
