let currentIndex = -1;
let isPlaying = false;
let globalTrackSources: string[] = [];

export const initPlayer = () => {
  const audio = document.querySelector('[data-main-audio]') as HTMLAudioElement;
  const trackItems = document.querySelectorAll('[data-track-item]');

  const mainContainer = document.querySelector(
    '[data-player][data-is-widget="false"]',
  ) as HTMLDivElement;

  const mainPlayBtn = mainContainer?.querySelector('[data-play]');
  const mainPlayPrev = mainContainer?.querySelector('[data-prev]');
  const mainPlayNext = mainContainer?.querySelector('[data-next]');
  const progressWrapper = mainContainer?.querySelector(
    '[data-progress-wrapper]',
  ) as HTMLDivElement;
  const progressBar = mainContainer?.querySelector(
    '[data-progress-bar]',
  ) as HTMLDivElement;
  const startTime = mainContainer?.querySelector(
    '[data-start-time]',
  ) as HTMLSpanElement;
  const endTime = mainContainer?.querySelector(
    '[data-end-time]',
  ) as HTMLSpanElement;
  const volumeInput = mainContainer?.querySelector(
    '[data-volume-input]',
  ) as HTMLInputElement;
  const volumeBtn = mainContainer?.querySelector(
    '[data-volume-btn]',
  ) as HTMLButtonElement;

  const widgetContainer = document.querySelector(
    '[data-player][data-is-widget="true"]',
  ) as HTMLDivElement;

  const widgetPlayBtn = widgetContainer?.querySelector('[data-play]');
  const widgetPlayPrev = widgetContainer?.querySelector('[data-prev]');
  const widgetPlayNext = widgetContainer?.querySelector('[data-next]');

  if (!audio || (!mainContainer && !widgetContainer)) return;

  // let currentIndex = -1;
  // let isPlaying = false;

  // Если мы зашли на страницу, где есть список треков, запоминаем их адреса в память файла
  if (trackItems.length > 0) {
    globalTrackSources = Array.from(trackItems).map(
      (item) => (item as HTMLElement).dataset.src || '',
    );
  }

  const togglePlayUI = (playing: boolean) => {
    if (mainPlayBtn) mainPlayBtn.classList.toggle('is-playing', playing);
    if (widgetPlayBtn) widgetPlayBtn.classList.toggle('is-playing', playing);
  };

  // Мгновенно синхронизируем кнопки при открытии новой страницы под текущую реальность
  togglePlayUI(isPlaying);

  // if (audio.src && trackItems.length > 0) {
  //   trackItems.forEach((item, idx) => {
  //     if (
  //       (item as HTMLElement).dataset.src &&
  //       audio.src.includes((item as HTMLElement).dataset.src!)
  //     ) {
  //       currentIndex = idx;
  //     }
  //   });
  // }

  // Синхронизируем и снимаем класс активного трека в списке
  const syncActiveTrackUI = () => {
    if (trackItems.length > 0) {
      trackItems.forEach((item, idx) => {
        const shouldBeActive = idx === currentIndex && isPlaying;
        (item as HTMLElement).classList.toggle('is-active', shouldBeActive);
      });
    }
  };
  syncActiveTrackUI();

  function formatTime(time = 0) {
    if (!Number.isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  audio.addEventListener('pause', () => {
    isPlaying = false;
    togglePlayUI(false);

    syncActiveTrackUI();
  });

  audio.addEventListener('play', () => {
    isPlaying = true;
    togglePlayUI(true);

    syncActiveTrackUI();
  });

  const loadPlayTrack = (index: number, isToggle = false) => {
    if (index === currentIndex && isToggle) {
      if (!audio.paused) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
      return;
    }

    currentIndex = index;
    // Если список есть на странице (мы в плеере), берем src оттуда
    if (trackItems.length > 0 && trackItems[currentIndex]) {
      const currentItem = trackItems[currentIndex] as HTMLElement;
      audio.src = currentItem.dataset.src || '';
    } else {
      // Если списка на странице нет (мы в виджете), берем сохраненный адрес из памяти файла!
      const savedSrc = globalTrackSources[currentIndex];
      if (savedSrc) audio.src = savedSrc;
    }

    if (audio.src) {
      audio.play().catch(() => {});
    }
  };

  mainPlayBtn?.addEventListener('click', () => {
    if (currentIndex === -1) return loadPlayTrack(0);
    loadPlayTrack(currentIndex, true);
  });

  mainPlayNext?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (globalTrackSources.length === 0) return;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= globalTrackSources.length) nextIndex = 0;
    loadPlayTrack(nextIndex);
  });

  mainPlayPrev?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (globalTrackSources.length === 0) return;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = globalTrackSources.length - 1;
    loadPlayTrack(prevIndex);
  });

  widgetPlayBtn?.addEventListener('click', () => {
    if (currentIndex === -1) return loadPlayTrack(0);
    loadPlayTrack(currentIndex, true);
  });

  widgetPlayNext?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (globalTrackSources.length === 0) return;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= globalTrackSources.length) nextIndex = 0;
    loadPlayTrack(nextIndex);
  });

  widgetPlayPrev?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (globalTrackSources.length === 0) return;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = globalTrackSources.length - 1;
    loadPlayTrack(prevIndex);
  });

  trackItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      loadPlayTrack(index, true);
    });
  });

  if (audio && volumeInput && volumeBtn) {
    audio.volume = 0.5;
    volumeInput.value = (0.5).toString();
    let lastVolume = 0.5;

    volumeBtn.addEventListener('click', () => {
      if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeInput.value = '0';
        volumeBtn.classList.add('is-volume');
      } else {
        audio.volume = lastVolume > 0 ? lastVolume : 0.5;
        volumeInput.value = audio.volume.toString();
        volumeBtn.classList.remove('is-volume');
      }
    });

    volumeInput.addEventListener('input', () => {
      const value = volumeInput.value;
      audio.volume = +value;
      if (+value == 0) {
        volumeBtn.classList.add('is-volume');
      } else {
        lastVolume = +value;
        volumeBtn.classList.remove('is-volume');
      }
    });
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    if (progressBar && startTime && progressWrapper) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
      startTime.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    if (endTime && audio.duration && !isNaN(audio.duration)) {
      endTime.textContent = formatTime(audio.duration);
    }
  });

  progressWrapper?.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    audio.currentTime = (clickX / width) * audio.duration;
  });

  audio.addEventListener('ended', () => {
    if (globalTrackSources.length === 0) return;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= globalTrackSources.length) nextIndex = 0;
    loadPlayTrack(nextIndex);
  });
};
