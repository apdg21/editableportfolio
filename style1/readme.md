\# Graphic Designer Portfolio Website



\## Overview



This is a fu# Graphic Designer Portfolio Website



\## Overview



This is a fully functional, responsive portfolio website designed for a graphic designer. It features editable content via a JSON data file, clickable samples with pagination, a contact form integrated with FormSubmit.co, and an admin interface for updating portfolio data.



---



\## File Structure



\- `index.html` – Main portfolio page

\- `form.html` – Content editor interface

\- `style.css` – Site styles (responsive and accessible)

\- `main.js` – Portfolio page logic (rendering, pagination, form validation)

\- `form.js` – Editor page logic (load/save JSON content)

\- `data.json` – Portfolio data (samples, hero text, about, testimonials, social, footer)

\- `assets/` – Images used in portfolio and logo/profile pictures

\- `samples/` – 20 `.txt` files with sample project descriptions

\- `README.md` – This documentation



---



\## Setup \& Running



\### Offline



\- Open `index.html` in a modern browser via `file://` protocol.

\- Admin controls ("Edit Portfolio" and "Load JSON") are visible offline.

\- Edit portfolio data using `form.html`.

\- Use the "Load JSON" button to upload custom JSON files for testing.

\- Serve site via local HTTP server (e.g., `python -m http.server`) for more reliable behavior.



\### Online



\- Upload the entire directory to your web server.

\- Ensure `assets/`, `samples/`, `data.json`, and all files are uploaded and accessible.

\- Admin controls are hidden online for security.

\- Contact form uses \[FormSubmit.co](https://formsubmit.co) with placeholder email `your-email@example.com`. Replace with your real email in `data.json` and `index.html` form action.



---



\## Editing Portfolio Content



\- \*\*Use `form.html`\*\* to edit all content sections: hero, about, samples, testimonials, footer, social links.

\- Save the changes to `localStorage` via the form's "Save to Local Storage" button.

\- Download updated `data.json` using the "Download JSON" button.

\- To apply updated JSON offline, use the "Load JSON" button on `index.html` or `form.html`.

\- `localStorage` persistence lets you preview changes seamlessly offline.

\- Note: Editing is disabled online via hidden admin controls for security.



---



\## Contact Form



\- Contact form sends submissions to \[FormSubmit.co](https://formsubmit.co).

\- Specify your email in the form action (on `index.html`) or update `data.json > contactEmail`.

\- Validation ensures name, email, subject, and message are filled with valid data.

\- Shows success message for 5 seconds after sending.

\- CAPTCHA is disabled to simplify user experience.



---



\## Accessibility \& Responsive Design



\- Semantic HTML tags with appropriate ARIA labels.

\- Keyboard navigable navigation and interactive elements.

\- High contrast colors suitable for readability.

\- Responsive CSS Grid layout for portfolio samples.

\- Pagination adjusts samples count per page based on viewport width (8 desktop, 4 mobile).



---



\## Notes



\- Sample project descriptions are plain `.txt` files for broad compatibility.

\- `.docx` files need server-side support, thus are not included.

\- Ensure all sample `.txt` files exist in the `samples/` folder.

\- If images are missing, a fallback image (`profile.jpg`) is used.

\- Social links show Font Awesome icons; fallback text is shown if CDN fails.

\- Admin interface only visible offline for security.

\- When testing resizing, pagination updates dynamically.

\- Handle edge cases: if samples fewer than pagination limit, pagination hides.

\- Work samples open `.txt` files in a new tab.



---



\## Dependencies



\- \[Font Awesome CDN](https://cdnjs.com/libraries/font-awesome) for social icons.

\- \[FormSubmit.co](https://formsubmit.co) for contact form backend.



---



\## Testing



\- Open `index.html` offline and online.

\- Test editing portfolio in `form.html`, save and reload portfolio page.

\- Test Load JSON offline with custom content.

\- Test contact form submission and validation.

\- Check pagination on different screen widths.

\- Test keyboard navigation and ARIA labels.

\- Check fallback behavior for missing images and invalid sample links.



---



\## License



This portfolio template is free to use and customize.



---



Enjoy building and showcasing your graphic design portfolio!

lly functional, responsive portfolio website designed for a graphic designer. It features editable content via a JSON data file, clickable samples with pagination, a contact form integrated with FormSubmit.co, and an admin interface for updating portfolio data.



---



\## File Structure



\- `index.html` – Main portfolio page

\- `form.html` – Content editor interface

\- `style.css` – Site styles (responsive and accessible)

\- `main.js` – Portfolio page logic (rendering, pagination, form validation)

\- `form.js` – Editor page logic (load/save JSON content)

\- `data.json` – Portfolio data (samples, hero text, about, testimonials, social, footer)

\- `assets/` – Images used in portfolio and logo/profile pictures

\- `samples/` – 20 `.txt` files with sample project descriptions

\- `README.md` – This documentation



---



\## Setup \& Running



\### Offline



\- Open `index.html` in a modern browser via `file://` protocol.

\- Admin controls ("Edit Portfolio" and "Load JSON") are visible offline.

\- Edit portfolio data using `form.html`.

\- Use the "Load JSON" button to upload custom JSON files for testing.

\- Serve site via local HTTP server (e.g., `python -m http.server`) for more reliable behavior.



\### Online



\- Upload the entire directory to your web server.

\- Ensure `assets/`, `samples/`, `data.json`, and all files are uploaded and accessible.

\- Admin controls are hidden online for security.

\- Contact form uses \[FormSubmit.co](https://formsubmit.co) with placeholder email `your-email@example.com`. Replace with your real email in `data.json` and `index.html` form action.



---



\## Editing Portfolio Content



\- \*\*Use `form.html`\*\* to edit all content sections: hero, about, samples, testimonials, footer, social links.

\- Save the changes to `localStorage` via the form's "Save to Local Storage" button.

\- Download updated `data.json` using the "Download JSON" button.

\- To apply updated JSON offline, use the "Load JSON" button on `index.html` or `form.html`.

\- `localStorage` persistence lets you preview changes seamlessly offline.

\- Note: Editing is disabled online via hidden admin controls for security.



---



\## Contact Form



\- Contact form sends submissions to \[FormSubmit.co](https://formsubmit.co).

\- Specify your email in the form action (on `index.html`) or update `data.json > contactEmail`.

\- Validation ensures name, email, subject, and message are filled with valid data.

\- Shows success message for 5 seconds after sending.

\- CAPTCHA is disabled to simplify user experience.



---



\## Accessibility \& Responsive Design



\- Semantic HTML tags with appropriate ARIA labels.

\- Keyboard navigable navigation and interactive elements.

\- High contrast colors suitable for readability.

\- Responsive CSS Grid layout for portfolio samples.

\- Pagination adjusts samples count per page based on viewport width (8 desktop, 4 mobile).



---



\## Notes



\- Sample project descriptions are plain `.txt` files for broad compatibility.

\- `.docx` files need server-side support, thus are not included.

\- Ensure all sample `.txt` files exist in the `samples/` folder.

\- If images are missing, a fallback image (`profile.jpg`) is used.

\- Social links show Font Awesome icons; fallback text is shown if CDN fails.

\- Admin interface only visible offline for security.

\- When testing resizing, pagination updates dynamically.

\- Handle edge cases: if samples fewer than pagination limit, pagination hides.

\- Work samples open `.txt` files in a new tab.



---



\## Dependencies



\- \[Font Awesome CDN](https://cdnjs.com/libraries/font-awesome) for social icons.

\- \[FormSubmit.co](https://formsubmit.co) for contact form backend.



---



\## Testing



\- Open `index.html` offline and online.

\- Test editing portfolio in `form.html`, save and reload portfolio page.

\- Test Load JSON offline with custom content.

\- Test contact form submission and validation.

\- Check pagination on different screen widths.

\- Test keyboard navigation and ARIA labels.

\- Check fallback behavior for missing images and invalid sample links.



---



\## License



This portfolio template is free to use and customize.



---



Enjoy building and showcasing your graphic design portfolio!



