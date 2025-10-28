# How to Replace the Demo Logo

The SlideMaker app currently has a demo logo "SM" that you can easily replace with your company logo.

## Option 1: Replace with Image Logo (Recommended)

### Step 1: Add your logo image
Place your logo file in: `frontend/src/assets/` (create the assets folder if it doesn't exist)

Example: `frontend/src/assets/company-logo.png`

### Step 2: Update App.js

**Current code:**
```javascript
<header className="App-header">
  <h1>SlideMaker</h1>
  <div className="logo">SM</div>
</header>
```

**Replace with:**
```javascript
import logo from './assets/company-logo.png';

// ... in the header:
<header className="App-header">
  <h1>SlideMaker</h1>
  <img src={logo} alt="Company Logo" className="logo-img" />
</header>
```

### Step 3: Update App.css

**Add this CSS:**
```css
.logo-img {
  height: 50px;
  width: auto;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .logo-img {
    height: 40px;
  }
}
```

---

## Option 2: Keep Text Logo (Change "SM")

Simply change the text in `frontend/src/App.js`:

**Current:**
```javascript
<div className="logo">SM</div>
```

**Change to your initials/brand:**
```javascript
<div className="logo">YourBrand</div>
```

The styling will automatically apply!

---

## Option 3: SVG Logo (Best for Scaling)

### Step 1: Create a logo component

Create `frontend/src/components/Logo.js`:
```javascript
import React from 'react';

const Logo = () => {
  return (
    <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Your SVG path data here */}
      <circle cx="50" cy="50" r="40" fill="white" opacity="0.2"/>
      <text x="50" y="60" fontSize="30" fill="white" textAnchor="middle" fontWeight="bold">
        YourLogo
      </text>
    </svg>
  );
};

export default Logo;
```

### Step 2: Import and use in App.js

```javascript
import Logo from './components/Logo';

// ... in the header:
<header className="App-header">
  <h1>SlideMaker</h1>
  <Logo />
</header>
```

### Step 3: Add CSS for SVG

```css
.logo-svg {
  height: 50px;
  width: auto;
}
```

---

## Current Logo Styling

The demo "SM" logo has these styles (in `App.css`):

```css
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 8px;
}
```

You can:
- Keep this styling for text logos
- Remove background for image logos
- Adjust size/padding as needed

---

## Tips

1. **Image Format**: Use PNG with transparent background for best results
2. **Size**: Recommended height 50-80px for best appearance
3. **Colors**: Logo should work well with blue header background (#005a9c)
4. **Responsive**: Test on mobile to ensure logo scales properly

---

## Example Replacements

### Corporate Style
```javascript
<div className="logo">
  <span style={{fontSize: '1.2rem', fontWeight: '600'}}>COMPANY</span>
  <span style={{fontSize: '0.7rem', display: 'block'}}>Solutions</span>
</div>
```

### Icon + Text
```javascript
<div className="logo" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
  <img src={iconLogo} alt="" style={{height: '30px'}} />
  <span>BrandName</span>
</div>
```

### Modern Monogram
```javascript
<div className="logo" style={{
  fontFamily: 'Georgia, serif',
  fontSize: '2rem',
  letterSpacing: '2px'
}}>
  AB
</div>
```

---

## Need Help?

The logo is in: `frontend/src/App.js` (line 7-9)  
The logo styling is in: `frontend/src/App.css` (line 20-26)

Just replace and reload your browser!
