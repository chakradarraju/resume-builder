import { Education, Experience, Part, SectionItem } from "./profile";

export function isExperience(p: SectionItem): p is Experience {
  return (p as Experience).experiences !== undefined;
}

export function isEducation(p: SectionItem): p is Education {
  return (p as Education).course !== undefined;
}

export function isPart(p: SectionItem): p is Part {
  return (p as Part).heading !== undefined;
}