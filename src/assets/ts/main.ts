import { initScreenSwitcher } from './components/screenSwitcher';
import { initMediaPlayer } from './components/media-player';

initMediaPlayer();
document.addEventListener('DOMContentLoaded', initScreenSwitcher);
