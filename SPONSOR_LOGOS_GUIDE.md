# Sponsor Logos Setup Guide

## 📁 **Directory Structure**

Place your sponsor logo image files in the following directory:

```
/client/public/images/sponsors/
```

## 🏷️ **Required Image Files**

Add the following image files to the sponsors directory:

### Sponsor Images (No Tier Labels)

- `sponsor-1.png` (recommended: 200x60px, transparent background)
- `sponsor-2.png` (recommended: 200x60px, transparent background)
- `sponsor-3.png` (recommended: 200x60px, transparent background)
- `sponsor-4.png` (recommended: 200x60px, transparent background)
- `sponsor-5.png` (recommended: 200x60px, transparent background)
- `sponsor-6.png` (recommended: 200x60px, transparent background)

**Note:** You can add more sponsors by naming them `sponsor-7.png`, `sponsor-8.png`, etc., and updating the code accordingly.

## 📏 **Image Guidelines**

### **File Format**

- **Preferred**: PNG with transparent background
- **Alternative**: JPG, WEBP, SVG
- **Max file size**: 300KB per image for optimal loading

### **Dimensions**

- **Recommended**: 200x60px (3.33:1 ratio)
- **Minimum**: 150x45px
- **Maximum**: 300x90px

### **Quality Requirements**

- High resolution for crisp display
- Clean, professional logos
- Consistent branding
- Transparent or white background recommended

## 🎨 **Display Features**

### **Visual Layout**

- Sponsors appear **above** the 3D orbital element
- 3x2 grid layout (3 columns, 2 rows)
- Equal sizing for all sponsors (no tier hierarchy)
- Compact, clean presentation

### **Visual Effects**

- Semi-transparent white backdrop with blur effect
- Hover animations (scale on hover)
- Smooth transitions
- Responsive sizing for mobile devices

### **Auto-Hide Feature**

- If an image fails to load, the entire container is hidden
- No placeholder images or error states
- Clean layout maintained when images are missing

## 🔄 **Adding/Updating Sponsors**

### **To Add New Sponsors:**

1. Add image file to `/client/public/images/sponsors/`
2. Name files sequentially: `sponsor-1.png`, `sponsor-2.png`, etc.
3. Update the image `src` paths in `HeroSection.jsx` if adding more than 6 sponsors
4. Ensure filename matches exactly (case-sensitive)

### **To Modify Layout:**

Edit the sponsors grid section in `/client/src/components/HeroSection.jsx` around line 470.

### **To Change Grid Layout:**

- Current: 3 columns (`grid-cols-3`)
- For 4 columns: Change to `grid-cols-4`
- For 2 columns: Change to `grid-cols-2`

## 📱 **Responsive Behavior**

- **Desktop**: 3x2 grid layout with hover effects
- **Tablet**: Maintained grid with adjusted spacing
- **Mobile**: 3x2 grid with smaller sizing, touch-friendly

## ✅ **Testing Checklist**

- [ ] Images load correctly on all devices
- [ ] Missing images are properly hidden (no broken image icons)
- [ ] Hover animations function smoothly
- [ ] Grid layout maintains consistency
- [ ] Images display correctly on different screen sizes
- [ ] File sizes optimized for web performance
- [ ] "View All Sponsors" link works correctly

## 🎯 **Layout Position**

The sponsor section is positioned:

- **Above** the 3D orbital rings element
- **Right column** of the hero section
- **Below** the main conference information
- **Compact size** to complement the design

## 🚀 **Future Enhancements**

- Click-through links to sponsor websites
- Dynamic loading from database/API
- Admin panel for sponsor management
- Animated carousel for many sponsors
- Sponsor logo rotation/shuffling

## 📧 **Support**

For technical assistance with sponsor logo implementation, contact the development team.
