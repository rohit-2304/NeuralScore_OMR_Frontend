# NeuralScore: OMR Dashboard

This directory contains the **Next.js** frontend for the Automated OMR (Optical Mark Recognition) Grading SaaS. It acts as an interactive command center where users can seamlessly drag-and-drop OMR sheets, visualize rapid grading inferences, and review deep analytics.

Built with bleeding-edge web technologies, the frontend focuses heavily on an immersive, glassmorphic UI, fluid frame motions, and an excellent developer experience.

## ✨ Highlights & Features

- **Modern Stack**: Built tightly with React 18, Next.js 14, and TypeScript.
- **Stunning UI/UX**:
  - Uses Tailwind CSS explicitly mapped for a dynamic dark mode syntax.
  - Implements complex animations via **Framer Motion** (e.g. view transitions and staggering uploads).
  - Minimalistic vector graphics gracefully implemented with **Lucide React**.
- **Real-Time Insight Display**:
  - Extracts overall metrics (Score, Accuracy, Blanks) dynamically from JSON.
  - Generates an analytical table containing question-by-question confidence scores.
- **Native Visualizer**: Binds base64-encoded annotation patches sent natively from the FastAPI backend into an immersive preview pane.
- **File Integrity Handlers**: Client-side fallbacks alerting the user on invalid file uploads or backend disconnects.

---

## 📂 Layout Overview

```text
frontend/
├── src/
│   └── app/
│       ├── page.tsx          # Main dashboard view containing dropzone & result views
│       ├── layout.tsx        # Base Document markup & Next.js RootLayout
│       └── globals.css       # Tailwind CSS directives & global visual settings
├── tailwind.config.ts        # Tailwind theme definitions and plugins
├── next.config.mjs           # Next.js configurations
└── package.json              # Project scripting and dependencies
```

---

## 🚀 Setup & Execution

### Prerequisites
Make sure you have Node.js (v18.17.0 or greater) and npm (or pnpm/yarn) installed on your system.
You will also need the FastAPI Backend active for predictions to work natively.

### 1. Install Dependencies
Navigate entirely into the `frontend` directory and install the necessary node modules:

```bash
npm install
```

### 2. Configure Environment Variables
By default, the dashboard reaches out to `http://127.0.0.1:8000/api/grade` for API processing. 
If your backend is hosted differently, create a `.env.local` file in the `frontend` root and add:
```env
NEXT_PUBLIC_API_URL=https://your-custom-api-domain.com/api/grade
```

### 3. Run Development Server
Bring up the React development environment:
```bash
npm run dev
```
Navigate to **[http://localhost:3000](http://localhost:3000)** inside your browser to see the dashboard.

### 4. Build for Production
To bundle the dashboard for deployment (e.g. across Vercel):
```bash
npm run build
npm run start
```

---

## 🎨 Modifying Core Design
The application enforces strict design properties across `tailwind.config.ts`. If altering the visual schema (e.g. to a light-mode priority), you will similarly need to update gradient definitions inside `page.tsx` directly.
