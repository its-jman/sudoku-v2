import {
  useEffect,
  Ref,
  RefObject,
  useCallback,
  useState,
  useRef,
} from "react";

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

export function rateLimit(func, millis, immediate = true) {
  let pending, lastCall, argsToCallWith, context;
  if (!millis || millis < 0) millis = 100;

  function callFn(now) {
    pending = undefined;
    lastCall = now ? now : Date.now();
    func.apply(context, argsToCallWith);
  }

  /**
   * Call or create a pending timeout.
   *    When the call is resolved (eg. callFn), the promise will be resolved and lastCall will be set.
   *    recently = now - lastCall > millis
   *
   *    Details:
   *      When this function is called, if there is an existing promise nothing should happen
   *      If you want a leading call on triggers (immediate = true)
   *           You should immediately call the function if you have not called the function recently (now - lastCall > millis)
   *           Otherwise, you should set pending if you have not called recently
   *      If you only want trailing calls (immediate = false)
   *           You should immediately set pending
   *
   * @param args
   */
  function rateLimited(...args) {
    context = this;
    argsToCallWith = args;
    if (!pending) {
      const now = Date.now();
      const since = now - lastCall;

      // If immediate and (it hasnt been called or it isnt going to be delayed (eg since > millis))
      if (immediate && (!lastCall || since > millis)) callFn(now);
      // If not immediate OR it should be delayed
      else if (!immediate || since < millis)
        pending = setTimeout(callFn, millis - since);
    }
  }

  return rateLimited;
}

export function useStateRef<T>(
  initialValue: T
): [RefObject<T>, (val: T) => void] {
  const [val, innerSetVal] = useState(initialValue);
  const valRef = useRef(val);
  valRef.current = val;
  const setVal = useCallback(
    (val: T) => {
      innerSetVal(val);
      valRef.current = val;
    },
    [valRef, innerSetVal]
  );
  return [valRef, setVal];
}

export function useMouseDown() {
  const [mouseDownRef, setMouseDown] = useStateRef(false);
  useEffect(() => {
    const downListener = (e: MouseEvent) => {
      const { button } = e;
      if (button === 0) {
        setMouseDown(true);
      }
    };
    const upListener = (e: MouseEvent) => {
      const { button } = e;
      if (button === 0) {
        setMouseDown(false);
      }
    };
    document.addEventListener("mousedown", downListener);
    document.addEventListener("mouseup", upListener);
    return () => {
      document.removeEventListener("mousedown", downListener);
      document.removeEventListener("mouseup", upListener);
    };
  }, []);

  return mouseDownRef;
}
