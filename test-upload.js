// اختبار بسيط لرفع الملف
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  try {
    console.log('🧪 Testing file upload...');
    
    // إنشاء FormData
    const formData = new FormData();
    
    // إنشاء ملف تجريبي
    const testContent = 'This is a test CV file content';
    const testFile = Buffer.from(testContent);
    
    formData.append('file', testFile, {
      filename: 'test_cv.pdf',
      contentType: 'application/pdf'
    });
    
    console.log('📤 Sending request to /api/upload...');
    
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Upload successful:', result);
    } else {
      console.log('❌ Upload failed:', result);
    }
    
  } catch (error) {
    console.error('💥 Test error:', error);
  }
}

// تشغيل الاختبار
testUpload();
