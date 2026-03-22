# Buildfolio 🚀

**Buildfolio** is a premium, minimal, and modern developer portfolio platform designed to help developers showcase their projects and GitHub repositories with elegance.

Built with a focus on visual excellence and developer experience, Buildfolio integrates seamlessly with GitHub and Firebase to provide a professional personal brand presence in minutes.

---

## ✨ Features

- **💎 Premium Design**: Sleek dark theme inspired by Linear, GitHub, and Notion.
- **🔐 Firebase Authentication**: Secure sign-in with Google and Email/Password.
- **🔄 GitHub Sync**: Automatically fetch and showcase your top repositories with star counts and languages.
- **📱 Responsive Layout**: Fully optimized for mobile, tablet, and desktop viewing.
- **🛠️ Project Management**: Private dashboard to manage, edit, and delete your showcase projects.
- **🌐 Community Explore**: A discovery page to browse and filter projects from other developers.

---

## 🛠️ Tech Stack

### Frontend
- **React/Next.js**: High-performance App Router architecture.
- **Tailwind CSS**: Modern styling with a custom dark-mode aesthetic.
- **Framer Motion**: Smooth micro-animations and transitions.
- **Lucide Icons**: Clean and consistent iconography.

### Backend
- **Node.js/Express**: Scalable REST API.
- **MongoDB**: Flexible database for user profiles and project metadata.
- **Firebase Admin SDK**: Secure server-side token verification.

---

## 📦 Project Structure

```text
buildfolio/
├── client/              # Next.js Frontend
│   ├── src/
│   │   ├── app/        # Pages & Layouts
│   │   ├── components/ # Atomic UI components
│   │   ├── context/    # Auth & State management
│   │   └── lib/        # API services (Firebase, GitHub)
└── server/              # Express Backend
    ├── src/
    │   ├── models/     # Database Schemas
    │   ├── routes/     # API Endpoints
    │   ├── middleware/ # Authentication logic
    │   └── config/     # Core configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Firebase Project (for Authentication)

### 2. Configuration

**Frontend (`client/.env.local`):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001/api
```

**Backend (`server/.env`):**
```env
PORT=5001
MONGODB_URI=...
FIREBASE_SERVICE_ACCOUNT_PATH=path/to/serviceAccountKey.json
```

### 3. Installation & Run
1. Install all dependencies:
   ```bash
   npm run install-all
   ```
2. Start the development servers:
   ```bash
   npm run dev
   ```

---

*Buildfolio - Your code, showcased beautifully.*
