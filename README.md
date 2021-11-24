# SVGcode: a PWA to convert raster images to SVG vector graphics

SVGcode is a Progressive Web App that lets you convert raster images like JPG,
PNG, GIF, WebP, AVIF, etc. to vector graphics in SVG format. It uses the File
System Access API, the Async Clipboard API, the File Handling API, and Window
Controls Overlay customization. The app is available at
<a href="https://svgco.de/">SVGco.de</a>. See what I did there?

<a href="https://svgco.de/">
  <img src="https://github.com/tomayac/SVGcode/raw/main/public/screenshots/desktop.png" alt="SVGcode application screenshot" width="707" height="497" />
</a>

For more background, read the accompanying [article](https://web.dev/svgcode/)
or watch the [video](https://youtu.be/kcvfyQh6J-0?).

## Developing and/or contributing

1. Fork this repository.
1. Clone from your fork:
   `git clone git@github.com:<your-github-account>/SVGcode.git`
1. Navigate into the application's directory: `cd SVGcode`
1. Install the dependencies: `npm i`
1. Start the application: `npm start`
1. Open the application in your browser:
   [`http://localhost:3000`](http://localhost:3000)
1. Check out the [available Issues](https://github.com/tomayac/SVGcode/issues)
   or create a [new Issue](https://github.com/tomayac/SVGcode/issues/new/choose)
   describing your plans.
1. Start hacking. Vite automatically reloads the app upon changes.
1. Lint your modifications: `npm run lint`
1. Make sure your changes respect the code style: `npm run fix`
1. Open a Pull Request that fixes the Issue (see 7. above).
1. Have fun, and thanks for your interest in SVGcode!

## Acknowledgements

With SVGcode, I just stand on the shoulders of a command line tool called
[Potrace](http://potrace.sourceforge.net/) by
[Peter Selinger](https://www.mathstat.dal.ca/~selinger/) that I have
[converted to Web Assembly](https://www.npmjs.com/package/esm-potrace-wasm), so
it can be used in a Web app. The converted SVGs are automatically optimized via
the amazing [svgo](https://github.com/svg/svgo) library.

## License

GNU General Public License v2.0

(This is due to Potrace choosing
[GNU General Public License v2.0](http://potrace.sourceforge.net/#license).)
