# Simple Media-Server build with next.js
requires ffmpeg & graphicsmagick
`sudo apt install ffmpeg graphicsmagick`
## Dev
`npm i`
`npm run dev`
## Prod
`npm run prod`
# Cli
`node cli.js <action> <...params>`
## Add user
`node cli.js adduser username "super secret password"`
or via npm-scripts
`npm run adduser username "super secret password"`