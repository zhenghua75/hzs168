<?php
/**
 * @file
 * Template file for theming of inline field group.
 *
 * Available variables:
 * - $group
 * - $label
 * - $items
 * - $classes
 * - $separator
 */
?>

<?php if ($items): ?>
  <div class="<?php print $classes; ?>">
  <?php if ($label): ?>
    <div class="field-group-label"><?php print $label; ?></div>
  <?php endif; ?>

  <?php foreach ($items as $key => $item): ?>
    <div class="field-group-inline-item item-<?php print $key; ?>">
      <?php $last = $item == end($items); ?>

      <?php print render($item); ?>

      <?php if (!$last): ?>
        <span class="field-group-inline-separator"><?php print $separator; ?></span>
      <?php endif; ?>
    </div>
  <?php endforeach; ?>
  </div>
<?php endif; ?>
