"use client";

import { useEffect, useState } from "react";
import { Blog } from "@/types";
import { firebaseService } from "@/Firebase";
import BulmaLoading from "@/components/Loading";
import BlogForm from "@/components/BlogForm";


function App() {
    // Initialize Firestore with more options
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const fetchedBlogs = await firebaseService.getBlogs();
                setBlogs(fetchedBlogs);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        }

        fetchBlogs();

    }, []);

    if (isLoading) return <BulmaLoading/>
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1 className="title is-1">Home</h1>
            <BlogForm/>
            {blogs.map((blog) => (
                <div className="blog-item box" key={blog.id}>
                    <h2 className="title is-3">{blog.title}</h2>
                    <p>{blog.content}</p>

                    <span><a href={`/blogs/${blog.id}`} className="button is-primary show-blog">Read more</a></span>

                    <span>
                        <button className="button is-danger deleteBlog"
                                onClick={() => firebaseService.deleteBlog(blog.id).then(() => {
                                    setBlogs(blogs.filter((b) => b.id !== blog.id));
                                })}>Delete
                        </button>
                    </span>
                    
                </div>
            ))}
        </div>
    );
}

export default App;
