import React, { useEffect, useState } from "react";
import Data from "../../shared/Data";
import { useSession } from "next-auth/react";
import app from "./../../shared/FirebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage,ref, uploadBytes } from "firebase/storage";
import Toast from "../Home/Toast";
import { Props } from "../model";
function Form() {

  const[inputs, setInputs] = useState <Props>({title: "",
                                               desc: "",
                                               date: "",
                                               location: "",
                                               zip: "",
                                               game: "",
                                               image: "",
                                                });

  const [showToast, setShowToast] = useState(false);
  const [file, setFile] = useState();
  const [submit, setSubmit] = useState(false);
  const {data:session} = useSession();
  const db = getFirestore(app);
  const storage = getStorage(app);
  useEffect(() => {
    if (session) {
      setInputs((values) => ({ ...values, userName: session.user?.name }));
      setInputs((values) => ({ ...values, userImage: session.user?.image }));
      setInputs((values) => ({ ...values, email: session.user?.email }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
/*
  const handleSubmit = async(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    setShowToast(true);
    const storageRef = ref(storage, 'letsconnect/'+file?.name);
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      }).then(resp=>{
        getDownloadURL(storageRef).then(async(url)=>{
           console.log(url);
            
            setInputs((values)=>({...values,image:url}));  
                await setDoc(doc(db, "posts", Date.now().toString()), inputs);     
            setSubmit(true);

        }) 
      }) ;
    
  }
  */

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    setShowToast(true);
  
    // Ensure that 'file' is defined before proceeding
    if (!file) {
      console.error("No file selected");
      return;
    }
  
    // Create a reference to the file in Firebase Storage
    const storageRef = ref(storage, 'letsconnect/' + file.name);
  
    try {
      // Upload the file to Firebase Storage
      const uploadTask = uploadBytes(storageRef, file);
  
      // Wait for the upload to complete
      await uploadTask;
  
      // Get the download URL for the uploaded file
      const url = await getDownloadURL(storageRef);
      console.log("File uploaded and URL generated:", url);
  
      // Save the download URL to Firebase Firestore
      const postData = {
        ...inputs,
        image: url,
        // Add other fields you want to save
      };
  
      const docRef = doc(db, "posts", Date.now().toString());
      await setDoc(docRef, postData);
  
      setSubmit(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle the error gracefully (e.g., show an error message)
    }
  };
  return (
    <div className="mt-4">
    

    <form onSubmit={handleSubmit} >
      <input
        type="text"
        name="title"
        placeholder="Title"
        required
        onChange={handleChange}
        className="w-full mb-4 border-[1px] p-2 rounded-md"
      />
      <textarea
        name="desc"
        className="w-full mb-4 
      outline-blue-400 border-[1px] 
      p-2 rounded-md"
        required
        onChange={handleChange}
        placeholder="Write Description here"
      />

      <input
        type="date"
        name="date"
        required
        onChange={handleChange}
        className="w-full mb-4 border-[1px] p-2 rounded-md"
      />
      <input
        type="text"
        placeholder="Location"
        name="location"
        required
        onChange={handleChange}
        className="w-full mb-4 border-[1px] p-2 rounded-md"
      />
      <input
        type="text"
        placeholder="Zip"
        name="zip"
        required
        onChange={handleChange}
        className="w-full mb-4 border-[1px] p-2 rounded-md"
      />
      <select
        name="game"
        onChange={handleChange}
        required
        className="w-full mb-4 border-[1px] p-2 rounded-md"
      >
        <option >
          Select Game
        </option>
        {Data.ActivityList.map((item) => (
          <option key={item.id}>{item.name}</option>
        ))}
      </select>
      <input
          type="file"
          onChange={(e)=>setFile(e.target.files[0])}
          accept="image/gif, image/jpeg, image/png"
          className="mb-5 border-[1px] w-full"
        />
      <button
        type="submit"
        className="bg-blue-500 w-full p-1 
rounded-md text-white"
      >
        Submit
      </button>
    </form>
  </div>
  );
}

export default Form;