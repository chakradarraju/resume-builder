import { useProfile } from "@/app/ProfileContext";
import Image from "next/image";
import { IoCloseCircle } from "react-icons/io5";
import { MdPersonAdd } from "react-icons/md";

const ProfilePic: React.FC<{}> = () => {
  const {picture, setPicture} = useProfile();

  function handlePicture(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Read the file as Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPicture(base64String);

        // Store the image in localStorage
        //localStorage.setItem('uploadedImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  return (<div className="w-1/4">
    {picture && <div className="group relative">
      <Image src={picture} width={256} height={256} alt="Image changed" className="w-56 h-56 rounded-full text-center object-cover"/>
      <IoCloseCircle className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={() => setPicture(null)} />
    </div>}
    {!picture && <div className="bg-gray-500 rounded-full w-56 h-56">
      <label className="flex flex-col items-center justify-center w-full h-full">
        <MdPersonAdd />
        <div>Choose pic</div>
        <input type="file" className="hidden" onChange={handlePicture} accept="image/*" />
      </label>
    </div>}
  </div>);
}

export default ProfilePic;