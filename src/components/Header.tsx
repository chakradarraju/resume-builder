'use client';

import { Button } from "@chakra-ui/react";
import { FaGripHorizontal, FaSave } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { HiMiniQueueList } from "react-icons/hi2";
import { useProfile } from '../app/ProfileContext';
import { Config, LayoutEnum, useConfig } from "@/app/ConfigContext";
import { SectionItem } from "@/types/profile";
import { BsWindowFullscreen, BsWindowSidebar } from "react-icons/bs";
import { Separator } from "@chakra-ui/react/separator";
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "./ui/popover";
import { SegmentedControl } from "./ui/segmented-control";
import { HStack } from "@chakra-ui/react";
import { PiColumnsPlusLeftBold, PiColumnsPlusRightBold, PiRowsPlusBottomBold, PiRowsPlusTopBold } from "react-icons/pi";
import { Component } from "react";
import { GrList, GrTextAlignFull } from "react-icons/gr";
import { MdOutlineWork } from "react-icons/md";
import { RiGraduationCapFill } from "react-icons/ri";


async function exportToPDF() {
  const printJS = await import('print-js');
  printJS.default({
      printable: 'page-1',
      maxWidth: 1000,
      type: 'html',
      targetStyles: ['*'],
      showModal: false,
      honorMarginPadding: false,
      style: '@import url(https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap);',
      css: '/_next/static/css/app/layout.css?v=1733040129890',
      font: 'Nunito',
      font_size: null
  });
}

const LayoutButton: React.FC<{config: Config, setConfig: React.Dispatch<React.SetStateAction<Config>>}> = ({config, setConfig}) => {
  return (<div className="flex">
    <PopoverRoot positioning={{ placement: "bottom" }}>
      <PopoverTrigger asChild>
        <Button variant="plain" size="sm" color="white">
          {config.layout === "SINGLE" ? <BsWindowFullscreen /> : <BsWindowSidebar />}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <SegmentedControl value={config.layout} onValueChange={({value}: {value: LayoutEnum}) => setConfig({layout: value}) } items={[
            { value: "SINGLE", label: <HStack><BsWindowFullscreen /> Classic layout</HStack> },
            { value: "SPLIT", label: <HStack><BsWindowSidebar /> Split layout</HStack>}]} />
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  </div>)
}

const AddButton: React.FC<{ icon: Component, onAdd: (t: SectionItem) => void, allowExpEdu?: boolean }> = ({ icon, onAdd, allowExpEdu = true }) => {
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
  const { config, setConfig } = useConfig();

  return <div className="w-full flex fixed z-[200]">
    <div className="p-4 bg-black text-white rounded-xl flex m-3 grow">
      <HiMiniQueueList className="my-auto m-1" /> 
      <div className="text-lg font-bold my-auto">
        Resume builder
      </div>
      <div className="flex flex-1 justify-center">
        <LayoutButton config={config} setConfig={setConfig} />
        <Separator orientation="vertical" />
        <AddButton icon={config.layout === "SINGLE" ? <PiRowsPlusTopBold /> : <PiColumnsPlusLeftBold />} onAdd={(t) => {
          setProfile({...profile, section1: profile.section1 ? [...profile.section1, t] : [t]});
        }} allowExpEdu={false} />
        <AddButton icon={config.layout === "SINGLE" ? <PiRowsPlusBottomBold /> : <PiColumnsPlusRightBold />} onAdd={(t) => {
          setProfile({...profile, section2: profile.section2 ? [...profile.section2, t]: [t]});
        }} />
      </div>
      <Button colorPalette="green" className="mx-3" onClick={saveProfileToLocalStorage} disabled={!unsavedChanges}><FaSave /></Button>
      <Button colorPalette="orange" color="white" onClick={exportToPDF}><FaDownload /> Download</Button>
    </div>
  </div>
}

export default Header;