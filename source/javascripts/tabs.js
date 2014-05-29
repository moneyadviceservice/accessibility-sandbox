;(function(window){
  'use strict';

  // NOTE: This is not production-ready code. This just a quick example for DAC.

  var tabs = {
    init : function() {
      var that = this;

      this.activeClass = 'is-active';
      this.$selectedIndicatorText = $('<span class="visually-hidden">(Selected)</span>');
      this.$tabsComponent = $('.js-tabs');
      this.$tabLinks = this.$tabsComponent.find('.tabs__nav a');
      this.$tabs = this.$tabsComponent.find('.tabs__item');

      this.$tabLinks.on('click keydown', function(e) {
        if(e.which === 13 || e.which === 1 || e.which === 32) {
          that.handleTabsAction(e, $(this));
        }
      });

      this.$currentTab = this.$tabs.first();
      this.$currentTabLink = this.$tabLinks.first();
      this.$tabs.attr('aria-hidden', 'true');

      // Select first tab
      this.selectTab(this.$tabLinks.first());

    },

    handleTabsAction : function(e, $tabLink) {
      e.preventDefault();
      this.selectTab($tabLink);
    },

    selectTab : function($tabLink) {
      // Store previous tab
      this.$previousTabLink = this.$currentTabLink;
      this.$previousTab = this.$currentTab;

      // Store current tab
      this.$currentTabLink = $tabLink;
      this.$currentTab = this.$tabs.filter($tabLink[0].hash);

      // Remove active class from tab links
      this.$tabLinks.parent().removeClass(this.activeClass);

      // Remove hidden selected text and set aria-selected to false
      if(this.$previousTabLink) {
        this.$previousTabLink.find('visually-hidden').remove();
        this.$previousTabLink.attr('aria-selected', 'false');
        this.$previousTab.attr('aria-hidden', 'true');
      }

      // Add hidden selected text and set aria-selected to true
      this.$currentTabLink
          .append(this.$selectedIndicatorText)
          .attr('aria-selected', 'true')
            .parent()
            .addClass(this.activeClass);

      // Remove class from activeTab
      this.$previousTab.removeClass(this.activeClass);

      // And update current tab
      this.$currentTab
        .addClass(this.activeClass)
        .attr('aria-hidden', 'false');
    }
  };

  tabs.init();
})(window);
