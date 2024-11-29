'use client';

import { Button } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { HiMiniQueueList } from "react-icons/hi2";
import { useProfile } from '../app/ProfileContext';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@chakra-ui/react/menu";
import { Config, useConfig } from "@/app/ConfigContext";
import ProfileEditor from "@/types/profileEditor";
import { SectionItem } from "@/types/profile";
import { BsWindowFullscreen, BsWindowSidebar } from "react-icons/bs";
import { Separator } from "@chakra-ui/react/separator";
import { Portal } from "@chakra-ui/react/portal";
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "./ui/popover";

const LayoutButton: React.FC<{config: Config, setConfig: React.Dispatch<React.SetStateAction<Config>>}> = ({config, setConfig}) => {
  return (<div className="flex">
    <PopoverRoot positioning={{ placement: "bottom" }}>
      <PopoverTrigger asChild>
        <Button variant="plain" size="sm" color="white">
          Layout
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Button value="single-col" className={`${config.layout === "SINGLE"} ? 'bg-gray-100' : ''`} onClick={() => setConfig({layout: "SINGLE"})}><BsWindowFullscreen />Classic layout</Button>
          <Button value="double-col" className={`${config.layout === "SPLIT"} ? 'bg-gray-100' : ''`} onClick={() => setConfig({layout: "SPLIT"})}><BsWindowSidebar />Split layout</Button>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  </div>)
}

const AddButton: React.FC<{ sectionName: string, onAdd: (t: SectionItem) => void, allowExpEdu?: boolean }> = ({ sectionName, onAdd, allowExpEdu = true }) => {
  return (<div>
    <PopoverRoot positioning={{ placement: "bottom" }}>
      <PopoverTrigger asChild>
        <Button variant="plain" size="sm" color="white">
          Add to {sectionName} section
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          {allowExpEdu && <Button value="add-experience" onClick={() => onAdd({experiences: []})}>Experience</Button>}
          {allowExpEdu && <Button value="add-education" onClick={() => onAdd({course: []})}>Education</Button>}
          <Button value="add-text" onClick={() => onAdd({type: "TEXT"})}>Text</Button>
          <Button value="add-list" onClick={() => onAdd({type: "LIST"})}>List</Button>
          <Button value="add-chips" onClick={() => onAdd({type: "CHIPS"})}>Chips</Button>
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
        <AddButton sectionName={config.layout === "SINGLE" ? "upper" : "left"} onAdd={(t) => {
          setProfile({...profile, section1: profile.section1 ? [...profile.section1, t] : [t]});
        }} allowExpEdu={false} />
        <AddButton sectionName={config.layout === "SINGLE" ? "lower" : "right"} onAdd={(t) => {
          setProfile({...profile, section2: profile.section2 ? [...profile.section2, t]: [t]});
        }} />
      </div>
      <Button colorPalette="green" className="mx-3" onClick={saveProfileToLocalStorage} disabled={!unsavedChanges}><FaSave /></Button>
      <Button colorPalette="orange" color="white"><FaDownload /> Download</Button>
    </div>
  </div>
}

export default Header;