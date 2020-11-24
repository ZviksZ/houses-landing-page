import * as $                                                from 'jquery';
import { CustomSelect }                                      from './components/custom-select';
import { CustomTabs }                                        from './components/custom-tabs';
import { Effects }                                           from './components/effects';
import { FeedForm }                                          from './components/feed-form';
import { initMaskedInput, initMoneyInput, initPlaceholders } from './components/form';
import { Header }                                            from './components/header';
import { HeaderMenu }                                        from './components/header-menu';
import { ModalGallery }                                      from './components/modal-gallery';
import { ModalWindowFullScreen }                             from './components/modal-window-fullscreen';
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

   // форма подписки на рассылку новостей
   new FeedForm();

   // инициализация функционала модальных окон
   let modal = new ModalWindowFullScreen();

   // Инициализация плейсхолдеров и масок
   initMaskedInput();
   initPlaceholders();
   initMoneyInput();

   setTimeout(() => {
      $('.preloader').addClass('preloader-hide');
   }, 200);
});
