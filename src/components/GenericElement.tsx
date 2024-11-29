import { useProfile } from "@/app/ProfileContext";
import Profile, { Part } from "@/types/profile";
import EditableText from "./EditableText";
import PartHoverMenu from "./PartHoverMenu";
import { Tag } from "./ui/tag";


const GenericElement: React.FC<{ part: Part, section: "SECTION1" | "SECTION2", sectionIndex: number, id: string }> = ({ part, section, sectionIndex, id }) => {
  const { profile, setProfile } = useProfile();

  function updatePart(update: object) {
    let newProfile = {...profile};
    let sectionToUpdate = section === "SECTION1" ? newProfile.section1 : newProfile.section2;
    if (!sectionToUpdate) return;
    let sectionItem = sectionToUpdate[sectionIndex];
    sectionToUpdate[sectionIndex] = {...sectionItem, ...update};
    setProfile(newProfile);
  }

  function updateList(idx: number, val: string) {
    let newProfile = {...profile};
    let sectionToUpdate = section === "SECTION1" ? newProfile.section1 : newProfile.section2;
    if (!sectionToUpdate) return;
    let sectionItem = sectionToUpdate[sectionIndex] as Part;
    if (!sectionItem.list) return;
    sectionItem.list[idx] = val;
    setProfile(newProfile);
  }

  if (part.type === "LIST" && !part.list) part.list = [''];
  if (part.type === "CHIPS" && !part.chips) part.chips = [''];

  return (<div className="relative group">
    <PartHoverMenu section={section} sectionIndex={sectionIndex} />
    <EditableText placeholder="Heading" value={part.heading} className="text-2xl" onChange={ele => updatePart({heading: ele.target.value})} />
    {part.type === "TEXT" && <EditableText placeholder="Description" multiline value={part.text} onChange={ele => updatePart({text: ele.target.value})} />}
    {part.type === "LIST" && <ul>
      {part.list?.map((i, key) => <li key={key}><EditableText placeholder="..." value={i} onChange={ele => updateList(key, ele.target.value)} /></li>)}
    </ul>}
    {part.type === "CHIPS" && <div>
      {/* {part.chips?.map((i, key) => <Tag key={key}><EditableText placeholder="..." value={i} onChange={ele => updateChips(i, ele.target.value)} /></Tag>)} */}
    </div>}
  </div>);
}

export default GenericElement;