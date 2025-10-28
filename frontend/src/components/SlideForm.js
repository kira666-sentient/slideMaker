import React, { useState, useEffect, useRef } from 'react';

const SlideForm = ({ layout, onSlideAdded, onFileUploaded, initialFile, slideCount }) => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(initialFile);
    const [position, setPosition] = useState(slideCount);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [warnings, setWarnings] = useState([]);
    
    // Abort controller for canceling requests
    const abortControllerRef = useRef(null);
    
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Cancel any pending requests
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Update position when slideCount changes
    useEffect(() => {
        setPosition(slideCount);
    }, [slideCount]);

    // Update file when initialFile changes
    useEffect(() => {
        if (initialFile) {
            setFile(initialFile);
        }
    }, [initialFile]);
    
    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Notify parent to fetch layouts
            if (onFileUploaded) {
                onFileUploaded(selectedFile);
            }
        }
    };

    // Content validation for overflow warnings
    const validateContent = () => {
        const newWarnings = [];
        const MAX_TITLE_LENGTH = 100;
        const MAX_TEXT_LENGTH = 500;
        const MAX_TEXT_LINES = 15;
        const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
        const MIN_IMAGE_SIZE = 1024; // 1KB minimum

        if (title && title.length > MAX_TITLE_LENGTH) {
            newWarnings.push(`⚠️ Title is too long (${title.length} chars). May exceed slide width. Recommended: ${MAX_TITLE_LENGTH} chars or less.`);
        }
        
        if (title && title.trim().length === 0) {
            newWarnings.push(`⚠️ Title contains only whitespace.`);
        }

        if (text && text.length > MAX_TEXT_LENGTH) {
            newWarnings.push(`⚠️ Content is very long (${text.length} chars). May exceed slide height. Recommended: ${MAX_TEXT_LENGTH} chars or less.`);
        }
        
        if (text && text.trim().length === 0) {
            newWarnings.push(`⚠️ Content contains only whitespace.`);
        }

        if (text && text.split('\n').length > MAX_TEXT_LINES) {
            newWarnings.push(`⚠️ Too many lines (${text.split('\n').length}). May exceed slide height. Recommended: ${MAX_TEXT_LINES} lines or less.`);
        }

        if (image) {
            if (image.size > MAX_IMAGE_SIZE) {
                newWarnings.push(`⚠️ Image size is large (${(image.size / 1024 / 1024).toFixed(2)}MB). May take time to process. Recommended: 5MB or less.`);
            }
            
            if (image.size < MIN_IMAGE_SIZE) {
                newWarnings.push(`⚠️ Image size is very small (${image.size} bytes). May be corrupted or invalid.`);
            }
            
            // Validate image type
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/bmp'];
            if (!validTypes.includes(image.type)) {
                newWarnings.push(`⚠️ Image type "${image.type}" may not be supported. Use PNG, JPEG, GIF, or BMP.`);
            }
        }
        
        // Validate position range
        const posNum = parseInt(position);
        if (!isNaN(posNum) && posNum > slideCount + 100) {
            newWarnings.push(`⚠️ Position ${posNum} is very high. Current presentation has ~${slideCount} slides.`);
        }

        setWarnings(newWarnings);
        return newWarnings.length === 0;
    };

    // Validate on content change
    useEffect(() => {
        if (title || text || image) {
            validateContent();
        }
    }, [title, text, image]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent double submission
        if (loading) {
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccess('');

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        try {
            // Validate file exists
            if (!file) {
                setError('Please select a PowerPoint file');
                setLoading(false);
                return;
            }
            
            // Validate layout is selected
            if (!layout) {
                setError('Please select a slide layout');
                setLoading(false);
                return;
            }
            
            // Validate content based on layout requirements
            if (!text.trim()) {
                setError('Content is required');
                setLoading(false);
                return;
            }
            
            // Validate position
            const positionNum = parseInt(position);
            if (isNaN(positionNum) || positionNum < 0) {
                setError('Position must be a non-negative number');
                setLoading(false);
                return;
            }
            
            const formData = new FormData();
            formData.append('file', file);
            formData.append('layout', layout); // Now using actual layout name from file
            formData.append('title', title.trim());
            formData.append('text', text.trim());
            if (image) {
                formData.append('image', image);
            }
            formData.append('position', positionNum);

            const response = await fetch('http://localhost:5000/api/add-slide', {
                method: 'POST',
                body: formData,
                signal: abortControllerRef.current.signal,
            });

            if (response.ok) {
                const blob = await response.blob();
                
                // Validate blob size
                if (blob.size === 0) {
                    setError('Received empty file from server. Please try again.');
                    setLoading(false);
                    return;
                }
                
                // Extract filename from Content-Disposition header
                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = file.name; // Default to original filename
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="?([^"]+)"?/);
                    if (match && match[1]) {
                        filename = match[1];
                    }
                }

                // Notify parent component with the updated file and filename
                if (onSlideAdded) {
                    const updatedFile = new File([blob], filename, { type: blob.type });
                    onSlideAdded(updatedFile, filename);
                }
                
                setSuccess('Slide added successfully! You can add more slides or download the presentation.');
                // Reset form fields but keep the file
                setTitle('');
                setText('');
                setImage(null);
                setWarnings([]);
                
                // Clear image input
                const imageInput = document.querySelector('input[type="file"][accept="image/*"]');
                if (imageInput) {
                    imageInput.value = '';
                }
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
                setError(errorData.error || 'Failed to add slide. Please try again.');
            }
        } catch (err) {
            // Check if error is due to abort
            if (err.name === 'AbortError') {
                setError('Request was cancelled');
            } else if (err.message.includes('fetch')) {
                setError('Cannot connect to the server. Please ensure the backend is running on port 5000.');
            } else {
                setError(`Error: ${err.message}`);
            }
            console.error('Error:', err);
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="slide-form">
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {warnings.length > 0 && (
                <div className="alert alert-warning">
                    {warnings.map((warning, idx) => (
                        <div key={idx}>{warning}</div>
                    ))}
                </div>
            )}
            
            <div className="form-group">
                <label>Upload PowerPoint File:</label>
                <input 
                    type="file" 
                    accept=".pptx"
                    onChange={handleFileChange}
                    required
                    disabled={loading || initialFile !== null}
                />
                {initialFile && <small className="form-hint">📄 Using: {initialFile.name}</small>}
            </div>
            <div className="form-group">
                <label>Slide Position:</label>
                <input 
                    type="number" 
                    value={position} 
                    onChange={(e) => setPosition(e.target.value)} 
                    min="0"
                    placeholder="0 = start, leave for end"
                    disabled={loading}
                />
                <small className="form-hint">
                    💡 Enter position: 0 = beginning, 1 = after first slide, etc. Leave as {slideCount} to add at end.
                </small>
            </div>
            <div className="form-group">
                <label>Title (optional):</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter slide title"
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label>Content:</label>
                <textarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="Enter slide content"
                    required
                    disabled={loading}
                />
            </div>
            <div className="form-group">
                <label>Image (optional):</label>
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])} 
                    disabled={loading}
                />
            </div>
            <button type="submit" disabled={loading || !layout}>
                {loading ? 'Processing...' : 'Add Slide'}
            </button>
        </form>
    );
};

export default SlideForm;
