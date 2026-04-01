const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PoeticFlow - Transform Thoughts to Art</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
            color: #f3f4f6;
        }
        .glass-panel {
            background: rgba(31, 41, 55, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }
        .loading-dots span {
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0; }
            40% { transform: scale(1); opacity: 1; }
        }
        
        .fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="min-h-screen flex flex-col items-center justify-center p-4">

    <!-- Main Container -->
    <div class="glass-panel w-full max-w-lg rounded-2xl p-8 transition-transform duration-500 hover:scale-[1.01] relative overflow-hidden">
        
        <!-- Decorative subtle glowing orb -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
        <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>

        <div class="text-center mb-8 relative z-10">
            <h1 class="text-5xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">PoeticFlow</h1>
            <p class="text-gray-400 font-light text-sm tracking-wide uppercase">Transform your thoughts into art.</p>
        </div>

        <div class="mb-8 relative z-10">
            <div class="relative group">
                <textarea id="sentenceInput" rows="3" class="w-full px-5 py-4 rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none bg-gray-800/50 text-white placeholder-gray-500 transition-all duration-300 shadow-inner group-hover:border-purple-400/50" placeholder="Type a sentence to inspire..."></textarea>
            </div>
            
            <button id="poetizeBtn" class="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-2 group">
                <span>Poetize</span>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </button>
        </div>

        <!-- Loading Indicator -->
        <div id="loading" class="hidden flex justify-center items-center my-10 space-x-2 text-purple-400 loading-dots">
            <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
            <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
            <span class="w-3 h-3 bg-purple-400 rounded-full"></span>
        </div>

        <!-- Results Section -->
        <div id="resultSection" class="hidden space-y-6 flex-col mt-4 opacity-0 z-10 relative">
            <!-- Poem Section -->
            <div class="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
                <div class="absolute -right-4 -top-4 text-8xl text-indigo-500 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 serif font-serif">"</div>
                <h3 class="text-xs font-semibold text-indigo-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    Your Poem
                </h3>
                <p id="poemOutput" class="text-lg italic leading-relaxed text-gray-200 whitespace-pre-line relative z-10"></p>
            </div>
            
            <!-- Quote Section -->
            <div class="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50 relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
                <div class="absolute -right-4 -top-4 text-7xl opacity-5 group-hover:opacity-10 transition-opacity">💡</div>
                <h3 class="text-xs font-semibold text-cyan-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    Inspiration
                </h3>
                <p id="quoteOutput" class="text-md font-medium text-gray-300 relative z-10"></p>
            </div>
        </div>
        
        <!-- Error Container -->
        <div id="errorSection" class="hidden mt-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm text-center font-medium"></div>
    </div>

    <!-- Script Logic -->
    <script>
        const btn = document.getElementById('poetizeBtn');
        const input = document.getElementById('sentenceInput');
        const loading = document.getElementById('loading');
        const resultSection = document.getElementById('resultSection');
        const poemOutput = document.getElementById('poemOutput');
        const quoteOutput = document.getElementById('quoteOutput');
        const errorSection = document.getElementById('errorSection');

        btn.addEventListener('click', async () => {
            const sentence = input.value.trim();
            if (!sentence) {
                showError("Please enter a sentence to inspire us.");
                return;
            }

            // Reset UI
            errorSection.classList.add('hidden');
            resultSection.classList.add('hidden');
            resultSection.classList.remove('fade-in');
            
            loading.classList.remove('hidden');
            loading.classList.add('flex');
            
            btn.disabled = true;
            btn.classList.add('cursor-not-allowed', 'opacity-50');
            const originalBtnContent = btn.innerHTML;
            btn.innerHTML = '<span>Conjuring Magic...</span>';

            try {
                const res = await fetch('/api/poetize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sentence })
                });

                if (!res.ok) {
                    const text = await res.text();
                    try {
                        const errorData = JSON.parse(text);
                        throw new Error(errorData.error || 'Server responded with ' + res.status);
                    } catch (e) {
                         throw new Error('Cloudflare Error ' + res.status + ': ' + (text || 'Empty response'));
                    }
                }

                const data = await res.json();

                // Populate Outputs
                poemOutput.textContent = data.poem;
                quoteOutput.textContent = data.quote;

                // Toggle visibility
                loading.classList.add('hidden');
                loading.classList.remove('flex');
                
                resultSection.classList.remove('hidden');
                resultSection.classList.add('flex', 'fade-in');
                resultSection.classList.add('opacity-100'); 
            } catch (err) {
                loading.classList.add('hidden');
                loading.classList.remove('flex');
                showError(err.message);
            } finally {
                btn.disabled = false;
                btn.classList.remove('cursor-not-allowed', 'opacity-50');
                btn.innerHTML = originalBtnContent;
            }
        });

        function showError(msg) {
            errorSection.textContent = msg;
            errorSection.classList.remove('hidden');
        }
    </script>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return new Response(HTML_CONTENT, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (request.method === "POST" && url.pathname === "/api/poetize") {
      try {
        const bodyContent = await request.text();
        if (!bodyContent) {
           return new Response(JSON.stringify({ error: "Empty request body" }), { status: 400 });
        }
        
        let data;
        try {
            data = JSON.parse(bodyContent);
        } catch(e) {
            return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
        }

        const sentence = data.sentence ? data.sentence.trim() : "";
        if (!sentence) {
          return new Response(JSON.stringify({ error: "Please provide a sentence." }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }

        const apiKey = env.LLM_API_KEY || "";
        if (!apiKey) {
          return new Response(JSON.stringify({ error: "LLM API Key is missing. Ensure Cloudflare Worker variables are set." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }

        const modelParams = env.LLM_MODEL || "qwen-3-235b-a22b-instruct-2507";
        const isCsk = apiKey.startsWith("csk-");
        const defaultBaseUrl = isCsk ? "https://api.chatanywhere.tech/v1" : "https://api.openai.com/v1";
        
        let baseUrl = env.LLM_BASE_URL || defaultBaseUrl;
        baseUrl = baseUrl.replace(/\/$/, "");

        const prompt = `Given the following user sentence, perform two tasks:
1. Write a short, creative poem (2-3 lines) inspired by the sentence.
2. Provide a relevant, famous inspirational quote that matches the theme of the sentence.

Format your response exactly as follows:
POEM:
<line 1>
<line 2>
QUOTE:
"<quote text>" - <author>

User sentence: "${sentence}"`;

        const payload = {
          model: modelParams,
          messages: [
            { role: "system", content: "You are a creative poet and a thoughtful philosopher." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 250
        };

        const llmResponse = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (!llmResponse.ok) {
          const errorText = await llmResponse.text();
          throw new Error(`LLM API Error ${llmResponse.status}: ${errorText}`);
        }

        const respData = await llmResponse.json();
        const content = respData.choices?.[0]?.message?.content || "";

        let poemLines = [];
        let quoteParts = [];

        const lines = content.trim().split('\n');
        let parsingPoem = false;
        let parsingQuote = false;

        for (let line of lines) {
          line = line.trim();
          if (!line) continue;

          if (line.startsWith("POEM:")) {
            parsingPoem = true;
            parsingQuote = false;
            continue;
          } else if (line.startsWith("QUOTE:")) {
            parsingPoem = false;
            parsingQuote = true;
            continue;
          }

          if (parsingPoem) {
            poemLines.push(line);
          } else if (parsingQuote) {
            quoteParts.push(line);
          }
        }

        let poemOutput = poemLines.map(l => l.trim()).filter(l => l).join("\n");
        let quoteOutput = quoteParts.map(p => p.trim()).filter(p => p).join(" ");

        if (!poemOutput && !quoteOutput) {
          poemOutput = content;
        }

        return new Response(JSON.stringify({ poem: poemOutput, quote: quoteOutput }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || err.toString() }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
