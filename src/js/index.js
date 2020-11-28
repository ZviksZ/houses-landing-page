import * as $                                                from 'jquery';
import { CustomSelect }                                      from './components/custom-select';
import { CustomTabs }                                        from './components/custom-tabs';
import { Effects }                                           from './components/effects';
import { FeedForm }                                          from './components/feed-form';
import { initMaskedInput, initMoneyInput, initPlaceholders } from './components/form';
import { Header }                                            from './components/header';
import { HeaderMenu }                                        from './components/header-menu';
import { HousesModal }                                       from './components/houses-modal';
import { InfrastructureMap }                                 from './components/infrastructure';
import { ModalGallery }                                      from './components/modal-gallery';
import { ModalWindowFullScreen }                             from './components/modal-window-fullscreen';
import { NewsModal }                                         from './components/news-modal';
import { Parallax }                                          from './components/parallax';
import RHSelect                                              from './components/realized-houses';
window.jQuery = require('jquery');

$(function() {
   // главное меню на мобильном
   new Header();
   new HeaderMenu();

   new Effects();

   // инициализация плагина кастомных селектов
   new CustomSelect();

   // функционал табов
   new CustomTabs();

   // галерея в модалке
   new ModalGallery();

   //Модалка с описанием домов
   new HousesModal();

   //Модалка новостей
   new NewsModal();

   // форма обратной связи
   new FeedForm();

   //Генплан, выбор домов
   new RHSelect($('#rh_sections'));

   //Паралакс эффект
   new Parallax();

   //Карта инфраструктуры
   new InfrastructureMap();

   // инициализация функционала модальных окон
   let modal = new ModalWindowFullScreen();

   // Инициализация плейсхолдеров и масок
   initMaskedInput();
   initPlaceholders();
   initMoneyInput();

   $(`a[href*="#"]`).click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
         && location.hostname == this.hostname) {
         var $target = $(this.hash);
         $target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
         if ($target.length) {
            var targetOffset = $target.offset().top - $('#header').height();
            $('html,body').animate({scrollTop: targetOffset}, 1000);
            return false;
         }
      }
   });

   $('.header-menu .header-menu__nav a').on('click', () => {
      $('html').removeClass('header-menu-open');
   })

   setTimeout(() => {
      $('.preloader').addClass('preloader-hide');
   }, 200);
});
