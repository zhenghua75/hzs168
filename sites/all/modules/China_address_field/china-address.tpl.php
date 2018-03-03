<?php

/**
 * @file
 * Default template implementation to display the value of China address field.
 *
 * Available variables:
 * - $address: An array of field values.
 * - $label: Determine whether to display label for each region type.
 */

?>

<?php if ($address['province']) : ?>
  <?php print $address['province']; ?><?php print t('Province'); ?>
<?php endif; ?>

<?php if ($address['city']) : ?>
  <?php print $address['city']; ?><?php print t('City'); ?>
<?php endif; ?>

<?php if ($address['county']) : ?>  
  <?php print $address['county']; ?>
<?php endif; ?>
