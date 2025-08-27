import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "careerflow", name: "CareerFlow", env: process.env.GEMINI_API_KEY });
