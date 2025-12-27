import { OpenAI } from "openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

// Configure LLM (no API key needed)
const openai = new OpenAI({
  baseURL: "http://192.168.178.98:1234",
  apiKey: "dummy-key", // Required by OpenAI client even for local endpoints
  defaultHeaders: {
    "Content-Type": "application/json"
  }
});

// LangChain-based agentic system
class ResearcherAgent {
  async run(prompt) {
    try {
      const chat = new ChatOpenAI({
        apiKey: "dummy-key",
        model: "mistralai/ministral-3-14b-reasoning",
        temperature: 0.7,
        maxTokens: 500,
        configuration: {
          baseURL: "http://192.168.178.98:1234/v1"
        }
      });

      const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You are a research agent that searches for information and provides comprehensive summaries."],
        ["user", "{input}"]
      ]);

      const chain = promptTemplate.pipe(chat).pipe(new StringOutputParser());
      const response = await chain.invoke({ input: prompt });
      
      console.log("ResearcherAgent response:", response);
      return response;
    } catch (error) {
      console.error("ResearcherAgent error:", error);
      return "Research failed due to connection issues.";
    }
  }
}

class TextGeneratorAgent {
  async run(prompt) {
    try {
      const chat = new ChatOpenAI({
        apiKey: "dummy-key",
        model: "mistralai/ministral-3-14b-reasoning",
        temperature: 0.8,
        maxTokens: 800,
        configuration: {
          baseURL: "http://192.168.178.98:1234/v1"
        }
      });

      const promptTemplate = ChatPromptTemplate.fromMessages([
        ["system", "You are a text generation agent that creates well-structured, high-quality content based on given inputs."],
        ["user", "{input}"]
      ]);

      const chain = promptTemplate.pipe(chat).pipe(new StringOutputParser());
      const response = await chain.invoke({ input: prompt });
      
      console.log("TextGeneratorAgent response:", response);
      return response;
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
    console.log("🚀 Starting LangChain Research Assistant...\n");

    // Research phase
    const researchInput = "Research modern feedback options for students in upper secondary education (Gymnasium Oberstufe). Focus on digital tools, peer feedback systems, and teacher-student communication platforms.";
    console.log("🔍 Research Input:", researchInput);
    const researchOutput = await researcherAgent.run(researchInput);
    console.log("📊 Research Output:", researchOutput);

    // Text generation phase
    const generateInput = `Create a comprehensive report on modern feedback options for Gymnasium Oberstufe students based on this research: ${researchOutput}`;
    console.log("\n✍️  Generation Input:", generateInput);
    const generatedText = await textGeneratorAgent.run(generateInput);
    console.log("📝 Generated Report:", generatedText);

    console.log("\n✅ LangChain research workflow completed successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
})();
