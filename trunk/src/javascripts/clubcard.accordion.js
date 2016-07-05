var clubcard = clubcard || {};

clubcard.pdpTermsAccordion = (function() {
  return {
    init: function() {
      $(".terms-accordion").accordion({
        groupElems: '.terms-group', 
        headingElems: '.terms-heading',
        bodyElems: '.terms-section',
        innerElems: '.terms-inner' 
      });
    },
    destroy: function() {
      $(".terms-accordion").each(function() {
        $(this).data("accordion").destroy();
      });
    }
  }
})();

clubcard.pdpPageAccordion = (function() {
  return {
    init: function() {
      $(".pdp-accordion").accordion({
        groupElems: '.product-description', 
        headingElems: '.product-description-heading',
        bodyElems: '.page-section',
        innerElems: '.page-inner' 
      });
    },
    destroy: function() {
      $(".pdp-accordion").each(function() {
        $(this).data("accordion").destroy();
      });
    }
  }
})();

clubcard.contentAccordion = (function() {
  return {
    init: function() {
      $(".primary-content").accordion({
        groupElems: '.primary-content-group', 
        headingElems: '.primary-content-heading',
        bodyElems: '.primary-content-body',
        innerElems: '.primary-content-inner' 
      });

      $(".secondary-content").accordion({
        groupElems: '.secondary-content-group', 
        headingElems: '.secondary-content-heading',
        bodyElems: '.secondary-content-body',
        innerElems: '.secondary-content-inner' 
      });
    }
  }
})();

clubcard.productBrowserAccordion = (function() {
  return {
    init: function() {
      $(".department-browser-container").accordion({
        groupElems: '.department-browser-item', 
        headingElems: '.department-browser-heading h2',
        bodyElems: '.department-browser-body',
        innerElems: '.department-browser-inner' 
      });
    }
  }
})();

clubcard.contactPageAccordion = (function() {
  return {
    init: function() {
      $(".contact-details-container").accordion({
        groupElems: '.contact-summary', 
        headingElems: '.contact-heading',
        bodyElems: '.contact-body',
        innerElems: '.contact-inner' 
      });
    }
  }
})();