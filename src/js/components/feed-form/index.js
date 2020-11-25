import * as $                                 from 'jquery';
import { initFormWithValidate, validateForm } from "../form";

export class FeedForm {
   constructor() {
      this.$form = $('#feedback-form');

      if (!this.$form.length) return false;

      this.$formTitle = $('#form-modal__title')
      this.$formMessage = $('#form-modal__message')
      this.$formOpenBtns = $('[data-open-form]')
      this.init();
   }

   init = () => {
      initFormWithValidate(this.$form);

      this.initHandlers();
   }

   initHandlers = () => {
      this.$form.on('submit', this.onSubmit)

      this.$formOpenBtns.on('click', this.openForm)
   }

   openForm = (e) => {
      let title = $(e.currentTarget).attr('data-title');

      if (title) {
         this.$formTitle.text(title)
      }
   }

   onSubmit = async (e) => {
      e.preventDefault();

      let data = this.$form.serialize();

      if (validateForm(this.$form, true)) {
         $.ajax({
            url: '/netcat/add.php',
            type: 'POST',
            dataType: 'text',
            data: data,
            success: res => {
               this.successForm();
            },
            error: res => {
               this.errorForm();
            },
            timeout: 30000
         });
      }
   }

   successForm = () => {
      this.clearForm(this.$form);

      this.$formMessage.find('.title').text('Успешно!');
      this.$formMessage.find('.text').text('Мы получили вашу заявку и скоро свяжемся с вами для уточнения всех деталей');

      this.$formMessage.addClass('show-message');
   };

   errorForm = () => {
      this.$formMessage.find('.title').text('Ошибка');
      this.$formMessage.find('.text').text('Отправка данных не удалась. Попробуйте повторить отправку формы.');

      this.$formMessage.addClass('show-message');

      setTimeout(() => {
         this.$formMessage.removeClass('show-message');
      }, 2500);
   };

   clearForm = form => {
      form[0].reset();
      form
         .find('.field')
         .removeClass('success')
         .addClass('empty');
      form.find('.field input').val('');
   };


}
