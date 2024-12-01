'use client';

import ResumeLayout from "@/components/ResumeLayout";
import { useEffect } from "react";
import { useProfile } from '../ProfileContext';

const Page: React.FC = () => {
  const {profile, setProfile} = useProfile();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    }
  }, [setProfile]);

  return (<div className="w-full" id="page-container">
    <div className="bg-white mx-auto w-[1000px] min-w-[1000px] min-h-[1400px] m-4 p-12 print:mx-0" id="page-1">
      <ResumeLayout profile={profile} setProfile={setProfile} />
    </div>
  </div>)
};

export default Page;