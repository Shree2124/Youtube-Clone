import React, { useEffect, useState } from "react";
import ProfileLayout from "../Layouts/ProfileLayout";
import SubscribeCard from "./SubscribeCard";
import axios from "../../api/axios";

const Subs = ({ darkMode }) => {
  const [subs, setSubs] = useState([])
    const fetchSubs = async()=>{
        try {
            const res = await axios.get(`/users/get-sub-channels`)
            console.log(res.data);

            setSubs(res.data.data)
            
        } catch (error) {
            
        }
    }

    useEffect(()=>{
      fetchSubs()
    },[])

  return (
  <ProfileLayout darkMode={darkMode}>

    {
      subs?.length > 0 && 
      subs?.map((s)=>
        (<SubscribeCard channelImage={s?.avatar} subscribers={s?.subscribers} channelName={s?.name} />)
      )
    }
  </ProfileLayout>
  );
};

export default Subs;
