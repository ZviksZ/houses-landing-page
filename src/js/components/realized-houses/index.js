import * as $                      from 'jquery';
import { SVG }                     from '@svgdotjs/svg.js';
import { declOfNum, numberFormat } from '../helpers'

export default class RHSelect {
   constructor($block) {
      this.$block = $block;
      this.$drawingBlock = $block.find('[data-drawing_block]');
      this.$drawing = $block.find('[data-drawing]');
      this.$drawingTransparent = $block.find('[data-drawing-transparent]');

      if (!this.$drawing.length) return false;

      this.desktop = null;

      this.items = JSON.parse(this.$drawing.attr('data-items'));

      this.drawingItems = [];
      this.drawingTransparentItems = [];

      this.drawingOptions = {
         id: this.$drawing.attr('id'),
         image: this.$drawing.attr('data-image'),
         colorBase: 'rgba(94, 134, 70, 0.7)',
         colorBaseSold: 'rgba(239, 27, 52, 0.4)',
         colorBaseReserve: 'rgba(255, 255, 255, 0.7)',
         colorFill: 'rgba(115, 167, 68, 0.7)',
         strokeBase: { color: '#fff', opacity: 0.7, width: 0 },
         strokeBaseSold: { color: '#EF1B34', opacity: 0.4, width: 0 },
         strokeFill: { color: '#73A756', opacity: 0.7, width: 0 },
         width: 1920,
         height: 930
      }

      this.drawingTransparentOptions = {
         id: this.$drawingTransparent.attr('id'),
         image: this.$drawingTransparent.attr('data-image'),
         colorBase: 'rgba(0,0,0,0)',
         colorFill: 'rgba(0,0,0,0)',
         strokeBase: { color: '#EF1B34', opacity: 0, width: 2 },
         strokeFill: { color: '#fff', opacity: 0, width: 2 },
         width: 1920,
         height: 930
      }

      this.init();
   }

   init() {
      this.$popupInfo = this.createPopup();
      this.$popupInfoContent = this.$popupInfo.find('.content');

      this.draw = this.drawingInit();
      this.drawTranparent = this.drawingTransparentInit();
      this.addDrawingItems();
      this.drawingResize();

      $(window)
         .on('mousemove', (e) => {
            this.setPopupPosition(e);
         })
         .on('resize', (e) => {
            this.drawingResize();
            this.initEventsHandler();
         });

      // закрытие тултипа
      $('body').on('click', '[data-close-popup-info]', () => {
         this.hidePopup();
         return false;
      });

      // при скроле удаляем кнопку Перемещайте генплан на моб.версии
      this.$drawingBlock.on('scroll', () => {
         if (this.$block.find('.move-button').length) {
            this.$block.find('.move-button').remove();
         }
      });

      this.initEventsHandler();
   }

   /**
    * Обработчик событий холста
    * для десктопа и мобильной версии разные события
    */
   initEventsHandler() {

      const desktop = this.isDesktop();
      if (desktop !== this.desktop) this.desktop = desktop;


      this.$block.off('mouseenter', '.item');
      this.$block.off('mouseleave', '.item');
      this.$block.off('click', '.item');

      if (this.desktop) {
         this.$block
            .on('mouseenter', '.item', e => {
               const id = e.currentTarget.dataset['id'];
               this.handlerMouseenter(this.drawingTransparentItems[id]);
            })
            .on('mouseleave', '.item', e => {
               const id = e.currentTarget.dataset['id'];
               this.handlerMouseleave(this.drawingTransparentItems[id]);
            })
            .on('click', '.item', e => {
               const id = e.currentTarget.dataset['id'];
               this.handlerClick(this.drawingTransparentItems[id]);
               return false;
            });

      } else {
         console.log('initMobile');
         this.$block.on('click', '.item', e => {
            const id = e.currentTarget.dataset['id'];
            this.handlerClickMobile(this.drawingTransparentItems[id]);
            return false;
         });
      }

      this.drawingTransparentItems.forEach((item) => {
         item.off('click');
         item.off('mouseenter');
         item.off('mouseleave');

         if (this.desktop) {
            item
               .on('mouseenter', () => {
                  this.handlerMouseenter(item);
               })
               .on('mouseleave', () => {
                  this.handlerMouseleave(item);
               })
               .on('click', () => {
                  this.handlerClick(item);
               });

         } else {
            console.log('initMobile');
            item.on('click', () => {
               this.handlerClickMobile(item);
               return false;
            });
         }

      })
   }

   drawingInit() {
      const draw = SVG().addTo(`#${this.drawingOptions.id}`);

      draw.viewbox(0, 0, this.drawingOptions.width, this.drawingOptions.height);

      const image = draw.image(this.drawingOptions.image);
      image.size('100%', '100%').move(0, 0);

      return draw;
   }

   drawingTransparentInit() {
      const drawTransparent = SVG().addTo(`#${this.drawingTransparentOptions.id}`);

      drawTransparent.viewbox(0, 0, this.drawingTransparentOptions.width, this.drawingTransparentOptions.height);

      const image = drawTransparent.image(this.drawingTransparentOptions.image);
      image.size('100%', '100%').move(0, 0);

      return drawTransparent;
   }

   drawingResize() {
      const kHW = this.drawingOptions.height / this.drawingOptions.width;
      const kWH = this.drawingOptions.width / this.drawingOptions.height;
      const blockWidth = this.$block.width();
      const blockHeight = this.$block.height();
      const kBlock = blockHeight / blockWidth;

      let widthDrawing = blockWidth;
      let heightDrawing = blockWidth * kHW;

      if (widthDrawing < 1000) {
         heightDrawing = 480;
         widthDrawing = heightDrawing * kWH;
      }

      let scale = widthDrawing / 1920 + 0.2;
      if (scale > 1) scale = 1;
      this.$block.find('.item').css({
         'transform': `translateX(-50%) translateY(-50%) scale(${scale})`
      });

      this.$drawing.css({
         width: `${widthDrawing}px`,
         height: `${heightDrawing}px`,
         marginLeft: `${-widthDrawing / 2}px`,
         marginTop: `${-heightDrawing / 2}px`
      });

      this.$drawingTransparent.css({
         width: `${widthDrawing}px`,
         height: `${heightDrawing}px`,
         marginLeft: `${-widthDrawing / 2}px`,
         marginTop: `${-heightDrawing / 2}px`
      });
   }

   /**
    * Добавлеине навигационных элементов секций
    * @returns {boolean}
    */
   addDrawingItems() {
      for (let i = 0; i < this.items.length; i++) {
         const item = this.items[i];
         if (!item.id) continue;

         this.addItemSVG(item);
         //this.addItemBalloon(item);
      }
   }

   /**
    * Добавление SVG элемента на холст
    * @param {Object} item - данные о секции
    */
   addItemSVG(item = {}) {
      const {
         id = null,
         name = '',
         nameType = '',
         status = '',
         href = '',
         coords = '',
         price = '',
         img = '',
         type = ''
      } = item;

      this.drawingItems[id] = this.draw.polygon(coords);

      if (status && status === '1') {
         this.drawingItems[id].fill(this.drawingOptions.colorBase);
      } else if (status && status === '2') {
         this.drawingItems[id].fill(this.drawingOptions.colorBaseReserve);
      } else if (status && status === '3') {
         this.drawingItems[id].fill(this.drawingOptions.colorBaseSold);
      }

      this.drawingItems[id].stroke(this.drawingOptions.strokeBase);
      this.drawingItems[id].style('cursor', 'pointer');
      this.drawingItems[id].data({
         id,
         href,
         coords,
         name,
         nameType,
         status,
         price,
         img,
         type
      });


      this.drawingTransparentItems[id] = this.drawTranparent.polygon(coords);
      this.drawingTransparentItems[id].fill(this.drawingTransparentOptions.colorBase);
      this.drawingTransparentItems[id].stroke(this.drawingTransparentOptions.strokeBase);
      this.drawingTransparentItems[id].style('cursor', 'pointer');
      this.drawingTransparentItems[id].data({
         id,
         href,
         coords,
         name,
         nameType,
         status,
         price,
         img,
         type
      });
   }

   /**
    * Обработчик наведения на объект
    * @param {Object} item - svg.js объект
    */
   handlerMouseenter(item) {
      let id = item.data('id');
      let status = item.data('status');



      if (status == '1') {
         this.drawingItems[id].fill(this.drawingOptions.colorFill);
         this.drawingItems[id].stroke(this.drawingOptions.strokeFill);

         item.fill(this.drawingTransparentOptions.colorFill);
         item.stroke(this.drawingTransparentOptions.strokeFill);

         this.setDataPopup(item);
         this.showPopup();
      }


   }

   /**
    * Обработчик ухода курсора с объекта
    * @param {Object} item - svg.js объект
    */
   handlerMouseleave(item) {
      let id = item.data('id');
      let status = item.data('status');

      if (status == '1') {
         this.drawingItems[id].fill(this.drawingOptions.colorBase);
      }
      this.drawingItems[id].stroke(this.drawingOptions.strokeBase);

      item.fill(this.drawingTransparentOptions.colorBase);
      item.stroke(this.drawingTransparentOptions.strokeBase);
      this.hidePopup();
   }

   /**
    * Обработчик клика на объект - десктоп
    * @param {Object} item - svg.js объект
    */
   handlerClick(item) {
      let status = item.data('status');

      if (status == '1') {
         window.location.href = item.data('href');
         return false;
      }


   }

   /**
    * Обработчик клика на объект - мобильные устройства
    * @param {Object} item - svg.js объект
    */
   handlerClickMobile(item) {
      let status = item.data('status');

      if (status == '1') {
         // открываем попап
         this.setDataPopup(item);
         this.showPopup();
      }
   }

   /**
    * Определение десктопа
    * @returns {boolean}
    */
   isDesktop() {
      return (window.innerWidth > 1000);
   }

   /**
    * Позиционирование тултипа
    * @param {Object} e - объект с параметрами курсора
    */
   setPopupPosition(e) {
      const mouseX = e.clientX + document.body.scrollLeft;
      const mouseY = e.clientY + document.body.scrollTop;

      let top = mouseY + 25;
      let left = mouseX + 15;
      const tooltipHeight = this.$popupInfo.height() + 30;
      const tooltipWidth = this.$popupInfo.width() + 15;

      //условия, чтобы тултип не ушел за вьюпорт
      if ( (mouseY + tooltipHeight) > $(window).height()) {
         top = top - tooltipHeight;
      }

      if ( (mouseX + tooltipWidth) > $(window).width()) {
         left = left - tooltipWidth;
      }

      const style = {
         left: `${left}px`,
         top: `${top}px`
      };

      this.$popupInfo.css(style);
   }

   /**
    * Показ тултипа
    */
   showPopup() {
      this.$popupInfo.addClass('show');
      setTimeout(() => {
         this.$popupInfo.addClass('show-effect');
      }, 5);
   }

   /**
    * Закрытие тултипа
    */
   hidePopup() {
      if (this.desktop) {
         this.$popupInfo.removeClass('show show-effect');
         this.clearPopup();

      } else {
         this.$popupInfo.removeClass('show-effect');
         setTimeout(() => {
            this.$popupInfo.removeClass('show');
            this.clearPopup();
         }, 400);
      }
   }

   /**
    * Создание тултипа
    * @return {HTMLElement} созданный тултип
    */
   createPopup() {
      $('body').append(`
            <div id="popup_info" class="popup-info">
                <div class="content"></div>
            </div>
        `);

      return $('#popup_info');
   }

   /**
    * Добавление данных в тултип
    * @param {Object} item - svg.js объект
    */
   setDataPopup(item = {}) {
      const href = item.data('href');
      const name = item.data('name');
      const nameType = item.data('nameType');
      const status = item.data('status');
      const price = item.data('price');
      const img = item.data('img');
      const type = item.data('type');
      const id = item.data('id');

      const priceFormated = numberFormat(price)
      const headHTML = `
            <div class="head">
                <div class="img" style="background-image: url(${img})"></div>
                <div class="info">
                    <div class="title">${name}</div>
                    <div class="subtitle">${nameType}</div>
                    <div class="price">${priceFormated} ₽</div>
                </div>             
                
            </div>
        `;

      const buttonHTML = `
            <div class="popup__footer text-align-center hide-desktop">
                <a href="${href}" data-open-modal-button="house-modal"
               data-effect-type="open-modal-fade-effect" data-house="${type}" class="button">Подробнее</a>                
                <a href="#" class="popup__footer-close" data-close-popup-info>Закрыть</a>
            </div>
        `;

      const popupHTML = headHTML + buttonHTML;
      this.$popupInfoContent.html(popupHTML);
   }

   /**
    * Очистка HTML тултипа
    */
   clearPopup() {
      this.$popupInfoContent.html('');
   }
}
