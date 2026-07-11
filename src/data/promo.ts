import type { PromoDataT } from '@appTypes/promoTypes';

export const promoData: PromoDataT = {
  title: 'Silence Tends to Destroy',
  plot: 'Юбилейный релиз. 10 лет с момента выхода альбома, который определил звучание локальной деткор-сцены.',
  poster: 'img/poster/poster-bg.jpg',
  genre: 'Progressive Metalcore / Melodic Metalcore',
  releaseName: 'Your Death Is My Salvation',
  releaseYear: 2016,
  runtime: '18 минут',
  tracks: [
    {
      id: 1,
      title: 'Cruelshow',
      duration: '3:03',
      fileUrl: '/audio/01-intro.mp3',
    },
    {
      id: 2,
      title: 'Embrace of Sorrow',
      duration: '4:23',
      fileUrl: '/audio/02-sttd.mp3',
    },
    {
      id: 2,
      title: 'Dead Honesty',
      duration: '3:19',
      fileUrl: '/audio/02-sttd.mp3',
    },
    {
      id: 2,
      title: 'Cold Sky',
      duration: '3:22',
      fileUrl: '/audio/02-sttd.mp3',
    },
    {
      id: 2,
      title: 'Time',
      duration: '4:46',
      fileUrl: '/audio/02-sttd.mp3',
    },
  ],
};
