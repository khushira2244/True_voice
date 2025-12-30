🔗 Live Demo

Demo URL:
👉 https://truevoicemoment.netlify.app

🔐 Demo Login Credentials

Email: demo@gmail.com

Password: demo123

These credentials are provided for demo and evaluation purposes only.




Mermaid requires **clean, line-by-line graph definitions**.

---

## ✅ The ONLY correct README-safe version (copy-paste)

Use **exactly this**, no edits:

````md
```mermaid
flowchart TD

  %% INPUT LAYER
  A((Child Interaction))
  A --> A1[Selections<br/>Hero • Place • Feeling • Severity]

  %% DECISION LAYER
  A1 --> B{Frontend Decision Core}

  %% STATE FORMATION
  B --> C[Structured Episode State<br/>Local UI JSON]

  %% HIDDEN FRONTEND LOGIC
  subgraph HIDDEN[Hidden Frontend Layer]
    direction TB
    C --> D[Hero–Place Mapping Matrix]
    D --> E[Previous Episode Pattern Check]
    E --> F[Support Rule Resolver<br/>Default vs Guided]
  end

  %% OUTPUT RENDERING
  F --> G[Visual Support Rendering<br/>Images • Tone • Text]
  F --> H[Scenario & Symptom UI]

  %% DISPLAY & FEEDBACK
  G --> I[App Interface]
  H --> I
  I --> J[Analytics View<br/>Emotion Frequency • Parent Response]






🎬 Opening lines (before starting the demo)

“Before I start the live walkthrough, I’d strongly recommend watching this short demo video first.
It explains the complete end-to-end flow of the application in a stable demo mode, including the sympathy image generation logic, which is an important part of the system design.

This video will give you the full context of how the app works, so the live demo will feel much clearer and easier to follow.”

🔗 Mention the Drive video (judges-only)

“I’ve shared the full demo video via Google Drive for judges.
The reason it’s on Drive is to keep the experience consistent, fast, and free from generation delays or randomness during evaluation.”

You can show or paste:

Google Drive Demo (Judges Only):
👉 https://drive.google.com/file/d/1MD6ALJ6idcGIQtyLmoC9HbVV1YLlvK4M/view

🎨 Clarify sympathy image generation (important framing)

“This video also includes the sympathy image generation flow.
During judging, images are pre-generated using structured prompts to ensure deterministic results, fast UX, and no dependency on live credits — while the backend already supports dynamic generation using the same prompt structure.”

This reassures judges you made a deliberate engineering choice, not a shortcut.


🤖 Image Generation During Judging (Stable Demo Mode)

All images used in this project were generated using FIBO via Postman and then saved as static image URLs inside the frontend mapping.

For judging, the frontend intentionally uses these pre-generated FIBO images to ensure:

✅ consistent outputs (no randomness during evaluation)

✅ fast UX (no waiting for generation)

✅ no dependency on live credit usage during judging

The backend already supports dynamic FIBO generation using the same prompt structure and safety rules, and can be enabled after judging if needed.


🔧 Post-Judging Mode (Dynamic Generation)

After judging, the backend can be configured to generate new support images dynamically using the same prompt structure and safety rules.

This does not require any frontend rewrite — only enabling the backend keys and calling the existing endpoint.



Installation & Running the Project and   only made for screen size (1440px to tab mode(768px))

This project has two parts:

Backend (Node + Express) → required for login + token-protected APIs

Frontend (React + Vite) → UI flow for kids + guardian

1️ Install & Start Backend

Open terminal:

cd fibo-backend/fibo-backend
npm install
🔐 Backend Environment Variables (Required)

The backend will not start properly unless all required environment variables are defined.

Create the file:

fibo-backend/fibo-backend/.env


Add the following functions and constants:


1."import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
    const value = process.env[name]
    if(!value){
        throw new Error(`Environment variables ${name} is required but not set.`)

    }
    return value
}
"
# ===============================
# Core Server Configuration
# ===============================
NODE_ENV=development
PORT=5000

# ===============================
# Authentication (Demo Mode)
# ===============================
JWT_SECRET=demo_jwt_secret
DEMO_PASSWORD=demo123

# ===============================
# AI / Image Generation (Demo Safe)
# ===============================
# Real keys are NOT required for judging
FAL_KEY=demo_key
OPENAI_API_KEY=demo_key
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_STYLE=chat

# (Optional – only if using Gemini instead of OpenAI)
GOOGLE_API_KEY=demo_key

# ===============================
# Weather / Location Defaults
# ===============================
WEATHER_LAT=28.6139
WEATHER_LON=77.2090

🔑 Important Notes for Judges

✅ All values above are demo-safe

✅ Backend will start successfully with these values

✅ Login + auth token flow works with DEMO_PASSWORD=demo123

❌ Real API keys are needed only if regenerating images

For demo evaluation, support images are pre-generated and reused, so real keys are not required.

The backend must start for login + auth token flow.

Login does NOT need real keys, so demo_key is fine.

Real keys are only needed if you want to regenerate images using FIBO.

 For judging/demo: pre-generated support images are already mapped in frontend, so real keys are optional.

▶️ Start Backend Server
npm run dev


Backend runs on:

http://localhost:5000

2️⃣ Install & Start Frontend (Required)

Before starting the frontend, you must configure the environment file.

📄 Create Frontend .env

Create the file:

fibo-frontend/.env


Add the following:

VITE_API_BASE=http://localhost:5000


This tells the frontend where the backend API is running.

▶️ Install & Run Frontend

Open a new terminal:

cd fibo-frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

⚠️ Important Note

Backend must be running before starting the frontend

Otherwise login and protected API calls will fail
 Demo Login (Required)

Login is required to get an auth token (protected routes).

Use:

Email: any valid email (example: demo@test.com)

Password: demo123

 Auth is intentionally simplified for hackathon evaluation.

✅ Quick Troubleshooting
If login fails

Make sure backend is running on http://localhost:5000

Make sure .env exists in backend folder

Use password exactly: demo123

If image generation fails

That’s expected if you used demo_key

Demo still works because support images are pre-generated and mapped in frontend

Add real FAL_KEY if you want to regenerate images

Demo Walkthrough (Video)

👉 Demo Video:
https://www.youtube.com/watch?v=Supej1h4ueY

This video demonstrates:

Complete end-to-end child flow

Hero-based interaction

Scenario, symptom, and severity selection

Support / sympathy image experience

Guardian-attended flow

Local episode persistence (demo mode)

 The demo uses pre-generated support images to ensure consistent, safe visuals during evaluation.

🧩 Product Discussion
What Problem Does TrueVoice Solve?

Many children—especially autistic or non-verbal children—struggle to communicate physical discomfort or pain using words.

Common challenges include:

Difficulty naming pain

Anxiety during questioning

Sensory overload

Reliance on adult interpretation

Traditional systems depend on verbal explanation, text input, or medical terminology, which can be overwhelming or inaccessible.

How TrueVoice Approaches the Problem

TrueVoice replaces explanation with guided visual choice.

Instead of asking children to describe pain, the system allows them to:

Choose a hero they feel safe with

Select where they are (home, school, outside)

Indicate what hurts

Indicate how severe it feels

This transforms pain expression into a calm, step-by-step interaction, reducing stress and ambiguity.

 Emotional Support Layer (Key Product Feature)

After a child completes an episode, TrueVoice introduces a Support / Sympathy stage.

This stage:

Acknowledges the child’s discomfort emotionally

Shows a calm, reassuring support image

Helps the child feel seen and safe, not rushed

For autistic children, emotional validation is as important as symptom identification.

 How Support Images Are Designed (Important)

TrueVoice intentionally limits image variation.

Design Choice:

One support image per child + location

Same image reused across multiple symptoms

Why this matters:

Reduces visual overload

Builds familiarity and emotional safety

Prevents anxiety caused by constantly changing visuals

This is a child-first UX decision, not a technical shortcut.

 How FIBO Is Used (AI Strategy)

FIBO is used sparingly and intentionally.

In the current demo:

Images are generated once per:

child + location + severity


Total images generated:

AVA: School, Home, Outside → 3 images

LEO: School, Home, Outside → 3 images

Total: 6 AI image generations

All subsequent episodes reuse these images via deterministic keys.

 How This Scales in the Future

TrueVoice is designed to scale without exploding AI usage.

Scaling dimensions:

More children → +3 images per child

More locations → +1 image per location per child

More symptoms → no new images required

This keeps:

AI cost low

UX consistent

System predictable and safe

 Responsible AI Design

TrueVoice follows responsible AI principles:

No AI calls per user click

No text rendered inside images

Guardian messaging separated from image prompting

Deterministic reuse instead of uncontrolled generation

This makes the system suitable for sensitive, child-centered contexts.

🌱 Future Scope & Product Evolution

TrueVoice is intentionally built as a foundational system.
The current version demonstrates the core interaction model, while leaving space for careful, responsible expansion.

👶 Child & Guardian Profile Expansion

In future versions:

Guardian profiles will define:

Where the child usually goes (school, therapy, playground, transport, etc.)

Trusted caregivers (parents, teachers, helpers)

The available scenarios presented to the child will be context-aware, based on guardian-provided inputs.

If an unfamiliar situation occurs:

The system can infer or suggest scenarios using an LLM

Always with guardian confirmation, never automatically.

This ensures flexibility without removing parental control.

🧠 Symptom Vocabulary Expansion (Community-Guided)

The current demo includes a limited symptom set to maintain clarity.

In the future:

Symptom categories can be expanded using:

Autism community guidelines

Pediatric care standards

Therapist and caregiver feedback

Symptoms will remain simple, visual, and non-clinical, even as coverage grows.

The goal is inclusivity, not medical diagnosis.

🔐 Attendance & Guardian Verification

Currently:

Episode attendance is marked using guardian name + email (demo mode)

In future versions:

Guardian actions can be protected using:

Multi-factor authentication (MFA)

Verified caregiver roles (parent, teacher, therapist)

This enables trusted tracking while respecting privacy boundaries.

🎨 From Sympathy Images to Storytelling

The current support image is a single-frame emotional acknowledgment.

Future evolution may include:

Multi-frame visual storytelling

Gentle narrative progression (beginning → support → calm)

Visual continuity across episodes

This opens the door to:

Better emotional processing for children

Clearer insight for caregivers and teachers

📊 Emotion & Episode Tracking (Optional, Opt-In)

With proper consent and safeguards:

Episodes can be analyzed over time to identify:

Recurring discomfort patterns

Environment-specific triggers

This data can support caregivers and educators — not replace them.

🤖 Adaptive Image Generation Precision

In the future, image generation can become layered and adaptive:

More precision for:

Emotional tone

Environment familiarity

Caregiver presence

Fewer visual changes when consistency is needed

More detail when guidance and clarity are beneficial

This allows the system to scale emotionally, not just technically.

🌍 A New Category of Application

TrueVoice represents an early step toward a new class of applications:

Systems that translate emotion into structured, interpretable signals — without forcing language.

It is designed not as a medical tool, but as a bridge between children, caregivers, and understanding.

🔬 Research-Oriented Framing (Future Research Direction)

TrueVoice can be viewed as more than a UI prototype — it is an early demonstration of a research direction:
how to build child-safe, non-verbal communication systems that translate subjective discomfort into structured, interpretable signals.

This creates a bridge between:

Human-centered interaction design

Affective computing

Accessible AI

Trustworthy, constrained generative systems

1) Non-Verbal Expression as a Structured Signal

A core research idea behind TrueVoice is:

A child’s selections (hero → place → symptom → severity) can be treated as a structured observation, not free text.

This allows future work in:

robust representation learning for non-verbal user input

mapping episodic selections to interpretable “state snapshots”

uncertainty-aware reasoning over incomplete or noisy choices

2) Emotion-Safe Generative AI (Constrained Generation)

TrueVoice uses a constrained generation strategy:

the model is never asked to generate arbitrary content

prompts are bounded by safe style, environment constraints, and caregiver guidance

output images are reused intentionally to reduce variability

This leads to a research question:

How do we design generative systems with bounded variability that prioritize psychological safety and predictability?

Potential evaluation dimensions:

visual consistency vs emotional effectiveness

cognitive load reduction for autistic children

safety constraint compliance under prompt variability

3) Personalization Without Overstimulation (Adaptive Precision)

Instead of “more personalization = better,” TrueVoice motivates a different idea:

Precision should be increased only when it improves clarity without increasing distress.

Future research can explore adaptive layers:

low-variation “safe baseline visuals”

gradual personalization controlled by guardian and therapist feedback

scenario-specific visual grounding to avoid hallucinated context

4) Longitudinal Episode Modeling (Opt-In, Privacy-Preserving)

With consent and safeguards, episodes can become a longitudinal dataset for:

pattern discovery (time/location recurrence)

trigger hypothesis generation (environment-linked distress)

caregiver/teacher decision support (not diagnosis)

Research direction:

privacy-preserving storage and summarization of child episodes

bias-aware interpretation (avoid overfitting assumptions)

explainable trend views suitable for caregivers

5) Human-in-the-Loop Safety and Verification

TrueVoice is naturally aligned with human-in-the-loop AI:

guardians define scenario boundaries

teachers/therapists may validate symptom expansions

AI can suggest, but never override caregiver confirmation

This enables research into:

safe interaction protocols

caregiver-verifiable personalization

role-based control (parent vs teacher vs clinician)

6) A New Benchmark Category

TrueVoice hints at a broader research benchmark:

“Emotion-safe multimodal support generation under constrained inputs.”

Future research could define:

small controlled prompt sets

safety and consistency metrics

child-friendly subjective feedback protocols

measurable reduction in anxiety / improved reporting reliability



