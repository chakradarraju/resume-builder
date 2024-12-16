import { useProfile } from "@/app/ProfileContext";
import Profile, { Part, PartType, SectionEnum, SectionItem } from "@/types/profile";
import EditableText from "./EditableText";
import PartHoverMenu from "./PartHoverMenu";
import { Tag } from "./ui/tag";
import InnerPartHoverMenu from "./InnerPartHoverMenu";
import { Editable } from "@chakra-ui/react"
import { useState } from "react";
import { getSection } from "@/lib/typeUtils";

function listItemRemover(item: SectionItem, index: number) {
  let sectionItem = item as Part;
  if (!sectionItem.list) return;
  sectionItem.list.splice(index, 1);
}

function listItemAdder(item: SectionItem, index: number) {
  let sectionItem = item as Part;
  if (!sectionItem.list) return;
  sectionItem.list.splice(index + 1, 0, '');
}

function listItemSwapper(item: SectionItem, idx: number, targetIdx: number) {
  let sectionItem = item as Part;
  if (!sectionItem.list) return;
  console.log('Swapping', sectionItem.list, idx, targetIdx);
  [sectionItem.list[idx], sectionItem.list[targetIdx]] = [sectionItem.list[targetIdx], sectionItem.list[idx]];
  console.log('After swap', sectionItem.list);
}

const GenericElement: React.FC<{ part: Part, section: SectionEnum, sectionIndex: number, id: string }> = ({ part, section, sectionIndex, id }) => {
  const { profile, setProfile } = useProfile();

  function updatePart(update: object) {
    let newProfile = {...profile};
    let sectionToUpdate = getSection(newProfile, section);
    if (!sectionToUpdate) return;
    let sectionItem = sectionToUpdate[sectionIndex];
    sectionToUpdate[sectionIndex] = {...sectionItem, ...update};
    setProfile(newProfile);
  }

  function updateList(idx: number, val: string) {
    let newProfile = {...profile};
    let sectionToUpdate = getSection(newProfile, section);
    if (!sectionToUpdate) return;
    let sectionItem = sectionToUpdate[sectionIndex] as Part;
    if (!sectionItem.list) return;
    sectionItem.list[idx] = val;
    setProfile(newProfile);
  }

  if ((part.type === PartType.List || part.type === PartType.Chips) && !part.list) part.list = [''];

  return (<div className="relative group/i break-inside-avoid-page">
    <PartHoverMenu section={section} sectionIndex={sectionIndex} />
    <EditableText placeholder="Heading" value={part.heading} className="text-2xl" onChange={ele => updatePart({heading: ele.target.value})} />
    {part.type === PartType.Text && <EditableText placeholder="Description" multiline value={part.text} onChange={ele => updatePart({text: ele.target.value})} />}
    {part.type === PartType.List && <ul className="list-disc">
      {part.list?.map((i, idx) => <li key={idx} className="relative group/ii ml-6">
        <InnerPartHoverMenu section={section} sectionIndex={sectionIndex} idx={idx} len={part.list?.length || 0} adder={listItemAdder} remover={listItemRemover} swapper={listItemSwapper}/>
        <EditableText placeholder="..." value={i} className="h-6" onChange={ele => updateList(idx, ele.target.value)} />
      </li>)}
    </ul>}
    {part.type === PartType.Chips && <div>
      {part.list?.map((listItem, tagIndex) => <span className="relative inline-block mx-1 my-1 hover:min-w-20 group/ii" key={tagIndex}><Tag variant="outline">
        <InnerPartHoverMenu section={section} sectionIndex={sectionIndex} idx={tagIndex} len={part.list?.length || 0} adder={listItemAdder} remover={listItemRemover} swapper={listItemSwapper} onTag={true} />
        <Editable.Root textAlign="start" value={listItem || ''} placeholder="..." onValueChange={e => updateList(tagIndex, e.value)}>
          <Editable.Preview />
          <Editable.Input />
        </Editable.Root>
      </Tag></span>)}
    </div>}
  </div>);
}

export default GenericElement;