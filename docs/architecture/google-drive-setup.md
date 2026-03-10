# Google Drive Setup (File Library)

This site now uses a shared Google Drive folder as the file drop location and file browser.

## Folder In Use

- URL: `https://drive.google.com/drive/folders/1Quiw9zk1ALPEZnxPfd-5iw0JvzLguVxt?usp=sharing`
- Folder ID: `1Quiw9zk1ALPEZnxPfd-5iw0JvzLguVxt`

## Access Model

- Authentication is handled by Google.
- Only users with granted Drive permissions can upload or view files.
- The `/library/` page embeds the folder using Google embedded folder view.

## Optional Local Override

You can override the folder per machine by creating:

- `assets/js/library/local-config.js`

Example:

```js
window.LibraryLocalConfig = {
  driveFolderUrl: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID?usp=sharing",
  driveFolderId: "YOUR_FOLDER_ID"
};
```

`local-config.js` should stay gitignored.

## Sharing and Upload Permissions

1. Open the folder in Google Drive.
2. Click `Share`.
3. Add members who should upload or view files.
4. Grant `Editor` for upload access or `Viewer` for read-only access.

## Notes

- The site does not directly call Google Drive API.
- The embedded view and folder links rely on Google Drive session/auth state in the browser.
