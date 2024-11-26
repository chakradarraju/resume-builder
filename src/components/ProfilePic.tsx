import Profile from "@/types/profile";
import Image from "next/image";
import { IoCloseCircle } from "react-icons/io5";
import { MdPersonAdd } from "react-icons/md";

const ProfilePic: React.FC<{ profile: Profile, setProfile: React.Dispatch<React.SetStateAction<Profile>> }> = ({ profile, setProfile }) => {

  function handlePicture(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Read the file as Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfile({...profile, picture: base64String});

        // Store the image in localStorage
        //localStorage.setItem('uploadedImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  return (<>
    {profile.picture && <div className="group relative">
      <Image src={profile.picture} width={256} height={256} alt="Image changed" className="w-64 h-64 rounded-full text-center object-cover"/>
      <IoCloseCircle className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={() => setProfile({...profile, picture: null})} />
    </div>}
    {!profile.picture && <div className="bg-gray-500 rounded-full w-64 h-64">
      <label className="flex flex-col items-center justify-center w-full h-full">
        <MdPersonAdd />
        <div>Choose pic</div>
        <input type="file" className="hidden" onChange={handlePicture} accept="image/*" />
      </label>
    </div>}
  </>);
}

export default ProfilePic;