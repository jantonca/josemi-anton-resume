#!/bin/bash
# scripts/add-image.sh - Simple script to add optimized images to R2

set -e

# Check if image file is provided
if [ $# -lt 2 ]; then
    echo "Usage: ./scripts/add-image.sh <image-path> <r2-name>"
    echo "Example: ./scripts/add-image.sh ./photo.jpg profile/avatar"
    exit 1
fi

IMAGE_PATH="$1"
R2_NAME="$2"

# Check if image exists
if [ ! -f "$IMAGE_PATH" ]; then
    echo "❌ Image not found: $IMAGE_PATH"
    exit 1
fi

echo "🚀 Adding image to R2..."
echo "📁 Source: $IMAGE_PATH"
echo "📦 R2 Name: $R2_NAME"
echo ""

# Load environment variables from .env and run the script
export $(grep -v '^#' .env | xargs) && node src/scripts/optimize-images.js add "$IMAGE_PATH" "$R2_NAME"

echo ""
echo "✨ Done! Use in components:"
echo "<R2Picture src=\"$R2_NAME\" alt=\"Description\" widths={[400, 800, 1200]} />"