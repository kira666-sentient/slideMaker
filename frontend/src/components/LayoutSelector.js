import React from 'react';

const LayoutSelector = ({ onLayoutChange, currentLayout, layouts, loading }) => {
    // Show loading state while fetching layouts
    if (loading) {
        return (
            <div className="layout-selector">
                <h2>Select Slide Layout</h2>
                <div className="loading-message">🔄 Loading layouts from your presentation...</div>
            </div>
        );
    }

    // If no layouts fetched yet, show instruction
    if (!layouts || layouts.length === 0) {
        return (
            <div className="layout-selector">
                <h2>Select Slide Layout</h2>
                <div className="info-message">📄 Please upload a PowerPoint file first to see available layouts</div>
            </div>
        );
    }

    return (
        <div className="layout-selector">
            <h2>Select Slide Layout ({layouts.length} available)</h2>
            <select 
                onChange={(e) => onLayoutChange(e.target.value)} 
                value={currentLayout}
            >
                <option value="">-- Select a layout --</option>
                {layouts.map((layout) => (
                    <option key={layout.index} value={layout.name}>
                        {layout.name}
                    </option>
                ))}
            </select>
            {currentLayout && (
                <small className="form-hint">
                    ✓ Selected: {currentLayout}
                </small>
            )}
        </div>
    );
};

export default LayoutSelector;
