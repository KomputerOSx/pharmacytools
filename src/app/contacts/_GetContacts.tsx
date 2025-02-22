//
//
// import { firebaseService } from "@/firebase/Firebase";
// import { Contact } from "@/firebase/types";
// import "./contactsGrid.css";
// import { useEffect, useState } from "react";
// import Loading from "@/components/Loading";
// import contactJSON from "./contacts.json";
//
// interface GetContactsProps {
//     search: string;
// }
//
// function GetContacts({ search }: GetContactsProps) {
//     //@ts-expect-error // Contacts saved as JSON, to save on Firestore bandwidth
//     const [contacts, setContacts] = useState<Contact[]>(contactJSON);
//     const [loading, setLoading] = useState<boolean>(true);
//
//     // useEffect(() => {
//     //     setLoading(true);
//     //     firebaseService.getContacts(search).then((contacts) => {
//     //         setContacts(contacts);
//     //         setLoading(false);
//     //     });
//     // }, []);
//
//     const filteredContacts = contacts.filter((contact) =>
//         // @ts-expect-error // search is a string
//         contact.name.toLowerCase().includes(String(search).toLowerCase()),
//     );
//
//     // if (loading) {
//     //     return <Loading />;
//     // }
//
//     return (
//         <div className="contact-grid">
//             {filteredContacts.map((contact: Contact, index) => (
//                 <div className="contact-card" key={index}>
//                     <div className="contact-info">
//                         <h2 className="contact-name">{contact.name}</h2>
//                         <p className="contact-number">{contact.number}</p>
//                         <div className="contact-details">
//                             <span className="contact-site">{contact.site}</span>
//                             <span className="contact-department">
//                                 {contact.department}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// }
//
// export default GetContacts;
