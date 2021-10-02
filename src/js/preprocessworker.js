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
  const { inputImageBitmap, posterize, rgb, width, height, dpr } = e.data;
  ctxOffscreen.scale(dpr, dpr);
  offscreen.width = width;
  offscreen.height = height;
  const imageData = preProcessMainCanvas(
    inputImageBitmap,
    getFilter(posterize, rgb),
    width,
    height,
    dpr,
  );
  e.ports[0].postMessage({ result: imageData });
});

const getFilter = (posterize, rgb) => {
  let filter;
  if (posterize) {
    filter = new CanvasFilter({
      componentTransfer: {
        funcR: {
          type: 'table',
          tableValues: rgb.r.map((component) => Number(component)),
        },
        funcG: {
          type: 'table',
          tableValues: rgb.g.map((component) => Number(component)),
        },
        funcB: {
          type: 'table',
          tableValues: rgb.b.map((component) => Number(component)),
        },
      },
    });
  }
  console.log({
    funcR: {
      type: 'table',
      tableValues: rgb.r.map((component) => Number(component)),
    },
    funcG: {
      type: 'table',
      tableValues: rgb.g.map((component) => Number(component)),
    },
    funcB: {
      type: 'table',
      tableValues: rgb.b.map((component) => Number(component)),
    },
  });
  return filter;
};
