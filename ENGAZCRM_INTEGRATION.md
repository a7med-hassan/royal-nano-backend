# EngazCRM Integration Guide

## 📋 Overview
تم دمج Royal Nano Backend مع EngazCRM لإرسال بيانات العملاء تلقائياً عند ملء نموذج التواصل (Contact Form) مباشرة إلى EngazCRM API.

## 🔗 Webhook URL

### Contact Form (Car Protection Service)
```
https://api.engazcrm.net/webhook/integration/royalnanoceramic/11/8/1
```

## 📊 Data Mapping

### Contact Form Fields
| Frontend Field | EngazCRM Field | Required | Description |
|----------------|----------------|----------|-------------|
| `full_name` | `full_name` | ✅ | اسم العميل الكامل |
| `mobile` | `mobile` | ✅ | رقم الهاتف |
| `client_16492512972331` | `client_16492512972331` | ✅ | ماركة السيارة |
| `client_16849336084508` | `client_16849336084508` | ✅ | موديل السيارة |
| `client_16492513797105` | `client_16492513797105` | ❌ | ملاحظات إضافية |
| `client_17293620987926` | `client_17293620987926` | ❌ | نوع الخدمة |


## 🔄 Workflow

1. **Frontend Submission**: المستخدم يملأ النموذج ويرسله
2. **Local Storage**: البيانات تُحفظ في MongoDB محلياً
3. **Direct EngazCRM Call**: البيانات تُرسل مباشرة إلى EngazCRM API
4. **Response**: إرجاع استجابة للمستخدم مع تفاصيل العملية

## 🛡️ Security & Architecture

### Direct API Integration
- **Direct Call**: اتصال مباشر بـ EngazCRM API
- **Field Mapping**: الحقول تُرسل بنفس الأسماء المطلوبة
- **Error Handling**: معالجة شاملة للأخطاء
- **Fallback**: حفظ البيانات محلياً حتى لو فشل الإرسال لـ EngazCRM

## 📝 Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Car protection service request saved successfully and sent to EngazCRM",
  "data": {
    "_id": "...",
    "fullName": "أحمد محمد",
    "phoneNumber": "01234567890",
    "carType": "sedan",
    "carModel": "BMW X5",
    "additionalNotes": "أريد حماية شاملة"
  },
  "engazResponse": {
    "status": "success",
    "lead_id": "12345"
  }
}
```

### Partial Success (CRM Failed)
```json
{
  "success": true,
  "message": "Car protection service request saved successfully, but failed to send to EngazCRM",
  "data": {
    "_id": "...",
    "fullName": "أحمد محمد",
    "phoneNumber": "01234567890"
  },
  "engazError": "Connection timeout",
  "warning": "Data saved locally but not synced to CRM"
}
```

## ⚙️ Configuration

### Timeout Settings
- **EngazCRM Request Timeout**: 10 seconds
- **Retry Policy**: No automatic retry (manual retry required)

### Error Handling
- **Local Storage**: Always succeeds (primary operation)
- **CRM Sync**: Graceful failure (doesn't affect user experience)
- **Logging**: All CRM operations are logged for debugging

## 🚀 Deployment

### Environment Variables
لا توجد متغيرات بيئة مطلوبة للـ webhook URLs (مدمجة في الكود).

### Dependencies
```json
{
  "axios": "^1.6.0"
}
```

## 📈 Monitoring

### Logs to Monitor
- `📤 Sending to EngazCRM:` - بداية إرسال البيانات
- `✅ EngazCRM response:` - نجاح الإرسال
- `❌ EngazCRM error:` - فشل الإرسال

### Success Metrics
- **Local Storage Success Rate**: 100% (expected)
- **CRM Sync Success Rate**: Monitor via logs
- **Response Time**: Monitor EngazCRM API performance

## 🔧 Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check EngazCRM API status
   - Verify webhook URL is correct
   - Check network connectivity

2. **Invalid Data Format**
   - Verify field mapping is correct
   - Check required fields are present
   - Validate data types

3. **Authentication Issues**
   - Verify webhook URL includes correct credentials
   - Check if webhook is still active

### Debug Steps
1. Check server logs for EngazCRM requests
2. Verify webhook URL is accessible
3. Test with sample data
4. Contact EngazCRM support if needed

## 📞 Support

- **Backend Issues**: Check server logs and error messages
- **CRM Issues**: Contact EngazCRM support
- **Integration Issues**: Review this documentation and field mapping
