'use client';

import SplitLayout from "@/components/SplitLayout";
import Profile from "@/types/profile";
import { useState } from "react";

const Page: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({});

  return (<div className="w-full">
    <div className="bg-white mx-auto w-[1240px] h-[1754px] min-w-[1240px] min-h-[1754px] m-4 p-8">
      <SplitLayout profile={profile} setProfile={setProfile} />
    </div>
  </div>)
};

export default Page;