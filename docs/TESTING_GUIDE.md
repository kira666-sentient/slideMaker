# SlideMaker Testing Guide

## Critical Fix Verification

### ✅ Test 1: International Language Support

**Purpose:** Verify layout detection works with non-English presentations

**Steps:**
1. Create a PowerPoint in Spanish (or download Spanish template)
2. Upload to SlideMaker
3. Verify dropdown shows Spanish layout names (e.g., "Título y contenido")
4. Select a layout
5. Add slide with content
6. Download and open in PowerPoint
7. Verify slide was added with correct layout

**Expected Result:** 
- Dropdown shows actual Spanish layout names
- Slide is added correctly
- No errors about layout not found

**Why It Matters:** This was the #1 critical bug - app would fail for non-English files

---

### ✅ Test 2: Custom Corporate Templates

**Purpose:** Verify app works with custom-named layouts

**Steps:**
1. Create PowerPoint with custom template
2. Rename layouts to custom names (e.g., "Company Standard Layout")
3. Upload to SlideMaker
4. Verify dropdown shows custom layout names
5. Add slide
6. Verify formatting matches template

**Expected Result:**
- Custom layout names appear in dropdown
- Theme/branding preserved
- Headers, footers, logos intact

---

### ✅ Test 3: Layout Without Content Placeholder

**Purpose:** Verify textbox fallback when placeholder missing

**Steps:**
1. Create PowerPoint with "Title Only" layout
2. Upload and select that layout
3. Try to add content
4. Verify content appears (as textbox fallback)

**Expected Result:**
- App doesn't crash
- Content appears somewhere on slide
- User receives no errors

---

## Comprehensive Feature Tests

### File Upload Tests

**Test 4: Valid PPTX Upload**
- Upload valid .pptx file
- Verify layouts load
- Verify slide count shows

**Test 5: Invalid File Type**
- Try uploading .ppt (old format)
- Verify error message: "File must be a .pptx PowerPoint file"

**Test 6: Corrupted PPTX**
- Upload corrupted/incomplete .pptx
- Verify error message: "Invalid or corrupted PowerPoint file"

**Test 7: File Too Large**
- Upload file > 50MB
- Verify error message with size limit

**Test 8: Empty Presentation**
- Upload PPTX with 0 slides
- Verify appropriate handling

---

### Layout Selection Tests

**Test 9: No File Uploaded**
- Don't upload file
- Verify message: "Please upload a PowerPoint file first"

**Test 10: Multiple Layouts Available**
- Upload presentation with 10+ layouts
- Verify all layouts appear in dropdown
- Verify dropdown shows count: "Select Slide Layout (12 available)"

**Test 11: Layout Loading State**
- Upload file and watch layout dropdown
- Verify "Loading layouts..." message appears briefly

**Test 12: Auto-Select First Layout**
- Upload file
- Verify first layout is automatically selected

---

### Content Input Tests

**Test 13: Required Fields**
- Try submitting with empty content
- Verify error: "Content is required"

**Test 14: Optional Title**
- Leave title blank
- Add content and submit
- Verify slide is created successfully

**Test 15: Optional Image**
- Don't upload image
- Verify slide is created without errors

**Test 16: All Fields Filled**
- Fill title, content, and image
- Verify all elements appear on slide

---

### Content Validation Tests

**Test 17: Long Title**
- Enter title > 100 characters
- Verify warning appears: "Title is too long"

**Test 18: Long Content**
- Enter content > 500 characters
- Verify warning appears: "Content is very long"

**Test 19: Many Lines**
- Enter content with > 15 lines
- Verify warning: "Too many lines"

**Test 20: Large Image**
- Upload image > 5MB
- Verify warning: "Image size is large"

**Test 21: Invalid Image Type**
- Try uploading .txt file as image
- Verify warning or error

**Test 22: Tiny Image**
- Upload image < 1KB
- Verify warning: "Image size is very small"

---

### Slide Positioning Tests

**Test 23: Add at Beginning**
- Set position to 0
- Add slide
- Download and verify slide is first

**Test 24: Add at Middle**
- Set position to 3
- Add slide
- Verify slide is after 3rd slide

**Test 25: Add at End (Default)**
- Leave position as default (slideCount)
- Add slide
- Verify slide is last

**Test 26: Invalid Position**
- Enter negative number
- Verify error: "Position cannot be negative"

**Test 27: Position Beyond Range**
- Enter 999 in 5-slide presentation
- Verify warning but allows submission
- Verify slide added at end (graceful handling)

---

### Multi-Slide Workflow Tests

**Test 28: Add Multiple Slides**
1. Upload file
2. Add slide 1
3. Verify "1 slide added" message
4. Add slide 2 (without re-uploading)
5. Verify "2 slides added"
6. Continue to 5 slides
7. Download
8. Verify all 5 slides present

**Test 29: Session Persistence**
- Add 3 slides
- Verify currentFile state persists
- Verify each slide uses updated file

**Test 30: Download Button**
- Add 1 slide
- Verify download button appears
- Click download
- Verify file downloads with correct name

**Test 31: Reset Functionality**
- Add 3 slides
- Click "Start New Presentation"
- Verify confirmation dialog appears
- Confirm reset
- Verify state cleared (slideCount = 0)

---

### Image Upload Tests

**Test 32: PNG Image**
- Upload PNG image
- Verify image appears on slide

**Test 33: JPEG Image**
- Upload JPEG image
- Verify it works

**Test 34: GIF Image**
- Upload GIF
- Verify it works

**Test 35: BMP Image**
- Upload BMP
- Verify it works

**Test 36: Unsupported Format**
- Try uploading .svg or .webp
- Verify warning or graceful handling

**Test 37: Very Large Image**
- Upload 10MB+ image
- Verify warning appears
- Verify processing succeeds or fails gracefully

---

### Error Handling Tests

**Test 38: Backend Offline**
- Stop backend server
- Try to upload file
- Verify error: "Backend server is not responding"
- Verify health check indicator shows offline

**Test 39: Network Timeout**
- Simulate slow network
- Verify request doesn't hang forever
- Verify timeout error message

**Test 40: Mid-Operation Failure**
- Start adding slide
- Kill backend mid-request
- Verify frontend shows error
- Verify state is cleaned up

**Test 41: Double Submission**
- Click "Add Slide" button rapidly multiple times
- Verify only one request is sent
- Verify button disabled during processing

---

### Theme Preservation Tests

**Test 42: Background Colors**
- Use template with colored background
- Add slide
- Verify new slide has same background color

**Test 43: Fonts**
- Use template with custom fonts
- Add slide
- Verify text uses same fonts

**Test 44: Headers and Footers**
- Use template with header/footer
- Add slide
- Verify header/footer present on new slide

**Test 45: Logos**
- Use template with company logo
- Add slide
- Verify logo appears on new slide

**Test 46: Slide Numbers**
- Use template with slide numbers
- Add slide
- Verify slide number increments correctly

---

### Browser Compatibility Tests

**Test 47: Chrome**
- Test all features in Chrome
- Verify everything works

**Test 48: Firefox**
- Test in Firefox
- Verify everything works

**Test 49: Edge**
- Test in Edge
- Verify everything works

**Test 50: Safari** (if on Mac)
- Test in Safari
- Verify everything works

**Test 51: Mobile Browser**
- Test on mobile device
- Verify responsive design
- Verify touch interactions work

---

### Performance Tests

**Test 52: Large Presentation**
- Upload 50+ slide presentation
- Verify layouts load quickly
- Verify adding slide completes in reasonable time

**Test 53: Many Layouts**
- Upload presentation with 20+ layouts
- Verify dropdown scrollable
- Verify selection works

**Test 54: Rapid Operations**
- Add 10 slides rapidly
- Verify no memory leaks
- Verify all slides added correctly

---

### Edge Cases

**Test 55: Special Characters**
- Use special characters in title/content (é, ñ, ü, 中文, العربية)
- Verify they appear correctly in PowerPoint

**Test 56: Emoji**
- Use emoji in content (🎉, ❤️, 🚀)
- Verify they appear correctly

**Test 57: Long Words**
- Use very long words (e.g., German compounds)
- Verify word wrap works

**Test 58: Empty Spaces**
- Enter only whitespace in title
- Verify warning: "Title contains only whitespace"

**Test 59: Newlines**
- Enter content with many newlines
- Verify formatting preserved

**Test 60: Mixed Content**
- Mix title, content, and image in various combinations
- Verify all work correctly

---

## Regression Testing

After any code changes, run these critical tests:

### Critical Path (Must Pass)
1. ✅ Upload PPTX → Layouts load
2. ✅ Select layout → Dropdown works
3. ✅ Add content → Slide created
4. ✅ Download → File downloads correctly
5. ✅ Multi-slide → Multiple slides work

### Security Checks
1. ✅ File size validation works
2. ✅ File type validation works
3. ✅ Content validation works
4. ✅ No SQL injection possible (N/A - no database)
5. ✅ No XSS possible

---

## Automated Testing (Future)

### Unit Tests
```javascript
// Frontend
describe('LayoutSelector', () => {
  it('shows loading state when loading=true')
  it('shows layouts when provided')
  it('shows message when no layouts')
})

describe('SlideForm', () => {
  it('validates required fields')
  it('shows warnings for long content')
  it('handles file upload')
})
```

```python
# Backend
def test_find_layout_by_name_exact_match():
    # Test exact name match
    
def test_find_layout_by_name_partial_match():
    # Test fallback to partial match
    
def test_add_slide_validation():
    # Test all validation rules
```

### Integration Tests
```python
def test_get_layouts_endpoint():
    # Upload file, verify layouts returned
    
def test_add_slide_endpoint():
    # Upload file, add slide, verify response
```

### End-to-End Tests
```javascript
// Using Playwright or Cypress
describe('Complete workflow', () => {
  it('should add slide to presentation', async () => {
    // 1. Upload file
    // 2. Select layout
    // 3. Fill form
    // 4. Submit
    // 5. Verify download
  })
})
```

---

## Test Data

### Sample PowerPoint Files
- `test_english.pptx` - Standard English template
- `test_spanish.pptx` - Spanish language template
- `test_custom.pptx` - Custom corporate template
- `test_minimal.pptx` - 1 slide, 1 layout
- `test_complex.pptx` - 50 slides, 20 layouts
- `test_corrupted.pptx` - Intentionally corrupted file
- `test_large.pptx` - 45MB file (near limit)

### Sample Images
- `test_small.png` - 500KB PNG
- `test_large.jpg` - 8MB JPEG
- `test_tiny.gif` - 500 bytes GIF
- `test_huge.bmp` - 15MB BMP (exceeds limit)

---

## Test Results Template

```
Test Date: ___________
Tester: ___________
Version: ___________

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | International Support | ✅ PASS | |
| 2 | Custom Templates | ✅ PASS | |
| ... | ... | ... | ... |

Critical Issues Found:
- None

Minor Issues Found:
- List any issues

Recommendations:
- Suggestions for improvement
```

---

## Performance Benchmarks

### Expected Response Times
- `/api/health`: < 100ms
- `/api/get-layouts`: < 2 seconds (10MB file)
- `/api/add-slide`: < 5 seconds (including positioning)

### Expected Resource Usage
- Backend memory: < 500MB
- Frontend memory: < 200MB
- Network: < file size + 10%

---

## Continuous Integration (Future)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: pip install -r requirements.txt pytest
      - name: Run tests
        run: pytest

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: 18
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Run tests
        run: cd frontend && npm test
```

---

## Sign-Off Checklist

Before considering app "production ready":

- [ ] All 60 manual tests pass
- [ ] No critical bugs found
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Documentation reviewed
- [ ] Deployment tested
- [ ] Backup/recovery tested
- [ ] Monitoring configured
- [ ] Error logging working
- [ ] User acceptance testing completed
