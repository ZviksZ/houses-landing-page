import * as $ from 'jquery';
import Swiper from 'swiper/js/swiper.min.js';

export class HousesModal {
   constructor() {
      this.$modal = $('#house-modal');

      if (!this.$modal.length) return false;

      this.slidersInit = [];

      this.init();
   }

   init = () => {
      // this.initModalSliders();
      this.initModalOpen();
   };

   initModalOpen = () => {
      $('body').on('click', 'a[data-house]', e => {
         let currentHouse = $(e.currentTarget).attr('data-house');

         this.$modal.find('.modal-content').addClass('hide');
         this.$modal.find('.modal-content[data-house="' + currentHouse + '"]').removeClass('hide');

         if (!this.slidersInit.includes(currentHouse)) {
            this.initModalSliders(currentHouse);
            this.slidersInit.push(currentHouse);
         }
      });
   };

   initModalSliders = currentHouse => {
      new Swiper($('.modal-content[data-house="' + currentHouse + '"] .house-modal__slider'), {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         lazy: true,
         resistance: false,
         slidesPerView: 1,
         centeredSlides: true,
         centeredSlidesBounds: true,
         spaceBetween: 0,
         pagination: {
            el: '.modal-content[data-house="' + currentHouse + '"] .swiper-pagination',
            clickable: true
         }
      });
   };
}
