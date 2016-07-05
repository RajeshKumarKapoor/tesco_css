/*!
 * jQuery countdown plugin
 * Author: @stevelorek
 * Licensed under the MIT license
 */
(function($) {
  $.fn.extend({
    countdown: function(options) {

      var options = $.extend({
        step: 1,
        minimum: 0,
        maximum: null,
        precision: 2
      }, options);

      return this.each(function() {
        var counter = $(this);
        var timers = [];
        var days = counter.find('.time-days .time-value');
        var hours = counter.find('.time-hours .time-value');
        var minutes = counter.find('.time-minutes .time-value');
        var seconds = counter.find('.time-seconds .time-value');

        function pad(n) {
          return (n < 10) ? ("0" + n) : n;
        }

        var deductSeconds = function() {
          if (timeRemaining() == 0) return destroy();
          var new_value = (secondsRemaining() == 0) ? 59 : secondsRemaining() - 1;
          seconds.html(pad(new_value));
          timers.push(setTimeout(deductSeconds, 1000));
          if (new_value == 59) deductMinute();
        };
        var deductMinute = function() {
          var new_value = (minutesRemaining() == 0) ? 59 : minutesRemaining() - 1;
          minutes.html(pad(new_value));
          if (new_value == 59) deductHour();
        };
        var deductHour = function() {
          var new_value = (hoursRemaining() == 0) ? 23 : hoursRemaining() - 1;
          hours.html(pad(new_value));
          if (new_value == 23) deductDay();
        };
        var deductDay = function() {
          var new_value = daysRemaining() - 1;
          days.html(pad(new_value));
        };
        var secondsRemaining = function() {
          return parseInt(seconds.html());
        };
        var minutesRemaining = function() {
          return parseInt(minutes.html());
        };
        var hoursRemaining = function() {
          return parseInt(hours.html());
        };
        var daysRemaining = function() {
          return parseInt(days.html());
        };
        var timeRemaining = function() {
          return parseInt(days.html()+hours.html()+minutes.html());
        };
        var destroy = function() {
          for (var i = 0; i < timers.length; i++) {
            clearTimeout(timers[i]);
          }
          counter.addClass('expired');
        };

        if (!counter.hasClass('expired')) timers.push(setTimeout(deductSeconds, 1000));
      });
    }
  });
})(jQuery);