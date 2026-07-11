import type { PromoDataT } from '@appTypes/promoTypes';

export const promoData: PromoDataT = {
  title: 'Silence Tends to Destroy',
  plot: 'Юбилейный релиз. 10 лет с момента выхода альбома, который определил звучание локальной деткор-сцены...',
  poster: 'img/poster/poster-bg.jpg',
  releaseName: 'Название Альбома / Сингла',
  releaseYear: 2016,
  tracks: [
    {
      id: 1,
      title: 'Intro',
      duration: '1:45',
      fileUrl: '/audio/01-intro.mp3',
    },
    {
      id: 2,
      title: 'Silence Tends to Destroy',
      duration: '4:12',
      fileUrl: '/audio/02-sttd.mp3',
    },
  ],
};
