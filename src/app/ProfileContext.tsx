import React, { createContext, useEffect, useState, useCallback, useMemo, useContext } from 'react';
import Profile, { EMPTY_PROFILE } from '@/types/profile';

interface ProfileContextType {
  name: string | null;
  setName: React.Dispatch<React.SetStateAction<string | null>>;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  unsavedChanges: boolean;
  saveProfileToLocalStorage: () => void;
  layout: LayoutEnum;
  setLayout: React.Dispatch<React.SetStateAction<LayoutEnum>>;
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
  review: string;
  setReview: React.Dispatch<React.SetStateAction<string>>;
  includePhoto: boolean;
  setIncludePhoto: React.Dispatch<React.SetStateAction<boolean>>;
  picture: string | null;
  setPicture: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
}

export enum LayoutEnum {
  Single = "SINGLE",
  Split = "SPLIT"
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setName] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [layout, setLayout] = useState<LayoutEnum>(LayoutEnum.Split);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [review, setReview] = useState("");
  const [picture, setPicture] = useState<string | null>(null);
  const [includePhoto, setIncludePhoto] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  function nameSuffix() {
    return name ? ('/' + name) : '';
  }

  // Load profile from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLoading(true)
      try {
        const suffix = nameSuffix();
        const storedProfile = localStorage.getItem('profile' + suffix);
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
        const storedPicture = localStorage.getItem('picture' + suffix);
        if (storedPicture) {
          setPicture(storedPicture);
        }
        const storedConfig = localStorage.getItem('config' + suffix);
        if (storedConfig) {
          const conf = JSON.parse(storedConfig);
          setLayout(conf.layout);
          setJobDescription(conf.jd);
          setReview(conf.review);
          setIncludePhoto(conf.includePhoto ?? true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile from localStorage', error);
      }
    }
  }, [name]);

  // Save profile to localStorage with debounce
  useEffect(() => {
    // Indicate that there are unsaved changes
    setUnsavedChanges(true);

    // Clear previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer
    const timer = setTimeout(() => {
      saveProfileToLocalStorage();
    }, 5000); // 5 seconds

    setDebounceTimer(timer);

    // Clean up timer on unmount
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
    // Exclude saveProfileToLocalStorage from dependencies to avoid unnecessary calls
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, picture, layout, jobDescription, review]);

  const saveProfileToLocalStorage = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const config = {
          layout,
          jd: jobDescription,
          review,
          includePhoto
        };
        const suffix = nameSuffix();
        localStorage.setItem('profile' + suffix, JSON.stringify(profile));
        if (picture !== null) {
          localStorage.setItem('picture' + suffix, picture);
        }
        localStorage.setItem('config' + suffix, JSON.stringify(config));
        console.log('Profile saved to localStorage', config);
        setUnsavedChanges(false);

        // Clear any existing debounce timer since we've saved manually
        if (debounceTimer) {
          clearTimeout(debounceTimer);
          setDebounceTimer(null);
        }
      }
    } catch (error) {
      console.error('Error saving profile to localStorage', error);
    }
  }, [profile, picture, layout, jobDescription, review, debounceTimer]);

  // Warn user before closing if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
  }, [unsavedChanges]);

  const value = useMemo(
    () => ({
      name,
      setName,
      profile,
      setProfile,
      unsavedChanges,
      saveProfileToLocalStorage,
      layout,
      setLayout,
      jobDescription,
      setJobDescription,
      review,
      setReview,
      includePhoto,
      setIncludePhoto,
      picture,
      setPicture,
      loading
    }),
    [name, profile, unsavedChanges, saveProfileToLocalStorage, layout, jobDescription, review, includePhoto, picture, loading]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};