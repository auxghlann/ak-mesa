// TODO: Create tools for the agent

/*
- create tool for experiences
- create tool for skills
- create tool for education
- create tool for projects
*/
import { z } from "zod";
import { tool } from "langchain";
import { personalInfo, experiences, skills, educations, certifications } from "../../../src/data/resumeData.js";

export const getExperience = tool(
    async () => {
        return `My experience is: ${JSON.stringify(experiences, null, 2)}`
    },
    {
        name: "get_experience",
        description: "Use this tool to get the latest experience of the subject.",
        schema: z.object({})
    }
)

export const getPersonalInfo = tool(
    async () => {
        return `My personal info is: ${JSON.stringify(personalInfo, null, 2)}`
    },
    {
        name: "get_personal_info",
        description: "Use this tool to get the personal information of the subject.",
        schema: z.object({})
    }
)

export const getSkills = tool(
    async () => {
        return `My skills are: ${JSON.stringify(skills, null, 2)}`
    },
    {
        name: "get_skills",
        description: "Use this tool to get the relevant hard and soft skills of the subject.",
        schema: z.object({})
    }
)

export const getEducation = tool(
    async () => {
        return `My education history is: ${JSON.stringify(educations, null, 2)}`
    },
    {
        name: "get_education",
        description: "Use this tool to get the educational background of the subject.",
        schema: z.object({})
    }
)

export const getCertifications = tool(
    async () => {
        return `My certifications are: ${JSON.stringify(certifications, null, 2)}`
    },
    {
        name: "get_certifications",
        description: "Use this tool to get the certifications achieved by the subject.",
        schema: z.object({})
    }
)

