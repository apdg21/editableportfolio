# Copywriter Portfolio Website

This is a modern, editable portfolio website designed for a copywriter, built with HTML5, CSS3, and vanilla JavaScript.

## Features
- Fully responsive design
- Editable content via JSON, including logo name, social media links, and copywriting samples
- Clickable copywriting samples linking to text files in a `samples/` folder
- Pagination for copywriting samples (8 per page on desktop, 4 per page on mobile)
- FormSubmit.co integration for contact form
- Offline editing and preview capability with persistent form data
- Accessible design practices
- Modern, professional aesthetic
- Admin controls ("Edit Portfolio" and "Load JSON" buttons) hidden when deployed online

## File Structure
- `index.html`: Main portfolio page
- `form.html`: Editing interface
- `style.css`: Main styles
- `main.js`: Portfolio functionality
- `form.js`: Form editor functionality
- `data.json`: Editable content
- `assets/`: Images (profile.jpg, ad_copy.jpg, blog_post.jpg, etc.)
- `samples/`: Copywriting sample text files (ad_copy.txt, blog_post.txt, etc.)

## Setup Instructions
1. Host the files on a web server or use a local server (e.g., `python -m http.server`) for offline testing.
2. Create a `samples/` folder in the project root and add text files for copywriting samples (e.g., `.txt` files).
3. Open `index.html` in a browser to view the portfolio.
4. Access `form.html` to edit content (available offline via the "Edit Portfolio" button or directly when deployed).

## Editing Content
1. Navigate to `form.html` (directly or via the "Edit Portfolio" button, visible only offline).
2. Modify fields in the editor form:
   - **Logo Name**: Replace "Your Name" with your actual name for the logo (displayed in the navbar and footer).
   - Hero title and subtitle
   - About text and skills
   - Form recipient email and success message
   - Footer text
   - Social media URLs (LinkedIn, Twitter, GitHub)
   - Add/remove copywriting samples with titles, descriptions, image URLs, and sample file URLs
3. Click "Save Changes" to update the data and save it to localStorage for preview and continued editing.
4. Click "Download JSON" to save the updated `data.json`.
5. Replace the existing `data.json` with the new file on your server.
6. Use "Load JSON" to upload a custom JSON file (available on both `form.html` and `index.html`, visible only offline).
7. Click "Preview Portfolio" to view changes. Return to `form.html` using the "Edit Portfolio" button to continue editing without losing changes.

**Important**: Ensure you update the "Logo Name" field in the editor with your actual name, as "Your Name" is a placeholder used in the logo and footer.

## Copywriting Samples
- Each sample in the "Work" section is clickable, opening a text file (e.g., `samples/ad_copy.txt`) in a new tab or triggering a download.
- Add sample files to the `samples/` folder and update the `link` field in `data.json` or via `form.html` to point to the file (e.g., `samples/your_sample.txt`).
- Ensure sample files are plain text (`.txt`) for compatibility. Other formats (e.g., `.docx`) may require additional setup.
- Samples are paginated: 8 per page on desktop (screens >768px), 4 per page on mobile (screens ≤768px). Use "Previous" and "Next" buttons to navigate. The pagination controls are hidden if there are no additional pages.

## Contact Form
- Integrated with FormSubmit.co
- Update the recipient email in `form.html`
- Form fields: Name, Email, Subject, Message
- Validation ensures all fields are filled and email is valid
- Success message appears only after successful form submission and hides after 5 seconds

## Social Media Links
- Editable via `form.html` (LinkedIn, Twitter, GitHub)
- Links appear as icons in the footer, powered by Font Awesome
- Leave fields empty in the editor to hide specific social icons
- Fallback text links display if Font Awesome fails to load

## Admin Controls
- The "Edit Portfolio" and "Load JSON" buttons are visible only when the site is accessed offline (e.g., via `file://` protocol).
- When deployed online (via `http://` or `https://`), these buttons are hidden to prevent public access to editing features.
- To edit content online, access `form.html` directly (e.g., `yourdomain.com/form.html`).

## Accessibility
- ARIA labels for form inputs and social links
- Semantic HTML structure
- Keyboard-navigable navigation
- High-contrast color scheme

## Customization
- Replace images in `assets/` with your own (ensure correct filenames in `data.json`)
- Add text files to `samples/` for copywriting samples and update `data.json` or `form.html` with the correct file paths
- Modify `style.css` for custom styling
- Update `data.json` for initial content changes, ensuring to replace "Your Name" with your actual name
- Update social media URLs in `data.json` or via the editor

## Dependencies
- **Font Awesome**: Included via CDN (`<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>`) in `index.html` and `form.html` for social media icons. If the CDN fails, fallback text links (e.g., "LinkedIn") will display instead of icons.
- **FormSubmit.co**: Required for contact form functionality. Update the recipient email in the editor or `data.json`.

## Notes
- Ensure `data.json` is valid JSON to prevent loading errors.
- Use modern browsers for optimal performance.
- Contact form requires an active FormSubmit.co account.
- If social media icons do not display, verify the Font Awesome CDN is accessible or add a local copy of Font Awesome.
- When deploying online, ensure `form.html` is accessible only to authorized users (e.g., via authentication or restricted access) to secure the editing interface.
- Changes made in `form.html` are saved to localStorage, allowing you to return to the editor via the "Edit Portfolio" button without losing data.
- Ensure the `samples/` folder exists and contains the text files referenced in `data.json`. Files must be accessible via the specified paths (e.g., `samples/ad_copy.txt`).
- Pagination displays 8 samples per page on desktop and 4 on mobile, with "Previous" and "Next" buttons for navigation. Buttons are disabled when at the first or last page.