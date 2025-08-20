# Vercel Deployment Guide for Royal Nano Backend

## 🚀 Quick Setup

### 1. MongoDB Atlas Setup ✅ COMPLETED

Your MongoDB Atlas is already configured and working with:

- **Cluster**: ryoalnan
- **Database**: royalNano
- **Username**: admin
- **Connection String**: Working with encoded password

**Note**: The password `royalnano$12#` has been encoded to handle special characters:

- `$` → `%24`
- `#` → `%23`

### 2. Vercel Deployment

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Set Environment Variables**

   ```bash
   vercel env add MONGO_URI
   # Paste your MongoDB connection string when prompted:
   # mongodb+srv://admin:royalnano%2412%23@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

## 🔧 Environment Variables in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Name**: `MONGO_URI`
   - **Value**: `mongodb+srv://admin:royalnano%2412%23@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan`
   - **Environment**: Production, Preview, Development

## 📱 Frontend Integration

### Angular Service Example

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  // Replace with your Vercel URL
  private apiUrl = "https://your-app-name.vercel.app/api";

  constructor(private http: HttpClient) {}

  // Contact Form
  submitContact(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }

  // Join Form
  submitJoin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/join`, data);
  }

  // Get Contacts
  getContacts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contact`);
  }

  // Get Joins
  getJoins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/join`);
  }
}
```

### HTML Form Examples

#### Contact Form

```html
<form (ngSubmit)="onContactSubmit()" #contactForm="ngForm">
  <input
    type="text"
    name="fullName"
    [(ngModel)]="contactData.fullName"
    required
  />
  <input type="email" name="email" [(ngModel)]="contactData.email" required />
  <textarea
    name="message"
    [(ngModel)]="contactData.message"
    required
  ></textarea>
  <button type="submit">إرسال</button>
</form>
```

#### Join Form

```html
<form (ngSubmit)="onJoinSubmit()" #joinForm="ngForm">
  <input type="text" name="fullName" [(ngModel)]="joinData.fullName" required />
  <input
    type="tel"
    name="phoneNumber"
    [(ngModel)]="joinData.phoneNumber"
    required
  />
  <select name="carType" [(ngModel)]="joinData.carType" required>
    <option value="سيدان">سيدان</option>
    <option value="SUV">SUV</option>
    <option value="فان">فان</option>
  </select>
  <button type="submit">انضمام</button>
</form>
```

## 🧪 Testing Your Deployment

1. **Test Health Check**

   ```bash
   curl https://your-app-name.vercel.app/api/health
   ```

2. **Test Contact Form**

   ```bash
   curl -X POST https://your-app-name.vercel.app/api/contact \
     -H "Content-Type: application/json" \
     -d '{"fullName":"أحمد حسن","email":"test@example.com","message":"مرحباً"}'
   ```

3. **Test Join Form**
   ```bash
   curl -X POST https://your-app-name.vercel.app/api/join \
     -H "Content-Type: application/json" \
     -d '{"fullName":"محمد علي","phoneNumber":"+966501234567","carType":"سيدان"}'
   ```

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot GET /api/contact"**

   - Make sure you're using POST for form submission
   - GET is only for retrieving data

2. **MongoDB Connection Error**

   - Check your connection string in Vercel environment variables
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify username/password are correct
   - **Important**: Use the encoded password (`%24` for `$`, `%23` for `#`)

3. **CORS Issues**
   - CORS is already enabled in the backend
   - Make sure your frontend URL is correct

### MongoDB Atlas IP Whitelist

1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. For development: Add your local IP
4. For production: Add `0.0.0.0/0` (allows all IPs)

## 📊 Monitoring

- Check Vercel function logs in your dashboard
- Monitor MongoDB Atlas for database connections
- Use the health check endpoint to verify server status

## 🎯 Next Steps

1. Deploy your frontend to Vercel or another hosting service
2. Update the API URL in your frontend code
3. Test the complete flow from frontend to backend
4. Set up monitoring and alerts if needed

## ✅ Current Status

- **MongoDB Atlas**: ✅ Connected and working
- **API Endpoints**: ✅ All working (POST and GET)
- **Data Storage**: ✅ Contact and Join forms storing successfully
- **Local Testing**: ✅ Working perfectly
- **Ready for Vercel**: ✅ All configurations complete
