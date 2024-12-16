import ProfilePic from "./ProfilePic";
import { SectionEnum, SectionItem } from "@/types/profile";
import EditableText from "./EditableText";
import EducationElement from "@/components/EducationElement";
import ExperienceElement from "@/components/ExperienceElement";
import GenericElement from "@/components/GenericElement";
import ProfileEditor from "@/types/profileEditor";
import { LayoutEnum, useConfig } from "@/app/ConfigContext";
import { isEducation, isExperience } from "@/types/typeChecks";

export function render(p: SectionItem, idx: number, section: SectionEnum) {
  if (isExperience(p)) return <ExperienceElement key={idx} experience={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
  if (isEducation(p)) return <EducationElement key={idx} education={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
  return <GenericElement key={idx} part={p} section={section} sectionIndex={idx} id={`${section}-${idx}`} />;
}

const ResumeLayout: React.FC<ProfileEditor> = ({ profile, setProfile }) => {
  const { layout, printMode, creditsRemaining } = useConfig();

  return (<div className="flex flex-col relative">
    {printMode && creditsRemaining === 0 && <span className="absolute top-0 right-0">Resume generated using <a className="underline text-blue-500" href="https://www.resumesgenie.com/">ResumesGenie</a></span>}
    <div className="flex mx-4">
      <ProfilePic profile={profile} setProfile={setProfile} />
      <div className="px-8 my-auto w-3/4">
        <EditableText placeholder="Your Name" className="text-5xl print:text-5xl text-blue-400 font-bold h-16" style={{textSize: '48px'}} value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
        <EditableText placeholder="Your designation" className="uppercase font-bold" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value })} />
      </div>
    </div>
    <div className={`flex m-4 mb-12 ${layout === LayoutEnum.Single ? 'flex-col': ''}`}>
      <div className={`${layout === LayoutEnum.Split ? 'w-1/4' : ''}`}>
        {profile.section1?.map((e, idx) => render(e, idx, SectionEnum.Section1))}
      </div>
      <div className={`${layout === LayoutEnum.Split ? 'w-3/4' : ''}`}>
        {profile.section2?.map((e, idx) => render(e, idx, SectionEnum.Section2))}
      </div> 
    </div>
    {printMode && creditsRemaining === 0 && <span className="absolute bottom-0 left-0">Resume generated using <a className="underline text-blue-500" href="https://www.resumesgenie.com/">ResumesGenie</a></span>}
  </div>);
}

export default ResumeLayout;