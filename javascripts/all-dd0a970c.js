;(function($, window) {
  'use strict';

  function FormValidator(options) {
    this.options = options || {};

    this.requiredFieldSelector = options.requiredFieldSelector || '[aria-required]';
    this.inputParentSelector = options.inputParentSelector || '.form__row';
    this.alertSelector = options.alertSelector || '.js-alert';
    this.requiredFields = [];
    this.summaryIsVisible = false;
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
      this.setCurrentField($(e.target));
      this.checkValidity(this.$currentField);
      this.updateSummary();
    }
  };

  FormValidator.prototype.handleFormSubmit = function() {
    this.checkForm();
    return false;
  };

  FormValidator.prototype.setupEventHandlers = function() {
    $(document)
      .on('blur', this.requiredFieldSelector, this.handleFieldBlur)
      .on('submit', this.options.formSelector, this.handleFormSubmit);
  };

  FormValidator.prototype.checkForm = function(e) {
    if(this.checkAllFields()) {
      this.$form.submit();
    }
    else {
      // this.focusFirstSummaryItem();
    }
  };

  FormValidator.prototype.checkAllFields = function() {
    var that = this,
        field;

    this.formIsValid = true;
    this.summaryIsVisible = true;

    for(field in this.requiredFields) {
      that.setCurrentField(this.requiredFields[field].elem);
      that.checkValidity(this.requiredFields[field]);
    }
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

    this.findParent(this.$currentField)
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

    this.findParent(this.$currentField)
      .addClass(this.parentInvalidClass)
      .removeClass(this.validClass);
  };

  FormValidator.prototype.findParent = function($field) {
    return $field.closest(this.inputParentSelector);
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
    return !!this.findParent($field).find('[name="' + $field.attr('name') + '"]').filter(':checked').length;
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
        errorId = 'error-inline-' + $field.attr('id'),
        $error;

    if(!this.findParent($field).find('.js-error-text').length){
      $error = $('<span/>').addClass('js-error-text').attr('id',errorId).text(errorMsg);
      this.findParent($field).find('.js-error-container').append($error);
    }

    this.addAlert(this.$alert, errorMsg);
  };

  FormValidator.prototype.removeInlineError = function($field) {
    this.findParent($field).find('.js-error-text').remove();
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
    this.$errorList.empty();
    for(field in this.getInvalidFields()) {
      $items.push(this.createSummaryItem(this.requiredFields[field].elem));
    }
    this.$errorList.append($items);
  };

  FormValidator.prototype.getErrorCount = function() {
    return this.$errorList.children().length;
  };

  FormValidator.prototype.updateErrorCountMessage = function() {
    var errorLength = this.getErrorCount();
    this.addLiveRegion(this.$errorCount, errorLength + (errorLength > 1? ' errors' : ' error') + ' prevented calculation:' );
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

  FormValidator.prototype.focusFirstSummaryItem = function() {
    this.$errorList.children().first().find('a')[0].focus();
  };

  FormValidator.prototype.addLiveRegion = function($target, val) {
    $target.empty();
    $target.append(val);
    // $('<span class="js-error-text" role="status" aria-atomic="false" aria-relevant="text" tabindex="-1" />')
    //     .appendTo($target)
    //     .append(val)
    //     .css('visibility', 'hidden')
    //     .css('visibility', 'visible');
  };

  window.FormValidator = FormValidator;

})(jQuery, window);
;(function(window){
  'use strict';

  var $itemInputs = $('.js-item-value');
  var $itemsTotal = $('.js-item-total');
  var $itemToggles = $('.js-toggle');
  var total = 0;

  function setup() {
    $itemToggles.on('click', function(e) {
      e.preventDefault();
      handleItemToggle($(this));
    });

    $itemInputs.on('keyup', function(e) {
      handleItemKeyEvent();
    });
  }

  function showItem($trigger) {
    var $target = $('[data-toggle-target=' + $trigger.data('toggle-trigger') + ']');
    $target.attr({
      'aria-hidden' : true
    });
  }

  function handleItemKeyEvent() {
    update(calculateTotal());
  }

  function handleItemToggle($trigger) {
    showItem($trigger);
  }

  function calculateTotal() {
    var itemsTotal = 0;
    $itemInputs.each(function(i) {
      itemsTotal += parseFloat($(this).val(),10) || 0;
    });
    return itemsTotal;
  }

  function update(itemsTotal) {
    total = itemsTotal;
    $itemsTotal.html("&pound" + itemsTotal.toFixed(2));
  }

  setup();
})(window);
/*! H5F
* https://github.com/ryanseddon/H5F/
* Copyright (c) Ryan Seddon | Licensed MIT */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.H5F = factory();
    }
}(this, function () {

    var d = document,
        field = d.createElement("input"),
        emailPatt = /^[a-zA-Z0-9.!#$%&'*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        urlPatt = /[a-z][\-\.+a-z]*:\/\//i,
        nodes = /^(input|select|textarea)$/i,
        isSubmit, bypassSubmit, usrPatt, curEvt, args,
        // Methods
        setup, validation, validity, checkField, bypassChecks, checkValidity, setCustomValidity, support, pattern, placeholder, range, required, valueMissing, listen, unlisten, preventActions, getTarget, addClass, removeClass, isHostMethod, isSiblingChecked;

    setup = function(form, settings) {
        var isCollection = !form.nodeType || false;

        var opts = {
            validClass : "valid",
            invalidClass : "error",
            requiredClass : "required",
            placeholderClass : "placeholder"
        };

        if(typeof settings === "object") {
            for (var i in opts) {
                if(typeof settings[i] === "undefined") { settings[i] = opts[i]; }
            }
        }

        args = settings || opts;

        if(isCollection) {
            for(var k=0,len=form.length;k<len;k++) {
                validation(form[k]);
            }
        } else {
            validation(form);
        }
    };

    validation = function(form) {
        var f = form.elements,
            flen = f.length,
            isRequired,
            noValidate = !!(form.attributes["novalidate"]);

        listen(form,"invalid",checkField,true);
        listen(form,"blur",checkField,true);
        listen(form,"input",checkField,true);
        listen(form,"keyup",checkField,true);
        listen(form,"focus",checkField,true);
        listen(form,"change",checkField,true);
        listen(form,"click",bypassChecks,true);

        listen(form,"submit",function(e){
            isSubmit = true;
            if(!bypassSubmit) {
                if(!noValidate && !form.checkValidity()) {
                    preventActions(e);
                }
            }
        },false);

        if(!support()) {
            form.checkValidity = function() { return checkValidity(form); };

            while(flen--) {
                isRequired = !!(f[flen].attributes["required"]);
                // Firefox includes fieldsets inside elements nodelist so we filter it out.
                if(f[flen].nodeName.toLowerCase() !== "fieldset") {
                    validity(f[flen]); // Add validity object to field
                }
            }
        }
    };
    validity = function(el) {
        var elem = el,
            missing = valueMissing(elem),
            attrs = {
                type: elem.getAttribute("type"),
                pattern: elem.getAttribute("pattern"),
                placeholder: elem.getAttribute("placeholder")
            },
            isType = /^(email|url)$/i,
            evt = /^(input|keyup)$/i,
            fType = ((isType.test(attrs.type)) ? attrs.type : ((attrs.pattern) ? attrs.pattern : false)),
            patt = pattern(elem,fType),
            step = range(elem,"step"),
            min = range(elem,"min"),
            max = range(elem,"max"),
            customError = !( elem.validationMessage === "" || elem.validationMessage === undefined );

        elem.checkValidity = function() { return checkValidity.call(this,elem); };
        elem.setCustomValidity = function(msg) { setCustomValidity.call(elem,msg); };

        elem.validity = {
            valueMissing: missing,
            patternMismatch: patt,
            rangeUnderflow: min,
            rangeOverflow: max,
            stepMismatch: step,
            customError: customError,
            valid: (!missing && !patt && !step && !min && !max && !customError)
        };

        if(attrs.placeholder && !evt.test(curEvt)) { placeholder(elem); }
    };
    checkField = function(e) {
        var el = getTarget(e) || e, // checkValidity method passes element not event
            events = /^(input|keyup|focusin|focus|change)$/i,
            ignoredTypes = /^(submit|image|button|reset)$/i,
            specialTypes = /^(checkbox|radio)$/i,
            checkForm = true;

        if(nodes.test(el.nodeName) && !(ignoredTypes.test(el.type) || ignoredTypes.test(el.nodeName))) {
            curEvt = e.type;

            if(!support()) {
                validity(el);
            }

            if(el.validity.valid && (el.value !== "" || specialTypes.test(el.type)) || (el.value !== el.getAttribute("placeholder") && el.validity.valid)) {
                removeClass(el,[args.invalidClass,args.requiredClass]);
                addClass(el,args.validClass);
                if (/^radio$/i.test(el.type)) {
                  var siblings = document.getElementsByName(el.name);
                  for(var i=0; i<siblings.length; i++){
                    removeClass(siblings[i],[args.invalidClass,args.requiredClass]);
                    addClass(siblings[i],args.validClass);
                  }
                }
            } else if(!events.test(curEvt)) {
                if(el.validity.valueMissing) {
                    removeClass(el,[args.invalidClass,args.validClass]);
                    addClass(el,args.requiredClass);
                } else if(!el.validity.valid) {
                    removeClass(el,[args.validClass,args.requiredClass]);
                    addClass(el,args.invalidClass);
                }
            } else if(el.validity.valueMissing) {
                removeClass(el,[args.requiredClass,args.invalidClass,args.validClass]);
            }
            if(curEvt === "input" && checkForm) {
                // If input is triggered remove the keyup event
                unlisten(el.form,"keyup",checkField,true);
                checkForm = false;
            }
        }
    };
    checkValidity = function(el) {
        var f, ff, isRequired, hasPattern, invalid = false;

        if(el.nodeName.toLowerCase() === "form") {
            f = el.elements;

            for(var i = 0,len = f.length;i < len;i++) {
                ff = f[i];

                isRequired = !!(ff.attributes["required"]);
                hasPattern = !!(ff.attributes["pattern"]);

                if(ff.nodeName.toLowerCase() !== "fieldset" && (isRequired || hasPattern && isRequired)) {
                    checkField(ff);
                    if(!ff.validity.valid && !invalid) {
                        if(isSubmit) { // If it's not a submit event the field shouldn't be focused
                            ff.focus();
                        }
                        invalid = true;
                    }
                }
            }
            return !invalid;
        } else {
            checkField(el);
            return el.validity.valid;
        }
    };
    setCustomValidity = function(msg) {
        var el = this;

        el.validationMessage = msg;
    };

    bypassChecks = function(e) {
        // handle formnovalidate attribute
        var el = getTarget(e);

        if(el.attributes["formnovalidate"] && el.type === "submit") {
            bypassSubmit = true;
        }
    };

    support = function() {
        return (isHostMethod(field,"validity") && isHostMethod(field,"checkValidity"));
    };

    // Create helper methods to emulate attributes in older browsers
    pattern = function(el, type) {
        if(type === "email") {
            return !emailPatt.test(el.value);
        } else if(type === "url") {
            return !urlPatt.test(el.value);
        } else if(!type) {
            return false;
        } else {
            var placeholder = el.getAttribute("placeholder"),
                val = el.value;

            usrPatt = new RegExp('^(?:' + type + ')$');

            if(val === placeholder) {
                return false;
            } else if(val === "") {
                return false;
            } else {
                return !usrPatt.test(el.value);
            }
        }
    };
    placeholder = function(el) {
        var attrs = { placeholder: el.getAttribute("placeholder") },
            focus = /^(focus|focusin|submit)$/i,
            node = /^(input|textarea)$/i,
            ignoredType = /^password$/i,
            isNative = !!("placeholder" in field);

        if(!isNative && node.test(el.nodeName) && !ignoredType.test(el.type)) {
            if(el.value === "" && !focus.test(curEvt)) {
                el.value = attrs.placeholder;
                listen(el.form,'submit', function () {
                  curEvt = 'submit';
                  placeholder(el);
                }, true);
                addClass(el,args.placeholderClass);
            } else if(el.value === attrs.placeholder && focus.test(curEvt)) {
                el.value = "";
                removeClass(el,args.placeholderClass);
            }
        }
    };
    range = function(el, type) {
        // Emulate min, max and step
        var min = parseInt(el.getAttribute("min"),10) || 0,
            max = parseInt(el.getAttribute("max"),10) || false,
            step = parseInt(el.getAttribute("step"),10) || 1,
            val = parseInt(el.value,10),
            mismatch = (val-min)%step;

        if(!valueMissing(el) && !isNaN(val)) {
            if(type === "step") {
                return (el.getAttribute("step")) ? (mismatch !== 0) : false;
            } else if(type === "min") {
                return (el.getAttribute("min")) ? (val < min) : false;
            } else if(type === "max") {
                return (el.getAttribute("max")) ? (val > max) : false;
            }
        } else if(el.getAttribute("type") === "number") {
            return true;
        } else {
            return false;
        }
    };
    required = function(el) {
        var required = !!(el.attributes["required"]);

        return (required) ? valueMissing(el) : false;
    };
    valueMissing = function(el) {
        var placeholder = el.getAttribute("placeholder"),
            specialTypes = /^(checkbox|radio)$/i,
            isRequired = !!(el.attributes["required"]);
        return !!(isRequired && (el.value === "" || el.value === placeholder || (specialTypes.test(el.type) && !isSiblingChecked(el))));
    };

    /* Util methods */
    listen = function (node,type,fn,capture) {
        if(isHostMethod(window,"addEventListener")) {
            /* FF & Other Browsers */
            node.addEventListener( type, fn, capture );
        } else if(isHostMethod(window,"attachEvent") && typeof window.event !== "undefined") {
            /* Internet Explorer way */
            if(type === "blur") {
                type = "focusout";
            } else if(type === "focus") {
                type = "focusin";
            }
            node.attachEvent( "on" + type, fn );
        }
    };
    unlisten = function (node,type,fn,capture) {
        if(isHostMethod(window,"removeEventListener")) {
            /* FF & Other Browsers */
            node.removeEventListener( type, fn, capture );
        } else if(isHostMethod(window,"detachEvent") && typeof window.event !== "undefined") {
            /* Internet Explorer way */
            node.detachEvent( "on" + type, fn );
        }
    };
    preventActions = function (evt) {
        evt = evt || window.event;

        if(evt.stopPropagation && evt.preventDefault) {
            evt.stopPropagation();
            evt.preventDefault();
        } else {
            evt.cancelBubble = true;
            evt.returnValue = false;
        }
    };
    getTarget = function (evt) {
        evt = evt || window.event;
        return evt.target || evt.srcElement;
    };
    addClass = function (e,c) {
        var re;
        if (!e.className) {
            e.className = c;
        }
        else {
            re = new RegExp('(^|\\s)' + c + '(\\s|$)');
            if (!re.test(e.className)) { e.className += ' ' + c; }
        }
    };
    removeClass = function (e,c) {
        var re, m, arr = (typeof c === "object") ? c.length : 1, len = arr;
        if (e.className) {
            if (e.className === c) {
                e.className = '';
            } else {
                while(arr--) {
                    re = new RegExp('(^|\\s)' + ((len > 1) ? c[arr] : c) + '(\\s|$)');
                    m = e.className.match(re);
                    if (m && m.length === 3) { e.className = e.className.replace(re, (m[1] && m[2])?' ':''); }
                }
            }
        }
    };
    isHostMethod = function(o, m) {
        var t = typeof o[m], reFeaturedMethod = new RegExp('^function|object$', 'i');
        return !!((reFeaturedMethod.test(t) && o[m]) || t === 'unknown');
    };
    /* Checking if one of the radio siblings is checked */
    isSiblingChecked = function(el) {
        var siblings = document.getElementsByName(el.name);
        for(var i=0; i<siblings.length; i++){
            if(siblings[i].checked){
                return true;
            }
        }
        return false;
    };

    // Since all methods are only used internally no need to expose globally
    return {
        setup: setup
    };

}));
;(function(window){
  'use strict';

  // NOTE: This just a quick tabs example for DAC and shouldn't be used in production.

  var accessibleTabs = {
    init : function(options) {
      var that = this;

      this.tabIndex = options.useRovingFocus? 0 : -1;
      this.activeClass = 'is-active';
      this.$selectedIndicatorText = $('<span class="visually-hidden"> (Selected)</span>');
      this.$tabsComponent = $('.js-tabs');
      this.$tabsNav = this.$tabsComponent.find('.tabs__nav');
      this.$tabLinks = null;
      this.$tabs = this.$tabsComponent.find('.tabs__item');

      this.$tabs.attr({
        'aria-hidden' : 'true',
        'tabindex' : '-1'
      });

      // Select first tab
      this.convertLinksToButtons();
      this.$currentTab = this.$tabs.first();
      this.$currentTabLink = this.$tabLinks.first();

      this.selectTab(this.$currentTabLink);
    },

    handleTabsAction : function(e, $tabLink) {
      e.preventDefault();
      this.selectTab($tabLink, true);
    },

    convertLinksToButtons : function() {
      var that = this;

      this.$tabsNav.find('a').each(function() {
        var $newElem = $('<button/>');
        $newElem
          .attr({
             'data-target-tab' : $(this)[0].hash
          })
          .text($(this).text());
        $(this).replaceWith($newElem);
      });

      this.$tabLinks = this.$tabsNav.find('button');

      this.$tabLinks.attr({
        'aria-selected' : 'false'
      });

      this.$tabLinks.on('click keydown', function(e) {
        if(e.which === 13 || e.which === 1 || e.which === 32) {
          that.handleTabsAction(e, $(this));
        }
      });
    },

    selectTab : function($tabLink, setFocus) {
      // Store previous tab
      this.$previousTabLink = this.$currentTabLink;
      this.$previousTab = this.$currentTab;

      // Store current tab
      this.$currentTabLink = $tabLink;
      this.$currentTab = this.$tabs.filter($tabLink.attr('data-target-tab'));

      // Remove active class from tab links
      this.$tabLinks.parent().removeClass(this.activeClass);

      // Remove hidden selected text and set aria-selected to false
      if(this.$previousTabLink) {
        this.$previousTabLink.find('visually-hidden').remove();
        this.$previousTabLink.attr('aria-selected', 'false');
        this.$previousTab
          .attr({
            'aria-hidden' : 'true',
            'tabindex' : -1
          })
          .removeClass(this.activeClass);
      }

      // Add hidden selected text and set aria-selected to true
      this.$currentTabLink
          .append(this.$selectedIndicatorText)
          .attr('aria-selected', 'true')
            .parent()
            .addClass(this.activeClass);

      // And update current tab
      this.$currentTab
        .addClass(this.activeClass)
        .attr({
          'aria-hidden': 'false'
        });

      if(setFocus){
        this.$currentTab.focus();
      }

      this.shiftTabIndex();
    },

    shiftTabIndex : function() {
      this.$currentTab.attr('tabindex', this.tabIndex);
    }
  };

  window.accessibleTabs = accessibleTabs;
})(window);
if($('.form')){
  var formValidator = new FormValidator({
    formSelector : '.form'
  });
}
;





