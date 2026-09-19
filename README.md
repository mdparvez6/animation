# Woodcut — Interactive 3D Animation

A cinematic interactive wood-cutting scene for the Animation project.

## Built with
- Three.js — WebGL scene, camera, lighting, materials and procedural geometry.
- GSAP — animation toolkit included for future timeline sequences.
- lil-gui — live scene controls.
- OrbitControls — interactive camera orbit and zoom.

## Run
Serve the folder with any static server, for example:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Controls
Drag to orbit, scroll to zoom, pause/play the cutting animation, reset the scene, or adjust animation speed/auto-rotation from the debug panel.

## Next upgrades
A natural next step is replacing the procedural character with a GLTF asset, adding Rapier physics for wood chips, post-processing for cinematic depth of field/bloom, and spatial audio.
