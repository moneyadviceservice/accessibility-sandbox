;(function(window){
  'use strict';

  // NOTE: This just a quick tabs example for DAC and shouldn't be used in production.

  var accessibleTabs = {
    init : function(options) {
      var that = this;

      this.tabIndex = options.useRovingTab? 0 : -1;
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
