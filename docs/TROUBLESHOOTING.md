# SlideMaker - Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### 1. "Import 'flask' could not be resolved"
**Cause**: Python dependencies not installed  
**Solution**:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

#### 2. "Port 5000 already in use"
**Cause**: Another application is using port 5000  
**Solution**:
- Find and stop the process using port 5000
- Or modify `app.py` to use a different port:
  ```python
  app.run(debug=True, host='0.0.0.0', port=5001)
  ```
  And update frontend fetch URL to `http://localhost:5001`

#### 3. "Cannot connect to the server"
**Cause**: Backend server is not running  
**Solution**:
- Make sure you've started the backend server
- Check if it's running on http://localhost:5000
- Visit http://localhost:5000/api/health to verify

### Frontend Issues

#### 4. "npm: command not found"
**Cause**: Node.js is not installed  
**Solution**:
- Download and install Node.js from https://nodejs.org/
- Restart your terminal after installation

#### 5. "Port 3000 already in use"
**Cause**: Another React app is running  
**Solution**:
- Stop the other app or
- When prompted, type 'Y' to run on a different port

#### 6. Frontend shows but buttons don't work
**Cause**: Backend not running or CORS issue  
**Solution**:
- Ensure backend is running on port 5000
- Check browser console for errors (F12)
- Verify CORS is properly configured in backend

### Upload Issues

#### 7. "No file selected" error
**Cause**: Trying to submit without selecting a file  
**Solution**:
- Make sure to select a .pptx file before submitting
- Only PowerPoint files (.pptx) are accepted

#### 8. "Invalid PowerPoint file"
**Cause**: File is corrupted or not a valid .pptx  
**Solution**:
- Try opening the file in PowerPoint first to verify it works
- Make sure it's saved as .pptx (not .ppt)
- Try with a different PowerPoint file

#### 9. Image not appearing in slide
**Cause**: Image file too large or invalid format  
**Solution**:
- Use common image formats (JPG, PNG)
- Compress large images before uploading
- Check browser console for errors

### General Issues

#### 10. Blank screen or white page
**Cause**: JavaScript errors  
**Solution**:
- Open browser console (F12)
- Look for error messages
- Clear browser cache (Ctrl+Shift+Delete)
- Restart both servers

#### 11. Download doesn't start
**Cause**: Browser blocking download or backend error  
**Solution**:
- Check if browser blocked the popup/download
- Look for browser notification about blocked downloads
- Allow downloads from localhost in browser settings
- Check backend terminal for error messages

#### 12. Styles look broken
**Cause**: CSS not loading properly  
**Solution**:
- Hard refresh the page (Ctrl+Shift+R)
- Clear browser cache
- Restart the frontend server

## Performance Tips

1. **Large Files**: For large PowerPoint files (>50MB), processing may take longer
2. **Images**: Compress images before uploading for faster processing
3. **Multiple Slides**: Add slides one at a time for best results

## Development Tips

### Backend Development
- Set `debug=True` in app.py for auto-reload on changes
- Check terminal output for detailed error messages
- Use `/api/health` endpoint to test if backend is responsive

### Frontend Development
- React dev server auto-reloads on file changes
- Use browser DevTools (F12) to inspect network requests
- Check Console tab for JavaScript errors

## Environment Setup Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 14+ installed
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed (pip install -r requirements.txt)
- [ ] Frontend dependencies installed (npm install)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Browser allows downloads from localhost

## Still Having Issues?

1. Check all error messages carefully
2. Ensure all steps in README.md are followed
3. Try the setup.bat script for automatic setup
4. Restart both servers
5. Clear browser cache and try again

## Useful Commands

### Backend
```bash
# Activate virtual environment (Windows)
cd backend
venv\Scripts\activate

# Run server
python app.py

# Test API
curl http://localhost:5000/api/health
```

### Frontend
```bash
# Install dependencies
cd frontend
npm install

# Start dev server
npm start

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```
