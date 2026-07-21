export const initWidgetVisibility = () => {
  const widgetPlayer = document.querySelector(
    '.widget-player',
  ) as HTMLDivElement;
  const audio = document.querySelector('[data-main-audio]') as HTMLAudioElement;

  if (widgetPlayer && audio) {
    const currentPath = window.location.pathname;
    const isMusicPlaying = audio.src && !audio.paused;

    if (
      currentPath !== '/media' &&
      currentPath !== '/media/' &&
      isMusicPlaying
    ) {
      widgetPlayer.classList.remove('hidden');
    } else {
      widgetPlayer.classList.add('hidden');
    }
  }
};
