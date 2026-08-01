import { Fancybox } from '@fancyapps/ui';

export function initFancybox() {
  Fancybox.bind("[data-fancybox='gallery']", {
    showClass: 'f-fadeIn',
    hideClass: 'f-fadeOut',

    Carousel: {
      transition: 'slide',
      Toolbar: {
        display: {
          right: ['toggleFull', 'close'],
        },
      },
    },
  });
}
