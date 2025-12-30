## 🧠 True Voice

**True Voice** is a **child-first, visual communication system** designed to help **autistic and non-verbal children** express **discomfort, pain, or emotional distress** without relying on **verbal explanation**.

Instead of asking children to describe how they feel, the system guides them through a **calm, step-by-step visual flow** using **familiar heroes, places, and simple choices** — while keeping **parents fully involved** in **review, safety, and support decisions**.

The design prioritizes **emotional safety**, **predictability**, and **human-in-the-loop control**.

---

## 🔗 Live Demo

**Demo URL 👉** https://truevoicemoment.netlify.app/

### Demo Credentials

- **Email:** demo@gmail.com  
- **Password:** demo123

For **judging and evaluation**, the demo runs in a **stable mode** using **pre-generated support images** to ensure **consistent UX** and avoid dependency on **live generation credits**.

🔄 End-to-End System Flow

<img width="3914" height="14717" alt="flow_design" src="https://github.com/user-attachments/assets/346ac685-684b-4b52-a83c-57beb2b194cb" />

Flow overview:

Parents provide child details, favorite heroes, and familiar places

Children interact through a guided visual flow (hero → place → symptom → severity)

Unknown places are safely suggested using an LLM and filtered

Emergency paths trigger immediate alerts to parents

Parent verification gates any custom support generation

Past episodes and parent decisions improve future guidance

Analytics summarize child discomfort patterns and parent involvement

This flow ensures safety, caregiver oversight, and long-term learning.

🧩 Product Description (FIBO-Based Design)

True Voice uses FIBO as its core image-generation system for emotional support and sympathy visuals.

Key principles:

Support images are generated using structured prompting

Visual variation is intentionally limited to reduce sensory overload

Images are reused deterministically for familiarity and emotional safety

Parents remain in control of any custom support generation

AI assists the interaction — it never replaces parental judgment.

▶️ Running the Project Locally

The project consists of a backend and a frontend.

🔐 Backend Setup
Backend Environment Validation

The backend includes a built-in environment validation layer (already implemented in the repository).
Required environment variables are checked at startup and the server fails fast if configuration is missing.

No additional setup is required beyond creating the .env file below.

Required .env file

Create a .env file in the backend root:

NODE_ENV=development
PORT=5000

JWT_SECRET=demo_jwt_secret
DEMO_PASSWORD=demo123

FAL_KEY=demo_key
OPENAI_API_KEY=demo_key
GOOGLE_API_KEY=demo_key


⚠️ All variables above are required.
For judging and local evaluation, placeholder values (demo_key) are sufficient.

Start Backend
cd fibo-backend/fibo-backend
npm install
npm run dev


Backend runs at:

http://localhost:5000

🖥️ Frontend Setup
cd fibo-frontend
npm install
npm run dev


Create .env in frontend root:

VITE_API_BASE=http://localhost:5000


Frontend runs at:

http://localhost:5173


Backend must be running before starting the frontend.

🌱 Future Implementation & Research Direction

True Voice is intentionally designed as a foundational system that can evolve carefully without compromising emotional safety or caregiver trust.

🔐 Guardian Verification & Trust Layers

Future versions may include:

Multi-factor authentication (MFA)

Verified caregiver roles (parent, teacher, therapist)

This enables trusted tracking while respecting privacy boundaries.

🎨 From Sympathy Images to Visual Storytelling

The current system uses a single-frame support image as emotional acknowledgment.

Future evolution may include:

Multi-frame visual storytelling

Gentle narrative progression (support → calm)

Visual continuity across episodes

This can support deeper emotional processing for children and clearer insight for caregivers.

📊 Emotion & Episode Tracking (Opt-In)

With explicit consent and safeguards:

Episodes may be analyzed over time to identify:

Recurring discomfort patterns

Environment-specific triggers

This data is intended to support caregivers and educators, not replace human judgment.

🤖 Adaptive Image Generation Precision

Future image generation may become emotionally adaptive:

Increased precision for emotional tone and environment familiarity

Reduced variation when consistency is required

Increased detail only when clarity and guidance benefit the child

The goal is emotional scalability, not visual novelty.

🌍 A New Category of Application

True Voice represents an early step toward a new class of systems:

Applications that translate emotion into structured, interpretable signals — without forcing language.

It is not a medical tool, but a bridge between children, caregivers, and understanding.

🔬 Research-Oriented Framing (Future Research Direction)

True Voice can be viewed as an early demonstration of a broader research direction:
designing child-safe, non-verbal communication systems that convert subjective discomfort into structured signals.

This connects:

Human-centered interaction design

Affective computing

Accessible AI

Trustworthy, constrained generative systems

1️⃣ Non-Verbal Expression as a Structured Signal

Selections (hero → place → symptom → severity) can be treated as structured observations, enabling:

Interpretable episodic state modeling

Uncertainty-aware reasoning over incomplete inputs

2️⃣ Emotion-Safe Generative AI

True Voice follows constrained generation:

No arbitrary generation

Bounded prompts with caregiver guidance

Intentional reuse to reduce variability

Research question:

How can generative systems balance expressiveness with psychological safety?

3️⃣ Personalization Without Overstimulation

Precision should increase only when it improves clarity without increasing distress.

Future research may explore:

Safe baseline visuals

Gradual personalization under caregiver control

Scenario-grounded generation to avoid hallucinated context

4️⃣ Longitudinal Episode Modeling (Privacy-Preserving)

With opt-in consent:

Episodes may support longitudinal pattern discovery

Caregiver decision support (not diagnosis)

Research directions include privacy-preserving storage and explainable trend views.

5️⃣ Human-in-the-Loop Verification

True Voice enforces:

Caregiver-defined boundaries

Role-based verification

AI suggestions without override authority

6️⃣ Toward a New Benchmark Category

True Voice hints at a future benchmark:

Emotion-safe multimodal support generation under constrained inputs

Potential evaluation dimensions:

Safety and consistency metrics

Child-friendly feedback protocols

Reduced anxiety and improved reporting reliability


