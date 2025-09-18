import SKILL_SYNONYMS from "../constants/enums/skillSynonyms";

export function normalizeSkill(skill: string): string {
  if (!skill) return "";
  const cleaned = skill.toLowerCase().trim();
  return SKILL_SYNONYMS[cleaned] || cleaned.replace(/[^a-z0-9]/g, "");
}