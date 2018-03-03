<div class="page-login-left">
	<img src="http://123.57.234.155/sites/default/files/loginleft.jpg"/>
</div>

<div class="hezuoshe-user-login-form-wrapper">
  <div class="logintitle"><h2><?php print render($intro_text); ?></h2></div>
  <?php print drupal_render_children($form) ?>
  <?php print render($links); ?>
</div>