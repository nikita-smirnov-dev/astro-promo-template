export const setupWidgetCloseButton = () => {
  const btnClose = document.querySelector(
    '.widget-player__btn',
  ) as HTMLButtonElement;
  const widgetPlayer = document.querySelector(
    '.widget-player',
  ) as HTMLDivElement;
  const audio = document.querySelector('[data-main-audio]') as HTMLAudioElement;

  if (btnClose && widgetPlayer && audio) {
    btnClose.addEventListener('click', () => {
      audio.pause();
      widgetPlayer.classList.add('hidden');
    });
  }
};
