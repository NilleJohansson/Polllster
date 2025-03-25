import { useState } from "react";
 
const useLocalStorage = (key, defaultValue) => {
    const [localStorageValue, setLocalStorageValue] = useState(() => {        
        try {
            const value = localStorage.getItem(key)
            // If value is already present in 
            // localStorage then return it
             
            // Else set default value in 
            // localStorage and then return it

            console.log("Stored value", value);
            
            if (value) {
                console.log("VALUE EXISTS");
                return JSON.parse(value)
            } else {
                console.log("DO WE EVER GO HERE?");
                localStorage.setItem(key, JSON.stringify(defaultValue));
                return defaultValue
            }
        } catch (error) {
            localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue
        }
    })
 
    // this method updates our localStorage and our state
    const setLocalStorageStateValue = (valueOrFn) => {
        console.log("Set local storage", valueOrFn);
        
        let newValue;
        if (typeof valueOrFn === 'function') {
            const fn = valueOrFn;
            newValue = fn(localStorageValue)
        }
        else {
            newValue = valueOrFn;
        }
        localStorage.setItem(key, JSON.stringify(newValue));
        setLocalStorageValue(newValue)
    }
    return [localStorageValue, setLocalStorageStateValue]
}
 
export default useLocalStorage;