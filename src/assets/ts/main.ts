import { initRockHand } from './components/rock-hand';
import { initPlayer } from './components/player';
import { initWidgetVisibility } from './components/widgetVisibility';
import { setupWidgetCloseButton } from './utils/setupWidgetCloseButton';

document.addEventListener('astro:page-load', () => {
  initRockHand();
  initPlayer();
  initWidgetVisibility();
  setupWidgetCloseButton();
});
