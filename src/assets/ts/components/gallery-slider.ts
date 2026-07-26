import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

export const initGallerySlider = () => {
  const swiperElement = document.querySelector('.photos__swiper');
  if (!swiperElement) return;

  new Swiper('.photos__swiper', {
    modules: [Navigation, Pagination],
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    resistanceRatio: 0.1,

    breakpoints: {
      320: {
        slidesPerView: 1.3,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 32,
      },
      1200: {
        slidesPerView: 2.5,
        spaceBetween: 40,
      },
    },

    navigation: {
      nextEl: '.photos__btn--next',
      prevEl: '.photos__btn--prev',
    },

    pagination: {
      el: '.photos__pagination',
      type: 'fraction',
      formatFractionCurrent: (number) => String(number).padStart(2, '0'),
      formatFractionTotal: (number) => String(number).padStart(2, '0'),
      renderFraction: function (currentClass, totalClass) {
        return `<span class="${currentClass}"></span><span class="photos__divider">/</span><span class="${totalClass}"></span>`;
      },
    },
  });
};
