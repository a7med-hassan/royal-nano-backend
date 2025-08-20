# Royal Nano Backend

Backend API for Royal Nano Angular frontend with MongoDB Atlas integration.

## 🎯 Features

- ✅ Contact form submission and storage in MongoDB Atlas
- ✅ Join form submission and storage in MongoDB Atlas
- ✅ MongoDB Atlas database integration (Cluster: ryoalnan)
- ✅ RESTful API endpoints (POST and GET)
- ✅ CORS enabled for frontend integration
- ✅ Error handling and validation
- ✅ Ready for Vercel deployment

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. MongoDB Atlas ✅ Already Configured

Your MongoDB Atlas is already set up and working:

- **Cluster**: ryoalnan
- **Database**: royalNano
- **Username**: admin
- **Password**: ahmed123 (updated - no special characters)
- **Connection**: Working with new password

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
MONGO_URI=mongodb+srv://admin:ahmed123@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan
PORT=3000
```

**Note**: Password has been updated to `ahmed123` without special characters for better compatibility.

### 4. Run the Server

#### Production Mode (with MongoDB)

```bash
npm start        # Start production server
npm run dev      # Start with nodemon
```

#### Local Testing Mode (no MongoDB required)

```bash
npm run local        # Start local server
npm run local:dev    # Start with nodemon
```

### 5. Test API

```bash
npm test            # Run API tests
```

## 📱 API Endpoints

### Contact Form

- **POST** `/api/contact` - Submit contact form
  - Body: `{ "fullName": "string", "email": "string", "message": "string" }`
- **GET** `/api/contact` - Retrieve all contact submissions

### Join Form

- **POST** `/api/join` - Submit join request
  - Body: `{ "fullName": "string", "phoneNumber": "string", "carType": "string" }`
- **GET** `/api/join` - Retrieve all join requests

### Health Check

- **GET** `/api/health` - Server health status with MongoDB connection info

## 🗄️ Database Schema

### Contact Collection

```javascript
{
  fullName: String (required),
  email: String (required),
  message: String (required),
  createdAt: Date (auto-generated)
}
```

### Join Collection

```javascript
{
  fullName: String (required),
  phoneNumber: String (required),
  carType: String (required),
  createdAt: Date (auto-generated)
}
```

## 🌐 Vercel Deployment

### 1. Set Environment Variable

```bash
vercel env add MONGO_URI
# Use: mongodb+srv://admin:ahmed123@ryoalnan.ev2z8cp.mongodb.net/royalNano?retryWrites=true&w=majority&appName=ryoalnan
```

### 2. Deploy

```bash
vercel --prod
```

## 🧪 Testing

### Local Testing

```bash
# Health Check
curl http://localhost:3000/api/health

# Contact Form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"fullName":"أحمد حسن","email":"test@example.com","message":"مرحباً"}'

# Join Form
curl -X POST http://localhost:3000/api/join \
  -H "Content-Type: application/json" \
  -d '{"fullName":"محمد علي","phoneNumber":"+966501234567","carType":"سيدان"}'
```

### Production Testing

```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/api/health
```

## 📱 Frontend Integration

### Angular Service Example

```typescript
export class ApiService {
  private apiUrl = "https://your-app.vercel.app/api";

  submitContact(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }

  submitJoin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/join`, data);
  }
}
```

## 📚 Documentation

- **`VERCEL_DEPLOYMENT.md`** - Detailed deployment guide
- **`SOLUTION_SUMMARY.md`** - Complete solution overview in Arabic
- **`MONGODB_TROUBLESHOOTING.md`** - MongoDB connection troubleshooting

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Check password and IP whitelist
2. **"Cannot GET /api/contact"**: Use POST for form submission, GET for retrieval
3. **CORS Issues**: CORS is already enabled

### MongoDB Atlas Setup

1. Ensure your IP is whitelisted in Network Access
2. Verify database user has correct permissions
3. Password is now `ahmed123` (no special characters)

## 🎉 Current Status

- **MongoDB Atlas**: ✅ Connected and working with new password
- **API Endpoints**: ✅ All working (POST and GET)
- **Data Storage**: ✅ Contact and Join forms storing successfully
- **Local Testing**: ✅ Working perfectly
- **Ready for Vercel**: ✅ All configurations complete

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
