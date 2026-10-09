export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  date: string;
  description: string[];
  pinned?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  date: string;
  honors: string;
  pinned?: boolean;
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
  pinned?: boolean;
  issuerIcon?: string;
}

export const experiences: Experience[] = [
  {
    id: "noah-intern",
    title: "Application Developer Intern (240 Hours)",
    company: "NOAH Business Application — Hybrid Internship",
    location: "Makati City, Philippines",
    date: "June – July 2025",
    pinned: true,
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
    honors: "Cum Laude Graduate (GWA: 94.42%), Consistent Dean's Lister with Highest Honor",
    pinned: true
  },
  {
    id: "shs",
    degree: "Senior High School - (STEM)",
    institution: "Saint Paul University Philippines - Tuguegarao City, Cagayan Valley",
    date: "2020 - 2022",
    honors: "With Honors",
    pinned: false
  },
  {
    id: "jhs",
    degree: "Junior High School",
    institution: "Wonderful Grace Learning Center - Luna, Quirino, Isabela",
    date: "2017 - 2020",
    honors: "With High Honors, Consistent Gold Awardee",
    pinned: false
  },
  {
    id: "elem",
    degree: "Elementary",
    institution: "Luna-Suerte Elementary School - Luna, Quirino, Isabela",
    date: "2010 - 2017",
    honors: "Valedictorian, Consistent Top 1 from Grade 1 - 6",
    pinned: false
  }
];

export const skills: SkillCategory[] = [
  {
    category: "Programming Languages and Frameworks",
    skills: ["Python", "TypeScript", "Java", "FastAPI", "React", "SpringBoot"]
  },
  {
    category: "Developer Tools",
    skills: ["Docker", "Git", "Github", "Linux", "Antigravity", "Codex"]
  },
  {
    category: "AI & Machine Learning",
    skills: ["LangChain", "LangGraph", "RAG", "Agentic AI", "Model Context Protocol (MCP)", "Scikit-Learn"]
  },
  {
    category: "Data Engineering",
    skills: ["SQL", "Airflow", "dbt", "Databricks", "Polars", "PySpark", "Power BI"]
  },
  {
    category: "Cloud & DB Platforms",
    skills: ["AWS (EC2, S3, RDS, Lambda)", "Vercel", "DigitalOcean", "Firebase", "PostgreSQL", "Neon", "Supabase", "DuckDB"]
  }
];

export const certifications: Certification[] = [
  {
    id: "cert-data-eng-sql",
    name: "Associate Data Engineer in SQL",
    issuer: "DataCamp",
    date: "2026",
    link: "https://www.datacamp.com/completed/statement-of-accomplishment/track/9d5313133f93d60042de6f6ba4123158b1338e49",
    pinned: true
  },
  {
    id: "cert-gci",
    name: "GCI World April 2026",
    issuer: "Matsuo-Iwasawa Laboratory, The University of Tokyo",
    date: "2026",
    link: "https://www.linkedin.com/in/ak-mesa/overlay/Certifications/1186979310/treasury/?profileId=ACoAADuF2dsB-_hteBQAGF_iC8BWH8rGlFqFjzQ",
    pinned: true
  },
  {
    id: "cert-ai-eng",
    name: "Associate AI Engineer for Developers",
    issuer: "DataCamp",
    date: "2025",
    link: "https://www.datacamp.com/statement-of-accomplishment/track/18cf84cf93af8e1361e3a9accb6f70fdf898e8b6?raw=1",
    pinned: true
  },
  {
    id: "cert-py-dev",
    name: "Associate Python Developer",
    issuer: "DataCamp",
    date: "2025",
    link: "https://www.datacamp.com/statement-of-accomplishment/track/a8e758409c8f1b3719269f1a7b24aa6b38ee3530?raw=1",
    pinned: true
  },
  {
    id: "cert-mcp",
    name: "MCP Fundamentals for Building AI Agents",
    issuer: "Educative",
    date: "2026",
    link: "https://www.educative.io/verify-certificate/BXCXVWSE6C",
    pinned: false
  },
  {
    id: "cert-hf",
    name: "Certificate of Achievement in Fundamentals of Agents",
    issuer: "Hugging Face",
    date: "2026",
    link: "https://agents-course-unit-1-quiz.hf.space/gradio_api/file=/tmp/gradio/a0d5909f6fb3906be95692bc9ab46cf8aaf761cd1dab10f1be42d5764b66fedb/image.webp",
    pinned: false
  },
  {
    id: "cert-kaggle-agents",
    name: "5-Day AI Agents Intensive Course with Google",
    issuer: "Kaggle",
    date: "2025",
    link: "https://www.kaggle.com/certification/badges/khestermesa/105",
    pinned: false
  },
  {
    id: "cert-ibm",
    name: "Artificial Intelligence Fundamentals",
    issuer: "IBM",
    date: "2025",
    link: "https://www.credly.com/badges/71a146aa-7318-4522-939f-406303ae87e0/linked_in_profile",
    pinned: false
  },
  {
    id: "cert-kaggle",
    name: "5-Day Gen AI Intensive",
    issuer: "Kaggle",
    date: "2025",
    link: "https://www.kaggle.com/certification/badges/khestermesa/96",
    pinned: false
  },
  {
    id: "cert-sql",
    name: "SQL and PostgreSQL: A Practical Course",
    issuer: "Udemy",
    date: "2025",
    link: "https://www.udemy.com/certificate/UC-35d7582d-4eb0-48f2-89ad-6cfbcd584cab/",
    pinned: false
  },
  {
    id: "cert-pandas",
    name: "Data Manipulation in Python: Master Python, Numpy & Pandas",
    issuer: "Udemy",
    date: "2025",
    link: "https://www.udemy.com/certificate/UC-b7b48e6f-2bb9-41a8-80a1-a931acf152e7/",
    pinned: false
  },
  {
    id: "cert-git",
    name: "Git for Beginners",
    issuer: "Udemy",
    date: "2025",
    link: "https://www.udemy.com/certificate/UC-404bb56b-e90b-4e46-91b8-813f4c5a3701/",
    pinned: false
  }
];

export const personalInfo = {
  name: "Khester Mesa",
  career_level: "Fresh Graduate. Looking for Entry Level jobs",
  headline: "Aspiring Data & AI Engineer",
  email: "khestermesa@gmail.com",
  phone: "09754486106",
  linkedin: "linkedin.com/in/ak-mesa",
  github: "github.com/auxghlann",
  website: "ak-mesa.vercel.app",
};
