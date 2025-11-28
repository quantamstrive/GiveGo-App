# GiveGo

**GiveGo** is a full-stack volunteering platform that connects volunteers with NGOs. It features a sleek pixel/neon retro style. This repo contains the app structure, flows, and design specs, ready to integrate into any AI coding model or development workflow.

---

## UI / Theme

* **Background:** Pure black (#000000)
* **Font:** Pixel-style (Press Start 2P / VT323)
* **Accents:** Neon cyan (#00eaff) & purple (#a960ff)
* Minimal retro-pixel vibe
* Smooth modern layout
* Fully responsive (mobile + desktop)
* Clean card layouts, glowing borders, pixel buttons

---

## Auth Flow

* Google OAuth sign-in
* User chooses a role: **Volunteer** or **NGO**
* Role is stored in the database

---

## Volunteer Flow

* **Registration Form:** Name, Phone/WhatsApp, Gmail
* **Dashboard Tabs:** Events | My Profile | Chats
* **Events Page:** Cards with title, description, location, time, age requirement, skills gained, buttons (Apply / Donate)
* **Apply Flow:** Optional NGO questions, status “Pending Review,” NGO Accept/Reject
* **Profile Page:** Volunteering hours, skills gained, certificates (downloadable), edit profile
* **Event Group Chat:** Real-time, neon pixel bubbles, auto-join when accepted
* **Certificates:** Downloadable PDFs after completing an event

---

## NGO Flow

* **Verification Page:** Organization name, registration number, documents, contact info, location
* **Dashboard Tabs:** Create Event | Manage Events | Applications | Certificates
* **Create Event:** Title, description, location, date/time, age/skill requirements, volunteer questions, banner upload
* **Application Review:** View volunteer info & answers, Accept/Reject, auto-add to chat
* **Certificate Issuing:** Upload/template, auto-generate PDF
