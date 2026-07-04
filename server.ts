import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { initialResumeData } from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint 1: Optimize bullet points using Google XYZ formula
app.post("/api/resume/optimize-bullet", async (req, res) => {
  try {
    const { bulletText, role = "Software Engineer Intern" } = req.body;
    if (!bulletText) {
      return res.status(400).json({ error: "bulletText is required" });
    }

    const prompt = `You are a professional resume writer specializing in tech. 
Optimize this basic, weak bullet point for a Computer Science resume for the role: "${role}".
Rewrite it using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]" (or similar impactful structure).
Provide 3 distinct options:
1. High Impact / Results-focused (incorporating realistic, illustrative metrics like %, ms, hours saved)
2. Technical / Implementation-focused (emphasizing specific tech stack and architectural choices)
3. Concise / Leadership-focused (ideal for shorter space, showing initiative)

Original bullet point: "${bulletText}"

Return the results strictly as a JSON object matching this schema:
{
  "options": [
    {
      "type": "Results-Focused",
      "text": "Accomplished X as measured by Y, by doing Z...",
      "explanation": "Why this works..."
    },
    {
      "type": "Technical-Focused",
      "text": "Built X using Y to achieve Z...",
      "explanation": "Why this works..."
    },
    {
      "type": "Concise-Focused",
      "text": "Optimized X leading to Y by Z...",
      "explanation": "Why this works..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  text: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["type", "text", "explanation"]
              }
            }
          },
          required: ["options"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Optimize Bullet error:", error);
    res.status(500).json({ error: error.message || "Failed to optimize bullet point." });
  }
});

// Endpoint 2: Resume Review & ATS Scanner
app.post("/api/resume/analyze-ats", async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: "resumeData and jobDescription are required" });
    }

    const prompt = `You are an ATS (Applicant Tracking System) scanner and a veteran tech recruiter.
Analyze the following Computer Science candidate's resume against the provided Job Description for an internship.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Job Description:
"${jobDescription}"

Conduct a rigorous review. Determine:
1. ATS Score (0-100): How well does this resume align with the job description?
2. Matching Skills: Technical keywords present in both the resume and the job description.
3. Missing Keywords/Skills: Crucial technical keywords, concepts, or tools mentioned in the job description but missing or weak in the resume.
4. Core Strengths: Areas where the candidate exceeds or meets expectations (e.g. good project tech stack, relevant coursework).
5. Weaknesses & Gaps: Areas needing improvement (e.g. bullet points lack numbers, missing crucial skills).
6. Actionable Recommendations: Specific, concrete steps the candidate can take to improve their resume specifically for this job description.

Return the results strictly as a JSON object matching this schema:
{
  "score": 85,
  "matchPercentage": 78,
  "matchingKeywords": ["React", "Git", "TypeScript"],
  "missingKeywords": ["Docker", "PostgreSQL", "Unit Testing"],
  "strengths": ["Strong personal projects showing full-stack exposure", "Relevant CS coursework matches core needs"],
  "weaknesses": ["Lack of quantifiable metrics in project bullets", "Missing devops or deployment experience"],
  "recommendations": [
    "Add Docker to your Skills list and mention deploying one of your projects using it.",
    "Rewrite your first project bullet to show how fast the webapp loads or how many concurrent users it can support.",
    "Specifically list 'Data Structures and Algorithms' under relevant coursework."
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            matchPercentage: { type: Type.INTEGER },
            matchingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "matchPercentage", "matchingKeywords", "missingKeywords", "strengths", "weaknesses", "recommendations"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("ATS Analyzer error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume." });
  }
});

// Endpoint 3: Project Idea Generator
app.post("/api/resume/suggest-projects", async (req, res) => {
  try {
    const { skills = [], coursework = "", focusArea = "Software Engineering" } = req.body;

    const prompt = `You are an elite Computer Science professor and tech mentor.
Suggest 3 highly impressive, unique, and recruiter-friendly personal portfolio project ideas for a CS student seeking a competitive internship.
The projects should be tailored to:
- Technical Skills: [${skills.join(", ")}]
- Completed Coursework: "${coursework}"
- Student's Focus Area: "${focusArea}"

Each project should NOT be a generic, trivial app (e.g., no simple Todo list, basic calculator, or generic weather app). Suggest creative, high-impact projects (e.g., a custom lightweight database engine, a real-time collaborative code editor with WebSockets, a compiler/interpreter, a local AI-powered assistant, a visual algorithm simulator, or a distributed key-value store).

For each project, provide:
1. Title
2. Complexity Level (Beginner, Intermediate, Advanced)
3. Tech Stack: Recommended languages, frameworks, and tools.
4. Description: Why this project is extremely impressive on a CS resume.
5. Key Features: 3 core features the project must have.
6. Execution Plan: 4 step-by-step phases to build it.
7. Gold Bullet Point: A pre-written highly impressive resume bullet point for this project once completed.

Return the results strictly as a JSON object matching this schema:
{
  "projects": [
    {
      "title": "Project Title",
      "difficulty": "Intermediate",
      "techStack": ["React", "Go", "Redis"],
      "description": "Why this project is impressive...",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "executionSteps": ["Step 1", "Step 2", "Step 3", "Step 4"],
      "goldBullet": "Engineered a distributed key-value store in Go, achieving 15,000+ operations/sec by implementing custom LRU caching..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING },
                  features: { type: Type.ARRAY, items: { type: Type.STRING } },
                  executionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                  goldBullet: { type: Type.STRING }
                },
                required: ["title", "difficulty", "techStack", "description", "features", "executionSteps", "goldBullet"]
              }
            }
          },
          required: ["projects"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Suggest Projects error:", error);
    res.status(500).json({ error: error.message || "Failed to generate project suggestions." });
  }
});

// Endpoint 4: Professional Summary Generator
app.post("/api/resume/generate-summary", async (req, res) => {
  try {
    const { skills = [], focusArea = "Software Engineering", major = "Computer Science" } = req.body;

    const prompt = `You are a professional resume writer for CS students.
Generate a high-impact, professional summary statement (2-3 sentences, approx 50-60 words) for a "${major}" student aiming for an internship.
Focus area: "${focusArea}"
Skills to emphasize: [${skills.join(", ")}]

Avoid empty clichés like 'passionate, self-motivated quick learner'. Instead, focus on technical capability, problem-solving skills, and academic/project highlights.

Return the results strictly as a JSON object matching this schema:
{
  "summary": "Resulting professional summary..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING }
          },
          required: ["summary"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.error("Generate Summary error:", error);
    res.status(500).json({ error: error.message || "Failed to generate professional summary." });
  }
});

const SAVE_PATH = path.join(process.cwd(), "resume-data-saved.json");

// API: Verify admin passcode
app.post("/api/auth/verify", (req, res) => {
  const { passcode } = req.body;
  const correctPasscode = process.env.Pou || process.env.ADMIN_PASSCODE || "Pou231247";
  if (passcode === correctPasscode) {
    return res.json({ success: true, message: "Authentication successful" });
  }
  return res.status(401).json({ success: false, error: "Incorrect passcode" });
});

// API: Load current resume data
app.get("/api/resume", (req, res) => {
  try {
    if (fs.existsSync(SAVE_PATH)) {
      const fileData = fs.readFileSync(SAVE_PATH, "utf-8");
      return res.json(JSON.parse(fileData));
    }
    return res.json(initialResumeData);
  } catch (error: any) {
    console.error("Load Resume error:", error);
    return res.json(initialResumeData);
  }
});

// API: Save resume data
app.post("/api/resume", (req, res) => {
  try {
    const { passcode, resumeData } = req.body;
    const correctPasscode = process.env.Pou || process.env.ADMIN_PASSCODE || "Pou231247";

    if (passcode !== correctPasscode) {
      return res.status(401).json({ error: "Unauthorized: Incorrect passcode" });
    }

    if (!resumeData) {
      return res.status(400).json({ error: "resumeData is required" });
    }

    fs.writeFileSync(SAVE_PATH, JSON.stringify(resumeData, null, 2), "utf-8");
    return res.json({ success: true, message: "Resume saved successfully!" });
  } catch (error: any) {
    console.error("Save Resume error:", error);
    return res.status(500).json({ error: error.message || "Failed to save resume." });
  }
});

// Serve static assets in production or use Vite dev middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
