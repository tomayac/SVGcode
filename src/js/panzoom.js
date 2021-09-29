import { svgOutput } from './domrefs';
import { showToast } from './ui';
import { i18n } from './i18n';

let x = 0;
let y = 0;
let zoomScale = 1;
let initialViewBox = {};

const onDragStart = (e) => {
  e.preventDefault();
  return false;
};

const onPointerMove = (e) => {
  const svg = svgOutput.querySelector('svg');
  if (!svg) {
    return;
  }
  for (let i = 0; i < pointerEventCache.length; i++) {
    if (e.pointerId === pointerEventCache[i].pointerId) {
      pointerEventCache[i] = e;
      break;
    }
  }
  if (pointerEventCache.length === 2) {
    const currentDifference = Math.abs(
      pointerEventCache[0].clientX - pointerEventCache[1].clientX,
    );

    if (previousDifference > 0) {
      if (currentDifference > previousDifference) {
        zoomScale *= 0.995;
        zoomOutput(zoomScale);
      }
      if (currentDifference < previousDifference) {
        zoomScale *= 1.005;
        zoomOutput(zoomScale);
      }
    }
    previousDifference = currentDifference;
  } else if (pointerEventCache.length === 1) {
    const newX = Math.floor(e.offsetX - x);
    const newY = Math.floor(e.offsetY - y);
    svg.setAttribute(
      'viewBox',
      `${-1 * newX} ${-1 * newY} ${initialViewBox.width} ${
        initialViewBox.height
      }`,
    );
  }
};

svgOutput.addEventListener('pointerdown', (e) => {
  const svg = svgOutput.querySelector('svg');
  if (!svg) {
    return;
  }
  pointerEventCache.push(e);
  svgOutput.addEventListener('dragstart', onDragStart);
  storeInitialViewBox();
  x = Math.floor(e.offsetX + initialViewBox.x);
  y = Math.floor(e.offsetY + initialViewBox.y);
  svgOutput.addEventListener('pointermove', onPointerMove);
  svgOutput.style.cursor = 'grabbing';
});

const onPointerUp = (e) => {
  svgOutput.removeEventListener('pointermove', onPointerMove);
  svgOutput.removeEventListener('dragstart', onDragStart);
  removeEvent(e);
  if (pointerEventCache.length < 2) {
    previousDifference = -1;
  }
  storeInitialViewBox();
  svgOutput.style.cursor = 'grab';
};

svgOutput.addEventListener('pointerup', (e) => {
  onPointerUp(e);
});

svgOutput.addEventListener('pointercancel', (e) => {
  onPointerUp(e);
});

svgOutput.addEventListener('pointerleave', (e) => {
  onPointerUp(e);
});

const storeInitialViewBox = () => {
  const svg = svgOutput.querySelector('svg');
  if (!svg) {
    return;
  }
  const viewBox = svg.getAttribute('viewBox');
  const [x, y, width, height] = viewBox.split(' ');
  initialViewBox.x = Number(x);
  initialViewBox.y = Number(y);
  initialViewBox.width = Number(width);
  initialViewBox.height = Number(height);
};

const zoomOutput = (zoomScale) => {
  const svg = svgOutput.querySelector('svg');
  if (!svg) {
    return;
  }
  // zoomScale = Math.min(Math.max(0.1, Math.abs(zoomScale)), 10);
  showToast(`${i18n.t('zoom')}: ${(1 / zoomScale).toFixed(1)}×`, 2000);
  if (initialViewBox.width === undefined) {
    storeInitialViewBox();
  }

  const newWidth = Math.ceil(initialViewBox.width * zoomScale);
  const newHeight = Math.ceil(initialViewBox.height * zoomScale);
  if (newWidth <= 0 || newHeight <= 0) {
    return;
  }
  const newX = Math.floor(
    initialViewBox.x + (initialViewBox.width - newWidth) / 2,
  );
  const newY = Math.floor(
    initialViewBox.y + (initialViewBox.height - newHeight) / 2,
  );
  svg.setAttribute('viewBox', `${newX} ${newY} ${newWidth} ${newHeight}`);
};

svgOutput.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoomScale = Math.max(0.1, Math.min(zoomScale * (1 + e.deltaY * 0.005), 10));
  zoomOutput(zoomScale);
});

const pointerEventCache = [];
let previousDifference = -1;

const removeEvent = (e) => {
  for (let i = 0; i < pointerEventCache.length; i++) {
    if (pointerEventCache[i].pointerId === e.pointerId) {
      pointerEventCache.splice(i, 1);
      break;
    }
  }
};

const resetZoomAndPan = () => {
  x = 0;
  y = 0;
  zoomScale = 1;
  initialViewBox = {};
};

export { initialViewBox, resetZoomAndPan, storeInitialViewBox };
