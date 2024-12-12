import React, { useEffect, useState } from "react";

//summary useEffect hook to :
//1.observe the dimensions of the container element 
//2.update the state when the element is resized.

export default function useDimensions(
  containerRef: React.RefObject<HTMLElement>, //The containerRef is a React ref object that points to the element whose dimensions we want to observe.
) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const currentRef = containerRef.current; //The currentRef variable is set to the current value of the containerRef ref object.

    // Function to get the dimensions of the observed element
    function getDimensions() {
      return {
        width: currentRef?.offsetWidth || 0,
        height: currentRef?.offsetHeight || 0,
      };
    }

    // Create a new ResizeObserver instance
    const resizeObserver = new ResizeObserver((entries) => { //entries is an array of ResizeObserverEntry objects, each corresponding to an observed element
      // Create a new ResizeObserver instance that calls the provided callback function when the observed element is resized
      const entry = entries[0]; //only 1 element is observed
      // Get the first entry from the entries array (there should only be one entry in this case)
      if (entry) {
        // If the entry exists, update the dimensions state with the current dimensions of the observed element
        setDimensions(getDimensions());
      }
    });


    if (currentRef) {
      // If the currentRef is defined (i.e., the element to be observed exists)
      resizeObserver.observe(currentRef);
      // Start observing the element for resize events
      setDimensions(getDimensions());
      // Set the initial dimensions state with the current dimensions of the observed element cuz we need this immediately
    }

    return () => {
      // Return a cleanup function to be called when the component is unmounted or dependencies change
      if (currentRef) {
        // If the currentRef is defined
        resizeObserver.unobserve(currentRef);
        // Stop observing the element for resize events
      }
      resizeObserver.disconnect();
      // Disconnect the ResizeObserver instance to clean up resources
    };
  }, [containerRef]);
  // The effect depends on containerRef, so it will re-run if containerRef changes

  return dimensions;
  // Return the current dimensions state
}
