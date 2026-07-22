import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToHash(hash: string) {
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    if (scrollToHash(hash)) return;

    // Element may not exist until the route finishes painting
    const frame = requestAnimationFrame(() => {
      if (!scrollToHash(hash)) {
        window.setTimeout(() => scrollToHash(hash), 50);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}
