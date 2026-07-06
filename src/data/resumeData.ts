export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  date: string;
  honors: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  link?: string;
}

export const experiences: Experience[] = [
  {
    id: "noah-intern",
    title: "Application Developer Intern (240 Hours)",
    company: "NOAH Business Application — Hybrid Internship",
    location: "Makati City, Philippines",
    date: "June – July 2025",
    description: [
      "Conducted system analysis and validated enhancements, ensuring compliance with updated Business Rules across SIT environments.",
      "Logged and documented UI and functional issues using structured issue-tracking templates, including screenshots, transaction paths, and Business Rule references.",
      "Gained practical exposure to quality control procedures, enhancement testing, and documentation workflows in a real-world enterprise application environment."
    ]
  }
];

export const educations: Education[] = [
  {
    id: "bs-cs",
    degree: "Bachelor of Science in Computer Science",
    institution: "University of Saint Louis Tuguegarao - Tuguegarao City, Cagayan Valley",
    date: "2022 - 2026",
    honors: "Cum Laude (GWA: 94.42%), Consistent Dean's Lister with Highest Honor"
  },
  {
    id: "shs",
    degree: "Senior High School - (STEM)",
    institution: "Saint Paul University Philippines - Tuguegarao City, Cagayan Valley",
    date: "2020 - 2022",
    honors: "With Honors"
  },
  {
    id: "jhs",
    degree: "Junior High School",
    institution: "Wonderful Grace Learning Center - Luna, Quirino, Isabela",
    date: "2017 - 2020",
    honors: "With High Honors, Consistent Gold Awardee"
  },
  {
    id: "elem",
    degree: "Elementary",
    institution: "Luna-Suerte Elementary School - Luna, Quirino, Isabela",
    date: "2010 - 2017",
    honors: "Valedictorian, Consistent Top 1 from Grade 1 - 6"
  }
];

export const skills: SkillCategory[] = [
  {
    category: "Tech Stack",
    skills: ["Python", "FastAPI", "LangGraph", "SQLite", "PostgreSQL", "Docker", "Git/Github", "Codex", "Antigravity", "VS Code", "React", "TypeScript"]
  },
  {
    category: "AI Working Knowledge",
    skills: ["Context Engineering", "RAG", "Agentic AI", "MCP fundamentals", "Agent Skills Integration", "Spec-Driven Development", "AI-assisted software development"]
  },
  {
    category: "Soft Skills",
    skills: ["Complex problem-solving", "Analytical thinking", "Technical communication", "Presentation", "Continuous learning", "Adaptability"]
  }
];

export const certifications: Certification[] = [
  {
    id: "cert-mcp",
    name: "MCP Fundamentals for Building AI Agents",
    issuer: "Educative",
    date: "2026",
    link: "https://www.educative.io/verify-certificate/BXCXVWSE6C"
  },
  {
    id: "cert-hf",
    name: "Certificate of Achievement in Fundamentals of Agents",
    issuer: "Hugging Face",
    date: "2026",
    link: "https://agents-course-unit-1-quiz.hf.space/gradio_api/file=/tmp/gradio/a0d5909f6fb3906be95692bc9ab46cf8aaf761cd1dab10f1be42d5764b66fedb/image.webp"
  },
  {
    id: "cert-ai-eng",
    name: "Associate AI Engineer for Developers",
    issuer: "DataCamp",
    date: "2025",
    link: "https://www.datacamp.com/statement-of-accomplishment/track/18cf84cf93af8e1361e3a9accb6f70fdf898e8b6?raw=1"
  },
  {
    id: "cert-py-dev",
    name: "Associate Python Developer",
    issuer: "DataCamp",
    date: "2025",
    link: "https://www.datacamp.com/statement-of-accomplishment/track/a8e758409c8f1b3719269f1a7b24aa6b38ee3530?raw=1"
  },
  {
    id: "cert-ibm",
    name: "Artificial Intelligence Fundamentals",
    issuer: "IBM",
    date: "2025",
    link: "https://www.credly.com/badges/71a146aa-7318-4522-939f-406303ae87e0/linked_in_profile"
  },
  {
    id: "cert-kaggle",
    name: "5-Day Gen AI Intensive",
    issuer: "Kaggle",
    date: "2025",
    link: "https://www.kaggle.com/certification/badges/khestermesa/96"
  },
  {
    id: "cert-sql",
    name: "SQL and PostgreSQL: A Practical Course",
    issuer: "Udemy",
    date: "2025",
    link: "https://www.udemy.com/certificate/UC-35d7582d-4eb0-48f2-89ad-6cfbcd584cab/"
  },
  {
    id: "cert-pandas",
    name: "Data Manipulation in Python: Master Python, Numpy & Pandas",
    issuer: "Udemy",
    date: "2025",
    link: "https://www.udemy.com/certificate/UC-b7b48e6f-2bb9-41a8-80a1-a931acf152e7/"
  },
  {
    id: "cert-git",
    name: "Git for Beginners",
    issuer: "Udemy",
    date: "2025",
    link: "https://www.udemy.com/certificate/UC-404bb56b-e90b-4e46-91b8-813f4c5a3701/"
  }
];

export const personalInfo = {
  name: "Allan Khester M. Mesa",
  headline: "Aspiring AI Engineer & AI Automation Specialist",
  email: "khestermesa@gmail.com",
  phone: "09754486106",
  linkedin: "linkedin.com/in/ak-mesa",
  github: "github.com/auxghlann",
};
