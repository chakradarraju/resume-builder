import { Input } from "@chakra-ui/react";
import ProfilePic from "./ProfilePic";
import Profile from "@/types/profile";

const SplitLayout: React.FC<{ profile: Profile, setProfile: React.Dispatch<React.SetStateAction<Profile>> }> = ({ profile, setProfile }) => (<div className="flex flex-col">
  <div className="flex">
    <ProfilePic profile={profile} setProfile={setProfile} />
    <div className="p-8 my-auto">
      <Input placeholder="Your Name" className="text-5xl border-none focus:outline-none focus-within:bg-gray-100 text-blue-400 font-bold w-full overflow-visible h-16" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} />
      <Input placeholder="Your designation" className="text-base border-none focus:outline-none focus-within:bg-gray-100 uppercase text-black font-bold w-full" value={profile.role || ''} onChange={e => setProfile({...profile, role: e.target.value })} />
    </div>
  </div>

</div>)

export default SplitLayout;