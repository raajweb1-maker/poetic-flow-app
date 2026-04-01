import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Use absolute pathing for Vercel Serverless compatibility
template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'templates'))
app = Flask(__name__, template_folder=template_dir)

# Configuration
LLM_API_KEY = os.getenv("LLM_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen-3-235b-a22b-instruct-2507")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "")

# Initialize OpenAI Client
client = None
if LLM_API_KEY:
    client_kwargs = {"api_key": LLM_API_KEY}
    
    if LLM_BASE_URL:
        client_kwargs["base_url"] = LLM_BASE_URL

    client = OpenAI(**client_kwargs)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/poetize", methods=["POST"])
def poetize():
    if not client:
        return jsonify({"error": "LLM client is not configured properly. Missing API Key."}), 500

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

    try:
        response = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": "You are a creative poet and a thoughtful philosopher."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=250
        )
        
        content = response.choices[0].message.content
        
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

        return jsonify({
            "poem": "\n".join([l.strip() for l in poem_lines if l.strip()]),
            "quote": " ".join([p.strip() for p in quote_parts if p.strip()])
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
