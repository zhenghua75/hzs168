<?php
/**
 *  @file views_slideshow_liquidcarousel.views_slideshow.inc
 */

/**
 * Implements hook_views_slideshow_slideshow_info().
 */
function views_slideshow_liquidcarousel_views_slideshow_slideshow_info() {
  return array(
    'views_slideshow_liquidcarousel' => array(
      'name' => t('Liquid Carousel'),
      'accepts' => array(),
      'calls' => array(),
    ),
  );
}

/**
 * Implements hook_views_slideshow_slideshow_type_form().
 */
function views_slideshow_liquidcarousel_views_slideshow_slideshow_type_form(&$form, &$form_state, &$view) {
  $library = libraries_load('liquidcarousel', 'minified');

  if (empty($library['installed'])) {
    $form['views_slideshow_liquidcarousel']['no_liquidcarousel_js'] = array(
      '#prefix' => '<div style="color: red">',
      '#suffix' => '</div>',
      '#markup' => _views_slideshow_liquidcarousel_get_install_error_message(),
    );
  }

  $form['views_slideshow_liquidcarousel']['duration'] = array(
    '#type' => 'textfield',
    '#title' => t('Duration'),
    '#default_value' => $view->options['views_slideshow_liquidcarousel']['duration'],
    '#description' => t('The duration of the animation.'),
  );
  $form['views_slideshow_liquidcarousel']['height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height'),
    '#default_value' => $view->options['views_slideshow_liquidcarousel']['height'],
    '#description' => t('The height of the list. Enter 0 to detect height automatically.'),
  );
  $form['views_slideshow_liquidcarousel']['hidearrows'] = array(
    '#type' => 'checkbox',
    '#title' => t('Hide arrows if all of the list items are visible'),
    '#default_value' => $view->options['views_slideshow_liquidcarousel']['hidearrows'],
  );
}

/**
 * Form validation callback for the slideshow settings.
 */
function views_slideshow_liquidcarousel_views_slideshow_options_form_validate(&$form, &$form_state, &$view) {
  $values = $form_state['values']['style_options']['views_slideshow_liquidcarousel'];

  if (!is_numeric($values['duration'])) {
    form_error($form['views_slideshow_liquidcarousel']['duration'], t('!setting must be numeric!', array('!setting' => 'Duration')));
  }
  if (!is_numeric($values['height'])) {
    form_error($form['views_slideshow_liquidcarousel']['height'], t('!setting must be numeric!', array('!setting' => 'Height')));
  }
}

/**
 * Implements hook_views_slideshow_option_definition().
 */
function views_slideshow_liquidcarousel_views_slideshow_option_definition() {
  $options['views_slideshow_liquidcarousel'] = array(
    'contains' => array(
      'duration' => array('default' => 100),
      'height' => array('default' => 0),
      'hidearrows' => array('default' => 1),
    )
  );
  return $options;
}

/**
 * Implements hook_views_slideshow_skin_info().
 */
function views_slideshow_liquidcarousel_views_slideshow_skin_info() {
  return array(
    'default' => array(
      'name' => t('Default'),
    ),
  );
}
