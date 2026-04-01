import traceback
import sys

try:
    import os
    import requests
    from flask import Flask, render_template, request, jsonify
    from dotenv import load_dotenv

    # Load environment variables
    load_dotenv()

    # Use absolute pathing for Vercel Serverless compatibility
    template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'templates'))
    app = Flask(__name__, template_folder=template_dir)

    # Configuration
    LLM_API_KEY = os.getenv("LLM_API_KEY", "")
    LLM_MODEL = os.getenv("LLM_MODEL", "qwen-3-235b-a22b-instruct-2507")
    
    # If using csk key, default to chatanywhere or fallback to standard OpenAI
    default_base_url = "https://api.chatanywhere.tech/v1" if LLM_API_KEY.startswith("csk-") else "https://api.openai.com/v1"
    raw_base_url = os.getenv("LLM_BASE_URL", "")
    LLM_BASE_URL = raw_base_url if raw_base_url else default_base_url
    
    # Clean trailing slash from base url
    LLM_BASE_URL = LLM_BASE_URL.rstrip('/')

    @app.route("/")
    def index():
        return render_template("index.html")

    @app.route("/api/poetize", methods=["POST"])
    def poetize():
        if not LLM_API_KEY:
            return jsonify({"error": "LLM API Key is missing. Ensure Vercel Environment Variables are set."}), 500

        data = request.json
        sentence = data.get("sentence", "").strip()

        if not sentence:
            return jsonify({"error": "Please provide a sentence."}), 400

        prompt = f"""
Given the following user sentence, perform two tasks:
1. Write a short, creative poem (2-3 lines) inspired by the sentence.
2. Provide a relevant, famous inspirational quote that matches the theme of the sentence.

Format your response exactly as follows:
POEM:
<line 1>
<line 2>
QUOTE:
"<quote text>" - <author>

User sentence: "{sentence}"
"""
        
        headers = {
            "Authorization": f"Bearer {LLM_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": LLM_MODEL,
            "messages": [
                {"role": "system", "content": "You are a creative poet and a thoughtful philosopher."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 250
        }

        try:
            # Bypass heavy openai SDK and hit the OpenAI-compatible REST API directly
            response = requests.post(f"{LLM_BASE_URL}/chat/completions", headers=headers, json=payload, timeout=25)
            
            if not response.ok:
                raise Exception(f"LLM API Error {response.status_code}: {response.text}")
                
            resp_data = response.json()
            content = resp_data['choices'][0]['message']['content']
            
            # Parse the structured response
            poem_lines = []
            quote_parts = []
            
            lines = content.strip().split('\n')
            parsing_poem = False
            parsing_quote = False
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                if line.startswith("POEM:"):
                    parsing_poem = True
                    parsing_quote = False
                    continue
                elif line.startswith("QUOTE:"):
                    parsing_poem = False
                    parsing_quote = True
                    continue
                    
                if parsing_poem:
                    poem_lines.append(line)
                elif parsing_quote:
                    quote_parts.append(line)

            poem_output = "\n".join([l.strip() for l in poem_lines if l.strip()])
            quote_output = " ".join([p.strip() for p in quote_parts if p.strip()])

            # Fallback if structure parsing behaves unusually
            if not poem_output and not quote_output:
                poem_output = content

            return jsonify({
                "poem": poem_output,
                "quote": quote_output
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    if __name__ == "__main__":
        app.run(host="0.0.0.0", port=5000, debug=True)

except Exception as e:
    err_msg = traceback.format_exc()
    
    # Pure WSGI fallback for Vercel diagnostic tracing
    def app(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'text/plain; charset=utf-8')]
        start_response(status, headers)
        body = f"CRITICAL INITIALIZATION ERROR IN VERCEL ENVIRONMENT:\n\n{err_msg}"
        return [body.encode('utf-8')]
