var clubcard = clubcard || {};

clubcard.categoryNavigationDrawer = (function() {
  return {
    init: function() {
      $(".category-navigation-drawer").removeClass("categories-open");
      $(".category-navigation-drawer").hide();

      $("#rewards-section").append("<a href='#' id='category-btn' class='category-btn ir'>View rewards</a>");
      
      $("#category-btn").bind("click", function(e) {
        $(".category-navigation-drawer").toggle();
        $("#rewards-section").parent().toggleClass("categories-btn-open");
        $(".category-navigation-drawer").toggleClass("categories-open");
        e.preventDefault();
      })
    },

    close: function() {
      $(".category-navigation-drawer").hide();
      $("#rewards-section").parent().removeClass("categories-btn-open");
      $(".category-navigation-drawer").removeClass("categories-open");
    },

    destroy: function() {
      $(".category-navigation-drawer").hide();
      $("#category-btn").remove();
      $("#rewards-section").parent().removeClass("categories-btn-open");
      $(".category-navigation-drawer").removeClass("categories-open");
    }
  }
})();