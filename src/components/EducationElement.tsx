import Profile, { Education, SectionItem } from "@/types/profile";
import EditableText from "./EditableText";
import { useProfile } from "@/app/ProfileContext";
import PartHoverMenu from "./PartHoverMenu";
import InnerPartHoverMenu from "./InnerPartHoverMenu";

function remover(item: SectionItem, index: number) {
  let sectionItem = item as Education;
  sectionItem.course = sectionItem.course.splice(index, 1);
}

function adder(item: SectionItem) {
  let sectionItem = item as Education;
  sectionItem.course.push({});
}

function swapper(item: SectionItem, idx: number, targetIdx: number) {
  let sectionItem = item as Education;
  [sectionItem.course[idx], sectionItem.course[targetIdx]] = [sectionItem.course[targetIdx], sectionItem.course[idx]];
}

const EducationElement: React.FC<{ education: Education, section: "SECTION1" | "SECTION2", sectionIndex: number, id: string }> = ({ education, section, sectionIndex, id }) => {
  const { profile, setProfile } = useProfile();
  
  function updateEducation(courseIndex: number, update: object) {
    let newProfile = {...profile};
    let sectionToUpdate = section === "SECTION1" ? newProfile.section1 : newProfile.section2;
    if (!sectionToUpdate) return;
    let sectionItem = sectionToUpdate[sectionIndex] as Education;
    let course = sectionItem.course[courseIndex];
    sectionItem.course[courseIndex] = {...course, ...update};
    setProfile(newProfile);
  }

  if (education.course.length === 0) education.course.push({});

  return <div className="group relative">
    <PartHoverMenu section={section} sectionIndex={sectionIndex} />
    <div className="text-2xl">Education</div>
    {education.course?.map((e, idx) => <div key={idx} className="group relative">
      <InnerPartHoverMenu section={section} sectionIndex={sectionIndex} idx={idx} len={education.course.length} adder={adder} remover={remover} swapper={swapper}/>
      <div className="flex">
        <EditableText placeholder="Institute" value={e.school} className="text-lg" onChange={eve => updateEducation(idx, {school: eve.target.value})} />
      </div>
      <div className="flex">
        <EditableText placeholder="Degree" value={e.degree} onChange={eve => updateEducation(idx, {degree: eve.target.value})} />
        <EditableText placeholder="Since - Until" value={e.timeline} className="w-1/4 text-right flex-initial" onChange={eve => updateEducation(idx, {timeline: eve.target.value})} />
      </div>
    </div>)}
  </div>;
}

export default EducationElement;