import { useProfile } from "@/app/ProfileContext";
import Profile, { SectionEnum, SectionItem } from "@/types/profile";
import { IoCloseCircle } from "react-icons/io5";
import { MdMoveDown, MdMoveUp, MdPlaylistAdd } from "react-icons/md";

const InnerPartHoverMenu: React.FC<{idx: number, len: number, section: SectionEnum, sectionIndex: number, adder: (i: SectionItem) => void, remover: (i: SectionItem, idx: number) => void, swapper: (i: SectionItem, idx: number, targetIdx: number) => void}> = ({idx, len, section, sectionIndex, adder, remover, swapper}) => {
  const { profile, setProfile } = useProfile();

  function run(op: (i: SectionItem) => void) {
    let newProfile = {...profile};
    let sectionToUpdate = section === "SECTION1" ? newProfile.section1 : newProfile.section2;
    if (!sectionToUpdate) return;
    op(sectionToUpdate[sectionIndex]);
    setProfile(newProfile);
  }
  
  return (<div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 text-gray-500 group-hover:opacity-100 z-10">
    {idx !== 0 && <button className="inline-block mx-1" onClick={() => run((i) => swapper(i, idx, idx - 1))}>
      <MdMoveUp />
    </button>}
    {idx !== len - 1 && <button className="inline-block mx-1" onClick={() => run((i) => swapper(i, idx, idx + 1))}>
      <MdMoveDown />
    </button>}
    <button onClick={() => run((i) => adder(i))}>
      <MdPlaylistAdd />
    </button>
    <button onClick={() => run((i) => remover(i, idx))}>
      <IoCloseCircle />
    </button>
  </div>)
}

export default InnerPartHoverMenu;