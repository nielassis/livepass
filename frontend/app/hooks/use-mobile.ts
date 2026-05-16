import * as React from "react";

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
  const mql = window.matchMedia([(max-width: ${MOBILE_BREAKPOINT - 1}px)](cci:1://file:///c:/Users/nielv/OneDrive/Documentos/git/livepass/backend/frontend/app/components/ui/select.tsx:8:0-12:1));
  const onChange = () => {
    setIsMobile(prevIsMobile => window.innerWidth < MOBILE_BREAKPOINT && !prevIsMobile);
  };
  mql.addEventListener("change", onChange);
  setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  return () => mql.removeEventListener("change", onChange);
}, []);

  return !!isMobile;
}
