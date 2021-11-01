const DISCRETE = 'discrete';

let offscreen;
let ctxOffscreen;

const preProcessMainCanvas = (
  inputImageBitmap,
  filter,
  cssFilters,
  width,
  height,
) => {
  ctxOffscreen.clearRect(0, 0, width, height);
  ctxOffscreen.filter = cssFilters;
  ctxOffscreen.drawImage(
    inputImageBitmap,
    0,
    0,
    inputImageBitmap.width,
    inputImageBitmap.height,
    0,
    0,
    width,
    height,
  );
  ctxOffscreen.filter = filter;
  ctxOffscreen.drawImage(
    offscreen,
    0,
    0,
    offscreen.width,
    offscreen.height,
    0,
    0,
    width,
    height,
  );
  return ctxOffscreen.getImageData(0, 0, width, height);
};

self.addEventListener('message', (e) => {
  if (e.data.offscreen) {
    offscreen = e.data.offscreen;
    ctxOffscreen = offscreen.getContext('2d');
    return;
  }
  const { inputImageBitmap, posterize, rgba, cssFilters, width, height, dpr } =
    e.data;
  ctxOffscreen.scale(dpr, dpr);
  offscreen.width = width;
  offscreen.height = height;
  const imageData = preProcessMainCanvas(
    inputImageBitmap,
    getFilter(posterize, rgba, cssFilters),
    cssFilters,
    width,
    height,
    dpr,
  );
  e.ports[0].postMessage({ result: imageData });
});

const getFilter = (posterize, rgba) => {
  const filters = [];
  if (posterize) {
    filters.push({
      filter: 'componentTransfer',
      funcR: {
        type: DISCRETE,
        tableValues: rgba.r,
      },
      funcG: {
        type: DISCRETE,
        tableValues: rgba.g,
      },
      funcB: {
        type: DISCRETE,
        tableValues: rgba.b,
      },
      funcA: {
        type: DISCRETE,
        tableValues: rgba.a,
      },
    });
  }
  return new CanvasFilter(filters);
};
