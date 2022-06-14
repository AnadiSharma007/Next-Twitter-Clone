import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon, XIcon } from "@heroicons/react/outline";
import { useEffect, useRef, useState } from "react";
import { db, storage } from "../firebase";
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
} from "@firebase/firestore";

import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSession } from "next-auth/react";

const Input = () => {

    const { data: session } = useSession();

    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const filePickerRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, 'posts'), {
            id: session.user.uid,
            username: session.user.name,
            userImg: session.user.image,
            tag: session.user.tag,
            text: input,
            timestamp: serverTimestamp(),
        })

        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url")
                .then(async () => {
                    const downloadUrl = await getDownloadURL(imageRef);
                    await updateDoc(doc(db, "posts", docRef.id), {
                        image: downloadUrl,
                    })
                })
        }

        setLoading(false);
        setInput("");
        setSelectedFile(null);


    }

    const addImageTOPost = (e) => {

        const reader = new FileReader(); // Java Script Read Function
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result)
        };

    };



    return (
        <div className={`border-b p-3 border-gray-700 flex space-x-3 overflow-y-scroll ${loading && "opacity-60"}`}>
            <img src={session.user.image} alt="" className='h-11 w-11 rounded-full cursor-pointer' />
            <div className="w-full divide-y divide-gray-700">
                <div className={`${selectedFile && 'pb-7'} ${input && "space-y-2.5"}`}>
                    <textarea
                        value={input}
                        onChange={(e) => { setInput(e.target.value) }}
                        rows="2"
                        placeholder="What's happening"
                        className="bg-transparent outline-none text-[#d9d9d9]
                text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"/>
                    {selectedFile && (
                        <div className="relative ">
                            <div className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] flex bg-opacity-75 rounded-full items-center justify-center top-1 left-1 cursor-pointer" onClick={() => setSelectedFile(null)}>
                                <XIcon
                                    className="text-white h-5" />
                            </div>
                            <img src={selectedFile} alt="" className="rounded-2xl max-h-80 object-contain " />
                        </div>
                    )}

                </div>

                {!loading && (
                    <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center">
                            <div className="icon" onClick={() => filePickerRef.current.click()}>
                                <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                                <input type="file" onChange={addImageTOPost} ref={filePickerRef} hidden />
                            </div>
                            <div className="icon rotate-90">
                                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>

                            <div className="icon" >
                                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>

                            <div className="icon">
                                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>
                        </div>
                        <button className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default" disabled={
                            !input.trim()
                        }
                            onClick={sendPost}
                        >
                            Tweet</button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Input