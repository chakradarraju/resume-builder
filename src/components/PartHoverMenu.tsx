import { useProfile } from "@/app/ProfileContext";
import Profile, { SectionItem } from "@/types/profile";
import { IoCloseCircle } from "react-icons/io5";
import { MdMoveDown, MdMoveUp } from "react-icons/md";

const PartHoverMenu: React.FC<{section: "SECTION1" | "SECTION2", sectionIndex: number}> = ({section, sectionIndex}) => {
  const { profile, setProfile } = useProfile();

  const sectionLength = (section === "SECTION1" ? profile.section1?.length : profile.section2?.length) || 0;

  function remove(i: SectionItem[]) {
    i.splice(sectionIndex, 1);
  }

  function swap(i: SectionItem[], targetIdx: number) {
    [i[sectionIndex], i[targetIdx]] = [i[targetIdx], i[sectionIndex]]
  }

  function run(op: (i: SectionItem[]) => void) {
    let newProfile = {...profile};
    let sectionToUpdate = section === "SECTION1" ? newProfile.section1 : newProfile.section2;
    if (!sectionToUpdate) return;
    op(sectionToUpdate);
    setProfile(newProfile);
  }

  return (<div className="absolute top-0 right-0 mt-2 mr-2 opacity-0 text-gray-500 group-hover:opacity-100 z-10">
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