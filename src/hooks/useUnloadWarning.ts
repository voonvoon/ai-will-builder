import { useEffect } from "react";

export default function useUnloadWarning(condition = true) {
  useEffect(() => {
    if (!condition) return;

    //BeforeUnloadEvent is a standard DOM event that is fired before the window is unloaded.
    //The listener function prevents the default behavior of the event, which is to show a confirmation dialog to the user.
    const listener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    //beforeunload event is fired when the window, the document and its resources are about to be unloaded.
    window.addEventListener("beforeunload", listener); //msg:'Changes you made may not be saved.'

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [condition]);
}
