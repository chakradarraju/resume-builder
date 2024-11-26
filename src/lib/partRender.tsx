import EducationElement from "@/components/EducationElement";
import ExperienceElement from "@/components/ExperienceElement";
import GenericElement from "@/components/GenericElement";
import {Part, Experience, Education} from "@/types/profile";

function isExperience(p: (Part | Experience | Education)): p is Experience {
  return (p as Experience).experiences !== undefined;
}

function isEducation(p: (Part | Experience | Education)): p is Education {
  return (p as Education).course !== undefined;
}

export function render(p: (Part | Experience | Education), idx: number, section: "SECTION1" | "SECTION2") {
  if (isExperience(p)) return <ExperienceElement key={idx} experience={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
  if (isEducation(p)) return <EducationElement key={idx} education={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
  return <GenericElement key={idx} part={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
}