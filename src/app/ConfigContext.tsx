import { createContext, useContext, useMemo, useState } from "react";

export interface Config {
  layout: "SINGLE" | "SPLIT"
}

interface ConfigContextType {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>({
    layout: "SPLIT"
  });

  const value = useMemo(
    () => ({
      config,
      setConfig,
    }),
    [config]
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