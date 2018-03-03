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

<?php if ($address['name_line']) : ?>
  <b> <?php print t('name'); ?> : </b>
  <?php print $address['name_line']; ?> 
<?php endif; ?>

<?php if ($address['province']) : ?>
  <b> <?php print t('province'); ?> : </b>
  <?php print $address['province']; ?> 
<?php endif; ?>

<?php if ($address['city']) : ?>
  <b> <?php print t('city'); ?> : </b>
  <?php print $address['city']; ?> 
<?php endif; ?>

<?php if ($address['county']) : ?>
  <b> <?php print t('county'); ?> : </b>
  <?php print $address['county']; ?> 
<?php endif; ?>

<?php if ($address['detail']) : ?>
  <b> <?php print t('detail'); ?> : </b>
  <?php print $address['detail']; ?> 
<?php endif; ?>

<?php if ($address['postcode']) : ?>
  <b> <?php print t('postcode'); ?> : </b>
  <?php print $address['postcode']; ?> 
<?php endif; ?>

<?php if ($address['linkphone']) : ?>
  <b> <?php print t('linkphone'); ?> : </b>
  <?php print $address['linkphone']; ?> 
<?php endif; ?>