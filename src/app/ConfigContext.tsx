import { createContext, useContext, useMemo, useState } from "react";

export type LayoutEnum = ("SINGLE" | "SPLIT")

interface ConfigContextType {
  layout: LayoutEnum;
  setLayout: React.Dispatch<React.SetStateAction<LayoutEnum>>;
  printMode: boolean,
  setPrintMode: React.Dispatch<React.SetStateAction<boolean>>;
  creditsRemaining: number,
  setCreditsRemaining: React.Dispatch<React.SetStateAction<number>>
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layout, setLayout] = useState<LayoutEnum>("SPLIT");
  const [printMode, setPrintMode] = useState<boolean>(false);
  const [creditsRemaining, setCreditsRemaining] = useState<number>(0);

  const value = useMemo(
    () => ({
      layout,
      setLayout,
      creditsRemaining,
      setCreditsRemaining,
      printMode,
      setPrintMode
    }),
    [layout, printMode, creditsRemaining]
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