import React from 'react'
import ProfileLayout from '../components/Layouts/ProfileLayout'

const Profile = ({darkMode}) => {
  console.log(darkMode);
  
  return (
    <div className='min-h-screen'>
      <ProfileLayout darkMode={darkMode} />
    </div>
  )
}

export default Profile
