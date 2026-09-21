# FreelanceHub — Modern Freelancer Marketplace Platform 🚀

A state-of-the-art, responsive freelance marketplace web application built with modern HTML5, Vanilla CSS3 (glassmorphism design system), and modular JavaScript. Features real-time search, multi-category filtering, interactive native modals, dynamic live card previews, proposal submission, and `localStorage` persistence.

---

## ✨ Features & Highlights

- 🎨 **Modern Glassmorphic UI & Ambient Aesthetics**:
  - Dark & Light mode switcher with persistent preference.
  - Curated color palette (Obsidian, Indigo/Violet gradients, Emerald, Cyan).
  - Modern typography powered by Google Fonts (`Outfit` & `Plus Jakarta Sans`).
  - Fluid micro-animations, elevation shadows, and glowing gradients.

- 🔍 **Real-Time Search & Filtering Engine**:
  - Multi-criteria instant search across project titles, descriptions, and required technical skills.
  - Filter by category (*Web Development, UI/UX & Design, Mobile Apps, AI & Data*).
  - Filter by budget tier (*Under ₹10,000, ₹10,000 – ₹25,000, ₹25,000+*).
  - Sort by newest or budget (high/low).

- 📋 **Live Interactive Project Posting**:
  - Real-time **Live Card Preview** that updates on the fly as the client fills out the posting form.
  - Automatic persistence to `localStorage` so newly created projects remain visible on refresh.

- 📑 **Native `<dialog>` Modals & Proposal Flow**:
  - **Apply for Project Modal**: Freelancers can submit bids, select timelines, and write personalized cover letters.
  - **Freelancer Profile Modal**: In-depth portfolio highlights, client testimonials, verified reviews, hourly rates, and hire buttons.
  - **Authentication Modal**: Seamless Sign In / Create Account with mock session state.
  - Native platform dismiss (ESC key and backdrop click to close).

- 🔔 **Custom Toast Notifications**:
  - Replaces default browser alerts with smooth, animated floating toast notifications with custom status icons.

- 💾 **Client-Side Persistence (`localStorage`)**:
  - Stores newly created projects, job applications, saved bookmarks, user session, and theme settings.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Structure** | Semantic HTML5, Native `<dialog>` elements, SVG icons |
| **Styling** | Vanilla CSS3, CSS Custom Properties (Variables), CSS Grid, Flexbox, Glassmorphism (`backdrop-filter`) |
| **Typography** | Google Fonts (`Outfit`, `Plus Jakarta Sans`) |
| **Logic & State** | Vanilla JavaScript (ES6+), DOM API, `localStorage` API, Event Delegation |

---

## 📂 Project Structure

```
FREELANCER MARKET/
├── FM.html                                    # Semantic HTML5 Application Structure
├── FM.css                                     # Modern Design System, Tokens, & Responsive Layout
├── FM.js                                      # Application State, Storage, Filters, & Modals
├── Freelancer_Marketplace_Project_Presentation.pptx # Project Pitch & Architecture Deck
└── README.md                                  # Documentation
```

---

## 🚀 Getting Started

Simply open `FM.html` in any modern web browser:

```bash
# Option 1: Double click FM.html in your file explorer
# Option 2: Serve via a lightweight local server (e.g. VS Code Live Server or python http.server)
python -m http.server 8000
```

Then navigate to `http://localhost:8000/FM.html` in your browser.

---

## 📄 License
MIT License. Created for FreelanceHub Platform.
