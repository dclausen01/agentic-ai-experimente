import { OpenAI } from "openai";

// Configure LLM (no API key needed)
const openai = new OpenAI({
  baseURL: "http://192.168.178.98:1234",
  apiKey: "dummy-key", // Required by OpenAI client even for local endpoints
  defaultHeaders: {
    "Content-Type": "application/json"
  }
});

// Simple agentic system without complex dependencies
class ResearcherAgent {
  async run(prompt) {
    try {
      const response = await fetch("http://192.168.178.98:1234/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/ministral-3-14b-reasoning",
          messages: [
            { role: "system", content: "You are a research agent that searches for information and provides comprehensive summaries." },
            { role: "user", content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      console.log("ResearcherAgent response:", JSON.stringify(data, null, 2));
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else if (data.error) {
        return `Research failed: ${data.error.message}`;
      } else {
        return "Research failed: Invalid response format.";
      }
    } catch (error) {
      console.error("ResearcherAgent error:", error);
      return "Research failed due to connection issues.";
    }
  }
}

class TextGeneratorAgent {
  async run(prompt) {
    try {
      const response = await fetch("http://192.168.178.98:1234/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/ministral-3-14b-reasoning",
          messages: [
            { role: "system", content: "You are a text generation agent that creates well-structured, high-quality content based on given inputs." },
            { role: "user", content: prompt }
          ],
          max_tokens: 800,
          temperature: 0.8,
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else if (data.error) {
        return `Text generation failed: ${data.error.message}`;
      } else {
        return "Text generation failed: Invalid response format.";
      }
    } catch (error) {
      console.error("TextGeneratorAgent error:", error);
      return "Text generation failed due to connection issues.";
    }
  }
}

// Initialize agents
const researcherAgent = new ResearcherAgent();
const textGeneratorAgent = new TextGeneratorAgent();

// Execute workflow
(async () => {
  try {
    console.log("🚀 Starting Agentic AI Research Assistant...\n");

    // Research phase
    const researchInput = "Find recent advancements in AI research and summarize key points.";
    console.log("🔍 Research Input:", researchInput);
    const researchOutput = await researcherAgent.run(researchInput);
    console.log("📊 Research Output:", researchOutput);

    // Text generation phase
    const generateInput = `Draft a well-structured article based on this summary: ${researchOutput}`;
    console.log("\n✍️  Generation Input:", generateInput);
    const generatedText = await textGeneratorAgent.run(generateInput);
    console.log("📝 Generated Text:", generatedText);

    console.log("\n✅ Agentic workflow completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
})();
