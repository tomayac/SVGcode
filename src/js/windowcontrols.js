import { debounce } from './util.js';
import { main, menu } from './domrefs.js';

const WINDOW_CONTROLS_OVERLAY = 'window-controls-overlay';

const onGeometryChange = () => {
  if (navigator.windowControlsOverlay.visible) {
    menu.classList.add(WINDOW_CONTROLS_OVERLAY);
    main.classList.add(WINDOW_CONTROLS_OVERLAY);
  } else {
    menu.classList.remove(WINDOW_CONTROLS_OVERLAY);
    main.classList.remove(WINDOW_CONTROLS_OVERLAY);
  }
};

navigator.windowControlsOverlay.addEventListener(
  'geometrychange',
  debounce(async () => {
    onGeometryChange();
  }, 250),
);

onGeometryChange();
