<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Musings — Viral Post Generator (Google AI Studio)

**What is this?**  
A small content tool built with **Google AI Studio** that generates LinkedIn-ready posts from a short draft. The app uses **Gemini 3 Pro** for generation and is tuned with a domain-specific system prompt for product/PM/content audiences.

**Built with:** Google AI Studio (Vibe coding)  
**Model:** Gemini 3 Pro

## Key idea & behavior
The app expects a short draft input and produces **3 LinkedIn-style posts** optimized for clarity, curiosity, and engagement. It follows a strict content policy encoded in the system prompt (see below) to ensure:

- Strong curiosity gaps (first two lines < 45 chars each)
- Short paragraphs
- No hashtags or “cringe” phrasing
- A clear call-to-action at the end

This makes the generated posts ready to copy-paste into LinkedIn with minimal editing.



## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
