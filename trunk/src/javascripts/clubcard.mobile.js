var clubcard = clubcard || {};

clubcard.mobile = (function() {
  var initialised = false;
  var touchType = null;

  return {
    init: function() {
      touchType = (typeof Touch !== "undefined") ? "touchstart.mobile" : "click.mobile";
      clubcard.mobileNavigation.init();
      clubcard.mobileFooter.init();
      clubcard.mobileFacet.init();
      clubcard.mobileSearch.init();
      clubcard.pdpPageAccordion.init();
      clubcard.productCarousel.create(1);
      clubcard.listing.facetNav.openPanels(clubcard.listing.facetNav.panels().first());
      clubcard.basket.summary.disable();
      initialised = true;
    },

    destroy: function() {
      if (initialised) {
        clubcard.mobileNavigation.destroy();
        clubcard.mobileFooter.destroy();
        clubcard.mobileFacet.destroy();
        clubcard.mobileSearch.destroy();
        clubcard.pdpPageAccordion.destroy();
        clubcard.productCarousel.destroy();
        clubcard.basket.summary.enable();
        initialised = false;
      }
    },

    resize: function() {
      if (initialised) {
        // specfice resize stuff here
      } else {
        clubcard.mobile.init();
      }
    },

    isInitialised: function() {
      return initialised;
    }
  }
})();

clubcard.mobileNavigation = (function() {
  return {
    init: function() {
      $(".header-container").prepend("<a href='#' id='nav-btn' class='nav-btn ir'>Open navigation</a>");

      $(".category-navigation-drawer").show();

      $("#nav-btn").bind("click", function(e) {
        clubcard.navigationReset.closeOpenPanels("facet", null, "search");
        $("body").toggleClass("nav-open");
        e.preventDefault();
      });

      var $rewardsNav = $(".category-navigation-drawer").clone();
      $(".category-navigation-drawer").remove();
      $("#rewards-section").append($rewardsNav);

      $(".category-navigation-drawer").addClass("categories-open");
    },

    close: function() {
      $("body").removeClass("nav-open");
    },

    destroy: function() {
      $(".category-navigation-drawer").hide();

      var $rewardsNav = $(".category-navigation-drawer").clone();
      $(".category-navigation-drawer").remove();

      $(".global-navigation-drawer").append($rewardsNav);
      $(".category-navigation-drawer").hide();
      
      $("#nav-btn").remove();
      $("body").removeClass("nav-open");
    }
  }
})();    

clubcard.mobileFooter = (function() {
  return {
    init: function() {
      $(".footer-accordion").accordion({
        groupElems: '.footer-group', 
        headingElems: '.footer-heading',
        bodyElems: '.footer-section',
        innerElems: '.footer-sub-links' 
      });
    },

    destroy: function() {
      $(".footer-accordion").each(function() {
        $(this).data("accordion").destroy();
      });
    }
  }
})();


clubcard.mobileFacet = (function() {
  return {
    init: function() {
      $(".facet-nav-container").addClass('facet-nav-closed');
      $(".facet-nav-container").addClass('facet-nav-init');

      $(".listing-controls").prepend("<a href='#' id='filter-btn' class='filter-btn listing-ctrl-btn'>Filter</a>");

      //bind click event to filter button
      $("#filter-btn").bind('click', function(e) {
        clubcard.navigationReset.closeOpenPanels(null, "mobileNav", "search");
        $("body").toggleClass("facet-open");
        $(".facet-nav-container").toggleClass('facet-nav-open');
        e.preventDefault();
      });
    },

    close: function() {
      $("body").removeClass("facet-open");
      $(".facet-nav-init").removeClass("facet-nav-open");
    },

    destroy: function() {
      $("#filter-btn").remove();
      $(".facet-nav-init").removeClass("facet-nav-closed facet-nav-init facet-nav-open");
      $("body").removeClass("facet-open");
    }
  }
})();


clubcard.mobileSearch = (function() {
  return {
    init: function() {
      $(".mobile-search-form").addClass("search-hidden");
      $(".listing-controls").append("<a href='#' id='search-btn' class='search-btn listing-ctrl-btn ir'>Search</a>");

      $("#search-btn").bind("click", function(e) {
        clubcard.navigationReset.closeOpenPanels("facet", "mobileNav", null);
        $(".result-options").toggleClass("search-open");
        $(".mobile-search-form").toggleClass("search-hidden");
        e.preventDefault();
      });
    },

    close: function() {
      $(".result-options").removeClass("search-open");
      $(".mobile-search-form").addClass('search-hidden');
    },

    destroy: function() {
      $("#search-btn").remove();
      $(".result-options").removeClass("search-open");
      $(".search-hidden").removeClass('search-hidden');
    }
  }
})();

clubcard.navigationReset = (function() {
  return {
    closeOpenPanels: function(facet, mobileNav, search) {
      if (facet) clubcard.mobileFacet.close();
      if (mobileNav) clubcard.mobileNavigation.close();
      if (search) clubcard.mobileSearch.close();
    }
  }
})();