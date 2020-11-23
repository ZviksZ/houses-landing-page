import * as $ from 'jquery';

export class Header {
   constructor() {
      this.$header = $('#header');
      this.headerClassName = 'header-bg';

      this.init();
   }

   init = () => {
      this.refreshStateHeader();

      $(window).on('scroll', this.refreshStateHeader);
   };

   refreshStateHeader = e => {
      if (window.innerWidth >= 1000) {
         if (pageYOffset > 100) {
            this.$header.addClass(this.headerClassName);
         } else {
            this.$header.removeClass(this.headerClassName);
         }
      }
   };
}
