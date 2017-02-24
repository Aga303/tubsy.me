`./build-mage`: Create `tubsy-buildenv` image

`./build-app`: Build tubsy, build result under `tubsy/dist`

`./serve-app`: Make Tubsy available at `http://localhost:8080`. Rerun after each build (`ng build` recreates `dist` thus the volume-mount gets corrupeted)
