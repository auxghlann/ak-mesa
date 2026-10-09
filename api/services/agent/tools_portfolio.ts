import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { personalInfo, experiences, skills, educations, certifications } from "../../../src/data/resumeData";

export const getPinnedDetails = tool(
    async () => {
        const pinnedExperiences = experiences.filter((exp) => exp.pinned);
        const pinnedEducations = educations.filter((edu) => edu.pinned);
        const pinnedCertifications = certifications.filter((cert) => cert.pinned);

        return `Pinned portfolio details: ${JSON.stringify({
            personalInfo,
            experiences: pinnedExperiences,
            educations: pinnedEducations,
            certifications: pinnedCertifications
        }, null, 2)}`;
    },
    {
        name: "get_pinned_details",
        description: "Use this tool to get Allan's featured/pinned portfolio highlights (personal info, pinned experience, pinned education, and pinned certifications). Always use this tool first when asked about Allan or his background, unless the user specifically asks for full, complete, or unpinned details.",
        schema: z.object({})
    }
);

export const getExperience = tool(
    async () => {
        return `My experience is: ${JSON.stringify(experiences, null, 2)}`
    },
    {
        name: "get_experience",
        description: "Use this tool to get the complete experience history of the subject when the user explicitly asks for all or complete experience.",
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
        description: "Use this tool to get the full education history (including high school and elementary) when the user explicitly asks for all or complete education.",
        schema: z.object({})
    }
)

export const getCertifications = tool(
    async () => {
        return `My certifications are: ${JSON.stringify(certifications, null, 2)}`
    },
    {
        name: "get_certifications",
        description: "Use this tool to get all certifications achieved by the subject when the user explicitly asks for all or complete certifications.",
        schema: z.object({})
    }
)

