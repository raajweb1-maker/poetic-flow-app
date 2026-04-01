const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PoeticFlow - Transform Thoughts to Art</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
            color: #334155;
            min-height: 100vh;
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.65);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
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
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Unique Instagram Link Effects */
        .insta-link {
            position: relative;
            display: inline-block;
            font-weight: 500;
            color: #d946ef;
            transition: all 0.3s ease;
        }
        .insta-text {
            background: linear-gradient(to right, #f59e0b, #ec4899, #8b5cf6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-size: 1.05rem;
            transition: all 0.4s ease;
            background-size: 200% auto;
            animation: shine 3s linear infinite;
        }
        @keyframes shine {
            to { background-position: 200% center; }
        }
        .insta-link::after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 2px;
            bottom: 0;
            left: 0;
            background: linear-gradient(to right, #f59e0b, #ec4899);
            transform-origin: bottom right;
            transition: transform 0.3s cubic-bezier(0.86, 0, 0.07, 1);
        }
        .insta-link:hover::after {
            transform: scaleX(1);
            transform-origin: bottom left;
        }
        .insta-link:hover {
            transform: translateY(-2px);
            text-shadow: 0 5px 15px rgba(236, 72, 153, 0.3);
        }
    </style>
</head>
<body class="flex flex-col items-center justify-center p-4">

    <!-- Main Container -->
    <div class="glass-panel w-full max-w-lg rounded-3xl p-8 mb-8 mt-4 transition-transform duration-500 hover:scale-[1.02] relative overflow-hidden z-10">
        
        <!-- Decorative subtle glowing bubbles -->
        <div class="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-60"></div>
        <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

        <div class="text-center mb-8 relative z-10">
            <h1 class="text-5xl font-bold mb-3 tracking-tight text-slate-800">PoeticFlow</h1>
            <p class="text-slate-600 font-medium text-sm tracking-wide uppercase">Transform your thoughts into art.</p>
        </div>

        <div class="mb-6 relative z-10">
            <div class="relative group">
                <textarea id="sentenceInput" rows="3" class="w-full px-5 py-4 rounded-2xl border border-white/50 focus:outline-none focus:ring-4 focus:ring-orange-300/50 focus:border-orange-400 resize-none bg-white/40 text-slate-800 placeholder-slate-500 transition-all duration-300 shadow-sm group-hover:border-orange-300/80" placeholder="Type a gentle thought to inspire..."></textarea>
            </div>
            
            <button id="poetizeBtn" class="w-full mt-4 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white font-semibold py-3.5 px-4 rounded-2xl shadow-xl hover:shadow-orange-500/30 transition-all duration-300 transform active:scale-[0.98] flex justify-center items-center gap-2 group border border-white/20">
                <span class="text-lg">Poetize</span>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
        </div>

        <!-- Loading Indicator -->
        <div id="loading" class="hidden flex justify-center items-center my-10 space-x-2 text-rose-500 loading-dots">
            <span class="w-3 h-3 bg-rose-400 rounded-full"></span>
            <span class="w-3 h-3 bg-rose-400 rounded-full"></span>
            <span class="w-3 h-3 bg-rose-400 rounded-full"></span>
        </div>

        <!-- Results Section -->
        <div id="resultSection" class="hidden space-y-6 flex-col mt-4 opacity-0 z-10 relative">
            <!-- Poem Section -->
            <div class="bg-white/50 p-6 rounded-2xl border border-white/60 relative overflow-hidden group hover:border-pink-300 transition-colors shadow-sm">
                <div class="absolute -right-2 -top-6 text-8xl text-rose-400 opacity-10 group-hover:opacity-20 transition-opacity rotate-12 serif font-serif">"</div>
                <h3 class="text-xs font-bold text-rose-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    Your Poem
                </h3>
                <p id="poemOutput" class="text-xl italic leading-relaxed text-slate-700 whitespace-pre-line relative z-10 font-medium"></p>
            </div>
            
            <!-- Quote Section -->
            <div class="bg-white/50 p-6 rounded-2xl border border-white/60 relative overflow-hidden group hover:border-amber-300 transition-colors shadow-sm">
                <div class="absolute -right-4 -top-4 text-7xl opacity-10 group-hover:opacity-20 transition-opacity">💡</div>
                <h3 class="text-xs font-bold text-amber-600 mb-3 uppercase tracking-widest flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    Inspiration
                </h3>
                <p id="quoteOutput" class="text-md font-medium text-slate-700 relative z-10 box-decoration-clone"></p>
            </div>
        </div>
        
        <!-- Error Container -->
        <div id="errorSection" class="hidden mt-6 bg-red-100/80 border border-red-200 text-red-600 p-4 rounded-xl text-sm text-center font-semibold"></div>
    </div>

    <!-- Instagram Footer -->
    <div class="mt-4 text-slate-700/80 font-medium tracking-wide z-10 text-sm">
        Crafted with warmth by 
        <a href="https://www.instagram.com/karmacharya32/" target="_blank" rel="noopener noreferrer" class="insta-link ml-1">
            <i class="insta-text">Karmacharya</i>
        </a>
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
                showError("Please enter a gentle thought to inspire us.");
                return;
            }

            // Reset UI
            errorSection.classList.add('hidden');
            resultSection.classList.add('hidden');
            resultSection.classList.remove('fade-in');
            
            loading.classList.remove('hidden');
            loading.classList.add('flex');
            
            btn.disabled = true;
            btn.classList.add('cursor-not-allowed', 'opacity-75');
            const originalBtnContent = btn.innerHTML;
            btn.innerHTML = '<span class="text-lg">Conjuring Magic...</span>';

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
                btn.classList.remove('cursor-not-allowed', 'opacity-75');
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

        const defaultModel = "llama3.1-8b";
        const defaultBaseUrl = "https://api.cerebras.ai/v1";
        
        const modelParams = env.LLM_MODEL || defaultModel;
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
