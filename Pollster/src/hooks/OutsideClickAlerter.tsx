import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

function useOutsideClickAlerter(ref, handleClick) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {        
        if (ref.current && !ref.current.contains(event.target)) {
          handleClick();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  
  /**
   * Component that alerts if you click outside of it
   */
  function OutsideClickAlerter({children, handleClick}) {
    const wrapperRef = useRef(null);
    useOutsideClickAlerter(wrapperRef, handleClick);
  
    return <div ref={wrapperRef}>{children}</div>;
  }
  
  OutsideClickAlerter.propTypes = {
    children: PropTypes.element.isRequired
  };
  
  export default OutsideClickAlerter;
  