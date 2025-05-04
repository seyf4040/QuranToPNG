# Quran Ayah Display Generator

A web application that allows users to select, customize, and export Quranic verses (ayat) with various display options. This tool is designed with respect for Quranic text and aims to serve the Muslim community with an easy-to-use interface for generating beautiful Quranic displays.

## Features

- **Surah and Ayah Selection**: Choose any surah and specific ayah or range of ayat from the Quran
- **Arabic Text Rendering**: Proper RTL (Right-to-Left) display with specialized Quranic fonts
- **Customization Options**: Adjust font, size, colors, alignment, and background transparency
- **Multiple Export Formats**: Generate PNG, SVG, PDF, and HTML files with transparent backgrounds
- **Special Quranic Features**: Support for bismillah, sajdah marks, and other Quranic notations
- **Responsive Design**: Works on desktop and mobile devices

## Installation

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/quran-ayah-display.git
   cd quran-ayah-display
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `public/fonts` directory and add the necessary Quranic font files:
   - Download the following TTF files and place them in the `public/fonts` directory:
     - `UthmanicHafs.ttf` (KFGQPC Uthmanic Script HAFS)
     - `me_quran.ttf` (Me Quran)

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
quran-ayah-display/
├── components/           # React components
│   ├── AyahNumber.js      # Ayah number display component
│   ├── ExportFormats.js   # Export options component
│   ├── ExportOptions.js   # Basic export buttons component
│   ├── FontLoader.js      # Font loading utility
│   ├── FontSelector.js    # Font selection component 
│   ├── QuranSpecialFeatures.js # Special Quranic features component
│   ├── QuranTextDisplay.js     # Main text display component
│   ├── RTLTextContainer.js     # RTL text container
│   ├── SettingsPanel.js        # Settings panel component
│   └── SurahMetadata.js        # Surah information component
├── data/
│   └── quran.json        # Quran text data (sample)
├── pages/
│   ├── _app.js           # Next.js app configuration
│   └── index.js          # Main application page
├── public/
│   ├── fonts/            # Quranic font files
│   └── favicon.ico       # Application favicon
├── styles/
│   └── globals.css       # Global styles
├── utils/
│   ├── apiUtils.js       # API integration utilities
│   └── quranUtils.js     # Quran data handling utilities
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
└── tailwind.config.js    # Tailwind CSS configuration
```

## Usage

1. **Select Surah and Ayah Range**: 
   - Choose a surah from the dropdown menu
   - Set the starting and ending ayah numbers

2. **Customize Text Display**:
   - Select a Quranic font
   - Adjust font size
   - Set text alignment
   - Choose text and background colors
   - Adjust background transparency

3. **Configure Special Features** (optional):
   - Enable/disable bismillah display
   - Show sajdah marks
   - Customize additional Quranic features

4. **Export**:
   - Select your preferred format (PNG, SVG, PDF, HTML)
   - Configure advanced export options if needed
   - Click the export button to download your file

## Cultural and Religious Considerations

This application has been developed with careful attention to the proper handling of Quranic text:

- **Respectful Text Rendering**: Uses specialized Quranic fonts and proper Arabic text handling
- **RTL Support**: Ensures correct right-to-left rendering of Arabic text
- **Proper Bismillah Handling**: Follows traditional rules for bismillah display
- **Sajdah Marking**: Appropriate indication of verses requiring prostration
- **Traditional Styling**: Options for traditional Uthmani script styling

Please use this tool with the appropriate respect for Quranic content.

## API Integration

By default, the application uses a local JSON file with Quranic text data. However, it includes support for integration with established Quran APIs:

### Supported APIs:

- **AlQuran.cloud API**: Can fetch Uthmani script, simple text, and other editions
- **Quran.com API**: Support for advanced features (requires API key)

To enable API integration, modify the `utils/apiUtils.js` file and uncomment the relevant API implementation code.

## Credits

- Quranic text data is based on the Uthmani Quran text
- Fonts include KFGQPC Uthmanic Script HAFS and other specialized Quranic fonts
- Built with Next.js, React, and Tailwind CSS

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Contact

Your Name - youremail@example.com

Project Link: [https://github.com/yourusername/quran-ayah-display](https://github.com/yourusername/quran-ayah-display)
