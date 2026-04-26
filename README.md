# Modern Landing Page

A beautiful, responsive landing page built with HTML, CSS, and JavaScript. Ready to deploy on Vercel.

## Features

- ⚡ Lightning-fast performance
- 📱 Fully responsive design
- 🎨 Modern, clean UI
- 🔄 Smooth animations and transitions
- 📧 Contact form
- 🎯 SEO-friendly

## Project Structure

```
vercel-landing-page/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── vercel.json         # Vercel configuration
├── package.json        # Project metadata
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Local Development

1. **Clone or navigate to the project directory:**
   ```bash
   cd vercel-landing-page
   ```

2. **Open in browser:**
   - Simply open `index.html` in your browser
   - Or use a local server:
     ```bash
     npx serve .
     ```

3. **Make your changes:**
   - Edit `index.html` for content
   - Modify `styles.css` for styling
   - Update `script.js` for functionality

## Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Method 2: Using GitHub + Vercel Dashboard

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Create a new repository (e.g., "my-landing-page")

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

4. **Deploy on Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Click "Deploy"
   - Your site will be live in seconds!

### Method 3: Drag and Drop

1. Go to https://vercel.com/new
2. Drag and drop the `vercel-landing-page` folder
3. Click "Deploy"

## Customization

### Update Content

Edit `index.html` to change:
- Brand name
- Hero title and subtitle
- Features
- About section
- Contact information

### Change Colors

Edit `styles.css` and modify the CSS variables:

```css
:root {
    --primary-color: #6366f1;    /* Main brand color */
    --secondary-color: #8b5cf6;  /* Accent color */
    --dark-color: #1f2937;       /* Dark text */
    --light-color: #f9fafb;      /* Light background */
}
```

### Add Images

Replace the placeholder in the About section:

```html
<div class="about-image">
    <img src="your-image.jpg" alt="About us">
</div>
```

### Connect Contact Form

Update `script.js` to send form data to your backend:

```javascript
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Send to your API
    await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
});
```

## Environment Variables (Optional)

If you need environment variables for APIs:

1. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=https://your-api.com
   ```

2. Access in your code:
   ```javascript
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
   ```

## Performance Tips

- Optimize images before uploading
- Use WebP format for better compression
- Minify CSS and JavaScript for production
- Enable Vercel's Edge Network for global CDN

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

MIT License - feel free to use this template for your projects!

## Support

For issues or questions:
- Check Vercel documentation: https://vercel.com/docs
- GitHub Issues: Create an issue in your repository

## Next Steps

1. Customize the content and colors
2. Add your own images
3. Connect the contact form to a backend
4. Add analytics (Google Analytics, Vercel Analytics)
5. Set up a custom domain in Vercel dashboard

---

**Built with ❤️ and deployed on Vercel**
