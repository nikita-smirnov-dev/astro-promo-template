import { initScreenSwitcher } from './components/screenSwitcher';
import { initRockHand } from './components/rock-hand';
import { initPlayer } from './components/player';

initRockHand();
initPlayer();
document.addEventListener('DOMContentLoaded', initScreenSwitcher);
