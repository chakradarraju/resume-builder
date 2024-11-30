import { Experience, SectionItem } from "@/types/profile";
import { TimelineConnector, TimelineContent, TimelineTitle, TimelineDescription, TimelineItem, TimelineRoot } from "@chakra-ui/react";
import { MdWork } from "react-icons/md";
import EditableText from "./EditableText";
import { useProfile } from "@/app/ProfileContext";
import PartHoverMenu from "./PartHoverMenu";
import InnerPartHoverMenu from "./InnerPartHoverMenu";

function remover(item: SectionItem, index: number) {
  let sectionItem = item as Experience;
  sectionItem.experiences = sectionItem.experiences.splice(index, 1);
}

function adder(item: SectionItem) {
  let sectionItem = item as Experience;
  sectionItem.experiences.push({});
}

function swapper(item: SectionItem, idx: number, targetIdx: number) {
  let sectionItem = item as Experience;
  [sectionItem.experiences[idx], sectionItem.experiences[targetIdx]] = [sectionItem.experiences[targetIdx], sectionItem.experiences[idx]];
}

const ExperienceElement: React.FC<{ experience: Experience, section: "SECTION1" | "SECTION2", sectionIndex: number, id: string }> = ({experience, section, sectionIndex, id}) => {
  const { profile, setProfile } = useProfile();

  function updateExperience(experienceIndex: number, update: object) {
    let newProfile = {...profile};
    let sectionToUpdate = section === "SECTION1" ? newProfile.section1 : newProfile.section2;
    if (!sectionToUpdate) return;
    let sectionItem = sectionToUpdate[sectionIndex] as Experience;
    let exp = sectionItem.experiences[experienceIndex];
    sectionItem.experiences[experienceIndex] = {...exp, ...update};
    setProfile(newProfile);
  }

  if (experience.experiences.length === 0) experience.experiences.push({});

  return (<div className="card relative group py-2 rounded-lg">
    <PartHoverMenu section={section} sectionIndex={sectionIndex} />
    <div className="text-2xl">Experiences</div>
    <TimelineRoot>
      {experience.experiences.map((e, idx) => <TimelineItem key={idx} className="relative group">
        <InnerPartHoverMenu section={section} sectionIndex={sectionIndex} idx={idx} len={experience.experiences.length} adder={adder} remover={remover} swapper={swapper}/>
        <TimelineConnector>
          <MdWork />
        </TimelineConnector>
        <TimelineContent className="pb-0 gap-0">
          <TimelineTitle className="flex">
            <EditableText placeholder="Company" value={e.company} className="text-lg" onChange={eve => updateExperience(idx, {company: eve.target.value})} />
          </TimelineTitle>
          <TimelineDescription className="flex flex-col">
            <div className="flex">
              <EditableText placeholder="Role" value={e.role} onChange={eve => updateExperience(idx, {role: eve.target.value})} />
              <EditableText placeholder="Since - Until" value={e.timeline} className="w-1/4 text-right flex-initial" onChange={eve => updateExperience(idx, {timeline: eve.target.value})} />
            </div>
            <div>
              <EditableText placeholder="Description" value={e.text} multiline onChange={eve => updateExperience(idx, {text: eve.target.value})} />
            </div>
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>)}
    </TimelineRoot>
  </div>);
};
//<TimelineTitle>
{/* <EditableText placeholder="Company" value={e.company} />
</TimelineTitle> */}
export default ExperienceElement;