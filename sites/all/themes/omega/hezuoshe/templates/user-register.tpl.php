<div class="page-register-left">
	<img src="http://123.57.234.155/sites/default/files/registerleft.jpg"/>
</div>

<div class="hezuoshe-user-register-form-wrapper">
  <div class="registertitle"><h2><?php print render($intro_text); ?></h2></div>
  <?php print drupal_render_children($form) ?>
  <div class="agreement">
  	<?php print render($agreement); ?>
  	<label id="protocol_error" class="error hide" style="display: none;"><?php print render($prom_agree); ?></label>
  </div>
</div>

