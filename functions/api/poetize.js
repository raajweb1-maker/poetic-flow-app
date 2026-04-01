export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const sentence = data.sentence ? data.sentence.trim() : "";

    if (!sentence) {
      return new Response(JSON.stringify({ error: "Please provide a sentence." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const apiKey = env.LLM_API_KEY || "";
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "LLM API Key is missing. Ensure Cloudflare Environment Variables are set." }), {
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
    const content = respData.choices[0].message.content;

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

    // Fallback if structure parsing fails completely
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
