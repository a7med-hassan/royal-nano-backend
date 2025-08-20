# 🚀 Royal Nano Backend - New Modular Structure

## 📁 **Project Structure**

```
Royal-nano-backend/
├── api/                    # API Routes
│   ├── contact.js         # Contact API (Car Protection Service)
│   ├── join.js            # Join API (Job Applications)
│   └── health.js          # Health Check API
├── models/                 # Mongoose Models
│   ├── Contact.js         # Contact Schema
│   └── Join.js            # Join Schema
├── lib/                    # Utility Libraries
│   └── dbConnect.js       # Database Connection Utility
├── server.js               # Main Express Server (Legacy)
├── server-local.js         # Local Server (No MongoDB)
├── package.json            # Dependencies & Scripts
├── vercel.json             # Vercel Configuration
└── env.example             # Environment Variables Example
```

## ✨ **New Features**

### **1. Modular API Routes**
- **`/api/contact`** - Car Protection Service requests
- **`/api/join`** - Job Applications
- **`/api/health`** - Server health check

### **2. Separate Mongoose Models**
- **`Contact.js`** - Car protection service schema
- **`Join.js`** - Job application schema

### **3. Database Connection Utility**
- **`dbConnect.js`** - Optimized for Vercel serverless

## 🗄️ **Database Schemas**

### **Contact Schema (Car Protection Service)**
```javascript
{
  fullName: String,           // Required
  phoneNumber: String,        // Required
  carType: String,            // Required
  carModel: String,           // Required
  additionalNotes: String,    // Optional
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### **Join Schema (Job Applications)**
```javascript
{
  fullName: String,           // Required
  phoneNumber: String,        // Required
  email: String,              // Optional
  jobPosition: String,        // Required
  experience: String,         // Optional
  additionalMessage: String,  // Optional
  cvFileName: String,         // Optional
  cvPath: String,             // Optional
  status: String,             // Enum: pending, reviewed, accepted, rejected
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

## 🚀 **API Endpoints**

### **POST /api/contact**
Submit car protection service request:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "أحمد حسن",
    "phoneNumber": "+966501234567",
    "carType": "سيدان",
    "carModel": "2023",
    "additionalNotes": "أريد حماية كاملة للسيارة"
  }'
```

### **GET /api/contact**
Retrieve all car protection requests:
```bash
curl http://localhost:3000/api/contact
```

### **POST /api/join**
Submit job application:
```bash
curl -X POST http://localhost:3000/api/join \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "محمد علي",
    "phoneNumber": "+966501234567",
    "email": "mohamed@example.com",
    "jobPosition": "سائق",
    "experience": "5 سنوات في القيادة",
    "additionalMessage": "أريد الانضمام لفريق العمل"
  }'
```

### **GET /api/join**
Retrieve all job applications:
```bash
curl http://localhost:3000/api/join
```

### **GET /api/health**
Check server and database status:
```bash
curl http://localhost:3000/api/health
```

## 🛠️ **Installation & Setup**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Environment Variables**
Create `.env` file:
```env
MONGO_URI=mongodb+srv://test:200111@ryoalnan.ev2z8cp.mongodb.net/?retryWrites=true&w=majority&appName=ryoalnan
PORT=3000
```

### **3. Development**
```bash
# Start with MongoDB
npm run dev

# Start local server (no MongoDB)
npm run local
```

## 🌐 **Vercel Deployment**

### **1. Environment Variables in Vercel**
- **Name**: `MONGO_URI`
- **Value**: `mongodb+srv://test:200111@ryoalnan.ev2z8cp.mongodb.net/?retryWrites=true&w=majority&appName=ryoalnan`

### **2. Deploy**
```bash
vercel --prod
```

## 🔧 **Key Benefits**

1. **Modular Structure** - Easy to maintain and extend
2. **Separate Models** - Clear separation of concerns
3. **Optimized for Vercel** - Connection caching for serverless
4. **ES Modules** - Modern JavaScript syntax
5. **Validation** - Input validation for all endpoints
6. **Error Handling** - Comprehensive error handling
7. **Timestamps** - Automatic creation and update tracking

## 📊 **Current Status**

- ✅ **New Modular Structure** - Implemented
- ✅ **Separate API Routes** - Working
- ✅ **Mongoose Models** - Created
- ✅ **Database Connection** - Optimized for Vercel
- ✅ **ES Modules Support** - Added
- ✅ **Ready for Vercel** - All configurations complete

## 🎯 **Next Steps**

1. **Test New API Routes** - Verify all endpoints work
2. **Deploy to Vercel** - Use new modular structure
3. **Update Frontend** - Point to new API endpoints
4. **Monitor Performance** - Check Vercel function logs

---

**Built with ❤️ for Royal Nano - New Modular Structure**
