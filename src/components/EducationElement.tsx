import Profile, { Education, SectionEnum, SectionItem } from "@/types/profile";
import EditableText from "./EditableText";
import { useProfile } from "@/app/ProfileContext";
import PartHoverMenu from "./PartHoverMenu";
import InnerPartHoverMenu from "./InnerPartHoverMenu";
import { fillBullet } from "@/lib/uiutils/fillBullet";
import { getSection } from "@/lib/typeUtils";

function remover(item: SectionItem, index: number) {
  let sectionItem = item as Education;
  sectionItem.course.splice(index, 1);
}

function adder(item: SectionItem, index: number) {
  let sectionItem = item as Education;
  sectionItem.course.splice(index + 1, 0, {});
}

function swapper(item: SectionItem, idx: number, targetIdx: number) {
  let sectionItem = item as Education;
  [sectionItem.course[idx], sectionItem.course[targetIdx]] = [sectionItem.course[targetIdx], sectionItem.course[idx]];
}

const EducationElement: React.FC<{ education: Education, section: SectionEnum, sectionIndex: number, id: string }> = ({ education, section, sectionIndex, id }) => {
  const { profile, setProfile } = useProfile();
  
  function updateEducation(courseIndex: number, update: object) {
    let newProfile = {...profile};
    let sectionToUpdate = getSection(newProfile, section);
    if (!sectionToUpdate) return;
    let sectionItem = sectionToUpdate[sectionIndex] as Education;
    let course = sectionItem.course[courseIndex];
    sectionItem.course[courseIndex] = {...course, ...update};
    setProfile(newProfile);
  }

  if (education.course.length === 0) education.course.push({});

  return <div className="group/i relative break-inside-avoid-page">
    <PartHoverMenu section={section} sectionIndex={sectionIndex} />
    <div className="text-2xl">Education</div>
    {education.course?.map((e, idx) => <div key={idx} className="group/ii relative">
      <InnerPartHoverMenu section={section} sectionIndex={sectionIndex} idx={idx} len={education.course.length} adder={adder} remover={remover} swapper={swapper}/>
      <div className="flex">
        <EditableText placeholder="Institute" value={e.school} className="text-lg h-8" onChange={eve => updateEducation(idx, {school: eve.target.value})} />
      </div>
      <div className={`flex ${e.degree || e.timeline ? '' : 'hidden group-hover/i:flex transition-all'}`}>
        <EditableText placeholder="Degree" value={e.degree} className="h-6" onChange={eve => updateEducation(idx, {degree: eve.target.value})} />
        <EditableText placeholder="Since - Until" value={e.timeline} className="w-1/4 h-6 text-right flex-initial" onChange={eve => updateEducation(idx, {timeline: eve.target.value})} />
      </div>
      <div className={`${e.text ? '' : 'hidden group-hover/i:flex'}`}>
        <EditableText placeholder="Description" value={e.text} multiline className="py-2" onChange={eve => updateEducation(idx, {text: fillBullet(eve.target.value)})} />
      </div>
    </div>)}
  </div>;
}

export default EducationElement;