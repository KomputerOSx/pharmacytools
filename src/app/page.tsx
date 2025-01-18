/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    getFirestore,
    collection,
    getDocs
} from "firebase/firestore";
import {getFirebase} from "@/Firebase";
import {useEffect, useState} from "react";
import BulmaLoading from "@/components/Loading";

interface Blog {
    id: string;
    title: string;
    content: string;
}

// async function getBlogs() {
//     const app = getFirebase();
//     const db = getFirestore(app);
//     const colRef = collection(db, "blogs");
//     const snapshot = await getDocs(colRef);
//     const blogs: Blog[] = [];
//
//     snapshot.forEach((doc) => {
//         const data = doc.data();
//         const blog: Blog = {
//             id: doc.id,
//             title: data.title,
//             content: data.content,
//         };
//         blogs.push(blog);
//     });
//     return blogs;
// }



function App() {
    // Initialize Firestore with more options
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const app = getFirebase();
                const db = getFirestore(app);
                const colRef = collection(db, "blogs");
                const snapshot = await getDocs(colRef);
                const fetchedBlogs: Blog[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    title: doc.data().title,
                    content: doc.data().content,
                }))

                    setBlogs(fetchedBlogs)
                } catch (error: any) {
                    setError(error.message);
                } finally {
                    setIsLoading(false);
                }
        }

        fetchBlogs().then((r => r));
    }, []);

    if (isLoading) return <BulmaLoading/>
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className={"title is-1"}>Home</h1>
            {blogs.map((blog: Blog) => (
                <div className={"card"} key={blog.id}>
                    <h2 className={"title is-3"}>{blog.title}</h2>
                    <p>{blog.content}</p>
                </div>
            ))}
        </div>
    );
}

export default App

