# Grade Calculator 3.0

A modern, feature-rich grade calculator for the Hungarian grading system with cloud synchronization, dark mode, and advanced analytics.

## 🌟 Features

### Authentication & User Management
- **Firebase Authentication** - Secure email/password login
- **Email Verification** - Automatic verification emails
- **Guest Mode** - Use without an account (limited features)
- **Session Persistence** - Stay logged in for 30-90 days

### Dark Mode
- Beautiful dark theme with custom color palette
- Toggle between light and dark modes
- Preference saved across sessions

### Grade Calculation
- **Score to Grade** - Convert points to grades
- **Percentage to Grade** - Convert percentages to grades
- **Customizable Ranges** - Adjust grade thresholds
- **Grade Table Generator** - Generate complete grade tables
- **Export Options** - Export tables as CSV or TXT

### Grade Grapher 📊
- Visualize grade progression with line charts
- Weighted average calculations
- Download charts as PNG or JPG
- **Requires login**

### Cloud Preset Management ☁️
- Save custom grade ranges to the cloud
- Load presets from any device
- Multiple presets per user
- Export/import presets as files
- **Cloud sync requires login**

### Error Validation
- Real-time validation of grade ranges
- Detects overlapping ranges
- Prevents invalid configurations
- Visual error notifications

### UI Components
- Animated notifications (Success, Warning, Error, Info)
- Loading spinner for async operations
- Responsive design
- Smooth animations and transitions

## 🎨 Color Palettes

### Light Mode
- Primary Green: `#96A78D`
- Light Green: `#B6CEB4`
- Pale Green: `#D9E9CF`
- Off-White: `#F0F0F0`

### Dark Mode
- Dark Background: `#222831`
- Secondary Dark: `#393E46`
- Accent: `#948979`
- Light Text: `#DFD0B8`

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari)
- Python 3 (for local server) or any other local server
- Firebase account (already configured)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd /Users/adin/.gemini/antigravity/scratch/grade-calculator-3.0
   ```

2. **Start a local server:**
   ```bash
   python3 -m http.server 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000
   ```

### First Time Setup

1. **Register an account:**
   - Go to `http://localhost:8000/register.html`
   - Enter your email and password
   - Check your email for verification link
   - Click the verification link

2. **Login:**
   - Go to `http://localhost:8000/login.html`
   - Enter your credentials
   - Check "Keep me logged in" for persistent sessions

3. **Or continue as guest:**
   - Click "Continue as Guest" on login page
   - Note: Some features will be restricted

## 📖 Usage

### Calculating Grades

1. **From Score:**
   - Enter your score (e.g., 85)
   - Enter maximum score (e.g., 100)
   - Click "Calculate Grade"

2. **From Percentage:**
   - Enter your percentage (e.g., 85%)
   - Optionally enter max points for reference
   - Click "Calculate Grade"

### Customizing Grade Ranges

1. Click on any grade range input
2. Modify the minimum or maximum values
3. Validation will run automatically
4. Fix any errors shown in red

### Using the Grade Grapher

1. Login to your account (required)
2. Click "Open Grade Grapher"
3. Add grade entries with weights
4. Click "Generate Graph"
5. Download as PNG or JPG

### Managing Presets

1. **Save Preset:**
   - Customize your grade ranges
   - Click "Presets" → "Save Preset"
   - Enter a name
   - Preset is saved to cloud (if logged in)

2. **Load Preset:**
   - Click "Presets" → "Load Preset"
   - Select from your saved presets
   - Ranges will update automatically

3. **Export/Import:**
   - Export: Download preset as JSON file
   - Import: Upload a preset JSON file

## 🔧 Configuration

### Firebase Configuration

The Firebase configuration is located in `js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDYq2gMg_kF07z9FQMHOMbB_Qvs7ar5otY",
  authDomain: "grade-calculator-3.firebaseapp.com",
  projectId: "grade-calculator-3",
  storageBucket: "grade-calculator-3.firebasestorage.app",
  messagingSenderId: "35484775534",
  appId: "1:35484775534:web:1ce8a1b16f98a85f6c227f"
};
```

## 📁 Project Structure

```
grade-calculator-3.0/
├── index.html              # Main calculator
├── login.html              # Login page
├── register.html           # Registration page
├── grapher.html           # Grade grapher
├── css/
│   ├── main.css           # Main styles
│   ├── dark-mode.css      # Dark theme
│   └── components.css     # UI components
├── js/
│   ├── firebase-config.js # Firebase setup
│   ├── auth.js            # Authentication
│   ├── theme.js           # Theme management
│   ├── validation.js      # Validation logic
│   ├── presets.js         # Preset management
│   ├── grapher.js         # Chart generation
│   └── notifications.js   # Notifications
└── assets/
    └── calculator-icon.png
```

## 🐛 Troubleshooting

### Firebase Errors
- Make sure you're running on localhost (not file://)
- Check that Firebase project is active
- Verify security rules are published

### Email Verification Not Received
- Check spam folder
- Wait up to 5 minutes
- Verify email address is correct

### Chart Not Loading
- Make sure you're logged in
- Check browser console for errors
- Verify Chart.js CDN is accessible

## 🔒 Security

- Passwords must be at least 6 characters with 1 capital letter
- Email verification required for new accounts
- Firestore security rules restrict data access to authenticated users
- Session tokens expire after 30-90 days

## 📝 License

© 2024 Grade Calculator 3.0. All rights reserved.
Licensed exclusively to the original user.

## 👤 Author

**DOMINIK**

## 🙏 Acknowledgments

- Firebase for authentication and database
- Chart.js for graph visualization
- UI components inspired by Uiverse.io

---

**Version:** 3.0  
**Last Updated:** December 2024
