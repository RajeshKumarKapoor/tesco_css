clubcard.desktop = (function() {
  var initialised = false;

  return {
    init: function() {
      clubcard.categoryNavigationDrawer.init();
      clubcard.pdpTermsAccordion.init();
      clubcard.productCarousel.create(5);
      clubcard.listing.facetNav.openPanels();
      clubcard.basket.summary.enable();
      initialised = true;
    },

    destroy: function() {
      if (initialised) {
        clubcard.categoryNavigationDrawer.destroy();
        clubcard.pdpTermsAccordion.destroy();
        clubcard.productCarousel.destroy()
        initialised = false;
      }
    },

    resize: function() {
      if (initialised) {
      } else {
        clubcard.desktop.init();
      }
    },

    isInitialised: function() {
      return initialised;
    }
  }
})();