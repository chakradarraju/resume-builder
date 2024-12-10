'use client';

import { Button } from "@chakra-ui/react";
import { FaGripHorizontal, FaSave, FaSignOutAlt } from "react-icons/fa";
import { HiMiniQueueList } from "react-icons/hi2";
import { useProfile } from '../app/ProfileContext';
import { LayoutEnum, useConfig } from "@/app/ConfigContext";
import { EMPTY_PROFILE, SectionItem } from "@/types/profile";
import { BsWindowFullscreen, BsWindowSidebar } from "react-icons/bs";
import { Separator } from "@chakra-ui/react/separator";
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "./ui/popover";
import { SegmentedControl } from "./ui/segmented-control";
import { HStack } from "@chakra-ui/react";
import { PiColumnsPlusLeftBold, PiColumnsPlusRightBold, PiRowsPlusBottomBold, PiRowsPlusTopBold } from "react-icons/pi";
import { ReactNode, Suspense } from "react";
import { GrList, GrTextAlignFull } from "react-icons/gr";
import { MdOutlineFiberNew, MdOutlineWork } from "react-icons/md";
import { RiDraftLine, RiGraduationCapFill } from "react-icons/ri";
import DownloadDialog from "./DownloadDialog";
import { signOut } from "next-auth/react";
import JobDescriptionDialog from "./JobDescriptionDialog";

const LayoutButton: React.FC<{layout: LayoutEnum, setLayout: React.Dispatch<React.SetStateAction<LayoutEnum>>}> = ({layout, setLayout}) => {
  return (<div className="flex">
    <PopoverRoot positioning={{ placement: "bottom" }}>
      <PopoverTrigger asChild>
        <Button variant="plain" size="sm" color="white">
          {layout === "SINGLE" ? <BsWindowFullscreen /> : <BsWindowSidebar />}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <SegmentedControl value={layout} onValueChange={({value}: {value: LayoutEnum}) => setLayout(value) } items={[
            { value: "SINGLE", label: <HStack><BsWindowFullscreen /> Classic layout</HStack> },
            { value: "SPLIT", label: <HStack><BsWindowSidebar /> Split layout</HStack>}]} />
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  </div>)
}

const AddButton: React.FC<{ icon: ReactNode, onAdd: (t: SectionItem) => void, allowExpEdu?: boolean }> = ({ icon, onAdd, allowExpEdu = true }) => {
  return (<div>
    <PopoverRoot positioning={{ placement: "bottom" }}>
      <PopoverTrigger asChild>
        <Button variant="plain" size="sm" color="white">
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          {allowExpEdu && <Button value="add-experience" onClick={() => onAdd({experiences: []})} title="Experience"><MdOutlineWork /></Button>}
          {allowExpEdu && <Button value="add-education" onClick={() => onAdd({course: []})} title="Education"><RiGraduationCapFill /></Button>}
          <Button value="add-text" onClick={() => onAdd({type: "TEXT"})} title="Text"><GrTextAlignFull/></Button>
          <Button value="add-list" onClick={() => onAdd({type: "LIST"})} title="List"><GrList /></Button>
          <Button value="add-chips" onClick={() => onAdd({type: "CHIPS"})} title="Chips"><FaGripHorizontal /></Button>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  </div>)
}



const Header: React.FC<{}> = () => {
  const { profile, setProfile, unsavedChanges, saveProfileToLocalStorage } = useProfile();
  const { layout, setLayout } = useConfig();

  const MainMenu: React.FC<{}> = () => {
    return (<PopoverRoot>
      <PopoverTrigger asChild>
        <Button variant="plain" size="sm" color="white">
          <HiMiniQueueList className="my-auto m-1" /> 
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody className="p-0">
          <Button onClick={() => setProfile(EMPTY_PROFILE)} variant="plain" className="w-full text-left" colorPalette="transparent">New resume</Button>
          <Button onClick={() => saveProfileToLocalStorage()} variant="plain" className="w-full text-left" colorPalette="white" disabled={!unsavedChanges}>{unsavedChanges ? 'Save changes' : 'Already saved'}</Button>
          <Button onClick={() => signOut()} variant="plain" className="w-full text-left" colorPalette="white">Sign out</Button>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>)
  }

  return <div className="w-full flex fixed z-[200]">
    <div className="p-4 bg-black text-white rounded-xl flex m-3 grow">
      <MainMenu />
      <div className="text-lg font-bold my-auto">
        Resume builder
      </div>
      <div className="flex flex-1 justify-center">
        <LayoutButton layout={layout} setLayout={setLayout} />
        <Separator orientation="vertical" />
        <AddButton icon={layout === "SINGLE" ? <PiRowsPlusTopBold /> : <PiColumnsPlusLeftBold />} onAdd={(t) => {
          setProfile({...profile, section1: profile.section1 ? [...profile.section1, t] : [t]});
        }} allowExpEdu={false} />
        <AddButton icon={layout === "SINGLE" ? <PiRowsPlusBottomBold /> : <PiColumnsPlusRightBold />} onAdd={(t) => {
          setProfile({...profile, section2: profile.section2 ? [...profile.section2, t]: [t]});
        }} />
      </div>
      <JobDescriptionDialog />
      <Suspense>
        <DownloadDialog />
      </Suspense>
    </div>
  </div>
}

export default Header;