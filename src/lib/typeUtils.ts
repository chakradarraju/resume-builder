import Profile, { SectionEnum, SectionItem } from "@/types/profile";

export function getSection(profile: Profile, section: SectionEnum): SectionItem[] {
  return section === SectionEnum.Section1 ? profile.section1 : profile.section2;
}