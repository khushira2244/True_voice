
# 🎙️ TrueVoice – Hero-Based Pain Expression System

*(Built using FIBO Image Generation)*

TrueVoice is a **child-first, emotion-safe interface** that helps children express physical discomfort or pain **without needing words**.
Instead of typing or explaining, children select a **hero**, a **situation**, a **symptom**, and a **severity** through visual storytelling.

This project was built as a **demo-ready prototype** focusing on **UX clarity, emotional safety, and explainability**, especially for children who struggle with verbal communication.

---

## 🧠 Problem Statement

Many children:

* Cannot clearly explain pain or discomfort
* Feel anxious or overwhelmed in medical or stressful situations
* Are non-verbal, autistic, or emotionally overloaded
* Struggle to identify *where* or *how severe* a problem is

Existing systems rely on:

* Text forms
* Adult-centric medical language
* Verbal explanations

❌ These approaches fail for young children.

---

## 💡 Our Solution

**TrueVoice** replaces text and medical jargon with:

* 🎭 **Hero-based interaction** (safe, friendly characters)
* 🖼️ **Image-only navigation**
* 🧭 Step-by-step guided flow
* 💙 Emotional validation (sympathy stage)
* 📋 Clear summary for caregivers or doctors

Children express pain by **choosing**, not explaining.

---

## 🔁 User Flow

1. **Landing Screen**
2. **Login (demo / mock)**
3. **Choose a Hero**
4. **Select Current Scenario**

   * Outside / Home / School
5. **Select Symptom**

   * Head / Chest / Stomach / Leg / Throat / Emergency
6. **Select Severity**

   * Normal / Severe
7. **Sympathy Screen**

   * Emotional acknowledgment
8. **Final Summary**

   * Saved locally for demo

---

## 📁 Project Structure

```
FIBO/
│
├── fibo-backend/
│   └── fibo-backend/
│       ├── src/
│       ├── routes/
│       ├── controllers/
│       ├── package.json
│       └── README (optional)
│
├── fibo-frontend/
│   ├── src/
│   │   ├── steps/
│   │   ├── data/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── readme.md   ← (this file)
```

---

## ⚙️ Tech Stack

### Frontend

* React (Vite)
* JavaScript
* CSS (minimal, demo-focused)
* LocalStorage (demo persistence)

### Backend

* Node.js
* Express
* Health check API
* Demo-only authentication

---

## ▶️ How to Run the Project Locally

### 1️⃣ Clone the Repository



### 2️⃣ Run Backend

```bash
cd fibo-backend/fibo-backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

(Used mainly for health check & demo auth)

---
## How to Run the Project Locally

### 1️⃣ Clone the Repository

---

### 2️⃣ Run Backend

```bash
cd fibo-backend/fibo-backend
npm install
✅ Create .env file (REQUIRED — not included in GitHub for security)
Create this file here:
fibo-backend/fibo-backend/.env

Add these variables:

env
Copy code
FAL_KEY=YOUR_FAL_KEY_HERE
OPENAI_API_KEY=YOUR_OPENAI_KEY_HERE
NODE_ENV=development
PORT=5000
Now start backend:

bash
Copy code
npm run dev
Backend runs on:

http://localhost:5000
(Used mainly for health check, demo auth, and FIBO image generation APIs)

3️⃣ Run Frontend
Open a new terminal:

bash
Copy code
cd fibo-frontend
npm install
npm run dev
✅ (Optional) Frontend .env
If you want to set the API base URL explicitly, create:
fibo-frontend/.env

Add:

env
Copy code
VITE_API_BASE=http://localhost:5000
Frontend runs on:

http://localhost:5173

## 🔐 Authentication Note

* Login is **mocked for demo purposes**
* No real credentials are required
* Focus is on **interaction flow and UX**

---

## 💾 Data Persistence

* Episodes are stored in **browser LocalStorage**
* Used only to demonstrate:

  * Flow completion
  * History preview
* No personal data is sent to a server

---

## 🚧 Deployment Status

🚀 **Deployment is currently in progress**

Planned targets:

* Frontend: Vercel / Netlify
* Backend: Fly.io / Render

This repository represents a **stable demo build**, ready for review and deployment.

---

## 🧪 Demo Scope & Limitations

* Designed for **concept validation**
* Optimized for **clarity over complexity**
* No analytics, tracking, or production auth
* Focused on **child-safe UX**

---

## 🌱 Future Improvements

* Tooltip explanations for symptoms (z-axis context)
* Multi-language support
* Caregiver / doctor dashboard
* Secure backend storage
* Accessibility enhancements (screen readers, voice)

---

## 🤝 Acknowledgements

* Built using **FIBO image generation**
* Inspired by child-centered healthcare design
* Created under time-bound hackathon constraints

---

## 🏁 Final Note

TrueVoice is not just a UI —
it is a **translation layer between emotion and care**.


