# SlideMaker Architecture Documentation

## Overview

SlideMaker is a full-stack web application that allows users to dynamically add custom slides to PowerPoint presentations while preserving themes, layouts, and formatting.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │SlideCreator │──│LayoutSelector│  │  SlideForm   │       │
│  │ (Container) │  │  (Dropdown)  │  │   (Form)     │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            │
                    HTTP/JSON (CORS)
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Flask API)                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/get-layouts    (POST)                         │   │
│  │  → Reads PPTX layouts                               │   │
│  │  → Returns layout names and indices                 │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/add-slide      (POST)                         │   │
│  │  → Adds slide with exact layout match               │   │
│  │  → Sets content using placeholders                  │   │
│  │  → Positions slide at requested index               │   │
│  │  → Returns modified PPTX file                       │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/health         (GET)                          │   │
│  │  → Health check endpoint                            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    python-pptx Library
                            │
┌─────────────────────────────────────────────────────────────┐
│                   PowerPoint Files (.pptx)                   │
│  • Preserves slide masters                                  │
│  • Maintains themes and formatting                          │
│  • Keeps headers, footers, logos                            │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. File Upload & Layout Discovery

```
User uploads PPTX
    ↓
Frontend → POST /api/get-layouts (with file)
    ↓
Backend reads presentation.slide_masters[0].slide_layouts
    ↓
Returns: [{index: 0, name: "Title Slide"}, {index: 1, name: "Title and Content"}, ...]
    ↓
Frontend populates dropdown with ACTUAL layout names
    ↓
User selects their desired layout by name
```

### 2. Slide Creation

```
User fills form (title, content, image, position)
    ↓
Frontend → POST /api/add-slide (with file, layout name, content)
    ↓
Backend:
  1. find_layout_by_name(layout_name) → Exact match
  2. prs.slides.add_slide(layout)
  3. Set title in title placeholder
  4. Set content in body/object placeholder (or textbox fallback)
  5. Add image to picture placeholder (or as shape)
  6. Reposition slide using XML manipulation (_sldIdLst)
  7. Save to BytesIO
    ↓
Returns: Modified PPTX file as blob
    ↓
Frontend:
  - Updates currentFile state
  - Increments slide count
  - Enables download button
```

## Key Design Decisions

### ✅ Dynamic Layout Detection (Critical Fix)

**Problem:** Hardcoded English layout names failed for international users and custom templates.

**Solution:** 
- Frontend fetches actual layout names from uploaded file
- User selects from their presentation's real layouts
- Backend uses exact name match
- Fallback to partial match if exact fails
- Ultimate fallback to first layout with content placeholders

**Benefits:**
- Works with any language (Spanish, French, German, etc.)
- Works with custom corporate templates
- No guessing or hardcoded assumptions
- User sees exactly what they're selecting

### ✅ Session Management

**Design:** Multi-slide workflow before download

**Implementation:**
- `currentFile` state persists modified presentation
- Each "Add Slide" operation works on current file
- `slideCount` tracks number of slides added
- Separate download button for final export
- Reset button clears session with confirmation

**Benefits:**
- Add multiple slides without re-uploading
- Preview slide count before download
- Batch operations are efficient

### ✅ Content Flexibility

**Design:** All fields optional except content

**Implementation:**
- Title: Optional (not all layouts need it)
- Content: Required (main purpose)
- Image: Optional (only if needed)
- Any layout can accept any combination

**Benefits:**
- Works with any slide layout type
- User not forced to fill unnecessary fields
- Flexible for different use cases

### ⚠️ Slide Positioning (Private API)

**Current:** Uses `prs.slides._sldIdLst` (undocumented)

**Risk:** Future python-pptx versions may break this

**Mitigation:**
- Wrapped in try/except with AttributeError handling
- Graceful degradation (slide added at end if positioning fails)
- Detailed error logging
- Does not crash entire operation

**Alternative:** Could accept slides only at end, but positioning is a valuable feature

## Security Considerations

### File Validation
- ✅ File extension checking (.pptx only)
- ✅ File size limits (50MB PowerPoint, 10MB images)
- ✅ Image format validation (PNG, JPG, GIF, BMP)
- ✅ MIME type validation for images
- ✅ Content length validation

### Input Sanitization
- ✅ Whitespace trimming
- ✅ Type validation (position must be integer)
- ✅ Range validation (position bounds)
- ✅ Empty content detection

### Error Handling
- ✅ Try/catch blocks for all file operations
- ✅ Specific error messages (no sensitive info leaks)
- ✅ Detailed server-side logging
- ✅ Client-side validation before submission

### CORS
- ⚠️ Currently allows all origins (development)
- 🔒 **TODO:** Restrict CORS origins in production

## Performance Optimizations

### Frontend
- ✅ Abort controller for cancelling requests
- ✅ Loading states prevent double submission
- ✅ Memory leak prevention (URL revocation)
- ✅ Validation happens client-side first

### Backend
- ✅ Streaming file handling (BytesIO)
- ✅ No temporary files on disk
- ✅ Efficient XML manipulation
- ✅ Early validation (fail fast)

### Scalability Considerations
- ⚠️ Single-threaded Flask development server
- ⚠️ No caching of layouts
- 🔒 **TODO:** Use production WSGI server (Gunicorn/uWSGI)
- 🔒 **TODO:** Add rate limiting
- 🔒 **TODO:** Implement request timeout

## Error Recovery

### Frontend
- Request timeout with abort signal
- Retry logic for network errors
- Clear error messages to user
- State cleanup after errors
- Confirmation dialogs prevent data loss

### Backend
- Graceful degradation for missing features
- Fallback mechanisms (textbox if no placeholder)
- Detailed logging for debugging
- Specific exception handling
- Does not expose stack traces to client

## Testing Strategy

### Manual Testing Checklist
- [ ] Upload various PPTX templates (English, Spanish, French)
- [ ] Test with corporate templates
- [ ] Test all layout types
- [ ] Verify theme preservation
- [ ] Test slide positioning (beginning, middle, end)
- [ ] Test multi-slide workflow
- [ ] Test with large files (near limits)
- [ ] Test with invalid files
- [ ] Test with corrupted PPTX
- [ ] Test image upload (all formats)
- [ ] Test network disconnection
- [ ] Test browser refresh during operation

### Automated Testing (TODO)
- Unit tests for layout finding logic
- Integration tests for API endpoints
- End-to-end tests for user workflows
- Load testing for large presentations
- Security testing for file uploads

## Known Limitations

1. **Slide Positioning:** Uses private API (may break in future)
2. **Single Slide Master:** Only uses first slide master (prs.slide_masters[0])
3. **No Undo:** Operations cannot be reversed without re-uploading
4. **No Preview:** User cannot preview slide before adding
5. **Session Only:** No server-side persistence (lost on page refresh)
6. **Development Server:** Flask dev server not suitable for production

## Future Enhancements

### High Priority
- [ ] Add slide preview before adding
- [ ] Support multiple slide masters
- [ ] Implement undo/redo functionality
- [ ] Add drag-and-drop file upload
- [ ] Improve error messages with suggested fixes

### Medium Priority
- [ ] Add slide template library
- [ ] Support bulk slide creation (CSV import)
- [ ] Add slide reordering after creation
- [ ] Implement user authentication
- [ ] Add presentation analytics

### Low Priority
- [ ] Add custom themes
- [ ] Support animations and transitions
- [ ] Add collaboration features
- [ ] Export to PDF
- [ ] Mobile app version

## Deployment

### Development
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm start
```

### Production (Recommended)
```bash
# Backend with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Frontend build
npm run build
# Serve build/ folder with Nginx or similar
```

### Environment Variables
```bash
# Backend
FLASK_ENV=production
FLASK_DEBUG=0
MAX_FILE_SIZE=52428800  # 50MB
MAX_IMAGE_SIZE=10485760  # 10MB

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

## Dependencies

### Frontend
- React 19.2.0
- Modern browser with ES6+ support
- Fetch API support

### Backend
- Python 3.7+
- Flask 3.0.0
- flask-cors 4.0.0
- python-pptx 0.6.23
- Werkzeug 3.0.1

## Maintenance

### Regular Tasks
- Monitor error logs
- Check disk space usage
- Update dependencies (security patches)
- Review and update file size limits
- Clean up temporary files (if any)

### Monitoring
- Backend health check: `GET /api/health`
- Expected response: `{"status": "healthy"}`
- Monitor response times
- Track error rates

## Support

For issues, questions, or feature requests:
1. Check `TROUBLESHOOTING.md`
2. Review `FIXES_APPLIED.md` for known issues
3. Check backend terminal logs
4. Check browser console (F12)
5. Verify both servers are running
