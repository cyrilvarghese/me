import type { ComponentType } from "react";
import CreativeOsContent from "./creative-os";
import CaseChatContent from "./case-chat";
import MsigContent from "./msig";

export const caseContent: Record<string, ComponentType> = {
  "creative-os": CreativeOsContent,
  "case-chat": CaseChatContent,
  msig: MsigContent,
};
