let currentIndex = -1;
let isPlaying = false;
let mainTrackSourcesCache: string[] = [];
let bonusTrackSourcesCache: string[] = [];
let activePlayerContext: 'main' | 'bonus' | null = null;
let lastVolume = 0.5;

declare global {
  interface HTMLAudioElement {
    hasGlobalListeners?: boolean;
  }
}

function formatTime(time: number): string {
  if (isNaN(time) || !isFinite(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const initGlobalAudioListeners = (audio: HTMLAudioElement) => {
  if (audio.hasGlobalListeners) return;
  audio.hasGlobalListeners = true;

  audio.addEventListener('play', () => {
    isPlaying = true;
    updateUIStates(true, audio);
  });

  audio.addEventListener('pause', () => {
    isPlaying = false;
    updateUIStates(false, audio);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;

    const isCurrentlyOnBonusPage = !!document.querySelector(
      '.bonus-track__container',
    );
    const currentScreenContext = isCurrentlyOnBonusPage ? 'bonus' : 'main';

    const currentContainer = isCurrentlyOnBonusPage
      ? document.querySelector('.bonus-track__container')
      : document.querySelector('[data-player][data-is-widget="false"]');

    const progressLine = currentContainer?.querySelector(
      '[data-progress-bar]',
    ) as HTMLElement;
    const startTime = currentContainer?.querySelector(
      '[data-start-time]',
    ) as HTMLElement;

    if (activePlayerContext === currentScreenContext) {
      if (progressLine) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progressLine.style.width = `${progressPercent}%`;
      }
      if (startTime) {
        startTime.textContent = formatTime(audio.currentTime);
      }
    } else {
      if (progressLine) progressLine.style.width = '0%';
      if (startTime) startTime.textContent = '0:00';

      const playBtn = currentContainer?.querySelector('[data-play]');
      if (playBtn) playBtn.classList.remove('is-playing');
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    const isCurrentlyOnBonusPage = !!document.querySelector(
      '.bonus-track__container',
    );
    const currentScreenContext = isCurrentlyOnBonusPage ? 'bonus' : 'main';

    const currentContainer = isCurrentlyOnBonusPage
      ? document.querySelector('.bonus-track__container')
      : document.querySelector('[data-player][data-is-widget="false"]');

    const endTime = currentContainer?.querySelector(
      '[data-end-time]',
    ) as HTMLElement;

    if (activePlayerContext === currentScreenContext && endTime) {
      endTime.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('ended', () => {
    const currentCache =
      activePlayerContext === 'bonus'
        ? bonusTrackSourcesCache
        : mainTrackSourcesCache;
    if (currentCache.length === 0) return;

    currentIndex++;
    if (currentIndex >= currentCache.length) {
      currentIndex = 0;
    }

    if (currentCache[currentIndex]) {
      audio.src = currentCache[currentIndex];
      audio.load();
      audio.play().catch(() => {});
    }
  });
};

const updateUIStates = (playing: boolean, audio: HTMLAudioElement) => {
  const isCurrentlyOnBonusPage = !!document.querySelector(
    '.bonus-track__container',
  );
  const currentScreenContext = isCurrentlyOnBonusPage ? 'bonus' : 'main';

  const mainContainer = document.querySelector(
    '[data-player][data-is-widget="false"]',
  );
  const widgetContainer = document.querySelector(
    '[data-player][data-is-widget="true"]',
  );

  const mainPlayBtn = mainContainer?.querySelector('[data-play]');
  if (mainPlayBtn) {
    mainPlayBtn.classList.toggle(
      'is-playing',
      playing && activePlayerContext === currentScreenContext,
    );
  }

  const widgetPlayBtn = widgetContainer?.querySelector('[data-play]');
  if (widgetPlayBtn) {
    widgetPlayBtn.classList.toggle('is-playing', playing);
  }

  const trackItems = document.querySelectorAll('[data-track-item]');
  trackItems.forEach((item) => {
    const itemSrc = (item as HTMLElement).dataset.src || '';
    const currentAudioSrc = window.location.origin
      ? audio.src.replace(window.location.origin, '')
      : audio.src;
    const shouldBeActive =
      playing &&
      itemSrc === currentAudioSrc &&
      activePlayerContext === currentScreenContext;
    item.classList.toggle('is-active', shouldBeActive);
  });
};

export const initPlayer = () => {
  const audio = document.querySelector('[data-main-audio]') as HTMLAudioElement;
  if (!audio) return;

  initGlobalAudioListeners(audio);

  const isBonusPage = !!document.querySelector('.bonus-track__container');
  const currentScreenContext = isBonusPage ? 'bonus' : 'main';

  const mainContainer = document.querySelector(
    '[data-player][data-is-widget="false"]',
  ) as HTMLDivElement;
  const widgetContainer = document.querySelector(
    '[data-player][data-is-widget="true"]',
  ) as HTMLDivElement;

  if (!mainContainer && !widgetContainer) return;

  const contextSelector = isBonusPage
    ? '.bonus-track__container'
    : '.media-panel';
  const pageContainer = document.querySelector(contextSelector);
  const trackItems = pageContainer
    ? pageContainer.querySelectorAll('[data-track-item]')
    : [];

  if (trackItems.length > 0) {
    const sources = Array.from(trackItems).map(
      (item) => (item as HTMLElement).dataset.src || '',
    );
    if (isBonusPage) {
      bonusTrackSourcesCache = sources;
    } else {
      mainTrackSourcesCache = sources;
    }
  }

  updateUIStates(!audio.paused, audio);

  const currentAudioSrc = window.location.origin
    ? audio.src.replace(window.location.origin, '')
    : audio.src;
  const currentCache =
    currentScreenContext === 'bonus'
      ? bonusTrackSourcesCache
      : mainTrackSourcesCache;
  if (activePlayerContext === currentScreenContext) {
    currentIndex = currentCache.indexOf(currentAudioSrc);
  }

  const endTime = mainContainer?.querySelector(
    '[data-end-time]',
  ) as HTMLSpanElement;
  if (
    endTime &&
    activePlayerContext === currentScreenContext &&
    audio.duration
  ) {
    endTime.textContent = formatTime(audio.duration);
  }

  const loadPlayTrack = (index: number, isToggle = false) => {
    const activeCache =
      currentScreenContext === 'bonus'
        ? bonusTrackSourcesCache
        : mainTrackSourcesCache;

    if (
      index === currentIndex &&
      isToggle &&
      activePlayerContext === currentScreenContext
    ) {
      if (!audio.paused) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
      return;
    }

    if (activePlayerContext !== currentScreenContext) {
      audio.pause();
      audio.currentTime = 0;
      activePlayerContext = currentScreenContext;
    }

    currentIndex = index;
    const targetSrc = activeCache[currentIndex];

    if (targetSrc) {
      audio.src = targetSrc;
      audio.load();
      audio.play().catch((err) => console.log('Playback error:', err));
    }
  };

  const setupSafeClick = (
    element: Element | null,
    callback: (e: Event) => void,
  ) => {
    if (!element) return;
    const newElement = element.cloneNode(true);
    element.parentNode?.replaceChild(newElement, element);
    newElement.addEventListener('click', callback);
    return newElement as Element;
  };

  setupSafeClick(mainContainer?.querySelector('[data-play]'), (e) => {
    e.preventDefault();
    const activeCache =
      currentScreenContext === 'bonus'
        ? bonusTrackSourcesCache
        : mainTrackSourcesCache;
    if (activeCache.length === 0) return;

    if (activePlayerContext !== currentScreenContext) {
      loadPlayTrack(0, true);
    } else {
      if (currentIndex === -1) currentIndex = 0;
      loadPlayTrack(currentIndex, true);
    }
  });

  setupSafeClick(mainContainer?.querySelector('[data-prev]'), (e) => {
    e.preventDefault();
    const activeCache =
      currentScreenContext === 'bonus'
        ? bonusTrackSourcesCache
        : mainTrackSourcesCache;
    if (activeCache.length === 0) return;

    if (activePlayerContext !== currentScreenContext) {
      loadPlayTrack(0, false);
      return;
    }

    currentIndex--;
    if (currentIndex < 0) currentIndex = activeCache.length - 1;
    loadPlayTrack(currentIndex, false);
  });

  setupSafeClick(mainContainer?.querySelector('[data-next]'), (e) => {
    e.preventDefault();
    const activeCache =
      currentScreenContext === 'bonus'
        ? bonusTrackSourcesCache
        : mainTrackSourcesCache;
    if (activeCache.length === 0) return;

    if (activePlayerContext !== currentScreenContext) {
      loadPlayTrack(0, false);
      return;
    }

    currentIndex++;
    if (currentIndex >= activeCache.length) currentIndex = 0;
    loadPlayTrack(currentIndex, false);
  });

  setupSafeClick(widgetContainer?.querySelector('[data-play]'), (e) => {
    e.preventDefault();
    if (!audio.src) return;
    if (!audio.paused) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  });

  setupSafeClick(widgetContainer?.querySelector('[data-prev]'), (e) => {
    e.preventDefault();
    const activeCache =
      activePlayerContext === 'bonus'
        ? bonusTrackSourcesCache
        : mainTrackSourcesCache;
    if (activeCache.length === 0 || currentIndex === -1) return;

    currentIndex--;
    if (currentIndex < 0) currentIndex = activeCache.length - 1;

    const targetSrc = activeCache[currentIndex];
    if (targetSrc) {
      audio.src = targetSrc;
      audio.load();
      audio.play().catch(() => {});
    }
  });

  setupSafeClick(widgetContainer?.querySelector('[data-next]'), (e) => {
    e.preventDefault();
    const activeCache =
      activePlayerContext === 'bonus'
        ? bonusTrackSourcesCache
        : mainTrackSourcesCache;
    if (activeCache.length === 0 || currentIndex === -1) return;

    currentIndex++;
    if (currentIndex >= activeCache.length) currentIndex = 0;

    const targetSrc = activeCache[currentIndex];
    if (targetSrc) {
      audio.src = targetSrc;
      audio.load();
      audio.play().catch(() => {});
    }
  });

  trackItems.forEach((item, index) => {
    setupSafeClick(item, (e) => {
      e.preventDefault();
      loadPlayTrack(index, true);
    });
  });
  const progressWrapper = mainContainer?.querySelector(
    '[data-progress-wrapper]',
  ) as HTMLDivElement;
  if (progressWrapper) {
    const newProgressWrapper = progressWrapper.cloneNode(true);
    progressWrapper.parentNode?.replaceChild(
      newProgressWrapper,
      progressWrapper,
    );
    newProgressWrapper.addEventListener('click', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = (newProgressWrapper as HTMLElement).getBoundingClientRect();
      const clickX = mouseEvent.clientX - rect.left;
      const width = rect.width;
      const clickPercent = clickX / width;
      if (audio.duration) {
        audio.currentTime = clickPercent * audio.duration;
      }
    });
  }
  const volumeInput = mainContainer?.querySelector(
    '[data-volume-input]',
  ) as HTMLInputElement;

  const volumeBtn = mainContainer?.querySelector(
    '[data-volume-btn]',
  ) as HTMLButtonElement;

  if (audio && volumeInput) {
    audio.volume = parseFloat(volumeInput.value);
  }

  if (audio && volumeInput && volumeBtn) {
    audio.volume = 0.5;
    volumeInput.value = (0.5).toString();

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
};
