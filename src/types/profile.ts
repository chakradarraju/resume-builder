export interface Part {
  type: "TEXT" | "LIST" | "CHIPS",
  heading?: string,
  text?: string,
  list?: string[],
}

export interface Experience {
  experiences: ExperiencePart[]
}

export interface ExperiencePart {
  company?: string,
  timeline?: string,
  role?: string,
  text?: string,
}

export interface Education {
  course: CoursePart[],
}

export interface CoursePart {
  school?: string,
  timeline?: string,
  degree?: string,
  text?: string,
}

export interface Profile {
  name?: string,
  role?: string,
  picture?: string,
  section1?: SectionItem[],
  section2?: SectionItem[],
}

export type SectionEnum = "SECTION1" | "SECTION2";

export type SectionItem = (Experience | Education | Part);

export default Profile;