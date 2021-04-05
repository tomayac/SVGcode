const canvasMain = new OffscreenCanvas(1, 1);
const ctxMain = canvasMain.getContext('2d', { desynchronized: true });
ctxMain.imageSmoothingEnabled = false;

const preProcessMainCanvas = (
  inputImageBitmap,
  filterString,
  width,
  height,
) => {
  canvasMain.width = width;
  canvasMain.height = height;
  ctxMain.clearRect(0, 0, canvasMain.width, canvasMain.height);
  ctxMain.filter = filterString;
  ctxMain.drawImage(
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
  return ctxMain.getImageData(0, 0, width, height);
};

self.addEventListener('message', (e) => {
  const [inputImageBitmap, filterString, width, height] = e.data;
  const imageData = preProcessMainCanvas(
    inputImageBitmap,
    filterString,
    width,
    height,
  );
  self.postMessage(imageData);
});
