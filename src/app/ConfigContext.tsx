import { createContext, useContext, useMemo, useState } from "react";

export enum LayoutEnum {
  Single = "SINGLE",
  Split = "SPLIT"
}

interface ConfigContextType {
  layout: LayoutEnum;
  setLayout: React.Dispatch<React.SetStateAction<LayoutEnum>>;
  printMode: boolean;
  setPrintMode: React.Dispatch<React.SetStateAction<boolean>>;
  creditsRemaining: number;
  setCreditsRemaining: React.Dispatch<React.SetStateAction<number>>;
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layout, setLayout] = useState<LayoutEnum>(LayoutEnum.Split);
  const [printMode, setPrintMode] = useState<boolean>(false);
  const [creditsRemaining, setCreditsRemaining] = useState<number>(0);
  const [jobDescription, setJobDescription] = useState<string>("");

  const value = useMemo(
    () => ({
      layout,
      setLayout,
      creditsRemaining,
      setCreditsRemaining,
      printMode,
      setPrintMode,
      jobDescription,
      setJobDescription,
    }),
    [layout, printMode, creditsRemaining, jobDescription]
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