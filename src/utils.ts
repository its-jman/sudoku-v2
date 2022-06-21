import { useEffect, Ref, RefObject, useCallback } from "react";

export const gcn = (...cns: string[]) => cns.filter(Boolean).join(" ");

export const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  cb: () => void
) => {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
        cb();
      }
    },
    [ref, cb]
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]);
};
