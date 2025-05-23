'use client';

import ResumeLayout from "@/components/ResumeLayout";
import { useConfig } from "@/app/ConfigContext";
import { useProfile } from "@/app/ProfileContext";
import { useEffect } from "react";
import { useParams } from "next/navigation";
//import mixpanel from "mixpanel-browser";

const FULLSTORY_ORG_ID = 'o-228D0K-na1';

const Page: React.FC = () => {
  const {printMode} = useConfig();
  const {setName} = useProfile();
  // const router = useRouter();
  const params = useParams<{ name: string; }>();

  useEffect(() => {
    console.log('Updating name to', params.name);
    setName(params.name);
  }, [params]);

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

  return (<div className="w-full" id="page-container">
    <div className={`bg-white w-[1000px] min-w-[1000px] min-h-[1400px] p-12 print:p-2 ${printMode ? 'm-0' : 'mx-auto mt-24 mb-4'}`} id="page-1">
      <ResumeLayout />
    </div>
  </div>)
};

export default Page;