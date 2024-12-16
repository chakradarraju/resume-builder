import { createContext, useContext, useMemo, useState } from "react";

interface ConfigContextType {
  printMode: boolean;
  setPrintMode: React.Dispatch<React.SetStateAction<boolean>>;
  creditsRemaining: number;
  setCreditsRemaining: React.Dispatch<React.SetStateAction<number>>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [printMode, setPrintMode] = useState<boolean>(false);
  const [creditsRemaining, setCreditsRemaining] = useState<number>(0);

  const value = useMemo(
    () => ({
      creditsRemaining,
      setCreditsRemaining,
      printMode,
      setPrintMode,
    }),
    [printMode, creditsRemaining]
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};