#!/bin/bash

# Script to generate PNG icons from SVG for Chrome extension
# Requires ImageMagick or inkscape to be installed

echo "Quick AHJ Search - Icon Generator"
echo "================================="

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "Using ImageMagick to convert icons..."
    convert icons/icon.svg -resize 16x16 icons/icon16.png
    convert icons/icon.svg -resize 48x48 icons/icon48.png
    convert icons/icon.svg -resize 128x128 icons/icon128.png
    echo "✅ Icons generated successfully with ImageMagick!"
    
# Check if Inkscape is available
elif command -v inkscape &> /dev/null; then
    echo "Using Inkscape to convert icons..."
    inkscape icons/icon.svg --export-png=icons/icon16.png --export-width=16 --export-height=16
    inkscape icons/icon.svg --export-png=icons/icon48.png --export-width=48 --export-height=48
    inkscape icons/icon.svg --export-png=icons/icon128.png --export-width=128 --export-height=128
    echo "✅ Icons generated successfully with Inkscape!"
    
else
    echo "❌ Neither ImageMagick nor Inkscape found!"
    echo ""
    echo "Please install one of the following:"
    echo "  • ImageMagick: sudo apt-get install imagemagick"
    echo "  • Inkscape: sudo apt-get install inkscape"
    echo ""
    echo "Alternatively, you can:"
    echo "  1. Open icons/icon.svg in any graphics editor"
    echo "  2. Export as PNG in sizes: 16x16, 48x48, 128x128"
    echo "  3. Save as icon16.png, icon48.png, icon128.png in the icons/ folder"
    echo ""
    echo "Or use an online SVG to PNG converter:"
    echo "  • https://convertio.co/svg-png/"
    echo "  • https://cloudconvert.com/svg-to-png"
    exit 1
fi

# Verify the files were created
echo ""
echo "Verifying generated icons:"
for size in 16 48 128; do
    if [ -f "icons/icon${size}.png" ]; then
        echo "✅ icon${size}.png created"
    else
        echo "❌ icon${size}.png missing"
    fi
done

echo ""
echo "🎉 Icon generation complete!"
echo "Your Chrome extension is now ready to load." 