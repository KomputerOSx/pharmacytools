// "use client";
//
// import { useEffect, useState } from "react";
// import { Contact } from "@/firebase/types";
// import { firebaseService } from "@/firebase/Firebase";
// import BulmaLoading from "@/components/Loading";
// import BlogForm from "@/components/BlogForm";
//
//
// function App() {
//     // Initialize Firestore with more options
//     const [blogs, setBlogs] = useState<Contact[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//
//
//
//     useEffect(() => {
//         async function fetchBlogs() {
//             try {
//                 const fetchedBlogs = await firebaseService.getContacts();
//                 setBlogs(fetchedBlogs);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : 'An error occurred');
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchBlogs();
//     }, []);
//
//     if (isLoading) return <BulmaLoading/>
//     if (error) return <div>Error: {error}</div>;
//
//     return (
//         <form onSubmit={handleSubmit}>
//             <div className="field">
//                 <label className="label">Name</label>
//                 <div className="control">
//                     <input
//                         type="text"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                     />
//                 </div>
//             </div>
//             <div className="field">
//                 <label className="label">Number</label>
//                 <div className="control">
//                     <input
//                         type="text"
//                         value={number}
//                         onChange={(e) => setNumber(e.target.value)}
//                     />
//                 </div>
//             </div>
//             <div className="field">
//                 <label className="label">Site</label>
//                 <div className="control">
//                     <input
//                         type="text"
//                         value={site}
//                         onChange={(e) => setSite(e.target.value)}
//                     />
//                 </div>
//             </div>
//             <div className="field">
//                 <label className="label">Department</label>
//                 <div className="control">
//                     <input
//                         type="text"
//                         value={department}
//                         onChange={(e) => setDepartment(e.target.value)}
//                     />
//                 </div>
//             </div>
//         </form>
//     );
// }
//
// export default App;
