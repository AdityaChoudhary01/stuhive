# 📑 StuHive: The Cinematic Academic Discovery Engine

<div align="center">
<p><strong>Empowering students through decentralized, open-access knowledge sharing.</strong></p>
<a href="[https://www.stuhive.in](https://www.stuhive.in)">Live Website</a> •
<a href="[https://www.stuhive.in/search](https://www.google.com/search?q=https://www.stuhive.in/search)">Explore Library</a> •
<a href="[https://www.stuhive.in/blogs](https://www.google.com/search?q=https://www.stuhive.in/blogs)">Community Blogs</a>
</div>

**StuHive** is a high-performance, decentralized academic library designed to empower students through seamless knowledge sharing. Built with a strict focus on **Cinematic UI/UX**, **Technical SEO**, and **Scalable Next.js 15 Architecture**, it transforms static study materials into a dynamic, real-time discovery experience.

---

## 🗺️ Platform Architecture & Live URLs

Explore the live platform modules:

| Module | Description | Live URL |
| --- | --- | --- |
| **Discovery Engine** | Global search, filtering, and pagination for study notes. | [stuhive.in/search](https://www.google.com/search?q=https://www.stuhive.in/search) |
| **Global Search** | Cross-platform search for notes, blogs, and users. | [stuhive.in/global-search](https://www.google.com/search?q=https://www.stuhive.in/global-search) |
| **Community Blogs** | Student-written articles, tutorials, and experiences. | [stuhive.in/blogs](https://www.google.com/search?q=https://www.stuhive.in/blogs) |
| **Real-Time Chat** | Peer-to-peer messaging and presence tracking. | [stuhive.in/chat](https://www.google.com/search?q=https://www.stuhive.in/chat) |
| **User Dashboard** | Manage uploads, saved collections, and follower stats. | [stuhive.in/profile](https://www.google.com/search?q=https://www.stuhive.in/profile) |
| **Support Platform** | Secure contact terminal routed via Brevo SMTP. | [stuhive.in/contact](https://www.google.com/search?q=https://www.stuhive.in/contact) |
| **Wall of Fame** | Real-time tracking of community supporters & donors. | [stuhive.in/supporters](https://www.google.com/search?q=https://www.stuhive.in/supporters) |
| **Legal Hub** | Privacy, Terms of Service, and DMCA guidelines. | [stuhive.in/privacy](https://www.google.com/search?q=https://www.stuhive.in/privacy) |

---

## ✨ Key Features

### 💬 Real-Time Ecosystem

* **Live Peer Messaging:** Powered by **Ably WebSockets**, featuring instant message delivery, unread counts, and active presence (online/offline status).
* **Smart UI Portals:** New chat dialogues utilize `react-dom` Portals to escape deep DOM hierarchies, ensuring perfect overlay rendering without layout shifts.

### 📚 Academic Vault & Collections

* **Cloudflare R2 Integration:** Decentralized, lightning-fast S3-compatible storage for high-res images, PDF documents, and avatars.
* **Custom Collections:** Users can create personalized folders to curate and save notes using **Optimistic UI Updates** for instant feedback.
* **Smart Deletion:** Server Actions automatically trigger cascade deletions, wiping database entries and their associated R2 cloud files simultaneously.

### 🎨 Cinematic Experience

* **Hardware-Accelerated UI:** Utilizing Tailwind CSS and CSS variables for smooth, 60fps glassmorphism effects.
* **Adaptive Interactivity:** Smart components feature hover-aware gradients, 3D tilt effects, and cinematic flares.
* **PWA Ready:** Installable as a Progressive Web App on iOS and Android with custom-configured Maskable Splash Screens.

### 🔍 Discovery Engine (SEO)

* **Schema.org Integration:** Automated JSON-LD injection for `CreativeWork`, `BlogPosting`, and `Person` entities to secure Google Rich Snippets.
* **Dynamic Metadata:** High-octane `generateMetadata` implementation that scales titles and descriptions based on real-time database counts.
* **Automated Sitemaps:** Real-time XML sitemap generation with MongoDB `.lean()` query optimization for fast indexing.

---

## 🏗 Tech Stack & Methodology

| Category | Technology | Implementation Details |
| --- | --- | --- |
| **Framework** | **Next.js 15 (App Router)** | Leveraging asynchronous `searchParams`, Server Components, and Streaming. |
| **Frontend** | **React 19 & Tailwind CSS** | Strict adherence to React purity rules; utilizing Shadcn UI & Lucide Icons. |
| **Backend** | **Server Actions** | Zero-API-route architecture. Direct, secure database mutations from the client. |
| **Database** | **MongoDB & Mongoose** | Highly normalized schemas with population mapping. |
| **Storage** | **Cloudflare R2** | Configured via `@aws-sdk/client-s3` for zero-egress-fee asset hosting. |
| **Real-Time** | **Ably** | Dynamically imported browser-only clients to keep initial server bundles under 6MB. |
| **Authentication** | **NextAuth.js** | Secure Google OAuth 2.0 integration with persistent sessions. |
| **Email API** | **Brevo SMTP** | Beautifully formatted HTML email templates for contact/support routing. |

---

## 📉 Performance Optimization Strategies

StuHive implements a ruthless performance strategy optimized for Vercel deployment:

1. **Strict React Purity:** Eliminated cascading renders and hydration mismatches by pushing non-deterministic state updates (like `Date.now()` or randomized mock data) into asynchronous event loops (`setTimeout`).
2. **Dynamic Bundle Splitting:** Heavy modules (like the Ably Chat Client and PDF renderers) are wrapped in Next.js `next/dynamic` to ensure they are only downloaded when a user actually opens them.
3. **Stale-While-Revalidate:** The custom Service Worker serves cached content instantly while fetching updates in the background, allowing the site to function in low-connectivity academic environments.
4. **Zero Layout Shift (CLS):** Every image (`next/image`) and skeleton state is pre-sized to prevent content jumping.

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/AdityaChoudhary01/StuHive.git
cd StuHive

```

### 2. Install dependencies

```bash
npm install

```

### 3. Environment Setup

Create a `.env.local` file in the root directory and populate it with your credentials:

```env
# APP
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AUTH
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

# DATABASE
MONGODB_URI=your_mongodb_connection_string

# CLOUDFLARE R2
R2_ACCESS_KEY_ID=your_id
R2_SECRET_ACCESS_KEY=your_secret
R2_BUCKET_NAME=your_bucket
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-pub-id.r2.dev

# APIs
BREVO_API_KEY=your_brevo_key
BREVO_VERIFIED_SENDER_EMAIL=your_email@domain.com
ABLY_API_KEY=your_ably_key

```

### 4. Run Development Server

```bash
npm run dev

```

---

## 📂 Architecture Structure

```text
├── actions/             # Next.js Server Actions (Database logic & mutations)
├── app/                 # Next.js App Router (Routes & Pages)
│   ├── (auth)/          # Authentication routes (Login/Signup)
│   ├── (static)/        # Static info pages (Donate, Contact, Supporters)
│   ├── (legal)/         # Legal pages (Privacy, Terms, DMCA)
│   ├── chat/            # Real-time Ably messaging routes
│   ├── search/          # The Discovery Engine
│   └── sitemap.xml/     # Automated SEO Sitemap
├── components/          # Reusable UI Components
│   ├── chat/            # Chat lists, Dialogues, Portals
│   ├── notes/           # Note cards, Filters, Collection Modals
│   ├── blog/            # Blog cards, Editors
│   └── ui/              # Shadcn primitive components (Buttons, Inputs, Dialogs)
├── hooks/               # Custom React Hooks (useToast, etc)
├── lib/                 # Shared utilities & Database config (Mongoose connection)
├── models/              # Mongoose Schema Models (User, Note, Blog, Chat)
├── public/              # Service Worker, Manifest, Splash Screens & Assets
└── next.config.js       # High-Octane Build Config

```

---

## 🤝 Contributing

Contributions are what make the academic community incredible. If you have a suggestion that would make this better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. Built for the academic community by Aditya Choudhary.