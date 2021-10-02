const DISCRETE = 'discrete';

let offscreen;
let ctxOffscreen;

const preProcessMainCanvas = (inputImageBitmap, filter, width, height) => {
  ctxOffscreen.clearRect(0, 0, width, height);
  ctxOffscreen.filter = filter;
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
  return ctxOffscreen.getImageData(0, 0, width, height);
};

self.addEventListener('message', (e) => {
  if (e.data.offscreen) {
    offscreen = e.data.offscreen;
    ctxOffscreen = offscreen.getContext('2d');
    return;
  }
  const { inputImageBitmap, posterize, rgba, width, height, dpr } = e.data;
  ctxOffscreen.scale(dpr, dpr);
  offscreen.width = width;
  offscreen.height = height;
  const imageData = preProcessMainCanvas(
    inputImageBitmap,
    getFilter(posterize, rgba),
    width,
    height,
    dpr,
  );
  e.ports[0].postMessage({ result: imageData });
});

const getFilter = (posterize, rgba) => {
  let filter;
  if (posterize) {
    filter = new CanvasFilter({
      componentTransfer: {
        funcR: {
          type: DISCRETE,
          tableValues: rgba.r.map((component) => Number(component)),
        },
        funcG: {
          type: DISCRETE,
          tableValues: rgba.g.map((component) => Number(component)),
        },
        funcB: {
          type: DISCRETE,
          tableValues: rgba.b.map((component) => Number(component)),
        },
        funcA: {
          type: DISCRETE,
          tableValues: rgba.a.map((component) => Number(component)),
        },
      },
    });
  }
  return filter;
};
