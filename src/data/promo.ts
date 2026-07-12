import type { PromoDataT } from '@appTypes/promoTypes';

export const promoData: PromoDataT = {
  title: 'Silence Tends to Destroy',
  plot: 'Юбилейный релиз. 10 лет с момента выхода альбома, который определил звучание локальной деткор-сцены.',
  poster: 'img/poster/poster-bg.jpg',
  cover: 'img/poster/cover.jpg',
  genre: 'Progressive Metalcore / Melodic Metalcore',
  releaseName: 'Your Death Is My Salvation',
  releaseYear: 2016,
  runtime: '18 минут',
  tracks: [
    {
      id: 1,
      title: 'Cruelshow',
      duration: '3:03',
      fileUrl: '/audio/Cruelshow.mp3',
    },
    {
      id: 2,
      title: 'Embrace of Sorrow',
      duration: '4:23',
      fileUrl: '/audio/Embrace-of-Sorrow.mp3',
    },
    {
      id: 3,
      title: 'Dead Honesty',
      duration: '3:19',
      fileUrl: '/audio/Dead-Honesty.mp3',
    },
    {
      id: 4,
      title: 'Cold Sky',
      duration: '3:22',
      fileUrl: '/audio/Cold-Sky.mp3',
    },
    {
      id: 5,
      title: 'Time',
      duration: '4:46',
      fileUrl: '/audio/Time.mp3',
    },
  ],
};
