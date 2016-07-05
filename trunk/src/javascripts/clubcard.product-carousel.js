var clubcard = clubcard || {};

clubcard.productCarousel = (function() {
  var navigationEnabled = false;
  var swiperObj = null;
  var originalHtml = null;
  var container = $('.swiper-container');
  var slidesPerView = 1;
  
  return {
    create: function(slide_count) {
      if (container.size()) {
        slidesPerView = slide_count;

        swiperObj = $('.swiper-wrapper').bxSlider({
          minSlides: 1,
          maxSlides: slidesPerView,
          moveSlides: 1,
          slideWidth: container.find('.swiper-slide').width(),
          pager: false,
          auto: true,
          pause: 3000,
          oneToOneTouch: false,
          onSliderLoad: function(currentIndex) {
            var slides = container.find('.swiper-slide:not(.bx-clone)');
            var offset = clubcard.productCarousel.activeOffset();
            container.find('.swiper-slide').removeClass('swiper-slide-active');
            $(slides[currentIndex+offset]).addClass('swiper-slide-active');
          },
          onSlideNext: function($slideElement, oldIndex, newIndex) {
            var visible = clubcard.productCarousel.getSlidesPerView();
            var offset = clubcard.productCarousel.activeOffset();
            var next_slide = clubcard.productCarousel.currentSlide().next();
            var new_slide = $(container.find('.swiper-slide')[newIndex+visible+offset]);
            next_slide.addClass('swiper-slide-active');
            new_slide.addClass('swiper-slide-active');
            container.find('.swiper-slide').not(next_slide).not(new_slide).removeClass('swiper-slide-active');
          },
          onSlidePrev: function($slideElement, oldIndex, newIndex) {
            var visible = clubcard.productCarousel.getSlidesPerView();
            var offset = clubcard.productCarousel.activeOffset();
            var next_slide = clubcard.productCarousel.currentSlide().prev();
            var new_slide = $(container.find('.swiper-slide')[newIndex+visible+offset]);
            next_slide.addClass('swiper-slide-active');
            new_slide.addClass('swiper-slide-active');
            container.find('.swiper-slide').not(next_slide).not(new_slide).removeClass('swiper-slide-active');
          },
          onSlideAfter: function($slideElement, oldIndex, newIndex) {
          }
        });
      }
    },

    currentSlide: function() {
      return container.find('.swiper-slide.swiper-slide-active');
    },

    activeOffset: function() {
      return (slidesPerView - 1) / 2;
    },

    getSlidesPerView: function() {
      return slidesPerView;
    },

    destroy: function() {
      if ($('.swiper-container').size()) {
        swiperObj.destroySlider();
      } 
    }
  }
})();