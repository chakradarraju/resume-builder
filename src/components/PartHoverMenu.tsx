import { useProfile } from "@/app/ProfileContext";
import { getSection } from "@/lib/typeUtils";
import Profile, { PartType, SectionEnum, SectionItem } from "@/types/profile";
import { FaGripHorizontal } from "react-icons/fa";
import { GoDot, GoDotFill } from "react-icons/go";
import { GrList } from "react-icons/gr";
import { IoCloseCircle } from "react-icons/io5";
import { MdMoveDown, MdMoveUp } from "react-icons/md";

const PartHoverMenu: React.FC<{section: SectionEnum, sectionIndex: number, showBullets?: boolean, partType?: PartType, bulletToggle?: (i: SectionItem[], idx: number) => void, toggleListType?: (i: SectionItem[], idx: number) => void}> = ({section, sectionIndex, showBullets, partType, bulletToggle, toggleListType}) => {
  const { profile, setProfile } = useProfile();

  const sectionLength = getSection(profile, section)?.length ?? 0;;

  function remove(i: SectionItem[]) {
    i.splice(sectionIndex, 1);
  }

  function swap(i: SectionItem[], targetIdx: number) {
    [i[sectionIndex], i[targetIdx]] = [i[targetIdx], i[sectionIndex]]
  }

  function run(op: (i: SectionItem[]) => void) {
    let newProfile = {...profile};
    let sectionToUpdate = getSection(newProfile, section);
    if (!sectionToUpdate) return;
    op(sectionToUpdate);
    setProfile(newProfile);
  }

  return (<div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 text-gray-500 group-hover/i:opacity-100 z-10">
    {bulletToggle && <button onClick={() => run((i) => bulletToggle(i, sectionIndex))}>
      {showBullets ? <GoDot /> : <GoDotFill />}
    </button>}
    {toggleListType && <button onClick={() => run((i) => toggleListType(i, sectionIndex))}>
      {partType === PartType.Chips ? <GrList /> : <FaGripHorizontal />}
    </button>}
    {sectionIndex !== 0 && <button className="inline-block mx-1" onClick={() => run((i) => swap(i, sectionIndex - 1))}>
      <MdMoveUp />
    </button>}
    {sectionIndex !== sectionLength - 1 && <button className="inline-block mx-1" onClick={() => run((i) => swap(i, sectionIndex + 1))}>
      <MdMoveDown />
    </button>}
    <button onClick={() => run((i) => remove(i))}>
      <IoCloseCircle />
    </button>
  </div>);
}

export default PartHoverMenu;