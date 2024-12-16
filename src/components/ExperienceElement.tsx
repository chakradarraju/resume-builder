import { Experience, SectionEnum, SectionItem } from "@/types/profile";
import { TimelineConnector, TimelineContent, TimelineDescription, TimelineItem, TimelineRoot, TimelineTitle } from "./ui/timeline";
import { MdWork } from "react-icons/md";
import EditableText from "./EditableText";
import { useProfile } from "@/app/ProfileContext";
import PartHoverMenu from "./PartHoverMenu";
import InnerPartHoverMenu from "./InnerPartHoverMenu";
import { fillBullet } from "@/lib/uiutils/fillBullet";
import { getSection } from "@/lib/typeUtils";

function remover(item: SectionItem, index: number) {
  let sectionItem = item as Experience;
  sectionItem.experiences.splice(index, 1);
}

function adder(item: SectionItem, index: number) {
  let sectionItem = item as Experience;
  sectionItem.experiences.splice(index + 1, 0, {});
}

function swapper(item: SectionItem, idx: number, targetIdx: number) {
  let sectionItem = item as Experience;
  [sectionItem.experiences[idx], sectionItem.experiences[targetIdx]] = [sectionItem.experiences[targetIdx], sectionItem.experiences[idx]];
}

const ExperienceElement: React.FC<{ experience: Experience, section: SectionEnum, sectionIndex: number, id: string }> = ({experience, section, sectionIndex, id}) => {
  const { profile, setProfile } = useProfile();

  function updateExperience(experienceIndex: number, update: object) {
    let newProfile = {...profile};
    let sectionToUpdate = getSection(newProfile, section);
    if (!sectionToUpdate) return;
    let sectionItem = sectionToUpdate[sectionIndex] as Experience;
    let exp = sectionItem.experiences[experienceIndex];
    sectionItem.experiences[experienceIndex] = {...exp, ...update};
    setProfile(newProfile);
  }

  if (experience.experiences.length === 0) experience.experiences.push({});

  return (<div className="card relative group/i py-2 rounded-lg break-inside-avoid-page text-black">
    <PartHoverMenu section={section} sectionIndex={sectionIndex} />
    <div className="text-2xl">Experiences</div>
    <TimelineRoot variant="outline">
      {experience.experiences.map((e, idx) => <TimelineItem key={idx} className="relative group/ii">
        <InnerPartHoverMenu section={section} sectionIndex={sectionIndex} idx={idx} len={experience.experiences.length} adder={adder} remover={remover} swapper={swapper}/>
        <TimelineConnector>
          <MdWork />
        </TimelineConnector>
        <TimelineContent className="pb-0 gap-0 -m-1">
          <TimelineTitle className="flex">
            <EditableText placeholder="Company" value={e.role} className="text-lg text-blue-400 font-bold leading-none h-8" onChange={eve => updateExperience(idx, {role: eve.target.value})} />
          </TimelineTitle>
          <TimelineDescription className="flex flex-col text-black font-normal">
            <div className={`flex ${e.role || e.timeline ? '' : 'hidden group-hover/i:flex'}`}>
              <EditableText placeholder="Role" value={e.company} className="h-6 font-bold" onChange={eve => updateExperience(idx, {company: eve.target.value})} />
              <EditableText placeholder="Since - Until" value={e.timeline} className="w-1/4 text-right flex-initial h-6" onChange={eve => updateExperience(idx, {timeline: eve.target.value})} />
            </div>
            <div className={`${e.text ? '' : 'hidden group-hover/i:flex'}`}>
              <EditableText placeholder="Description" value={e.text} multiline className="py-2" onChange={eve => updateExperience(idx, {text: fillBullet(eve.target.value)})} />
            </div>
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>)}
    </TimelineRoot>
  </div>);
};

export default ExperienceElement;