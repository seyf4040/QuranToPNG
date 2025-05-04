# 📚 Quranic Font Integration Guide

This project supports **dynamic Quranic font selection** using fonts stored in the `/public/fonts/` folder and listed in a config file.

Developers can easily add new Quranic fonts without changing the application logic.

---

## ✅ How to Add a New Font

### 1. 🗂 Place the `.ttf` File

Copy the font file into:

```
/public/fonts/
```

**Example:**
```
/public/fonts/Lateef-Regular.ttf
```
---

### 2. 📝 Update `fonts.json`

Edit `/public/fonts/fonts.json` and add a new entry:

```json
[
  {
    "name": "Uthmanic_Hafs_1",
    "file": "/fonts/uthmanic_hafs_v22.ttf",
    "label": "Hafs (small)"
  },
  {
    "name": "Uthmanic_Hafs_2",
    "file": "/fonts/UthmanicHafs_V22.ttf",
    "label": "Hafs (big)"
  },
  {
    "name": "Lateef",
    "file": "Lateef-Regular.ttf",
    "label": "Lateef (Elegant)"
  }
]
```
name: used internally as font-family

file: the exact .ttf filename

label: what users see in the font dropdown menu

### 3. 🎨 Register the Font in globals.css
Edit the file:

```
/src/styles/globals.css
```
Add this block:

```css
@font-face {
  font-family: "Lateef";
  src: url("/fonts/Lateef-Regular.ttf") format("truetype");
  font-display: swap;
}
```
Make sure the font-family matches the "name" from fonts.json.

## ℹ️ Notes
Restart the dev server after changes:


```bash 
npm run dev
``` 
Fonts are loaded dynamically using the custom hook useFontList()

The first font listed in fonts.json is selected by default

No need to modify any component logic to add new fonts

Happy coding!