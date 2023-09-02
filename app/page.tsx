"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import './globals.css'
import ActivityList from "@/components/Home/ActivityList";
import Search from "@/components/Home/Search";
import Hero from "@/components/Home/Hero";
import { getFirestore, doc, setDoc, getDoc, 
  collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import app from '../shared/FirebaseConfig'
import { useEffect, useState } from "react";
import Posts from "@/components/Home/Posts";
import { Props } from "@/components/model";

export default function Home() {
  const db=getFirestore(app);
  const [posts,setPosts]=useState<DocumentData[]>([])
  useEffect(()=>{
    getPost();
  },[])

  const getPost=async()=>{
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
    
   setPosts(posts=>[...posts,doc.data()]);
});
  }

  const onGamePress=async(gameName: string)=>{
    setPosts([]);
    if(gameName=='Other Games')
    {
      getPost();
      return ;
    }
    const q=query(collection(db,"posts"),
    where("game","==",gameName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data=doc.data();
      data.id=doc.id
      setPosts(posts=>[...posts,doc.data()]);
   
});
  }
    
  return (
    <main className="overflow-hidden px-5 sm:px-7 md:px-10">
    <Hero />
    <Search />
    <ActivityList />
    {posts.length === 0 ? (
      <p>Loading...</p>
    ) : posts.length > 0 ? (
      <Posts posts={posts} />
    ) : (
      <p>No posts found.</p>
    )}
    <Footer />
  </main>
  )
}