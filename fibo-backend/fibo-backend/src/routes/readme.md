Here’s a tight summary of what you’ve built on the backend, so you can wire the frontend without thinking too much 👇

---

## 1️⃣ App + Router structure

* **`app.js`**

  * `app.use(express.json())`
  * `app.use("/api", router)` → mounts `routes/index.js`
  * `GET /health` → `{ ok: true, env: NODE_ENV }`

* **`routes/index.js`**

  * `GET /api/ping` → `{ ok: true, message: "Api is live" }`
  * `router.use("/episodes", episodeRoutes)` → `/api/episodes/...`
  * `router.use("/", promptRoutes)` → `/api/hero`, `/api/scenario`, etc.

So all your important endpoints are under `/api`.

---

## 2️⃣ Auth (login) – high level

You have login implemented (JWT-style). The idea:

* User **registers / logs in** → gets a **token**.
* Frontend must send:

  ```http
  Authorization: Bearer <token>
  ```

  to any route that needs `req.user` (like episodes, and possibly severity).

You use `requireAuth` middleware on protected routes to:

* read `Authorization` header
* verify JWT
* set `req.user = { id, email, ... }`

---

## 3️⃣ FIBO service

**File:** `services/fiboService.js`

* Exported function:

  ```js
  generateWithFibo(promptOrInput, extraOptions = {}) -> Promise<imageUrl>
  ```
* You always call it like:

  ```js
  const imageUrl = await generateWithFibo(prompt, { aspect_ratio: "1:1" })
  ```

It returns a direct `imageUrl` that frontend can use in `<img src="...">`.

---

## 4️⃣ Prompt routes (core medical flow) – `promptRoutes.js`

All of these are **POST** under `/api`:

---

### 🔹 `/api/hero`

* **Body:**

  ```json
  { "hero": "ava_child" }  // or "leo_child"
  ```
* Looks up hero in `HERO_OPTIONS`:

  ```js
  { id: "ava_child", basePrompt: "..." }
  ```
* Calls FIBO with `basePrompt`.
* **Response:**

  ```json
  {
    "imageUrl": "https://...",
    "prompt": "...",
    "step": "hero",
    "hero": "ava_child"
  }
  ```

---

### 🔹 `/api/scenario`

* **Body:**

  ```json
  { "hero": "ava_child", "scenario": "home" }
  ```

  `scenario` is one of: `"home" | "school" | "outside"`

* Looks up in `HERO_SCENARIO_PROMPTS`:

  ```js
  { hero: "ava_child", scenario: "home", basePrompt: "..." }
  ```

* Calls FIBO.

* **Response:**

  ```json
  {
    "imageUrl": "https://...",
    "prompt": "...",
    "step": "scenario",
    "hero": "ava_child",
    "scenario": "home"
  }
  ```

---

### 🔹 `/api/symptom`

* **Body:**

  ```json
  {
    "hero": "ava_child",
    "scenario": "home",
    "symptom": "stomach"
  }
  ```

  `symptom` is one of your `BODY_AREAS` ids:
  `"head" | "chest" | "stomach" | "throat" | "arm" | "leg" | "back" | "breathing_or_choking" | "big_hurt_or_bleeding"`

* Looks up in `HERO_SCENARIO_SYMPTOM_PROMPTS`:

  ```js
  { hero, scenario, symptom, basePrompt }
  ```

* Calls FIBO.

* **Response:**

  ```json
  {
    "imageUrl": "https://...",
    "prompt": "...",
    "step": "symptom",
    "hero": "ava_child",
    "scenario": "home",
    "symptom": "stomach"
  }
  ```

---

### 🔹 `/api/severity`  ✅ final step + episode creation

* **Body:**

  ```json
  {
    "hero": "ava_child",
    "scenario": "home",
    "symptom": "stomach",
    "severity": "mild"   // or "severe"
  }
  ```

* Looks up in `HERO_SCENARIO_SYMPTOM_WITH_SRVERITY_PROMPTS`:

  ```js
  { hero, scenario, symptom, severity, basePrompt }
  ```

* Calls FIBO with that `basePrompt`.

* **Creates an episode** (final record) for this user using `createEpisode(...)`.

* **Response:**

  ```json
  {
    "imageUrl": "https://...",
    "prompt": "...",
    "step": "severity",
    "hero": "ava_child",
    "scenario": "home",
    "symptom": "stomach",
    "severity": "severe",
    "episodeId": 3
  }
  ```

This is the **only step** where we save a “final image episode”.

---

## 5️⃣ Episodes – `episodeRoutes.js`

In-memory storage (for now):

```js
const episodes = [];
let nextEpisodeId = 1;

export function createEpisode({ userId, hero, scenario, symptom, severity, prompt, imageUrl }) {
  const episode = {
    id: nextEpisodeId++,
    userId,          // from req.user.id
    hero,
    scenario,
    symptom,
    severity,
    prompt,
    imageUrl,
    createdAt: new Date().toISOString()
  };
  episodes.push(episode);
  return episode;
}
```

### 🔹 `GET /api/episodes`  (usually protected with `requireAuth`)

* Uses `req.user.id`
* Returns all episodes **for that user**:

  ```json
  {
    "episodes": [ { ... }, { ... } ]
  }
  ```

### 🔹 `GET /api/episodes/last`

* Filters episodes for `req.user.id`
* Returns last one:

  ```json
  {
    "lastEpisode": { ... }  // or null
  }
  ```

Later, frontend can call `/api/episodes/last` and use `imageUrl` + episode metadata to build a **WhatsApp share link**.

---

## 6️⃣ Frontend wiring checklist

When you build the UI, the flow per user will be:

1. **Login**

   * `POST /api/auth/login` → store `token` in localStorage

2. **Hero step**

   * `POST /api/hero` with `{ hero }` + `Authorization: Bearer token`

3. **Scenario step**

   * `POST /api/scenario` with `{ hero, scenario }`

4. **Symptom step**

   * `POST /api/symptom` with `{ hero, scenario, symptom }`

5. **Severity (final)**

   * `POST /api/severity` with `{ hero, scenario, symptom, severity }`
   * This will also create an episode

6. **Show / share last episode**

   * `GET /api/episodes/last` (with token)
   * Use `imageUrl` and fields in a “share on WhatsApp” button later.

---

If you want, next step I can sketch a tiny frontend state machine like:

```ts
type Step = "hero" | "scenario" | "symptom" | "severity";
```

and show how to call each API in order from React or plain JS.
