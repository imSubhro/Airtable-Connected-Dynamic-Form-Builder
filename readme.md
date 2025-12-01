# 🚀 Airtable Dynamic Form Builder

> A smart form builder that connects to Airtable, creates custom forms, and keeps responses in sync.

---

## 📖 What Does This App Do?

This application lets you:
- ✅ **Create custom forms** from your Airtable tables
- ❌ **Add smart logic** (Coming Soon)
- ✅ **Collect responses** that save to both Airtable and your database
- ❌ **Auto-sync** (Coming Soon)

**Think of it as:** Google Forms + Airtable Integration

---

## 🎯 Key Features

### 1️⃣ **Login with Airtable**
- ✅ Secure OAuth authentication
- ✅ Access to all your Airtable bases and tables

### 2️⃣ **Visual Form Builder**
- ✅ Select any Airtable table
- ✅ Choose which columns become form fields
- ❌ Drag and drop to reorder questions (Fields are added in order)
- ✅ Mark fields as required or optional

### 3️⃣ **Conditional Logic** (🚧 Under Construction)
- Show/hide questions based on previous answers
- Support for multiple conditions with AND/OR logic
- *Current Status: Not yet implemented*

### 4️⃣ **Smart Form Viewer**
- ✅ Clean, responsive forms
- ❌ Real-time conditional logic
- ✅ Client-side validation (Required fields)

### 5️⃣ **Dual Storage**
- ✅ Responses saved to **Airtable** (your source of truth)
- ✅ Also saved to **MongoDB** (fast queries and tracking)

### 6️⃣ **Automatic Sync** (🚧 Under Construction)
- Webhooks keep MongoDB updated when Airtable changes
- Tracks deleted records (soft delete)
- *Current Status: Webhook endpoints not yet implemented*

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - UI library
- **React Router** - Page navigation
- **Axios** - API calls
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### **Backend**
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **Airtable SDK** - Airtable API integration
- **JWT** - Authentication tokens

---

## 📦 Installation

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Airtable account with OAuth app created

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/airtable-form-builder.git
cd airtable-form-builder
```

### **2. Setup Backend**
```bash
cd server
npm install
```

Create `.env` file in `server/` directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/airtable-forms
JWT_SECRET=your_super_secret_jwt_key
AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:3000/auth/airtable/callback
CLIENT_URL=http://localhost:5173
```

### **3. Setup Frontend**
```bash
cd ../client
npm install
```

Create `.env` file in `client/` directory:
```env
VITE_API_URL=http://localhost:3000
```

### **4. Start the Application**

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### **5. Access the App**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

---

## 🎨 How to Use

### **Step 1: Login**
1. Click "Login with Airtable"
2. Authorize the app to access your Airtable account
3. You'll be redirected back to the dashboard

### **Step 2: Create a Form**
1. Click "Create New Form"
2. Select an Airtable Base from the dropdown
3. Select a Table within that base
4. Choose which fields to include in your form
5. Configure each field (Mark as required/optional)
6. Save the form

### **Step 3: Share Your Form**
1. Copy the form link (e.g., `/form/abc123`)
2. Share with anyone
3. They can fill it out without logging in

### **Step 4: View Responses**
*Feature coming soon. Currently responses are saved to database but not viewable in UI.*

---


---

## 📁 Project Structure

```
airtable-form-builder/
│
├── client/                      # React Frontend
│   ├── src/
│   │   ├── pages/              # Main Pages (Builder, Viewer, Dashboard)
│   │   ├── context/            # React Context (auth, etc.)
│   │   ├── utils/              # Helper functions
│   │   └── App.jsx
│   └── package.json
│
├── server/                      # Node/Express Backend
│   ├── config/                 # DB connection, env config
│   ├── models/                 # MongoDB schemas
│   │   ├── User.js
│   │   ├── Form.js
│   │   └── Response.js
│   ├── routes/                 # API routes
│   │   ├── auth.js
│   │   └── api.js              # Main API routes
│   ├── services/               # Airtable API logic
│   └── server.js
│
└── README.md
```

---


## 📝 API Endpoints

### **Authentication**
- `GET /auth/airtable` - Initiate OAuth
- `GET /auth/airtable/callback` - OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### **Airtable Integration**
- `GET /api/airtable/bases` - List user's bases
- `GET /api/airtable/bases/:baseId/tables` - List tables

### **Forms**
- `POST /api/forms` - Create form
- `GET /api/forms` - List user's forms
- `GET /api/forms/:formId` - Get form details
- `PUT /api/forms/:formId` - Update form
- `POST /api/forms/:formId/submit` - Submit response

---



## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.


---

**Made with ❤️ by [imSubhro]**