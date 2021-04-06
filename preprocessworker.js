const preProcessMainCanvas = (
  ctxOffscreen,
  inputImageBitmap,
  filterString,
  width,
  height,
) => {
  ctxOffscreen.clearRect(0, 0, width, height);
  ctxOffscreen.filter = filterString;
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
  const { offscreen, inputImageBitmap, filterString, width, height } = e.data;
  const ctxOffscreen = offscreen.getContext('2d');
  offscreen.width = width;
  offscreen.height = height;
  const imageData = preProcessMainCanvas(
    ctxOffscreen,
    inputImageBitmap,
    filterString,
    width,
    height,
  );
  e.ports[0].postMessage({ result: imageData });
});
