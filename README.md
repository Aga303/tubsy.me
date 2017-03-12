`./build`: Create `tubsy-buildenv` image

`./run`: Build tubsy, build result under `tubsy/dist`

`./http`: Make Tubsy available at `http://localhost:8080`. Rerun after each build (`ng build` recreates `dist` thus the volume-mount gets corrupeted)

Tubsy angular2 base is created with `ng new tubsy`.
