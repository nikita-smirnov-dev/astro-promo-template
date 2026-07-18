export const initWidgetVisibility = (hash: string) => {
  const widgetPlayer = document.querySelector(
    '.widget-player',
  ) as HTMLDivElement;
  const audio = document.querySelector('[data-main-audio]') as HTMLAudioElement;

  if (widgetPlayer && audio) {
    const isNotMediaPage = hash !== '#media';
    const isMusicPlaying = audio.src && !audio.paused;

    if (isNotMediaPage && isMusicPlaying) {
      widgetPlayer.classList.remove('hidden');
    } else {
      widgetPlayer.classList.add('hidden');
    }
  }
};
