# PoeticFlow

PoeticFlow is a minimalist web application that transforms user-provided sentences into a short poem and a relevant inspirational quote.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory (or use the existing one) with the following variables:
   ```env
   LLM_API_KEY=your_api_key
   LLM_MODEL=qwen-3-235b-a22b-instruct-2507
   ```
   *(Optional)* If your provider requires a custom base URL, set `LLM_BASE_URL`.

3. **Run the Application**
   ```bash
   python app.py
   ```
   The application will be accessible at `http://127.0.0.1:5000`.
