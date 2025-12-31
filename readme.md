## 🔗 Live Demo
** Intro Video:- https://www.youtube.com/watch?v=2oXbinAgXJY
**Demo URL 👉** https://truevoicemoment.netlify.app/
** How to run the Application :- https://youtu.be/Supej1h4ueY





## 🧠 True Voice

**True Voice** is a **child-first, visual communication system** designed to help **autistic and non-verbal children** express **discomfort, pain, or emotional distress** without relying on **verbal explanation**.

Instead of asking children to describe how they feel, the system guides them through a **calm, step-by-step visual flow** using **familiar heroes, places, and simple choices** — while keeping **parents fully involved** in **review, safety, and support decisions**.

The design prioritizes **emotional safety**, **predictability**, and **human-in-the-loop control**.

---



### Demo Credentials

- **Email:** demo@gmail.com  
- **Password:** demo123

For **judging and evaluation**, the demo runs in a **stable mode** using **pre-generated support images** to ensure **consistent UX** and avoid dependency on **live generation credits**.

🔄 End-to-End System Flow

<img width="3914" height="14717" alt="flow_design" src="https://github.com/user-attachments/assets/346ac685-684b-4b52-a83c-57beb2b194cb" />


# Flow Overview

Parents provide **child details**, **favorite heroes**, and **familiar places**.

Children interact through a **guided visual flow** that progresses step by step:
**hero → place → symptom → severity**, without requiring verbal explanation.

If a selected place is unfamiliar, **safe alternatives are suggested** through controlled generation and filtering.

When an **emergency** is detected, the system triggers **immediate alerts to parents** and generates an automatic SOS support image.

All **custom support image generation is gated by parent verification**, ensuring caregiver control at the right moment.

Over time, **past episodes and parent decisions** improve future guidance.

An **analytics layer** summarizes **child discomfort patterns** and **parent involvement**.

This flow ensures **emotional safety**, **caregiver oversight**, and **long-term learning**.

---

## 🌍 Product Vision

True Voice’s long-term vision is to become a **trusted communication bridge** between autistic children, caregivers, and support professionals — **without forcing children to speak, label emotions, or conform to verbal expectations**.

We envision a future where:

- Children can safely communicate discomfort in their **own visual language**
- Parents receive **context, not alarms**
- Support decisions remain **human-led**, not algorithmic
- AI acts as a **quiet assistant**, never an authority

True Voice is designed to **scale care and understanding**, not automation.

---

## 👥 Who This Product Is For

### Primary Users
- Autistic and non-verbal children  
- Children with sensory processing challenges  
- Children who struggle with verbal emotional expression  

### Secondary Users
- Parents and guardians  
- Teachers and caregivers  
- Therapists and support professionals *(future, opt-in)*  

Each group interacts with the system differently, but **all interactions are anchored in child comfort and safety first**.

---

## 🧠 What Makes True Voice a Product

True Voice is not a one-off visualization tool.  
It is a **repeatable, structured system** with:

- **Deterministic visual flows** (familiarity over novelty)
- **Reusable support images** tied to real situations
- **Parent-verified guidance loops**
- **Episode history** that improves future responses
- **Clear separation** between child input and caregiver decision-making

This makes it suitable for **daily use**, not just emergencies.

---

## 🛡️ Safety, Ethics & Design Boundaries

True Voice is built with **explicit constraints**:

- ❌ No diagnosis  
- ❌ No automated medical advice  
- ❌ No behavioral scoring  
- ❌ No child surveillance  

Instead, it enforces:

- **Human-in-the-loop verification**
- **Predictable visuals**
- **Low sensory load**
- **Consent-based analytics**
- **Clear ownership of decisions by caregivers**

These boundaries are **intentional and foundational**, not limitations.

---

## 📦 Why FIBO Was Critical (Product-Level Justification)

Most generative systems prioritize **novelty and diversity**.  
True Voice requires the opposite.

FIBO enables:

- **Structured, repeatable image generation**
- **Strict control over variation**
- **Deterministic reuse across episodes**
- **Scene stability for emotional safety**

This makes FIBO suitable for **assistive and neurodiverse-first applications**, where predictability matters more than creativity.

---

## 🧩 Market & Real-World Applicability

True Voice addresses a **real and underserved gap**:

- Autism support tools focus heavily on assessment  
- Communication tools often assume verbal participation  
- Parents lack **contextual emotional history**, only isolated events  

True Voice fits naturally into:

- Home caregiving  
- Special education environments  
- Therapy support workflows *(non-clinical)*  
- Early intervention ecosystems  

It is designed to **integrate**, not disrupt.

---

## 🧭 Product Principles

True Voice follows five core principles:

1. **Child comfort over system intelligence**
2. **Structure over spontaneity**
3. **Human decisions over automation**
4. **Understanding over monitoring**
5. **Long-term trust over short-term insight**


# ▶️ Running the Project Locally

The project consists of a **backend** and a **frontend**.

## 🔐 Backend Setup

### Backend Environment Validation

The backend includes a **built-in environment validation layer**.  
Required environment variables are checked at startup, and the server fails fast if configuration is missing.

No additional setup is required beyond creating the `.env` file.

### Required `.env` File

Create a `.env` file in the backend root:

** Add below Variable Key and Value Pair **

NODE_ENV=development
PORT=5000

JWT_SECRET=demo_jwt_secret
DEMO_PASSWORD=demo123

FAL_KEY=demo_key
OPENAI_API_KEY=demo_key
GOOGLE_API_KEY=demo_key


⚠️ All variables above are required.  
For judging and local evaluation, placeholder values (`demo_key`) are sufficient.

### Start Backend



cd fibo-backend/fibo-backend
npm install
npm run dev


Backend runs at:



http://localhost:5000


---

## 🖥️ Frontend Setup



cd fibo-frontend
npm install
npm run dev


Create a `.env` file in the frontend root:



VITE_API_BASE=http://localhost:5000


Frontend runs at:



http://localhost:5173


⚠️ Backend must be running before starting the frontend.

---

# 🌱 Future Implementation & Research Direction

True Voice is intentionally designed as a **foundational system** that can evolve carefully without compromising **emotional safety** or **caregiver trust**.

## 🔐 Guardian Verification & Trust Layers

Future versions may include:

- **Multi-factor authentication (MFA)**
- **Verified caregiver roles** (parent, teacher, therapist)

This enables trusted tracking while respecting privacy boundaries.

## 🎨 From Sympathy Images to Visual Storytelling

The current system uses a **single-frame support image** as emotional acknowledgment.

Future evolution may include:

- **Multi-frame visual storytelling**
- **Gentle narrative progression** (support → calm)
- **Visual continuity across episodes**

## 📊 Emotion & Episode Tracking (Opt-In)

With explicit consent and safeguards:

- Episodes may be analyzed to identify **recurring discomfort patterns**
- Environment-specific triggers may be surfaced

This data is designed to **support caregivers**, not replace human judgment.

## 🤖 Adaptive Image Generation Precision

Future image generation may become more emotionally adaptive:

- Increased precision for emotional tone
- Reduced variation when consistency is required
- Added detail only when clarity benefits the child

The goal is **emotional scalability**, not visual novelty.

## 🌍 A New Category of Application

True Voice represents an early step toward a new class of systems:

> Applications that translate emotion into structured, interpretable signals — without forcing language.

It is **not a medical tool**, but a bridge between **children**, **caregivers**, and **understanding**.

---

# 🔬 Research-Oriented 

True Voice can be viewed as an early demonstration of a broader research direction:
designing **child-safe, non-verbal communication systems** that convert subjective discomfort into structured signals.

### Research Threads

1. **Non-verbal expression as a structured signal**
2. **Emotion-safe generative AI**
3. **Personalization without overstimulation**
4. **Privacy-preserving longitudinal modeling**
5. **Human-in-the-loop verification**
6. **Toward a new benchmark category for emotion-safe AI**
## License

MIT License

Copyright (c) 2025 Khushboo Rani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.







