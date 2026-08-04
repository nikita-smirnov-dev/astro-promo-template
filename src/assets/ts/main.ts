import { initRockHand } from './components/rock-hand';
import { initFancybox } from './components/photo-gallery-fancy';
import { initPlayer } from './components/player';
import { initWidgetVisibility } from './components/widgetVisibility';
import { setupWidgetCloseButton } from './utils/setupWidgetCloseButton';
import { initSwitchCategory } from './components/switchCategory';
import { initGallerySlider } from './components/gallery-slider';
import { initVideoPreview } from './components/video-preview';

document.addEventListener('astro:page-load', () => {
  initSwitchCategory();
  initRockHand();
  initPlayer();
  initWidgetVisibility();
  setupWidgetCloseButton();
  initGallerySlider();
  initVideoPreview();
  initFancybox();
});
