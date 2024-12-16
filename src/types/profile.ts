export enum SectionEnum {
  Section1,
  Section2
};

export enum PartType {
  Text, List, Chips
}

export type SectionItem = (Experience | Education | Part);

export interface Part {
  type: PartType,
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
  section1: SectionItem[],
  section2: SectionItem[],
}

export const EMPTY_PROFILE: Profile = {
  name: '',
  role: '',
  picture: '',
  section1: [{type: PartType.Text, heading: 'About me'}, {type: PartType.List, heading: 'Contacts'}],
  section2: [{experiences:[]}, {course:[]}, {type: PartType.List, heading: 'Skills'}]
};


export default Profile;