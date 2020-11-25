import * as $ from 'jquery';

export class NewsModal {
   constructor() {
      this.$modal = $('#news-modal');

      if (!this.$modal.length) return false;

      this.init();
   }

   init = () => {
      // this.initModalSliders();
      this.initModalOpen();
   };

   initModalOpen = () => {
      $('.section-news__list .item').on('click', e => {
         let currentHouse = $(e.currentTarget).attr('data-news');

         this.$modal.find('.modal-content').addClass('hide');
         this.$modal.find('.modal-content[data-news="' + currentHouse + '"]').removeClass('hide');
      });
   };
}
