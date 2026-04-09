# PoeticFlow

PoeticFlow is a high-performance web application that transforms user-provided sentences into a short poem and a relevant inspirational quote. It runs as a monolithic **Cloudflare Worker**, delivering ultra-fast edge performance.

## Technology Stack
- **Frontend**: Vanilla HTML/CSS (interstitial glassmorphism) with Tailwind CSS.
- **Backend**: Native JavaScript Cloudflare Worker (V8 runtime).
- **AI Engine**: Powered by `llama3.1-8b`.

## Setup Instructions

1. **Install Wrangler (Cloudflare CLI)**
   ```bash
   npm install -g wrangler
   ```

2. **Configure Local Environment**
   Create a `.dev.vars` file in the root directory (Cloudflare's equivalent of `.env`) with the following variables:
   ```env
   LLM_API_KEY=your_api_key
   LLM_MODEL=llama3.1-8b
   ```

3. **Run the Application**
   ```bash
   npx wrangler dev
   ```

## Deployment
This project is configured as a monolithic worker in `src/index.js`. To deploy:
```bash
npx wrangler deploy
```

## Environment Variables
Ensure the following variables are set in your Cloudflare Worker dashboard:
- `LLM_API_KEY`: Your AI provider API key.
- `LLM_MODEL`: (Optional) Defaults to `llama3.1-8b`.
- `LLM_BASE_URL`: (Optional) Defaults to Cerebras API base.
