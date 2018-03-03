<?php
/**
 * @file views_slideshow_liquidcarousel.theme.inc
 */

/**
 * Implements hook_preprocess_HOOK().
 */
function views_slideshow_liquidcarousel_preprocess_views_slideshow_liquidcarousel_main_frame(&$variables) {
  $library = libraries_load('liquidcarousel', 'minified');

  if ($library['installed']) {
    $module_path = drupal_get_path('module', 'views_slideshow_liquidcarousel');

    $settings = $variables['settings'];
    $vss_id = $variables['vss_id'];
    $settings['vss_id'] = $vss_id;

    drupal_add_css($module_path . '/css/liquidcarousel.css');
    drupal_add_js($module_path . '/js/liquidcarousel.js');
    drupal_add_js(array('viewsSlideshowLiquidCarousel' => array('#views_slideshow_liquidcarousel_main_' . $vss_id => $settings)), 'setting');
  }
}
