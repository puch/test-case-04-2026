# Test Case 04/2026

This is a fairly simple project that does not use any third-party packages or libraries, except for the SASS compiler.

## Author

Slava Puchkin (Вячеслав Пучкин).

v.puchkin@bk.ru

## Details

1. Videos are loaded into HTML using JavaScript.
2. Video scrolling is implemented using native scroll and the CSS `scroll-snap-type` property, which greatly simplifies scroll handling.
3. Videos at positions -2 and beyond, and +2 and beyond from the active video are unloaded (only the poster remains).
4. Videos at positions -1 and +1 are preloaded.
5. The mute/unmute button works for each individual video. In one of the commits (`c5bdd05`), I implemented a solution where it worked globally for all videos, but there is an issue with this approach: on iOS browsers, the video is forcibly paused if its sound is programmatically turned on. This is iOS policy. Therefore, it was decided to implement sound control separately for each video.
6. The progress bar is draggable.
7. Videos can be paused and unpaused. Each video resumes playback from the position it was paused at when you return to it.
8. Video loading via API is not supported; the application works with a predefined set of videos.
9. Infinite scroll is not implemented.
10. The interface is designed by me and reflects my subjective vision.
11. Possible improvements: improve progress bar accuracy, add notification when video is paused due to low power mode on iOS/macOS, show the indicator that the video is without sound if so.

## Desktop Version Features

1. On desktop, there are buttons for scrolling up and down.

## Tablet & Mobile Version Features

1. On tablet and mobile devices, the up and down scroll buttons are not available.

## Launch Instructions

You can run the project by simply opening the `index.html` file, as all SCSS code has already been compiled and is located in the `/css` folder.

Alternatively, you can run the project in Visual Studio Code:

1. Install the **Live Sass Compiler** extension.
2. In the extension settings under **Settings: Formats**, set the `savePath` option to `/css`.
3. Install the **Live Server** extension.
4. Click **Watch Sass** in the VS Code status bar.
5. Click **Go Live** in the VS Code status bar.
6. The application will open in your browser.

## Project Structure

- 📄 index.html
- 📄 favicon.svg
- 📄 Readme.md

- 📁 css/
    - `style.css` — Compiled styles

- 📁 scss/
    - `style.scss` — Main styles
    - `_reset.scss` — CSS reset
    - `_variables.scss` — Variables & mixins

- 📁 images/ — Icons
    - `arrow.svg`
    - `pause.svg`
    - `play.svg`
    - `sound-off.svg`
    - `sound-on.svg`

- 📁 videos/
    - `1.webp` - posters (generated using ffmpeg)
    - `2.webp`
    - `3.webp`
    - `4.webp`
    - `5.webp`
    - `6.webp`
    - `7.webp`
    - `8.webp`
    - `9.webp`
    - `10.webp`
    - `11.webp`
    - `1.mp4` - video files
    - `2.mp4`
    - `3.mp4`
    - `4.mp4`
    - `5.mp4`
    - `6.mp4`
    - `7.mp4`
    - `8.mp4`
    - `9.mp4`
    - `10.mp4`
    - `11.mp4`

- 📁 js/
    - `app.js`

## Technologies Used

- HTML5
- SCSS (SASS)
- JavaScript (Vanilla)
- Live Sass Compiler (development only)
- Live Server (development only)