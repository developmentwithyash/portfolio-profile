# How to Update Your Portfolio

This portfolio was designed from the ground up to be **effortless to update**. You don't need to touch `index.html` or write complex CSS. Everything is driven by a single master data file:

📍 **`data/portfolio-data.js`**

---

## 1. Adding a New Project in 60 Seconds

Open `data/portfolio-data.js`, locate the `projects: [` array, and add a new project object:

```javascript
{
  id: "my-new-project",
  title: "Project Name — Subtitle",
  category: "mobile", // "mobile" | "ai" | "games" | "autonomous"
  tagline: "One punchy sentence describing the core value",
  badge: "Production Ready", // or "Active Beta", "Open Source", "Client Work"
  year: "2026",
  featured: true, // true shows prominently at the top
  metrics: [
    { label: "Performance", value: "60 FPS" },
    { label: "Latency", value: "< 50ms" },
    { label: "Security", value: "End-to-End" }
  ],
  description: "A 2-3 sentence overview of the project and the technical problem it solves.",
  highlights: [
    "Key architectural achievement or optimization metric 1.",
    "Key engineering achievement 2.",
    "Key technical integration or benchmark 3."
  ],
  stack: ["Kotlin Multiplatform", "Compose", "PostgreSQL", "Docker"],
  image: "assets/my-project-preview.jpg", // Drop image into assets/ folder
  githubUrl: "https://github.com/yashdev/my-project",
  liveUrl: "https://myproject.com", // Or "#" if private/demo only
  architectureNotes: "Brief notes on architecture (Clean Architecture, MVI, Microservices, etc.)"
}
```

Save the file, and your new project immediately appears in:
- The project grid
- The interactive category filter tabs
- The modal deep-dive inspection drawer
- The metrics counters

---

## 2. Updating Your Availability, Rates or Bio

In `data/portfolio-data.js`, update the `developer` object:

```javascript
developer: {
  name: "Yash",
  title: "Senior Systems, Mobile & Creative Engineer",
  availability: "Available for Q4 Contracts & Strategic Advisory",
  availabilityStatus: "available", // Options: "available" (green glow) | "busy" (amber glow)
  email: "work.developmentwithyash@gmail.com",
  // ...
}
```

---

## 3. Adding New Services or Testimonials

Simply add an entry to the `services: []` or `testimonials: []` arrays in `data/portfolio-data.js`. The cards and grids re-render automatically.

---

## 4. Running Locally

To preview your changes locally on your Mac:

```bash
# From the portfolio directory:
cd /Users/yashdev/Desktop/Yash-Core/projects/portfolio-profile
python3 -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
