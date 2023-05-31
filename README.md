# Proiect_Grafica_Computerizata

This project is a 3D airplane simulation built using the Three.js library. It includes a scene with a model of a Boeing airplane, lighting, textures, and interactive features.

# Getting started
Clone the project repository or download the source code.
Run "npx serve . " in terminal and copy local (or network) address to run into a browser.

## What do I use to open the project
As IDE (or code editor) I use Visual Studio Code

## Project Structure
The project structure is as follows:
1. index.html: The main HTML file that includes the necessary scripts and provides a container for the 3D scene.
2. src/: The directory that contains the JavaScript code for the project.
3. app.js: The main JavaScript file that initializes the scene, sets up the camera, renderer, lighting, and loads the 3D model and textures.
and the other files.

## Features
The project includes the following features:

1. 3D Scene: The scene is constructed using the Three.js library and includes a background color.
2. Lighting: Ambient light and directional light are added to the scene to illuminate the objects.
3. Camera: A perspective camera is set up to view the scene.
4. Renderer: A WebGL renderer is created and added to the HTML document.
5. Loading 3D Model: The GLTFLoader is used to load a 3D model of a Boeing airplane (from the boeing.glb file) and add it to the scene.
6. Textures: Textures are applied to the ground, sky, runway, and tower objects to enhance the visual appearance of the scene.
7. Rain Particle System: A particle system is created to simulate rain. Raindrop textures are used for the particles, and their positions are animated to create a falling rain effect.
8. Tower Interaction: The tower object in the scene can change its color and emit light based on the proximity of the airplane model. The color and light change when the airplane is close to the tower, indicating a potential collision.
Keyboard Interaction: The airplane model can be controlled using the arrow keys on the keyboard. The model can be moved up, down, left, and right in the scene.


## Acknowledgements
1. Three.js: A JavaScript library used for creating and displaying 3D computer graphics in a web browser.
2. GLTFLoader: An addon loader for Three.js used to load 3D models in the GLTF format.




