import React, { useState, useEffect, useRef } from 'react';
import SlideForm from './SlideForm';
import LayoutSelector from './LayoutSelector';
import './SlideCreator.css';

const SlideCreator = () => {
    const [layout, setLayout] = useState('');
    const [currentFile, setCurrentFile] = useState(null);
    const [downloadFilename, setDownloadFilename] = useState('');
    const [slideCount, setSlideCount] = useState(0);
    const [showDownload, setShowDownload] = useState(false);
    const [backendStatus, setBackendStatus] = useState('checking'); // checking, online, offline
    const [availableLayouts, setAvailableLayouts] = useState([]);
    const [layoutsLoading, setLayoutsLoading] = useState(false);
    
    // Track object URLs for cleanup
    const objectURLsRef = useRef([]);
    
    // Check backend health on mount
    useEffect(() => {
        const checkBackend = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/health', {
                    method: 'GET',
                    signal: AbortSignal.timeout(5000), // 5 second timeout
                });
                
                if (response.ok) {
                    setBackendStatus('online');
                } else {
                    setBackendStatus('offline');
                }
            } catch (error) {
                console.error('Backend health check failed:', error);
                setBackendStatus('offline');
            }
        };
        
        checkBackend();
        
        // Re-check every 30 seconds
        const interval = setInterval(checkBackend, 30000);
        
        return () => clearInterval(interval);
    }, []);
    
    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            objectURLsRef.current.forEach(url => {
                try {
                    window.URL.revokeObjectURL(url);
                } catch (e) {
                    console.error('Error revoking URL:', e);
                }
            });
        };
    }, []);

    const handleSlideAdded = (updatedFile, filename) => {
        // Validate file
        if (!updatedFile || updatedFile.size === 0) {
            console.error('Invalid file received');
            return;
        }
        
        setCurrentFile(updatedFile);
        setDownloadFilename(filename);
        setSlideCount(prev => prev + 1);
        setShowDownload(true);
    };
    
    const handleFileUploaded = async (file) => {
        // When a new file is uploaded, fetch its layouts
        if (!file) return;
        
        setLayoutsLoading(true);
        setAvailableLayouts([]);
        setLayout(''); // Reset layout selection
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch('http://localhost:5000/api/get-layouts', {
                method: 'POST',
                body: formData,
            });
            
            if (response.ok) {
                const data = await response.json();
                setAvailableLayouts(data.layouts || []);
                
                // Auto-select first layout if available
                if (data.layouts && data.layouts.length > 0) {
                    setLayout(data.layouts[0].name);
                }
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Failed to load layouts' }));
                console.error('Failed to fetch layouts:', errorData.error);
                alert(`Could not load layouts from file: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error fetching layouts:', error);
            alert('Cannot connect to server to load layouts. Please ensure backend is running.');
        } finally {
            setLayoutsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!currentFile) {
            alert('No file available to download');
            return;
        }
        
        try {
            const url = window.URL.createObjectURL(currentFile);
            objectURLsRef.current.push(url);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = downloadFilename || `presentation_with_${slideCount}_slides.pptx`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                objectURLsRef.current = objectURLsRef.current.filter(u => u !== url);
            }, 100);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file. Please try again.');
        }
    };

    const handleReset = () => {
        // Confirm reset if slides have been added
        if (slideCount > 0) {
            const confirm = window.confirm(
                `You have ${slideCount} slide${slideCount !== 1 ? 's' : ''} added. Are you sure you want to start over?`
            );
            if (!confirm) return;
        }
        
        // Clean up object URLs
        objectURLsRef.current.forEach(url => {
            try {
                window.URL.revokeObjectURL(url);
            } catch (e) {
                console.error('Error revoking URL:', e);
            }
        });
        objectURLsRef.current = [];
        
        setCurrentFile(null);
        setSlideCount(0);
        setShowDownload(false);
        setAvailableLayouts([]);
        setLayout('');
    };

    return (
        <div className="slide-creator">
            {backendStatus === 'offline' && (
                <div className="alert alert-error">
                    ⚠️ Backend server is not responding. Please ensure the Flask server is running on port 5000.
                </div>
            )}
            
            {backendStatus === 'checking' && (
                <div className="alert alert-warning">
                    🔄 Checking backend connection...
                </div>
            )}
            
            <div className="session-info">
                {slideCount > 0 && (
                    <div className="slides-added">
                        ✅ <strong>{slideCount}</strong> slide{slideCount !== 1 ? 's' : ''} added
                    </div>
                )}
            </div>
            
            <LayoutSelector 
                onLayoutChange={setLayout} 
                currentLayout={layout}
                layouts={availableLayouts}
                loading={layoutsLoading}
            />
            <SlideForm 
                layout={layout} 
                onSlideAdded={handleSlideAdded}
                onFileUploaded={handleFileUploaded}
                initialFile={currentFile}
                slideCount={slideCount}
            />
            
            {showDownload && (
                <div className="download-section">
                    <button 
                        className="btn-download" 
                        onClick={handleDownload}
                    >
                        📥 Download Presentation ({slideCount} slide{slideCount !== 1 ? 's' : ''})
                    </button>
                    <button 
                        className="btn-reset" 
                        onClick={handleReset}
                    >
                        🔄 Start New Presentation
                    </button>
                </div>
            )}
        </div>
    );
};

export default SlideCreator;
