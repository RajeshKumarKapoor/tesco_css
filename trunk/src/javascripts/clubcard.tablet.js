var clubcard = clubcard || {};

clubcard.tablet = (function() {
  var initialised = false;
  var touchType = null;

  return {
    init: function() {
      touchType = (typeof Touch !== "undefined") ? "touchstart.mobile" : "click.mobile";
      clubcard.mobileNavigation.init();
      clubcard.mobileFooter.init();
      clubcard.mobileFacet.init();
      clubcard.pdpTermsAccordion.init();
      clubcard.productCarousel.create(3);
      clubcard.listing.facetNav.openPanels(clubcard.listing.facetNav.panels().first());
      clubcard.basket.summary.enable();
      clubcard.map.init();
      initialised = true;
    },

    destroy: function() {
      if (initialised) {
        clubcard.mobileNavigation.destroy();
        clubcard.mobileFooter.destroy();
        clubcard.mobileFacet.destroy();
        clubcard.pdpTermsAccordion.destroy();
        clubcard.productCarousel.destroy();
        initialised = false;
      }
    },

    resize: function() {
      if (initialised) {
      } else {
        clubcard.tablet.init();
      }
    },
    
    isInitialised: function() {
      return initialised;
    }
  }
})();