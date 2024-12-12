
//What is Debounce in React?
// "debounce" refers to a technique used to limit the rate at which a function is executed. It ensures that
// a function is not called too frequently, which can be useful in scenarios where an event may be triggered
// multiple times in quick succession.


//below is the code for the useDebounce hook
//The useDebounce hook is used to debounce a value in a React component. 
//It takes a value and a delay as arguments and returns a debounced value that is updated after the specified delay. 
//This can be useful for handling user input in a form or other scenarios where you want to delay the execution of a function until the user has stopped typing.
import { useState, useEffect } from "react";


//value is willdata
export default function useDebounce<T>(value: T, delay: number = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
