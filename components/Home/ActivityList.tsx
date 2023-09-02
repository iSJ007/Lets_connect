"use client"
import React, { useEffect, useState } from 'react'

import Data from './../../shared/Data'
const ActivityList = () => {
  const [activitys, setActivitys] = useState(Data.ActivityList);
  useEffect(()=>{
    setActivitys(Data.ActivityList) 
 },[])
  return (
    <div className='grid grid-cols-3 sm:grid-cols-4
    md:grid-cols-5 lg:grid-cols-7 mt-4'>

      {activitys.map((item) => (
               <div key={item.id}
              
             className='flex flex-col 
             items-center cursor-pointer
             '>
                 <img src={item.image} 
                 width={40} height={20} 
                 className='hover:animate-bounce transition-all 
                 duration-150'/>
                 <h2 className='text-[14px] text-center'>{item.name}</h2>
             </div>

      )


      )}


    </div>
  )
}

export default ActivityList