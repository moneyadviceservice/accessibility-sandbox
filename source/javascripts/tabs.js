;(function(window){
  'use strict';

  var $component;
  var $componentLabels;

  function setup() {
    $component = $('.js-component');
    $componentLabels = $component.find('.component__label');

    $componentLabels.on('click keydown', function(e) {
      if(e.which === 13 || e.which === 1 || e.which === 32) {
        handleComponentAction(e, $(this));
      }
    });
  }

  function handleComponentAction(e, $label) {
    toggleTab($label);
    setARIAExpanded($componentLabels);
  }

  function toggleTab($label) {
    var $content = $label.next('.component__content');
    if( $label.attr('aria-selected') === 'true'){
      closeTab($label, $content);
    }
    else{
      openTab($label, $content);
    }
  }

  function setARIAExpanded($labels) {
    var count = 0;
    console.log($componentLabels.filter('[aria-selected="true"]').length);
    if($componentLabels.filter('[aria-selected="true"]').length > 0) {
      $component.attr('aria-expanded', 'true');
    }
    else {
      $component.attr('aria-expanded', 'false');
    }
  }

  function openTab($label, $content) {
    $label
      .attr({
        'aria-selected' : 'true',
        'tabindex' : 0
      })
      .removeClass('is-inactive')
      .addClass('is-active');

    $content
      .attr({
        'aria-hidden' : 'false',
        'tabindex' : 0
      })
      .removeClass('is-inactive')
      .addClass('is-active');
  }

  function closeTab($label, $content) {
    $label
      .attr({
        'aria-selected' : 'false',
        'tabindex' : 0
      })
      .addClass('is-inactive')
      .removeClass('is-active');

    $content
      .attr({
        'aria-hidden' : 'true',
        'tabindex' : -1
      })
      .addClass('is-inactive')
      .removeClass('is-active');
  }

  function closeAllTabs($tabs) {

  }

  setup();
})(window);
