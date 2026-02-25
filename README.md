# 🎓 Student Productivity OS

A premium, modern productivity dashboard designed specifically for students to manage assignments, track exams, organize notes, set goals, and boost academic performance—all in one beautiful interface.

## ✨ Features

### 🎯 Core Functionality
- **Smart Assignment Tracker** - Never miss a deadline with intelligent tracking and reminders
- **Exam Countdown System** - Visual countdowns and progress tracking for upcoming exams
- **Notes Organization** - Create, organize, and search notes by subject
- **Goal Management** - Set academic and skill goals with progress tracking
- **Focus Study Timer** - Pomodoro technique with session tracking
- **Productivity Analytics** - Beautiful charts and insights into your study habits

### 🎨 Design Highlights
- **Immersive 3D Animations** - Three.js powered 3D scenes and floating elements
- **Glassmorphism UI** - Modern glass-effect cards and panels
- **Smooth Micro-interactions** - Hover effects, transitions, and animations
- **Custom Animated Cursor** - Premium cursor with glow effect
- **Particle System** - Subtle floating particles for ambiance
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

### 🚀 Technical Features
- **Local Storage** - All data saved locally in your browser
- **No Backend Required** - Runs entirely in the browser
- **Fast Performance** - Optimized for 60 FPS animations
- **Keyboard Shortcuts** - Quick navigation and actions
- **Dark/Light Mode** - Toggle between themes
- **Export/Import Data** - Backup and restore your data

## 🎬 Demo

Open `index.html` in your browser to see the app in action!

## 📁 Project Structure

```
student-productivity-os/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Core styles
│   └── animations.css     # Animation styles
├── components/
│   ├── 3d-scene.js        # Three.js 3D scenes
│   ├── animations.js      # Animation controllers
│   ├── auth.js            # Authentication
│   ├── dashboard.js       # Dashboard logic
│   ├── assignments.js     # Assignment management
│   ├── exams.js           # Exam management
│   ├── notes.js           # Notes management
│   ├── goals.js           # Goals management
│   ├── timer.js           # Pomodoro timer
│   ├── analytics.js       # Charts and analytics
│   └── settings.js        # Settings management
├── utils/
│   ├── storage.js         # LocalStorage management
│   └── helpers.js         # Utility functions
├── app.js                 # Main application controller
└── README.md              # This file
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **Three.js** - 3D graphics and animations
- **LocalStorage API** - Data persistence
- **Canvas API** - Charts and visualizations

## 🎯 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or build process required!

### Running the App

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Create an account or login
4. Start organizing your academic life!

### First Time Setup

1. **Sign Up** - Create your account with name, email, and password
2. **Add Assignments** - Click "Add Assignment" to track your tasks
3. **Schedule Exams** - Add upcoming exams with dates
4. **Create Notes** - Organize notes by subject
5. **Set Goals** - Define academic and skill goals
6. **Use Timer** - Start Pomodoro sessions for focused study

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + K` - Focus search
- `Esc` - Close modals

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles/main.css`:

```css
:root {
    --accent-1: #6366f1;  /* Primary color */
    --accent-2: #8b5cf6;  /* Secondary color */
    --accent-3: #ec4899;  /* Accent color */
}
```

### Adjusting Animations
Modify animation speeds in `styles/animations.css` or disable them for better performance.

### Timer Duration
Change the default Pomodoro length in `components/timer.js`:

```javascript
let timerSeconds = 25 * 60; // Change 25 to your preferred minutes
```

## 📊 Data Management

### Export Data
Go to Settings → Data → Export to download a JSON backup of all your data.

### Import Data
Use the import function to restore data from a backup file.

### Reset Data
Settings → Data → Reset All Data (Warning: This cannot be undone!)

## 🏆 Hackathon-Ready Features

This project is optimized for hackathon judging with:

- ✅ **Strong First Impression** - Cinematic landing page with 3D animations
- ✅ **Clear Problem Statement** - Well-defined user pain points
- ✅ **Beautiful UI/UX** - Premium design inspired by Apple, Notion, and Linear
- ✅ **Smooth Animations** - Professional micro-interactions throughout
- ✅ **Responsive Design** - Works on all devices
- ✅ **Fast Performance** - Optimized loading and animations
- ✅ **Complete Features** - Fully functional productivity suite
- ✅ **Clean Code** - Well-organized and documented

## 🚀 Future Enhancements

- [ ] Backend integration with user authentication
- [ ] Cloud sync across devices
- [ ] AI-powered study suggestions
- [ ] Collaboration features for group projects
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Calendar integration
- [ ] Notification system
- [ ] Study group features
- [ ] Grade tracking

## 📝 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🐛 Known Issues

- 3D animations may be slower on older devices (can be disabled)
- LocalStorage has a 5-10MB limit per domain
- No data sync between devices (coming soon)

## 💡 Tips for Best Experience

1. Use on a desktop/laptop for full 3D experience
2. Enable hardware acceleration in browser settings
3. Use Chrome or Firefox for best performance
4. Regular data exports recommended
5. Close other tabs for smoother animations

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for students everywhere

## 🙏 Acknowledgments

- Three.js for 3D graphics
- Inter font by Rasmus Andersson
- Inspiration from Apple, Notion, and Linear design systems

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Made for students, by students. Study smarter, not harder! 🎓✨**
