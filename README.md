# cs405Project2

CS 405 - Project 2: WebGL Mesh Viewer with Advanced Lighting

Overview

This project is a WebGL-based application that allows users to upload and render 3D mesh models with texture mapping. It includes advanced lighting techniques such as ambient, diffuse, and specular lighting to enhance visual realism. The application also features dynamic user controls for interactive experimentation with lighting and material properties.

Features

Mesh Loading: Supports OBJ file uploads to render 3D models.
Texture Mapping: Allows users to upload images as textures, including support for non-power-of-two textures.
Basic Lighting:
Ambient light intensity slider.
Diffuse lighting from a dynamic light source.
Specular Lighting:
Adjustable specular intensity to simulate reflective surfaces.
Implemented using the Phong reflection model for realistic highlights.
Dynamic Controls:
Enable/disable lighting.
Adjust rotation speed and zoom.
Change light position using arrow keys.
Visual Feedback:
Real-time updates to the rendered scene with user interactions.
How to Use

Upload a Mesh:
Click the "OBJ Model" button to upload an OBJ file.
Add a Texture:
Upload a texture image using the "Texture Image" button.
Supports images of any size, including non-power-of-two dimensions.
Enable Lighting:
Check the "Enable Light" checkbox to activate lighting effects.
Adjust Lighting:
Use sliders to modify:
Ambient Light Density for general scene illumination.
Specular Light Intensity for reflective highlights.
Move the Light:
Use arrow keys to reposition the light source dynamically.
Rotate the Scene:
Enable auto-rotation using the "Auto Rotation" checkbox or adjust rotation speed with the slider.
Files

project2.html: Contains the HTML structure and UI elements.
project2.js: Implements the WebGL rendering pipeline and advanced lighting features.
obj.js: Parses OBJ files for rendering.
Implementation Details

Task 1: Non-Power-of-Two Textures
Modified setTexture function in project2.js to support textures of any size.
Applied GL_CLAMP_TO_EDGE for wrapping and GL_LINEAR for filtering.
Task 2: Basic Lighting
Implemented ambient and diffuse lighting in the fragment shader (meshFS).
Added controls to adjust ambient light and toggle lighting effects.
Task 3: Specular Lighting
Integrated specular lighting based on the Phong reflection model.
Added dynamic controls to adjust specular intensity and shininess.
Testing

Upload the sample OBJ file and leaves.jpg texture from the resources folder.
Adjust lighting sliders and observe the changes in real-time.
Verify light movement using arrow keys and test various rotation speeds.
Known Issues

Specular highlights may appear flat if the normals are incorrect in the uploaded OBJ file.
Extremely high shininess values can cause sharp, unrealistic reflections.
Future Enhancements

Add support for multiple light sources.
Introduce bump mapping for more realistic surface textures.
Improve UI for better user experience.
Credits

Developed by Emre Gökay Kılınç for CS 405 - Computer Graphics Course.
Uses WebGL and JavaScript for rendering and user interaction.
