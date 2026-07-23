import { initRockHand } from './components/rock-hand';
import { initPlayer } from './components/player';
import { initWidgetVisibility } from './components/widgetVisibility';
import { setupWidgetCloseButton } from './utils/setupWidgetCloseButton';
import { initSwitchCategory } from './components/switchCategory';

document.addEventListener('astro:page-load', () => {
  initSwitchCategory();
  initRockHand();
  initPlayer();
  initWidgetVisibility();
  setupWidgetCloseButton();
});
