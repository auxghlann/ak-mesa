export interface Project {
  id: string;
  title: string;
  techStack: string[];
  date: string;
  shortDescription: string;
  bulletPoints: string[];
}

export const projects: Project[] = [
  {
    id: "rbai",
    title: "rbAI (Senior yr. Thesis)",
    techStack: ["React", "Python", "FastAPI", "Docker", "LangGraph"],
    date: "2026",
    shortDescription: "An educational coding playground utilizing Agentic AI to promote process-oriented learning.",
    bulletPoints: [
      "Architected a full-stack educational coding playground designed to be an academic ally to adopt a process-oriented approach rather than a traditional output-based method in an academic setting.",
      "Engineered a custom Behavior Engine that processes real-time telemetry data to calculate an Engagement Score (CES) and automatically flag potential academic dishonesty.",
      "Integrated an agentic AI using LangGraph, utilizing the Groq API for the LLM, creating a custom pedagogical firewall, ensuring the system provides contextual hints and questions rather than generating direct code solutions that may skip productive struggle for novice programmers."
    ]
  },
  {
    id: "table-reviewer",
    title: "Table Reviewer",
    techStack: ["React", "Supabase", "MDX"],
    date: "2025",
    shortDescription: "A personal academic review web application facilitating active learning.",
    bulletPoints: [
      "Developed a personal academic review web application to facilitate active learning — implementing study tools, such as reviewers and custom flashcards, to aid in the retention of university course materials.",
      "Deployed and maintained the platform for active production use, successfully scaling the application to support an ongoing user base of 10+ active learners."
    ]
  }
];
