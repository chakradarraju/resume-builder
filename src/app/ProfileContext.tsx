import React, { createContext, useEffect, useState, useCallback, useMemo, useContext } from 'react';
import Profile, { EMPTY_PROFILE } from '@/types/profile';

interface ProfileContextType {
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
  loading: boolean;
}

export enum LayoutEnum {
  Single = "SINGLE",
  Split = "SPLIT"
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [layout, setLayout] = useState<LayoutEnum>(LayoutEnum.Split);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Load profile from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedProfile = localStorage.getItem('profile');
        if (storedProfile) {
          setProfile(JSON.parse(storedProfile));
        }
        const storedConfig = localStorage.getItem('config');
        if (storedConfig) {
          const conf = JSON.parse(storedConfig);
          setLayout(conf.layout);
          setJobDescription(conf.jd);
          setReview(conf.review);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile from localStorage', error);
      }
    }
  }, []);

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
  }, [profile, layout, jobDescription, review]);

  const saveProfileToLocalStorage = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const config = { layout, jd: jobDescription, review };
        localStorage.setItem('profile', JSON.stringify(profile));
        localStorage.setItem('config', JSON.stringify(config));
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
  }, [profile, layout, jobDescription, review, debounceTimer]);

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
      loading
    }),
    [profile, unsavedChanges, saveProfileToLocalStorage, layout, jobDescription, review, loading]
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