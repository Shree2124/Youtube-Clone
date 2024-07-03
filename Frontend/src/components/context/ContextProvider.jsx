import React,{useState} from 'react'
import MobileContext from './MobileContext.js'


const MobileContextProvider=({children})=> {
    const [isMobile, setIsMobile] = useState(false);
    const handleClose = () => {
        setIsMobile(false);
      };
  return(
    <MobileContext.Provider value={{isMobile,setIsMobile,handleClose}}>
        {children}
    </MobileContext.Provider>
  )
}

export default MobileContextProvider
