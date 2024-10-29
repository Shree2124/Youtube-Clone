import React,{useState} from 'react'
import MobileContext from './MobileContext.js'


const MobileContextProvider=({children})=> {
    const [isMobile, setIsMobile] = useState(false);
    console.log(isMobile);
    
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
