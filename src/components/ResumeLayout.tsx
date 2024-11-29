import ProfilePic from "./ProfilePic";
import { SectionItem } from "@/types/profile";
import EditableText from "./EditableText";
import EducationElement from "@/components/EducationElement";
import ExperienceElement from "@/components/ExperienceElement";
import GenericElement from "@/components/GenericElement";
import {Experience, Education} from "@/types/profile";
import ProfileEditor from "@/types/profileEditor";
import { useConfig } from "@/app/ConfigContext";

function isExperience(p: SectionItem): p is Experience {
  return (p as Experience).experiences !== undefined;
}

function isEducation(p: SectionItem): p is Education {
  return (p as Education).course !== undefined;
}

export function render(p: SectionItem, idx: number, section: "SECTION1" | "SECTION2") {
  if (isExperience(p)) return <ExperienceElement key={idx} experience={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
  if (isEducation(p)) return <EducationElement key={idx} education={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
  return <GenericElement key={idx} part={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
}

const ResumeLayout: React.FC<ProfileEditor> = ({ profile, setProfile }) => {
  const { config, setConfig } = useConfig();

  return (<div className="flex flex-col">
    <div className="flex m-4">
      <ProfilePic profile={profile} setProfile={setProfile} />
      <div className="p-8 my-auto">
        <EditableText placeholder="Your Name" className="text-5xl text-blue-400 font-bold h-16" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
        <EditableText placeholder="Your designation" className="uppercase font-bold" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value })} />
      </div>
    </div>
    <div className={`flex m-4 ${config.layout === "SINGLE" ? 'flex-col': ''}`}>
      <div className={`${config.layout === "SPLIT" ? 'w-1/4' : ''}`}>
        {profile.section1?.map((e, idx) => render(e, idx, "SECTION1"))}
      </div>
      <div className={`${config.layout === "SPLIT" ? 'w-3/4' : ''}`}>
        {profile.section2?.map((e, idx) => render(e, idx, "SECTION2"))}
      </div>
    </div>
  </div>);
}

export default ResumeLayout;