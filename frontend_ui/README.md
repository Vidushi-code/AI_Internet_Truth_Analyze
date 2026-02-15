# AI Truth Engine - Frontend UI

## 📁 Project Structure

```
frontend_ui/
├── index.html      # Main HTML structure
├── styles.css      # Modern styling with animations
├── script.js       # JavaScript for API integration
└── README.md       # This file
```

## 🚀 How to Run

### Option 1: Using Python's Built-in HTTP Server

1. Open a terminal and navigate to the `frontend_ui` folder:
   ```bash
   cd "C:\Users\hp\OneDrive\Desktop\AI Internet Truth Engine\frontend_ui"
   ```

2. Start a simple HTTP server:
   ```bash
   python -m http.server 8080
   ```

3. Open your browser and go to:
   ```
   http://localhost:8080
   ```

### Option 2: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Direct File Access

Simply double-click `index.html` to open it in your default browser.

**Note:** Some browsers may block API requests from `file://` protocol. Using a local server (Option 1 or 2) is recommended.

## ⚙️ Configuration

The frontend is configured to connect to the backend API at:
```
http://127.0.0.1:8000/analyze
```

If your backend is running on a different port, update the `API_BASE_URL` in `script.js`:

```javascript
const API_BASE_URL = 'http://127.0.0.1:YOUR_PORT';
```

## 🎨 Features

### Visual Design
- **Animated gradient mesh background** with floating orbs
- **Glassmorphism effects** for modern UI
- **Smooth animations** for all interactions
- **Responsive design** for mobile, tablet, and desktop
- **Custom scrollbar** styling
- **Beautiful hover effects** on interactive elements

### Functionality
- **Real-time validation** of user input
- **Animated score counter** for truth score
- **Color-coded verdict badges** (TRUE/FALSE/UNCERTAIN)
- **Credibility indicators** for sources
- **Smooth scrolling** to results
- **Error handling** with user-friendly messages
- **Loading animations** during API calls
- **Keyboard shortcuts** (Ctrl+Enter to analyze)

### User Experience
- **Input validation** (minimum 10 characters)
- **Visual feedback** on input status
- **Auto-hide errors** after 5 seconds
- **Smooth transitions** between states
- **Network status monitoring**
- **Performance optimized**

## 🎯 Usage

1. **Enter a Claim**: Type or paste a claim you want to verify in the text area.

2. **Analyze**: Click the "Analyze Claim" button or press `Ctrl+Enter`.

3. **View Results**: The system will display:
   - Truth Score (0-100)
   - Verdict (TRUE/FALSE/UNCERTAIN)
   - Bias Analysis
   - AI Reasoning
   - Verified Sources with credibility ratings

## 🔧 Customization

### Colors
Update the CSS variables in `styles.css` under `:root`:

```css
:root {
    --primary: #6366f1;
    --secondary: #8b5cf6;
    --success: #10b981;
    /* ... more colors */
}
```

### Animations
Adjust animation durations in `styles.css`:

```css
@keyframes shimmer {
    /* Modify animation properties */
}
```

### API Timeout
Modify the fetch request in `script.js` to add timeout:

```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds

fetch(url, {
    signal: controller.signal,
    // ... other options
});
```

## 🌐 Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript enabled.

## 📱 Responsive Breakpoints

- **Desktop**: > 768px
- **Tablet**: 480px - 768px  
- **Mobile**: < 480px

## 🐛 Troubleshooting

### Backend Connection Error
**Error**: "Cannot connect to backend"

**Solutions**:
1. Ensure the backend server is running on port 8000
2. Check if `uvicorn` is installed and running
3. Verify CORS is enabled in the backend

### CORS Issues
If you encounter CORS errors, ensure your FastAPI backend has CORS middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Styling Not Loading
- Clear browser cache (Ctrl+F5)
- Ensure `styles.css` is in the same folder as `index.html`
- Check browser console for errors

### JavaScript Not Working
- Ensure `script.js` is in the same folder as `index.html`
- Open browser console (F12) to check for errors
- Verify JavaScript is enabled in browser settings

## 🔑 Keyboard Shortcuts

- **Ctrl+Enter**: Analyze the entered claim
- **F12**: Open browser developer tools
- **Ctrl+Shift+I**: Open inspect element

## 🎨 Design Philosophy

The UI follows modern design principles:
- **Minimalism**: Clean, uncluttered interface
- **Neumorphism & Glassmorphism**: Depth through soft shadows and transparency
- **Motion Design**: Purposeful animations that enhance UX
- **Accessibility**: Proper contrast ratios and semantic HTML
- **Progressive Enhancement**: Works without JavaScript for basic viewing

## 📊 Performance

- **Optimized animations** using CSS transforms and opacity
- **Efficient DOM manipulation** with minimal reflows
- **Lazy loading** for heavy elements
- **Compressed assets** for faster load times

## 🔮 Future Enhancements

Potential features to add:
- [ ] Dark/Light theme toggle
- [ ] Export results as PDF
- [ ] Share results via URL
- [ ] History of analyzed claims
- [ ] Voice input for claims
- [ ] Multi-language support
- [ ] Comparison mode for multiple claims
- [ ] Advanced filters for sources

## 📄 License

Part of the AI Truth Engine project.

## 🤝 Contributing

To modify the frontend:
1. Edit the respective files (`index.html`, `styles.css`, `script.js`)
2. Test in multiple browsers
3. Ensure responsive design works on all screen sizes
4. Maintain consistency with the existing design language

## 📞 Support

For issues or questions:
1. Check the console for error messages (F12)
2. Verify backend API is responding
3. Review this README for troubleshooting tips

---

**Made with ❤️ for truth and transparency**
