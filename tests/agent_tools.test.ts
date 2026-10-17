import { describe, it, expect } from "vitest";
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

import {
  getPinnedDetails,
  getExperience,
  getEducation,
  getCertifications,
  getSkills,
  getPersonalInfo
} from "../api/services/agent/tools_portfolio";
import { educations, certifications, experiences, personalInfo, skills } from "../src/data/resumeData";

describe("Agent Portfolio Tools - Pinned & Full Retrieval", () => {
  it("getPinnedDetails should return pinned highlights and personal info", async () => {
    const result = await getPinnedDetails.invoke({});
    const jsonStr = result.replace(/^Pinned portfolio details: /, "");
    const parsed = JSON.parse(jsonStr);

    expect(parsed.personalInfo.name).toBe(personalInfo.name);

    const pinnedExpCount = experiences.filter((e) => e.pinned).length;
    expect(parsed.experiences.length).toBe(pinnedExpCount);

    const pinnedEduCount = educations.filter((e) => e.pinned).length;
    expect(parsed.educations.length).toBe(pinnedEduCount);
    expect(parsed.educations[0].degree).toBe("Bachelor of Science in Computer Science");

    const pinnedCertCount = certifications.filter((c) => c.pinned).length;
    expect(parsed.certifications.length).toBe(pinnedCertCount);
  });

  it("getEducation should return all education entries for full queries", async () => {
    const result = await getEducation.invoke({});
    const parsed = JSON.parse(result.replace(/^My education history is: /, ""));
    expect(parsed.length).toBe(educations.length);
    expect(parsed.length).toBeGreaterThan(1);
  });

  it("getCertifications should return all certifications for full queries", async () => {
    const result = await getCertifications.invoke({});
    const parsed = JSON.parse(result.replace(/^My certifications are: /, ""));
    expect(parsed.length).toBe(certifications.length);
    expect(parsed.length).toBeGreaterThan(4);
  });

  it("getExperience should return all experience entries for full queries", async () => {
    const result = await getExperience.invoke({});
    const parsed = JSON.parse(result.replace(/^My experience is: /, ""));
    expect(parsed.length).toBe(experiences.length);
  });

  it("getSkills and getPersonalInfo should return valid baseline data", async () => {
    const skillsRes = await getSkills.invoke({});
    const skillsParsed = JSON.parse(skillsRes.replace(/^My skills are: /, ""));
    expect(skillsParsed.length).toBe(skills.length);

    const infoRes = await getPersonalInfo.invoke({});
    const infoParsed = JSON.parse(infoRes.replace(/^My personal info is: /, ""));
    expect(infoParsed.name).toBe(personalInfo.name);
  });

  it("listProjects schema should validate default all=false and explicit all=true", async () => {
    const { listProjects } = await import("../api/services/agent/tools_database");
    const defaultParsed = listProjects.schema.parse({});
    expect(defaultParsed.all).toBe(false);

    const allParsed = listProjects.schema.parse({ all: true });
    expect(allParsed.all).toBe(true);
  });
});
