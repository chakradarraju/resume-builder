import Profile from "./profile";

interface ProfileEditor {
  profile: Profile,
  setProfile: React.Dispatch<React.SetStateAction<Profile>>
}

export default ProfileEditor;