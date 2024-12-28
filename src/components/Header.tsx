'use client';

import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  MenuTriggerItem,
} from "@/components/ui/menu";
import { Button } from "@chakra-ui/react";
import { FaGripHorizontal } from "react-icons/fa";
import { HiMiniQueueList, HiOutlineDocument, HiOutlineDocumentArrowDown, HiOutlineDocumentArrowUp, HiOutlineDocumentCheck } from "react-icons/hi2";
import { useProfile, LayoutEnum } from '@/app/ProfileContext';
import Profile, { PartType, SectionItem } from "@/types/profile";
import { BsWindowFullscreen, BsWindowSidebar } from "react-icons/bs";
import { Separator } from "@chakra-ui/react/separator";
import { PopoverArrow, PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "./ui/popover";
import { SegmentedControl } from "./ui/segmented-control";
import { HStack } from "@chakra-ui/react";
import { PiColumnsPlusLeftBold, PiColumnsPlusRightBold, PiRowsPlusBottomBold, PiRowsPlusTopBold } from "react-icons/pi";
import { ChangeEvent, ReactNode, Suspense, use, useEffect, useRef, useState } from "react";
import { GrList, GrTextAlignFull } from "react-icons/gr";
import { MdOutlineWork } from "react-icons/md";
import { RiGraduationCapFill } from "react-icons/ri";
import DownloadDialog from "./DownloadDialog";
import { signOut, useSession } from "next-auth/react";
import ReviewResumeDialog from "./ReviewResumeDialog";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

const LayoutButton: React.FC<{layout: LayoutEnum, setLayout: React.Dispatch<React.SetStateAction<LayoutEnum>>}> = ({layout, setLayout}) => {
  const {includePhoto, setIncludePhoto} = useProfile();
  return (<div className="flex">
    <PopoverRoot positioning={{ placement: "bottom" }}>
      <PopoverTrigger asChild>
        <Button variant="plain" size="sm" color="white">
          {layout === LayoutEnum.Single ? <BsWindowFullscreen /> : <BsWindowSidebar />}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody className="text-center">
          <Switch colorPalette="blue" checked={includePhoto} defaultChecked onCheckedChange={e => setIncludePhoto(e.checked)} color="black" className="mb-4">Include photo</Switch>
          <SegmentedControl value={layout} onValueChange={({value}: {value: LayoutEnum}) => setLayout(value) } items={[
            { value: LayoutEnum.Single, label: <HStack><BsWindowFullscreen /> Classic layout</HStack> },
            { value: LayoutEnum.Split, label: <HStack><BsWindowSidebar /> Split layout</HStack>}]} />
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
          <Button value="add-text" onClick={() => onAdd({type: PartType.Text})} title="Text"><GrTextAlignFull/></Button>
          <Button value="add-list" onClick={() => onAdd({type: PartType.List})} title="List"><GrList /></Button>
          <Button value="add-chips" onClick={() => onAdd({type: PartType.Chips})} title="Chips"><FaGripHorizontal /></Button>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  </div>)
}


const Header: React.FC<{}> = () => {
  const router = useRouter();
  const { profile, setProfile, unsavedChanges, saveProfileToLocalStorage, layout, setLayout } = useProfile();
  const loadProfileInput = useRef<HTMLInputElement>(null);
  const { data: session, status } = useSession();
  const [savedResumes, setSavedResumes] = useState<string[]>([]);

  useEffect(() => {
    setSavedResumes(Object.keys(localStorage).filter(k => k.startsWith('profile/')).map(k => k.split('/')[1]));
  }, []);

  async function handleLoadProfile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const fileProfile = JSON.parse(await event.target.files[0].text()) as Profile;
      setProfile(fileProfile);
    }
  }

  function downloadProfile() {
    const data = JSON.stringify(profile, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const fileUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.download = profile.name?.replace(' ', '_') + ".json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(fileUrl);
    document.body.removeChild(downloadLink);
  }

  const MainMenu: React.FC<{}> = () => {
    return (<MenuRoot>
      <MenuTrigger as={Button} colorScheme="blue">
        <HiMiniQueueList /> 
      </MenuTrigger>
      <MenuContent>
        <MenuItem onClick={() => router.push('/new')} value="clear"><HiOutlineDocument /> New resume</MenuItem>
        {!unsavedChanges && savedResumes.length > 0 && <MenuRoot positioning={{ placement: "right-start", gutter: 2 }}>
          <MenuTriggerItem value="open">
            <HiOutlineDocument /> Open resume
          </MenuTriggerItem>
          <MenuContent>
            {savedResumes.map(r => <MenuItem key={r} onClick={() => {
              router.push(`/builder/${r}`);
            }} value={r}>{r}</MenuItem>)}
          </MenuContent>
        </MenuRoot>}
        <MenuItem onClick={() => saveProfileToLocalStorage()} value="save" disabled={!unsavedChanges}><HiOutlineDocumentCheck /> {unsavedChanges ? 'Save changes' : 'Already saved'}</MenuItem>
        <MenuItem onClick={() => downloadProfile()} value="download"><HiOutlineDocumentArrowDown /> Download resume data</MenuItem>
        <MenuItem onClick={() => loadProfileInput.current?.click()} value="load"><HiOutlineDocumentArrowUp /> Load profile</MenuItem>
        {session?.user?.email && <MenuItem onClick={() => signOut()} value="signout"><HiOutlineLogout /> Sign out</MenuItem>}
        {!session?.user?.email && <MenuItem onClick={() => router.push('/login')} value="signin"><HiOutlineLogin /> Sign in</MenuItem>}
      </MenuContent>
    </MenuRoot>)
  }

  return <div className="w-full flex fixed z-[200]">
    <input type="file" ref={loadProfileInput} className="hidden" onChange={handleLoadProfile} accept="application/json" /> 
    <div className="p-4 bg-black text-white rounded-xl flex m-3 grow">
      <div className="flex flex-1">
        <MainMenu />
        <div className="text-lg font-bold my-auto">
          Resume builder
        </div>
      </div>
      <div className="flex flex-1 justify-center">
        <LayoutButton layout={layout} setLayout={setLayout} />
        <Separator orientation="vertical" />
        <AddButton icon={layout === LayoutEnum.Single ? <PiRowsPlusTopBold /> : <PiColumnsPlusLeftBold />} onAdd={(t) => {
          setProfile({...profile, section1: profile.section1 ? [...profile.section1, t] : [t]});
        }} allowExpEdu={false} />
        <AddButton icon={layout === LayoutEnum.Single ? <PiRowsPlusBottomBold /> : <PiColumnsPlusRightBold />} onAdd={(t) => {
          setProfile({...profile, section2: profile.section2 ? [...profile.section2, t]: [t]});
        }} />
      </div>
      <div className="flex flex-1 justify-end">
        <ReviewResumeDialog />
        <Suspense>
          <DownloadDialog />
        </Suspense>
      </div>
    </div>
  </div>
}

export default Header;