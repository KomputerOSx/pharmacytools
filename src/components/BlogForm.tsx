import React, { useState } from 'react';
import { firebaseService } from '@/Firebase';

const BlogForm = ({ onBlogCreated }: { onBlogCreated?: () => void }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await firebaseService.addBlog({
                title,
                content
            });

            // Clear form
            setTitle('');
            setContent('');

            // Notify parent component if callback provided
            if (onBlogCreated) {
                onBlogCreated();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create blog');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="box">
            <h2 className="title is-4">Create New Blog</h2>

            {error && (
                <div className="notification is-danger">
                    <button className="delete" onClick={() => setError(null)}></button>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Enter blog title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Content</label>
                    <div className="control">
                        <textarea
                            className="textarea"
                            placeholder="Enter blog content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <div className="control">
                        <button
                            className={`button is-primary ${isSubmitting ? 'is-loading' : ''}`}
                            type="submit"
                            disabled={isSubmitting}
                        >
                            Create Blog
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogForm;