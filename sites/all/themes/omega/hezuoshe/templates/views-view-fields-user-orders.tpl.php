<?php

/**
  * commerce_backoffice_user_orders
 */
?>
<?php foreach ($fields as $id => $field): ?>
  <?php if (!empty($field->separator)): ?>
    <?php print $field->separator; ?>
  <?php endif; ?>

  <?php print $field->wrapper_prefix; ?>
    <?php print $field->label_html; ?>
	<?php if($view->name=='commerce_backoffice_user_orders'){
		$orderstatus = $view->style_plugin->get_field_value($view->row_index,'status');
		if($id=='order_id_1' && $orderstatus!='checkout_payment_select'){
			print $field->content;
		}
	}?>
  <?php print $field->wrapper_suffix; ?>
<?php endforeach; ?>
