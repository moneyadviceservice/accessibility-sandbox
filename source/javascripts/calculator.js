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
