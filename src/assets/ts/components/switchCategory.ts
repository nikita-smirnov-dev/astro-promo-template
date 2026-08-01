export const initSwitchCategory = () => {
  const radios = document.querySelectorAll('input[name="mixer-category"]');
  const lists = document.querySelectorAll('.bonus-track__tracks--bonus');
  const audio = document.querySelector('[data-main-audio]') as HTMLAudioElement;

  if (!radios.length || !lists.length) return;

  function switchCategory(activeIndex: number) {
    lists.forEach((list, index) => {
      if (index === activeIndex) {
        list.classList.add('is-active');
      } else {
        list.classList.remove('is-active');
        audio.pause();
      }
    });
  }

  radios.forEach((radio, index) => {
    radio.addEventListener('change', () => {
      switchCategory(index);
    });
  });

  let defaultIndex = 0;
  radios.forEach((radio, index) => {
    if ((radio as HTMLInputElement).checked) {
      defaultIndex = index;
    }
  });

  switchCategory(defaultIndex);
};
