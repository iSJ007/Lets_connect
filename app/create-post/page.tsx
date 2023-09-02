"use client"
import Form from '@/components/CreatePost/Form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'


function CreatePost() {
  const {data:session}=useSession();
  const router=useRouter();
  useEffect(()=>{
    if(!session)
    {
        router.push('/')
    }
  },[]);
  
  return (
    <div className='flex justify-center'>
    <div className='p-6 mt-8 lg:w-[35%] md:w-[50%]'>
        <h2 className='text-[30px] 
        font-extrabold text-blue-500'>CREATE POST</h2>
        <p>Create Post and Discover/Invite new people to your events </p>
       <Form/>
    </div>
    
    </div>
  )
}

export default CreatePost