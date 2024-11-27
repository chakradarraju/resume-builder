import { Button, Input, MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@chakra-ui/react";
import ProfilePic from "./ProfilePic";
import Profile, { SectionItem } from "@/types/profile";
import EditableText from "./EditableText";
import EducationElement from "@/components/EducationElement";
import ExperienceElement from "@/components/ExperienceElement";
import GenericElement from "@/components/GenericElement";
import {Experience, Education} from "@/types/profile";

interface ProfileEditor {
  profile: Profile,
  setProfile: React.Dispatch<React.SetStateAction<Profile>>
}

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

const AddButton: React.FC<ProfileEditor & { onAdd: (t: SectionItem) => void, allowExpEdu?: boolean }> = ({ profile, setProfile, onAdd, allowExpEdu = true }) => {
  return (<div>
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="outline" size="sm" colorPalette="green">
          Add
        </Button>
      </MenuTrigger>
      <MenuContent>
        {allowExpEdu && <MenuItem value="add-experience" onClick={() => onAdd({experiences: []})}>Experience</MenuItem>}
        {allowExpEdu && <MenuItem value="add-education" onClick={() => onAdd({course: []})}>Education</MenuItem>}
        <MenuItem value="add-text" onClick={() => onAdd({type: "TEXT"})}>Text</MenuItem>
        <MenuItem value="add-list" onClick={() => onAdd({type: "LIST"})}>List</MenuItem>
        <MenuItem value="add-chips" onClick={() => onAdd({type: "CHIPS"})}>Chips</MenuItem>
      </MenuContent>
    </MenuRoot>
  </div>)
}

const SplitLayout: React.FC<ProfileEditor> = ({ profile, setProfile }) => (<div className="flex flex-col">
  <div className="flex m-4">
    <ProfilePic profile={profile} setProfile={setProfile} />
    <div className="p-8 my-auto">
      <EditableText placeholder="Your Name" className="text-5xl text-blue-400 font-bold h-16" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
      <EditableText placeholder="Your designation" className="uppercase font-bold" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value })} />
    </div>
  </div>
  <div className="flex m-4">
    <div className="w-1/4">
      {profile.section1?.map((e, idx) => render(e, idx, "SECTION1"))}
      <AddButton profile={profile} setProfile={setProfile} onAdd={(t) => {
        setProfile({...profile, section1: profile.section1 ? [...profile.section1, t] : [t]});
      }} allowExpEdu={false} />
    </div>
    <div className="w-3/4">
      {profile.section2?.map((e, idx) => render(e, idx, "SECTION2"))}
      <AddButton profile={profile} setProfile={setProfile} onAdd={(t) => {
        setProfile({...profile, section2: profile.section2 ? [...profile.section2, t]: [t]});
      }} />
    </div>
  </div>
</div>)

export default SplitLayout;