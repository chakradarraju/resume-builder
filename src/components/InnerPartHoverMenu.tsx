import { useProfile } from "@/app/ProfileContext";
import { getSection } from "@/lib/typeUtils";
import Profile, { SectionEnum, SectionItem } from "@/types/profile";
import { IoCloseCircle } from "react-icons/io5";
import { MdMoveDown, MdMoveUp, MdPlaylistAdd } from "react-icons/md";
import { TbArrowMoveLeft, TbArrowMoveRight } from "react-icons/tb";

const InnerPartHoverMenu: React.FC<{idx: number, len: number, section: SectionEnum, sectionIndex: number, onTag?: boolean, adder: (i: SectionItem, idx: number) => void, remover: (i: SectionItem, idx: number) => void, swapper: (i: SectionItem, idx: number, targetIdx: number) => void}> = ({idx, len, section, sectionIndex, onTag, adder, remover, swapper}) => {
  const { profile, setProfile } = useProfile();

  function run(op: (i: SectionItem) => void) {
    let newProfile = {...profile};
    let sectionToUpdate = getSection(newProfile, section);
    if (!sectionToUpdate) return;
    op(sectionToUpdate[sectionIndex]);
    setProfile(newProfile);
  }
  
  return (<div className={`absolute top-0 right-0 ${onTag ? '-mt-2': 'mt-2'} mr-2 text-gray-500 invisible group-hover/ii:visible z-10`}>
    {idx !== 0 && <button className="inline-block mx-1" onClick={() => run((i) => swapper(i, idx, idx - 1))}>
      {onTag ? <TbArrowMoveLeft /> : <MdMoveUp />}
    </button>}
    {idx !== len - 1 && <button className="inline-block mx-1" onClick={() => run((i) => swapper(i, idx, idx + 1))}>
      {onTag ? <TbArrowMoveRight /> : <MdMoveDown />}
    </button>}
    <button onClick={() => run((i) => adder(i, idx))}>
      <MdPlaylistAdd />
    </button>
    <button onClick={() => run((i) => remover(i, idx))}>
      <IoCloseCircle />
    </button>
  </div>)
}

export default InnerPartHoverMenu;