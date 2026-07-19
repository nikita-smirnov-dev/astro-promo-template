import { setupWidgetCloseButton } from '../utils/setupWidgetCloseButton';
import { initWidgetVisibility } from './widgetVisibility';

setupWidgetCloseButton();

export const initScreenSwitcher = () => {
  const screens = {
    hero: document.getElementById('screen-hero'),
    media: document.getElementById('screen-media'),
    details: document.getElementById('screen-details'),
    gallery: document.getElementById('screen-gallery'),
    video: document.getElementById('screen-video'),
    bonusTracks: document.getElementById('screen-bonus-tracks'),
  };

  function handleRoute(): void {
    const hash = window.location.hash || '#hero';

    if (
      !screens.hero ||
      !screens.media ||
      !screens.details ||
      !screens.gallery ||
      !screens.video ||
      !screens.bonusTracks
    )
      return;

    screens.hero.classList.toggle('hidden', hash !== '#hero');
    screens.media.classList.toggle('hidden', hash !== '#media');
    screens.details.classList.toggle('hidden', hash !== '#details');
    screens.gallery.classList.toggle('hidden', hash !== '#gallery');
    screens.video.classList.toggle('hidden', hash !== '#video');
    screens.bonusTracks.classList.toggle('hidden', hash !== '#bonus-tracks');

    setTimeout(() => {
      initWidgetVisibility(hash);
    }, 800);
  }

  window.addEventListener('hashchange', handleRoute);

  handleRoute();
};
