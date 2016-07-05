(function($) {
  if(!$.accordion){
    $.accordion = new Object();
  };

  $.accordion.defaultOptions = {
    groupElems: '.acc-group', 
    headingElems: '.acc-heading',
    bodyElems: '.acc-body',
    innerElems: '.acc-inner' 
  }

  $.accordion = function(el, options) {
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$el = $(el);
    base.el = el;
    base.el.data('accordion', base);
    base.touchType = (typeof Touch !== "undefined") ? "touchend.accordion" : "click.accordion";
    base.options = $.extend({}, $.accordion.defaultOptions, options);

    //Public functions
    base.create = function() {

      //turn default classes into jQuery Objects
      $groupElems = base.$el.find(base.options.groupElems);
      //console.log(base.options.groupElems, base.$el, $groupElems);
      $headingElems = base.$el.find(base.options.headingElems);
      $bodyElems = base.$el.find(base.options.bodyElems);
      $innerElems = base.$el.find(base.options.innerElems);

      base.$el.addClass("accordion");

      //this has to be using find to lock to the item so there is no conflict
      $groupElems.addClass("accordion-group");
      $headingElems.addClass("accordion-heading");

      //need to wrap an a tag inside the heading to create clickable heading
      $headingElems.wrapInner('<a class="accordion-toggle collapsed" data-toggle="collapse" ></a>');

      $groupElems.each(function() {
        if ($(this).find(base.options.bodyElems).hasClass('in')) $(this).find(base.options.headingElems).find('.accordion-toggle').removeClass('collapsed')
      });
          
      $bodyElems.addClass("accordion-body collapse");
      $innerElems.addClass("accordion-inner");

      //get an ID from each accordion element
      var accordionID = base.$el.attr("id");
      //console.log(accordionID)

      //Setting id for link and section needs to be in each statement for multiple accordions 
      $groupElems.each(function(index, value){
        //create unique ID for each section in an accordion by appending a new index val
        var accordionSectionID = accordionID + "Sec"+ (index+1);

        //for this groups heading add data attributes + href to the link
        $(this).find(".accordion-toggle").attr('href', "#"+accordionSectionID);
        $(this).find(".accordion-toggle").attr('data-parent', "#"+accordionSectionID);

        //for this groups body add id
        $(this).find(".accordion-body").attr("id", accordionSectionID)

      })

    };

    base.destroy = function() {
      base.$el.find(".accordion-group").removeClass("accordion-group");
      base.$el.find(".accordion-heading").removeClass("accordion-heading");

      //might need to remove the link wrapped around it rather than the element. 
      //can't wrap a link around a heading, has to be inserted inside

      base.$el.find(".accordion-toggle").contents().unwrap();
       
       //remove style attribute setting fixed height on closed object
      base.$el.find(".accordion-body").attr("style", "").removeClass("accordion-body collapse");
      base.$el.find(".accordion-inner").removeClass("accordion-inner");
    };

    base.openPanel = function(section) {
      section.find(".accordion-body").addClass("in").css('height', 'auto');
      section.find(".accordion-toggle").removeClass("collapsed");
    };

    base.closePanel = function(section) {
      section.find(".accordion-body").removeClass("in").css('height', '0');
      section.find(".accordion-toggle").addClass("collapsed");
    };

    // base.open = function(e){
    //   var $panel = $(e.target).parent(base.options.panel);

    //   if($panel.hasClass('on') ) {
    //     $panel.removeClass('on');
    //     $panel.find(base.options.content).slideUp('normal');
    //   } else {
    //     $panel.siblings().removeClass('on');
    //     $panel.addClass('on');
    //     base.$el.find(base.options.content + ":visible").slideUp('normal');
    //     $panel.find(base.options.content).slideDown('normal');
    //   }
    // };

    // Call init function
    base.create();
  };



  $.fn.accordion = function(options) {
   return this.each(function() {
      (new $.accordion($(this), options));
   });
  };

  //Private function

})(jQuery);