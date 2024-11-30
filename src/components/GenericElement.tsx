import { useProfile } from "@/app/ProfileContext";
import Profile, { Part, SectionItem } from "@/types/profile";
import EditableText from "./EditableText";
import PartHoverMenu from "./PartHoverMenu";
import { Tag } from "./ui/tag";
import InnerPartHoverMenu from "./InnerPartHoverMenu";
import { Editable } from "@chakra-ui/react"

function listItemRemover(item: SectionItem, index: number) {
  let sectionItem = item as Part;
  if (!sectionItem.list) return;
  sectionItem.list = sectionItem.list.splice(index, 1);
}

function listItemAdder(item: SectionItem) {
  let sectionItem = item as Part;
  if (!sectionItem.list) return;
  sectionItem.list.push('');
}

function listItemSwapper(item: SectionItem, idx: number, targetIdx: number) {
  let sectionItem = item as Part;
  if (!sectionItem.list) return;
  [sectionItem.list[idx], sectionItem.list[targetIdx]] = [sectionItem.list[targetIdx], sectionItem.list[idx]];
}

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

  if ((part.type === "LIST" || part.type === "CHIPS") && !part.list) part.list = [''];

  return (<div className="relative group">
    <PartHoverMenu section={section} sectionIndex={sectionIndex} />
    <EditableText placeholder="Heading" value={part.heading} className="text-2xl" onChange={ele => updatePart({heading: ele.target.value})} />
    {part.type === "TEXT" && <EditableText placeholder="Description" multiline value={part.text} onChange={ele => updatePart({text: ele.target.value})} />}
    {part.type === "LIST" && <ul className="list-disc">
      {part.list?.map((i, key) => <li key={key} className="relative">
        <InnerPartHoverMenu section={section} sectionIndex={sectionIndex} idx={key} len={part.list?.length || 0} adder={listItemAdder} remover={listItemRemover} swapper={listItemSwapper}/>
        <EditableText placeholder="..." value={i} onChange={ele => updateList(key, ele.target.value)} />
      </li>)}
    </ul>}
    {part.type === "CHIPS" && <div>
      {part.list?.map((i, idx) => <Tag key={idx}>
        <Editable.Root textAlign="start" defaultValue={i} placeholder="...">
          <Editable.Preview />
          <Editable.Input />
        </Editable.Root>
      </Tag>)}
      {/* {part.chips?.map((i, key) => <Tag key={key}><EditableText placeholder="..." value={i} onChange={ele => updateChips(i, ele.target.value)} /></Tag>)} */}
    </div>}
  </div>);
}

export default GenericElement;