# Frontend Integration Guide

## 🔗 API Endpoints

### Base URL
```
Production: https://royal-nano-backend.vercel.app
Local: http://localhost:3000
```

## 📋 Contact Form Integration

### 1. Contact API Endpoint
```
POST /api/contact
```

### 2. Required Fields (EngazCRM Format)
```javascript
{
  full_name: "أحمد محمد",                    // ✅ مطلوب
  mobile: "01234567890",                     // ✅ مطلوب  
  client_16492512972331: "BMW",             // ✅ مطلوب (ماركة السيارة)
  client_16849336084508: "X5",              // ✅ مطلوب (موديل السيارة)
  client_16492513797105: "ملاحظات",         // ❌ اختياري
  client_17293620987926: "حماية شاملة",     // ❌ اختياري (نوع الخدمة)
  utm_source: "google",                     // ❌ اختياري
  utm_medium: "cpc",                        // ❌ اختياري
  utm_campaign: "car-protection-2024"       // ❌ اختياري
}
```

### 3. Response Format
```javascript
{
  success: true,
  message: "Car protection service request saved successfully and sent to EngazCRM",
  data: {
    _id: "...",
    fullName: "أحمد محمد",
    phoneNumber: "01234567890",
    carType: "BMW",
    carModel: "X5",
    additionalNotes: "ملاحظات",
    serviceType: "حماية شاملة",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "car-protection-2024",
    createdAt: "2024-01-01T00:00:00.000Z"
  },
  engazResponse: {
    // EngazCRM response data
  }
}
```

## 🚙 Car Brands API

### Endpoint
```
GET /api/car-brands?q=search_term
```

### Example Usage
```javascript
// Get all brands
fetch('/api/car-brands')

// Search for specific brand
fetch('/api/car-brands?q=bmw')
```

## 💻 Frontend Examples

### 1. Vanilla JavaScript
```html
<!DOCTYPE html>
<html>
<head>
    <title>Royal Nano Contact Form</title>
</head>
<body>
    <form id="contactForm">
        <input type="text" name="full_name" placeholder="الاسم الكامل" required>
        <input type="tel" name="mobile" placeholder="رقم الهاتف" required>
        <input type="text" name="client_16492512972331" placeholder="ماركة السيارة" required>
        <input type="text" name="client_16849336084508" placeholder="موديل السيارة" required>
        <textarea name="client_16492513797105" placeholder="ملاحظات إضافية"></textarea>
        <input type="text" name="client_17293620987926" placeholder="نوع الخدمة">
        <button type="submit">إرسال</button>
    </form>

    <script>
        document.getElementById('contactForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('تم إرسال الطلب بنجاح!');
                    e.target.reset();
                } else {
                    alert('حدث خطأ: ' + result.message);
                }
            } catch (error) {
                alert('حدث خطأ في الاتصال');
                console.error('Error:', error);
            }
        });
    </script>
</body>
</html>
```

### 2. React.js
```jsx
import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    mobile: '',
    client_16492512972331: '',
    client_16849336084508: '',
    client_16492513797105: '',
    client_17293620987926: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setMessage('تم إرسال الطلب بنجاح!');
        setFormData({
          full_name: '',
          mobile: '',
          client_16492512972331: '',
          client_16849336084508: '',
          client_16492513797105: '',
          client_17293620987926: '',
          utm_source: '',
          utm_medium: '',
          utm_campaign: ''
        });
      } else {
        setMessage('حدث خطأ: ' + result.message);
      }
    } catch (error) {
      setMessage('حدث خطأ في الاتصال');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="الاسم الكامل"
        required
      />
      <input
        type="tel"
        name="mobile"
        value={formData.mobile}
        onChange={handleChange}
        placeholder="رقم الهاتف"
        required
      />
      <input
        type="text"
        name="client_16492512972331"
        value={formData.client_16492512972331}
        onChange={handleChange}
        placeholder="ماركة السيارة"
        required
      />
      <input
        type="text"
        name="client_16849336084508"
        value={formData.client_16849336084508}
        onChange={handleChange}
        placeholder="موديل السيارة"
        required
      />
      <textarea
        name="client_16492513797105"
        value={formData.client_16492513797105}
        onChange={handleChange}
        placeholder="ملاحظات إضافية"
      />
      <input
        type="text"
        name="client_17293620987926"
        value={formData.client_17293620987926}
        onChange={handleChange}
        placeholder="نوع الخدمة"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'جاري الإرسال...' : 'إرسال'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default ContactForm;
```

### 3. Angular
```typescript
// contact.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/api/contact';

  constructor(private http: HttpClient) { }

  submitContact(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}

// contact.component.ts
import { Component } from '@angular/core';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact',
  template: `
    <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
      <input 
        name="full_name" 
        [(ngModel)]="formData.full_name" 
        placeholder="الاسم الكامل" 
        required>
      <input 
        name="mobile" 
        [(ngModel)]="formData.mobile" 
        placeholder="رقم الهاتف" 
        required>
      <input 
        name="client_16492512972331" 
        [(ngModel)]="formData.client_16492512972331" 
        placeholder="ماركة السيارة" 
        required>
      <input 
        name="client_16849336084508" 
        [(ngModel)]="formData.client_16849336084508" 
        placeholder="موديل السيارة" 
        required>
      <textarea 
        name="client_16492513797105" 
        [(ngModel)]="formData.client_16492513797105" 
        placeholder="ملاحظات إضافية">
      </textarea>
      <input 
        name="client_17293620987926" 
        [(ngModel)]="formData.client_17293620987926" 
        placeholder="نوع الخدمة">
      <button type="submit" [disabled]="loading">
        {{ loading ? 'جاري الإرسال...' : 'إرسال' }}
      </button>
    </form>
    <p *ngIf="message">{{ message }}</p>
  `
})
export class ContactComponent {
  formData = {
    full_name: '',
    mobile: '',
    client_16492512972331: '',
    client_16849336084508: '',
    client_16492513797105: '',
    client_17293620987926: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: ''
  };
  
  loading = false;
  message = '';

  constructor(private contactService: ContactService) { }

  onSubmit() {
    this.loading = true;
    this.message = '';

    this.contactService.submitContact(this.formData).subscribe({
      next: (response) => {
        if (response.success) {
          this.message = 'تم إرسال الطلب بنجاح!';
          this.formData = {
            full_name: '',
            mobile: '',
            client_16492512972331: '',
            client_16849336084508: '',
            client_16492513797105: '',
            client_17293620987926: '',
            utm_source: '',
            utm_medium: '',
            utm_campaign: ''
          };
        } else {
          this.message = 'حدث خطأ: ' + response.message;
        }
      },
      error: (error) => {
        this.message = 'حدث خطأ في الاتصال';
        console.error('Error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
```

### 4. Vue.js
```vue
<template>
  <form @submit.prevent="submitForm">
    <input 
      v-model="formData.full_name" 
      placeholder="الاسم الكامل" 
      required>
    <input 
      v-model="formData.mobile" 
      placeholder="رقم الهاتف" 
      required>
    <input 
      v-model="formData.client_16492512972331" 
      placeholder="ماركة السيارة" 
      required>
    <input 
      v-model="formData.client_16849336084508" 
      placeholder="موديل السيارة" 
      required>
    <textarea 
      v-model="formData.client_16492513797105" 
      placeholder="ملاحظات إضافية">
    </textarea>
    <input 
      v-model="formData.client_17293620987926" 
      placeholder="نوع الخدمة">
    <button type="submit" :disabled="loading">
      {{ loading ? 'جاري الإرسال...' : 'إرسال' }}
    </button>
  </form>
  <p v-if="message">{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        full_name: '',
        mobile: '',
        client_16492512972331: '',
        client_16849336084508: '',
        client_16492513797105: '',
        client_17293620987926: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: ''
      },
      loading: false,
      message: ''
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;
      this.message = '';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData)
        });

        const result = await response.json();

        if (result.success) {
          this.message = 'تم إرسال الطلب بنجاح!';
          this.formData = {
            full_name: '',
            mobile: '',
            client_16492512972331: '',
            client_16849336084508: '',
            client_16492513797105: '',
            client_17293620987926: '',
            utm_source: '',
            utm_medium: '',
            utm_campaign: ''
          };
        } else {
          this.message = 'حدث خطأ: ' + result.message;
        }
      } catch (error) {
        this.message = 'حدث خطأ في الاتصال';
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

## 🔧 Car Brands Integration

### JavaScript Example
```javascript
// Get all car brands
async function getCarBrands() {
  try {
    const response = await fetch('/api/car-brands');
    const data = await response.json();
    return data.data; // Array of car brands
  } catch (error) {
    console.error('Error fetching car brands:', error);
    return [];
  }
}

// Search car brands
async function searchCarBrands(query) {
  try {
    const response = await fetch(`/api/car-brands?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.data; // Filtered array of car brands
  } catch (error) {
    console.error('Error searching car brands:', error);
    return [];
  }
}

// Usage
getCarBrands().then(brands => {
  console.log('All brands:', brands);
});

searchCarBrands('bmw').then(results => {
  console.log('BMW results:', results);
});
```

## 🚀 Deployment

### Environment Variables
Make sure to set these in your deployment platform:

```bash
MONGO_URI=mongodb+srv://...
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
JWT_SECRET=...
```

### CORS Configuration
The backend is configured to accept requests from any origin (`*`), but you can restrict it in production.

## 📝 Notes

1. **Field Names**: Use exact EngazCRM field names (`full_name`, `mobile`, etc.)
2. **Required Fields**: `full_name`, `mobile`, `client_16492512972331`, `client_16849336084508`
3. **UTM Tracking**: Optional fields for marketing tracking
4. **Error Handling**: Always handle both success and error responses
5. **Loading States**: Show loading indicators during form submission
