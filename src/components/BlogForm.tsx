import React, { useState } from 'react';
import { firebaseService } from '@/firebase/Firebase';

const ContactForm = ({ onContactCreated }: { onContactCreated?: () => void }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [site, setSite] = useState('');
    const [department, setDepartment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await firebaseService.addContact({
                name,
                number,
                site,
                department
            });

            // Clear form
            setName('');
            setNumber('');
            setSite('');
            setDepartment('');

            // Notify parent component if callback provided
            if (onContactCreated) {
                onContactCreated();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create Contact');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="box">
            <h2 className="title is-4">Create New Contact</h2>

            {error && (
                <div className="notification is-danger">
                    <button className="delete" onClick={() => setError(null)}></button>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Number</label>
                    <div className="control">
                        <input
                            type="text"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Site</label>
                    <div className="control">
                        <input
                            type="text"
                            value={site}
                            onChange={(e) => setSite(e.target.value)}
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Department</label>
                    <div className="control">
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ContactForm;