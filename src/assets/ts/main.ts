import { initScreenSwitcher } from './components/screenSwitcher';
import { initMediaPlayer } from './components/media-player';
import { initRockHand } from './components/rock-hand';

initRockHand();
initMediaPlayer();
document.addEventListener('DOMContentLoaded', initScreenSwitcher);
