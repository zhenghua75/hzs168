<?php
/**
 * @file
 * Views Slideshow: Single Frame template file.
 *
 * - $rows: The themed rows from the view.
 * - $settings: The settings for the views slideshow type.
 * - $view: The view object.
 * - $vss_id: The views slideshow id.
 */
?>
<div id="views_slideshow_liquidcarousel_content_<?php print $vss_id; ?>" class="liquid">
  <span class="previous"><?php print t('Previous'); ?></span>
  <div class="wrapper">
    <ul>
    <?php foreach ($rows as $row): ?>
      <li><?php print $row; ?></li>
    <?php endforeach; ?>
    </ul>
  </div>
  <span class="next"><?php print t('Next'); ?></span>
</div>
