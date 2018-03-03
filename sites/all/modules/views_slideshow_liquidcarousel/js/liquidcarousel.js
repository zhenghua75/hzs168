/**
 * @file liquidcarousel.js
 */
(function ($) {
  Drupal.behaviors.viewsSlideshowLiquidCarousel = {
    attach: function (context, settings) {
      var fullId;
      var slideshowSettings;
      var slideshowContainer;

      $('.views_slideshow_liquidcarousel_main:not(.viewsSlideshowLiquidCarousel-processed)', context).addClass('viewsSlideshowLiquidCarousel-processed').each(function() {
        fullId = '#' + $(this).attr('id');// The id of the carousel.
        slideshowSettings = settings.viewsSlideshowLiquidCarousel[fullId];
        slideshowSettings.duration = parseInt(slideshowSettings.duration);
        slideshowSettings.height = parseInt(slideshowSettings.height);
        slideshowSettings.hidearrows = (slideshowSettings.hidearrows == 1) ? true : false;

        slideshowSettings.targetId = '#' + $(fullId + " :first").attr('id');
        slideshowContainer = $(slideshowSettings.targetId);

        // Check if liquidcarousel has been loaded.
        if (!jQuery.isFunction(slideshowContainer.liquidcarousel)) {
          return;
        }

        // Dynamically set the height when the height is set to 0.
        if (slideshowSettings.height == 0) {
          slideshowSettings.height = $('> .wrapper > ul > li:first', slideshowContainer).height();
        }

        // Create the liquid carousel.
        slideshowContainer.liquidcarousel({
          height:slideshowSettings.height,
          duration:slideshowSettings.duration,
          hidearrows:slideshowSettings.hidearrows
        });
      });
    }
  };
})(jQuery);

