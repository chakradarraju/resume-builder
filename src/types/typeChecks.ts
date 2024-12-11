import { CoursePart, Education, Experience, ExperiencePart, Part } from "./profile";

export function isExperience(p: any): p is Experience {
  return (p as Experience).experiences !== undefined;
}

export function isEducation(p: any): p is Education {
  return (p as Education).course !== undefined;
}

export function isPart(p: any): p is Part {
  return (p as Part).heading !== undefined;
}

export function isExperiencePart(p: any): p is ExperiencePart {
  return (p as ExperiencePart).role !== undefined;
}

export function isCoursePart(p: any): p is CoursePart {
  return (p as CoursePart).degree !== undefined;
}