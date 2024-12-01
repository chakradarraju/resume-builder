'use client';

import ResumeLayout from "@/components/ResumeLayout";
import { useEffect } from "react";
import { useProfile } from '../ProfileContext';
import { useConfig } from "../ConfigContext";

const Page: React.FC = () => {
  const {profile, setProfile} = useProfile();
  const {printMode} = useConfig();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    }
  }, [setProfile]);

  return (<div className="w-full" id="page-container">
    <div className={`bg-white w-[1000px] min-w-[1000px] min-h-[1400px] p-12 ${printMode ? 'm-0' : 'mx-auto mt-24'}`} id="page-1">
      <ResumeLayout profile={profile} setProfile={setProfile} />
    </div>
  </div>)
};

export default Page;