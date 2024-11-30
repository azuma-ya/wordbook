import { useLayoutEffect, useRef } from "react";

import { usePathname, useRouter } from "next/navigation";

export const useViewTransitionRouter = (): ReturnType<typeof useRouter> => {
  const router = useRouter();
  const pathname = usePathname();

  const promiseCallbacks = useRef<Record<
    "resolve" | "reject",
    (value: unknown) => void
  > | null>(null);

  const transitionHelper = (updateDOM: () => Promise<void> | void) => {
    if (!document.startViewTransition) {
      return updateDOM();
    }

    document.startViewTransition(updateDOM);
  };

  useLayoutEffect(() => {
    return () => {
      if (promiseCallbacks.current) {
        promiseCallbacks.current.resolve(undefined);
        promiseCallbacks.current = null;
      }
    };
  }, []);

  return {
    ...router,
    push: (...args: Parameters<typeof router.push>) => {
      transitionHelper(() => {
        const url = args[0] as string;
        if (url === pathname) {
          router.push(...args);
        } else {
          return new Promise((resolve, reject) => {
            // @ts-ignore
            promiseCallbacks.current = { resolve, reject };
            router.push(...args);
          });
        }
      });
    },
  };
};
