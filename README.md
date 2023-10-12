# SVGcode: A PWA to Convert Raster Images to SVG Vector Graphics

SVGcode is a Progressive Web App that lets you convert raster images like JPG,
PNG, GIF, WebP, AVIF, etc. to vector graphics in SVG format. It uses the File
System Access API, the Async Clipboard API, the File Handling API, and Window
Controls Overlay customization. The app is available at
<a href="https://svgco.de/">SVGco.de</a>. See what I did there? For more
background, read the accompanying [article](https://web.dev/svgcode/) or watch
the [video](https://youtu.be/kcvfyQh6J-0?).

<a href="https://svgco.de/">
  <img src="https://github.com/tomayac/SVGcode/raw/main/public/screenshots/desktop-dark.png" alt="SVGcode application screenshot" width="707" height="497" />
</a>

## Access from the Web or install from a store

Apart from using the Web app at [svgco.de](https://svgco.de/), you can also
install SVGcode from the
[Play Store](https://play.google.com/store/apps/details?id=de.svgco.twa) on
Android (or ChromeOS) and the
[Microsoft Store](https://www.microsoft.com/en-us/p/svgcode/9plhxdgsw1rj#activetab=pivot:overviewtab)
on Windows.

<a href="https://svgco.de/"><img height="50px" src="https://raw.githubusercontent.com/tomayac/SVGcode/main/public/badges/web-browser.svg"></a>
<a href="https://play.google.com/store/apps/details?id=de.svgco.twa"><img height="50px" src="https://raw.githubusercontent.com/tomayac/SVGcode/main/public/badges/play-store.svg"></a>
<a href="https://www.microsoft.com/en-us/p/svgcode/9plhxdgsw1rj#activetab=pivot:overviewtab"><img height="50px" src="https://raw.githubusercontent.com/tomayac/SVGcode/main/public/badges/microsoft-store.svg"></a>

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

## Contributing translations

If SVGcode is not available in _your_ language, consider contributing a
translation. Therefore, make a copy of one of the files in
[`src/i18n/`](https://github.com/tomayac/SVGcode/blob/main/src/i18n/) (most
users will probably be most familiar with
[`en-US.js`](https://github.com/tomayac/SVGcode/blob/main/src/i18n/en-US.js))
and translate the strings. Name the new file according to
[`Tags for Identifying Languages`](https://tools.ietf.org/rfc/bcp/bcp47.txt)
(`$language-$REGION` like `en-US`). Then add the language code to the
`SUPPORTED_LANGUAGES` array in
[`src/js/i18n.js`](https://github.com/tomayac/SVGcode/blob/main/src/js/i18n.js)
and the locale to `SUPPORTED_LOCALES` array in the
[same file](https://github.com/tomayac/SVGcode/blob/main/src/js/i18n.js). Danke!

## Acknowledgements

With SVGcode, I just stand on the shoulders of a command line tool called
[Potrace](http://potrace.sourceforge.net/) by
[Peter Selinger](https://www.mathstat.dal.ca/~selinger/) that I have
[converted to Web Assembly](https://www.npmjs.com/package/esm-potrace-wasm), so
it can be used in a Web app. The converted SVGs are automatically optimized via
the amazing [svgo](https://github.com/svg/svgo) library.

## Bragging zone

<a href="https://www.producthunt.com/posts/svgcode-2?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-svgcode-2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=322238&theme=dark" alt="SVGcode - A PWA to convert raster images to SVG vector graphics | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## License

GNU General Public License v2.0

(This is due to Potrace choosing
[GNU General Public License v2.0](http://potrace.sourceforge.net/#license).)
