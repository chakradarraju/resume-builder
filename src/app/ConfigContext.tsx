import { createContext, useContext, useMemo, useState } from "react";

export type LayoutEnum = ("SINGLE" | "SPLIT")

export interface Config {
  layout: LayoutEnum,
}

interface ConfigContextType {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
  printMode: boolean,
  setPrintMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>({
    layout: "SPLIT",
  });
  const [printMode, setPrintMode] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      config,
      setConfig,
      printMode,
      setPrintMode
    }),
    [config, printMode]
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