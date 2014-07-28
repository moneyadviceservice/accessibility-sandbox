;(function($, window) {
  'use strict';

  function FormValidator(options) {
    this.options = options || {};

    this.requiredFieldSelector = options.requiredFieldSelector || '[aria-required]';
    this.inputParentSelector = options.inputParentSelector || '.form__row';
    this.inputGroupItemSelector = options.inputGroupItemSelector || '.form__group-item';
    this.errorContainer = options.errorContainer || '.js-error-container';
    this.alertSelector = options.alertSelector || '.js-alert';
    this.requiredFields = [];
    this.summaryIsVisible = false;
    this.eventType = null;
    this.$form = $(options.formSelector);
    this.$currentField = null;
    this.$errorSummary = $('.js-error-summary');
    this.$errorCount = $('.js-error-count');
    this.$errorList = $('.js-error-list');
    this.$alert = $(this.alertSelector);
    this.invalidFields = [];
    this.validClass = options.validClass || 'is-valid';
    this.parentInvalidClass = options.parentInvalidClass || 'is-errored';
    this.invalidClass = options.invalidClass || 'is-invalid';
    this.formIsValid = null;
    this.formIsSubmitted = false;
    this.handleFieldBlur = $.proxy(this.handleFieldBlur, this);
    this.handleFormSubmit = $.proxy(this.handleFormSubmit, this);
    this.validateOnBlur = options.validateOnBlur || true;

    this.init();
  }

  FormValidator.prototype.init = function() {
    this.setupEventHandlers();
    this.setupRequiredFields();
  };

  FormValidator.prototype.setupRequiredFields = function() {
    var that = this;

    this.$form.find(this.requiredFieldSelector).each(function() {
      that.requiredFields.push({
        elem : $(this),
        isValid : true
      });
    });
  };

  FormValidator.prototype.handleFieldBlur = function(e) {
    if(this.validateOnBlur) {
      this.eventType = 'blur';
      this.setCurrentField($(e.target));
      this.checkValidity(this.$currentField);
      this.updateSummary();
    }
  };

  FormValidator.prototype.handleFormSubmit = function(event) {
    if(this.formIsSubmitted !== true) {
      this.eventType = 'submit';
      this.checkForm();
      return false;
    }
    else {
      return true;
    }

  };

  FormValidator.prototype.setupEventHandlers = function() {
    $(document)
      .on('blur', this.requiredFieldSelector, this.handleFieldBlur)
      .on('submit', this.options.formSelector, this.handleFormSubmit);
  };

  FormValidator.prototype.checkForm = function(e) {
    if(this.checkAllFields()) {
      this.formIsSubmitted = true;
      this.$form.submit();
    }
    else {
      this.focusFirstInvalidItem();
    }
  };

  FormValidator.prototype.checkAllFields = function() {
    var that = this,
        field;

    this.formIsValid = true;
    this.summaryIsVisible = true;

    this.requiredFields.forEach(function(field) {
      that.setCurrentField(field.elem);
      that.checkValidity(field);
    });

    this.updateSummary();

    return this.formIsValid;
  };

  FormValidator.prototype.updateFieldValidity = function($field, state) {
    var field = this.requiredFields.filter(function(item) {
      return item.elem[0] === $field[0];
    })[0].isValid = state === 'valid'? true : false;
  };

  FormValidator.prototype.checkValidity = function(fieldItem) {
    if(this.isValidField(this.$currentField)) {
      this.setFieldValidState(this.$currentField);
      this.updateFieldValidity(this.$currentField, 'valid');
    }
    else{
      this.setFieldInvalidState(this.$currentField);
      this.updateFieldValidity(this.$currentField, 'invalid');
      this.formIsValid = false;
    }
  };

  FormValidator.prototype.setFieldValidState = function() {
    this.$currentField
      .addClass(this.validClass)
      .removeClass(this.invalidClass)
      .attr('aria-invalid', false)
      .removeAttr('aria-describedby');

    this.removeInlineError(this.$currentField);

    this.findParentContainer(this.$currentField)
      .addClass(this.validClass)
      .removeClass(this.parentInvalidClass);
  };

  FormValidator.prototype.setFieldInvalidState = function() {
    this.$currentField
      .addClass(this.invalidClass)
      .removeClass(this.validClass)
      .attr({
        'aria-invalid' : true,
        'aria-describedby' : 'error-inline-' + this.$currentField.attr('id')
      });

    this.addInlineError(this.$currentField);

    this.findParentContainer(this.$currentField)
      .addClass(this.parentInvalidClass)
      .removeClass(this.validClass);
  };

  FormValidator.prototype.findParentContainer = function($field) {
    var $fieldContainer = $field.closest(this.inputGroupItemSelector),
        fieldType = this.getFieldType($field);

    if((fieldType === 'select' || fieldType === 'checkbox') && $fieldContainer.length){
      return $fieldContainer;
    }
    else {
      return $field.closest(this.inputParentSelector);
    }
  };

  FormValidator.prototype.findErrorContainer = function($field) {
    return $field.siblings(this.inputParentSelector);
  };

  FormValidator.prototype.setCurrentField = function($field) {
    this.$currentField = $field;
  };

  FormValidator.prototype.isValidField = function($field) {
    var handleFieldValidation,
        that = this;

    handleFieldValidation = {
      'select' : function() {
        return that.isSelectSelected($field);
      },
      'checkbox' : function() {
        return that.isCheckboxChecked($field);
      },
      'radio' : function() {
        return that.isRadioChecked($field);
      },
      'email' : function() {
        return that.isValidEmail($field);
      },
      'text' : function() {
        return that.isFilled($field);
      },
      'textarea' : function() {
        return this.text();
      },
      'number' : function() {
        return this.text();
      },
      'tel' : function() {
        return this.text();
      }
    };

    return handleFieldValidation[this.getFieldType($field)]();
  };

  FormValidator.prototype.isSelectSelected = function($field) {
    return $field[0].options.selectedIndex > 0;
  };

  FormValidator.prototype.isCheckboxChecked = function($field) {
    return $field.is(':checked');
  };

  FormValidator.prototype.isRadioChecked = function($field) {
    return !!this.findParentContainer($field).find('[name="' + $field.attr('name') + '"]').filter(':checked').length;
  };

  FormValidator.prototype.isValidEmail = function($field) {
    return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/gi.test($field.val());
  };

  FormValidator.prototype.isFilled = function($field) {
    return !!$field.val().replace(/\s/gi,'').length;
  };

  FormValidator.prototype.isNumber = function(val) {
    return /[^0-9]/gi.test(val);
  };

  FormValidator.prototype.getFieldType = function($field) {
    var fieldType = $field.attr('type');
    return !fieldType? $field[0].tagName.toLowerCase() : fieldType;
  };

  FormValidator.prototype.addInlineError = function($field) {
    var errorMsg = $field.data('error-message'),
        errorId = 'error-inline-' + this.getFieldType($field) === 'radio' ? $field.attr('name') : $field.attr('id'),
        $error;

    if(!this.findParentContainer($field).find('.js-error-text').length){
      $error = $('<span/>').addClass('js-error-text form__row-error').attr('id',errorId).text(errorMsg);
      this.findParentContainer($field).find('.js-error-container').append($error);
    }

    this.addAlert(this.$alert, errorMsg);
  };

  FormValidator.prototype.removeInlineError = function($field) {
    this.findParentContainer($field).find('.js-error-text').remove();
  };

  // FormValidator.prototype.addSummaryError = function($field) {
  //   if(!this.$errorList.find('#error-' + $field.attr('id')).length) {
  //     this.$errorList.append(this.createSummaryItem($field));
  //   }
  //   this.updateSummary();
  // };

  // FormValidator.prototype.removeSummaryError = function($field) {
  //   this.$errorList.find('#error-' + $field.attr('id')).remove();
  //   this.updateSummary();
  // };

  FormValidator.prototype.updateSummary = function() {
    if(!this.summaryIsVisible) return;

    this.updateSummaryItems();
    this.updateErrorCountMessage();

    if(this.getErrorCount()) {
      this.showSummary();
    }
    else {
      this.hideSummary();
      this.summaryIsVisible = false;
    }
  };

  FormValidator.prototype.updateSummaryItems = function() {
    var field;
    var $items = [];
    var invalidFields = this.getInvalidFields();
    var that = this;

    this.$errorList.empty();
    invalidFields.forEach(function(field) {
      $items.push(that.createSummaryItem(field.elem));
    });

    this.$errorList.append($items);
  };

  FormValidator.prototype.getErrorCount = function() {
    return this.$errorList.children().length;
  };

  FormValidator.prototype.updateErrorCountMessage = function() {
    var errorLength = this.getErrorCount();
    if(this.eventType === 'submit') {
      this.addLiveRegion(this.$errorCount, errorLength + (errorLength > 1? ' errors' : ' error') + ' prevented calculation<span class="visually-hidden">. Tab to cycle through errors</span> :' );
      this.$errorCount.attr('tabindex',-1);
      this.$errorCount[0].focus();
    }
  };

  FormValidator.prototype.showSummary = function() {
    this.$errorSummary.addClass('is-active');
  };

  FormValidator.prototype.hideSummary = function() {
    this.$errorSummary.removeClass('is-active');
  };

  FormValidator.prototype.getInvalidFields = function() {
    return this.requiredFields.filter(function(item) {
      return item.isValid === false;
    });
  };

  FormValidator.prototype.createSummaryItem = function($field) {
    var $fieldID = $field.attr('id'),
        $item = $('<li />').attr('id', 'error-'+ $fieldID),
        $itemLink = $('<a />').attr('href', '#' + $fieldID);

    $item.append($itemLink);
    this.addLiveRegion($itemLink, $field.data('error-message'));

    return $item;
  };

  FormValidator.prototype.addAlert = function($target, val) {
    $target.empty();
    $target.append(val);
  };

  FormValidator.prototype.focusFirstInvalidItem = function() {
    this.getInvalidFields()[0].elem[0].focus();
  };

  FormValidator.prototype.addLiveRegion = function($target, val) {
    $target.empty();
    $target.append(val);
  };

  window.FormValidator = FormValidator;

})(jQuery, window);
