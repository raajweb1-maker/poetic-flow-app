# PoeticFlow

PoeticFlow is a minimalist web application that transforms user-provided sentences into a short poem and a relevant inspirational quote. It operates blazingly fast on the **Cloudflare Pages** edge network.

## Setup Instructions

This project requires zero Python dependencies or WSGI scaling limits. The backend runs completely native on Cloudflare V8 isolates.

1. **Install Wrangler (Cloudflare CLI)**
   ```bash
   npm install -g wrangler
   ```

2. **Configure Local Environment**
   Create a `.dev.vars` file in the root directory (Cloudflare's equivalent of `.env`) with the following variables:
   ```env
   LLM_API_KEY=your_api_key
   LLM_MODEL=qwen-3-235b-a22b-instruct-2507
   ```

3. **Run the Application**
   ```bash
   npx wrangler pages dev public
   ```
   The application and its `/api/poetize` wrapper will be locally hosted for testing.

## Cloudflare Pages Deployment
Simply connect this generic GitHub repository directly to your Cloudflare dashboard under **Pages**. It will automatically detect the static `public/` directory and compile the `functions/api/poetize.js` file instantly with native performance.
