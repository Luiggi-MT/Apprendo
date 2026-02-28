import WakeWord from "../WakeWord/WakeWord";

import React, { createContext, ReactNode, useContext } from "react";

const VoiceContext = createContext(WakeWord);

export const useVoice = () => {
  return useContext(VoiceContext);
};

export const VoiceProvider = ({ children }: { children: ReactNode }) => {
  return (
    <VoiceContext.Provider value={WakeWord}>{children}</VoiceContext.Provider>
  );
};
