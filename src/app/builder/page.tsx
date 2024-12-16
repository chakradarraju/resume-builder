'use client';

import ResumeLayout from "@/components/ResumeLayout";
import { useEffect } from "react";
import { useProfile } from '../ProfileContext';
import { useConfig } from "../ConfigContext";
import Profile from "@/types/profile";
//import mixpanel from "mixpanel-browser";
import { FullStory, init } from '@fullstory/browser';
import { redirect, useSearchParams } from "next/navigation";

const FULLSTORY_ORG_ID = 'o-228D0K-na1';

const Page: React.FC = () => {
  const {profile, setProfile} = useProfile();
  const {printMode} = useConfig();

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     init({ orgId: FULLSTORY_ORG_ID });
  //   }
  // }, []);
  // useEffect(() => {
  //   mixpanel.init("f7fb8a723ec41c96963a52173e0bef49", {
  //     debug: true,
  //     track_pageview: true,
  //     ignore_dnt: true,
  //     record_sessions_percent: 100,
  //     persistence: "localStorage",
  //     api_host: 'https://api-in.mixpanel.com',
  //   });
  //   mixpanel.start_session_recording();
  // }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && profile === null) {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile) as Profile);
      }
    }
  }, [profile, setProfile]);

  return (<div className="w-full" id="page-container">
    <div className={`bg-white w-[1000px] min-w-[1000px] min-h-[1400px] p-12 print:p-2 drop-shadow-md ${printMode ? 'm-0' : 'mx-auto mt-24 mb-4'}`} id="page-1">
      <ResumeLayout profile={profile} setProfile={setProfile} />
    </div>
  </div>)
};

export default Page;