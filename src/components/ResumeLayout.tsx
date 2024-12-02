import ProfilePic from "./ProfilePic";
import { SectionEnum, SectionItem } from "@/types/profile";
import EditableText from "./EditableText";
import EducationElement from "@/components/EducationElement";
import ExperienceElement from "@/components/ExperienceElement";
import GenericElement from "@/components/GenericElement";
import ProfileEditor from "@/types/profileEditor";
import { useConfig } from "@/app/ConfigContext";
import { isEducation, isExperience } from "@/types/typeChecks";
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from "./ui/timeline";
import { LuCheck, LuPackage, LuShip } from "react-icons/lu";
import { Text } from "@chakra-ui/react";

export function render(p: SectionItem, idx: number, section: SectionEnum) {
  if (isExperience(p)) return <ExperienceElement key={idx} experience={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
  if (isEducation(p)) return <EducationElement key={idx} education={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
  return <GenericElement key={idx} part={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
}

const ResumeLayout: React.FC<ProfileEditor> = ({ profile, setProfile }) => {
  const { config, setConfig } = useConfig();

  return (<div className="flex flex-col">
    <div className="flex m-4">
      <ProfilePic profile={profile} setProfile={setProfile} />
      <div className="p-8 my-auto w-3/4">
        <EditableText placeholder="Your Name" className="text-5xl print:text-5xl text-blue-400 font-bold h-16" style={{textSize: '48px'}} value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
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