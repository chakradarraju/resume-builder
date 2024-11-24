'use client';

import { Button } from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { HiMiniQueueList } from "react-icons/hi2";
import { useProfile } from '../app/ProfileContext';

const Header: React.FC<{}> = () => {
  const { unsavedChanges, saveProfileToLocalStorage } = useProfile();

  return <div className="w-full flex fixed">
    <div className="p-4 bg-black text-white rounded-xl flex m-3 grow">
      <HiMiniQueueList className="my-auto m-1" /> 
      <div className="text-lg font-bold flex-1 my-auto">
        Resume builder
      </div>
      <Button colorPalette="green" className="mx-3" onClick={saveProfileToLocalStorage} disabled={!unsavedChanges}><FaSave /></Button>
      <Button colorPalette="orange"><FaDownload /> Download</Button>
    </div>
  </div>
}

export default Header;