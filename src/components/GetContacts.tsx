import {firebaseService} from "@/firebase/Firebase";
import {Contact} from "@/firebase/types";
import useSWR from 'swr';

async function GetContacts() {
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR('/api/contacts', fetcher);

    if (error) return <div>Failed to load</div>;
    if (!data) return <div>Loading...</div>;

    const contacts = await firebaseService.getContacts();
    return (
        <div>
            <h1 className={"title is-1"}>Contacts</h1>
              <ul>\
                  {contacts.map((contact: Contact) => (
                      <li key={contact.id}>
                          <h2>{contact.name}</h2>
                          <p>{contact.number}</p>
                          <p>{contact.site}</p>
                          <p>{contact.department}</p>
                      </li>
                 ))}
              </ul>
        </div>
    );
}

export default GetContacts;