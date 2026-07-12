export const initMediaPlayer = () => {
  const container = document.querySelector('[data-media]') as HTMLDivElement;

  if (!container) return;

  const playBtn = container.querySelector('[data-play]');
  const playPrev = container.querySelector('[data-prev]');
  const playNext = container.querySelector('[data-next]');
  const trackItems = container.querySelectorAll('[data-track-item]');
  const audio = container.querySelector(
    '[data-main-audio]',
  ) as HTMLAudioElement;

  const progressWrapper = container.querySelector(
    '[data-progress-wrapper]',
  ) as HTMLDivElement;
  const progressBar = container.querySelector(
    '[data-progress-bar]',
  ) as HTMLDivElement;
  const startTime = container.querySelector(
    '[data-start-time]',
  ) as HTMLSpanElement;
  const endTime = container.querySelector('[data-end-time]') as HTMLSpanElement;

  const volumeWrapper = container.querySelector(
    '[data-volume-wrapper]',
  ) as HTMLDivElement;
  const volumeInput = container.querySelector(
    '[data-volume-input]',
  ) as HTMLInputElement;
  const volumeBtn = container.querySelector(
    '[data-volume-btn]',
  ) as HTMLButtonElement;

  if (
    !playBtn ||
    !playPrev ||
    !playNext ||
    !audio ||
    !progressWrapper ||
    !progressBar ||
    !startTime ||
    !endTime ||
    !volumeWrapper ||
    !volumeInput ||
    !volumeBtn ||
    trackItems.length === 0
  )
    return;

  let currentIndex = -1;
  let isPlaying = false;
  audio.volume = 0.5;
  volumeInput.value = (0.5).toString();
  let lastVolume = 0.5;

  volumeBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
      lastVolume = audio.volume;
      audio.volume = 0;
      volumeInput.value = '0';
      volumeBtn.classList.add('is-volume');
      volumeBtn.setAttribute('aria-label', 'Включить звук');
    } else {
      audio.volume = lastVolume > 0 ? lastVolume : 0.5;
      volumeInput.value = audio.volume.toString();
      volumeBtn.classList.remove('is-volume');
      volumeBtn.setAttribute('aria-label', 'Выключить звук');
    }
  });

  volumeInput.addEventListener('input', () => {
    const value = volumeInput.value;
    audio.volume = +value;

    volumeInput.setAttribute(
      'aria-valuenow',
      Math.round(+value * 100).toString(),
    );

    if (+value == 0) {
      volumeBtn.classList.add('is-volume');
      volumeBtn.setAttribute('aria-label', 'Включить звук');
    } else {
      lastVolume = +value;
      volumeBtn.classList.remove('is-volume');
      volumeBtn.setAttribute('aria-label', 'Выключить звук');
    }
  });

  function formatTime(time = 0) {
    if (!Number.isFinite(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  const setInitialDuration = () => {
    if (audio.duration && !isNaN(audio.duration)) {
      endTime.textContent = formatTime(audio.duration);
    } else {
      endTime.textContent = '0:00';
    }
  };

  audio.addEventListener('loadedmetadata', setInitialDuration);

  audio.addEventListener('timeupdate', () => {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressWrapper.setAttribute(
      'aria-valuenow',
      Math.round(progressPercent).toString(),
    );

    progressBar.style.width = `${progressPercent}%`;

    startTime.textContent = formatTime(audio.currentTime);
  });

  progressWrapper.addEventListener('click', (e) => {
    if (!audio.duration) return;

    const rect = progressWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
  });

  progressWrapper.addEventListener('keydown', (e) => {
    if (!audio.duration) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        audio.currentTime = audio.currentTime + 5;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        audio.currentTime = audio.currentTime - 5;
        break;
    }
  });

  const loadPlayTrack = (index: number, isToggle = false) => {
    if (index === currentIndex && isToggle) {
      const currentItem = trackItems[index] as HTMLElement;
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        playBtn.classList.remove('is-playing');
        currentItem?.classList.remove('is-active');
      } else {
        audio.play();
        isPlaying = true;
        playBtn.classList.add('is-playing');
        currentItem?.classList.add('is-active');
      }
      return;
    }

    currentIndex = index;

    const currentItem = trackItems[currentIndex] as HTMLElement;
    if (!currentItem) return;

    trackItems.forEach((item) => {
      (item as HTMLElement).classList.remove('is-active');
    });

    currentItem.classList.add('is-active');

    const trackSrc = currentItem.dataset.src || '';
    audio.src = trackSrc;

    audio.play();
    isPlaying = true;
    playBtn.classList.add('is-playing');

    playBtn.setAttribute('aria-label', 'Поставить на паузу');
  };

  trackItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      loadPlayTrack(index, true);
    });
  });

  playNext.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    currentIndex = currentIndex + 1;

    if (currentIndex >= trackItems.length) {
      currentIndex = 0;
    }

    loadPlayTrack(currentIndex);
  });

  playPrev.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    currentIndex = currentIndex - 1;

    if (currentIndex < 0) {
      currentIndex = trackItems.length - 1;
    }

    loadPlayTrack(currentIndex);
  });

  playBtn?.addEventListener('click', () => {
    if (currentIndex === -1) {
      loadPlayTrack(0);
      return;
    }

    const currentItem = trackItems[currentIndex] as HTMLElement;

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      currentItem?.classList.remove('is-active');
    } else {
      audio.play();
      isPlaying = true;
      currentItem?.classList.add('is-active');
    }

    playBtn.classList.toggle('is-playing', isPlaying);

    const newLabel = isPlaying
      ? 'Поставить на паузу'
      : 'Воспроизвести саундтрек';
    playBtn.setAttribute('aria-label', newLabel);
  });

  audio.addEventListener('ended', () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= trackItems.length) {
      nextIndex = 0;
    }
    loadPlayTrack(nextIndex);
  });
};
