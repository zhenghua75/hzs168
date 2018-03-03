<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page.
 *
 * The doctype, html, head and body tags are not in this template. Instead they
 * can be found in the html.tpl.php template in this directory.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $directory: The directory the template is located in, e.g. modules/system
 *   or themes/bartik.
 * - $is_front: TRUE if the current page is the front page.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or
 *   prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 *
 * Navigation:
 * - $main_menu (array): An array containing the Main menu links for the
 *   site, if they have been configured.
 * - $secondary_menu (array): An array containing the Secondary menu links for
 *   the site, if they have been configured.
 * - $breadcrumb: The breadcrumb trail for the current page.
 *
 * Page content (in order of occurrence in the default page.tpl.php):
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title: The page title, for use in the actual HTML content.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 * - $messages: HTML for status and error messages. Should be displayed
 *   prominently.
 * - $tabs (array): Tabs linking to any sub-pages beneath the current page
 *   (e.g., the view and edit tabs when displaying a node).
 * - $action_links (array): Actions local to the page, such as 'Add menu' on the
 *   menu administration interface.
 * - $feed_icons: A string of all feed icons for the current page.
 * - $node: The node object, if there is an automatically-loaded node
 *   associated with the page, and the node ID is the second argument
 *   in the page's path (e.g. node/12345 and node/12345/revisions, but not
 *   comment/reply/12345).
 *
 * Regions:
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['sidebar_second']: Items for the second sidebar.
 * - $page['header']: Items for the header region.
 * - $page['footer']: Items for the footer region.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see template_process()
 * @see html.tpl.php
 *
 * @ingroup themeable
 */
?>
<div id="page-wrapper" class="clearfix">
  <div id="page" class="clearfix">

    <header id="header-outer-wrapper" class="outer-wrapper clearfix" role="banner">
      <div id="header-layout" class="header-layout inner-wrapper clearfix <?php print $region_classes['header']; ?>">
        
        <?php if ($page['header']): ?>
        <div id="header" class="region--header clearfix column">
          <?php print render($page['header']); ?>
        </div>
        <?php endif; ?>
        
        <div id="branding" class="region--branding clearfix column">
        
          <?php if ($logo): ?>
            <div id="logoblock">
              <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home" id="logo">
                <img src="<?php print $logo; ?>" alt="<?php print t('Home'); ?>" />
              </a>
            </div>
          <?php endif; ?>
          <div id="demandrelease">
            <a href="/node/add/buydemand" target="_blank" class="release"><?php print t('release demand'); ?></a>
          </div>

          <div id="branding-middle">
            <?php if ($page['branding']): ?>
              <?php print render($page['branding']); ?>
            <?php endif; ?>

            <?php if ($site_name || $site_slogan): ?>
              <div id="name-and-slogan">
                <?php if ($site_name): ?>
                  <?php if ($title): ?>
                    <div id="site-name"><strong>
                      <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home"><span><?php print $site_name; ?></span></a>
                    </strong></div>
                  <?php else: /* Use h1 when the content title is empty */ ?>
                    <h1 id="site-name">
                      <a href="<?php print $front_page; ?>" title="<?php print t('Home'); ?>" rel="home"><span><?php print $site_name; ?></span></a>
                    </h1>
                  <?php endif; ?>
                <?php endif; ?>
      
                <?php if ($site_slogan): ?>
                  <div id="site-slogan"><?php print $site_slogan; ?></div>
                <?php endif; ?>
              </div> <!-- /#name-and-slogan -->
            <?php endif; ?>
          </div>

          <div id="branding-right">
            <a href="http://www.hzs168.com/allassociation">
              <img src="http://www.hzs168.com/sites/default/files/right-association.png"/>
            </a>
          </div>
        </div>
        
        <?php if($main_menu || $secondary_menu): ?>
          <div id="menu" class="region--menu clearfix">
            <?php if ($main_menu): ?>
              <nav id ="main-menu" class="navigation clearfix" role="navigation">
                <?php print render($page['menu']); ?>
              </nav> <!-- /#main-menu -->
            <?php endif; ?>
            <?php if($secondary_menu): ?>
              <nav id="secondary-menu" class="navigation clearfix" role="navigation">
                <?php print theme('links__system_secondary_menu', array('links' => $secondary_menu, 'attributes' => array('id' => 'secondary-menu', 'class' => array('links', 'inline', 'clearfix')))); ?>
              </nav> <!-- /#secondary-menu -->
            <?php endif; ?>
          </div>
        <?php endif; ?>
      </div>
    </header> <!-- /.section, /#header-->

  <?php if ($page['preface_first'] || $page['preface_header'] || $page['preface_second'] || $page['preface_third'] || $page['preface_fourth']): ?>
    <section id="preface-slideshow" class="outer-wrapper clearfix">
      <div id="preface-slideshow-layout" class="preface-slideshow-layout inner-wrapper clearfix">
        <?php if ($page['preface_first']): ?>
          <div id="preface-first" class="region--preface-first"><?php print render($page['preface_first']); ?></div>
        <?php endif; ?>
        <?php if ($page['preface_second']): ?>
          <div id="preface-second" class="region--preface-second"><?php print render($page['preface_second']); ?></div>
        <?php endif; ?>
      </div>
    </section>
    <section id="preface-outer-wrapper" class="outer-wrapper clearfix">
      <div id="preface-layout" class="preface-layout inner-wrapper clearfix <?php print $region_classes['preface']; ?>">
        <?php if ($page['preface_header']): ?>
          <div id="preface-header" class="region--preface-header"><?php print render($page['preface_header']); ?></div>
        <?php endif; ?>
        <?php if ($page['preface_third']): ?>
          <div id="preface-third" class="region--preface-third"><?php print render($page['preface_third']); ?></div>
        <?php endif; ?>
        <?php if ($page['preface_fourth']): ?>
          <div id="preface-fourth" class="region--preface-fourth"><?php print render($page['preface_fourth']); ?></div>
        <?php endif; ?>
      </div><!-- /#preface-layout -->
    </section> <!-- /#preface-wrapper -->
  <?php endif; ?>
  
  
  <?php
    // need some good cleanup on these default Drupal elements
  ?>
  
  <section id="core-outer-wrapper" class="outer-wrapper clearfix">
    <div id="core-layout" class="core-layout inner-wrapper clearfix <?php print $region_classes['core']; ?>">
      
      <div id="highlighted" class="region--highlighted column">
        <?php print $messages; ?>    
        
        <a id="main-content"></a>

        <?php if ($page['highlighted']): ?>
          <?php print render($page['highlighted']); ?>
        <?php endif; ?>

        <?php print render($page['help']); ?>
        <?php if ($action_links): ?><ul class="action-links"><?php print render($action_links); ?></ul><?php endif; ?>
      </div>
      
      <?php if ($page['help']): ?>
        <div id="help" class="region--help column">
          <?php print render($page['help']); ?>
        </div>
      <?php endif; ?>
    
    </div>
  </section> 

  <section id="content-outer-wrapper" class="outer-wrapper clearfix">
    <?php if ($tabs): ?><div class="tabs"><?php print render($tabs); ?></div><?php endif; ?>
    <div id="main-layout" class="main-layout inner-wrapper clearfix <?php print $region_classes['main']; ?>">
      <?php if ($page['sidebar_first']): ?>
        <div id="sidebar-first" class="region--sidebar-first column sidebar">
          <aside class="section">
            <?php print render($page['sidebar_first']); ?>
          </aside>
        </div><!-- /.section, /#sidebar-first -->
      <?php endif; ?>
      
      <main id="content" class="region--content column" role="main">
        <?php print render($page['content']); ?>
        <?php print $feed_icons; ?>
      </main> <!-- /.section, /#content -->
  
      <?php if ($page['sidebar_second']): ?>
        <div id="sidebar-second" class="region--sidebar-second column sidebar">
          <aside class="section">
            <?php print render($page['sidebar_second']); ?>
          </aside>
        </div><!-- /.section, /#sidebar-second -->
      <?php endif; ?>
  
    </div><!-- /#main -->
  </section><!-- /#main-outer-wrapper -->

  <?php if ($page['postscript_first'] || $page['postscript_second'] || $page['postscript_third'] || $page['postscript_fourth']): ?>
    <section id="postscript-outer-wrapper" class="outer-wrapper clearfix">
      <div id="postscript-layout" class="postscript-layout inner-wrapper clearfix <?php print $region_classes['postscript']; ?>">
        <?php if ($page['postscript_header']): ?>
          <div id="postscript-header" class="region--postscript-header"><?php print render($page['postscript_header']); ?></div>
        <?php endif; ?>
        <?php if ($page['postscript_first']): ?>
          <div id="postscript-first" class="region--postscript-first"><?php print render($page['postscript_first']); ?></div>
        <?php endif; ?>
        <?php if ($page['postscript_second']): ?>
          <div id="postscript-second" class="region--postscript-second"><?php print render($page['postscript_second']); ?></div>
        <?php endif; ?>
        <?php if ($page['postscript_third']): ?>
          <div id="postscript-third" class="region--postscript-third"><?php print render($page['postscript_third']); ?></div>
        <?php endif; ?>
        <?php if ($page['postscript_fourth']): ?>
          <div id="postscript-fourth" class="region--postscript-fourth"><?php print render($page['postscript_fourth']); ?></div>
        <?php endif; ?>
        <?php if ($page['postscript_five']): ?>
          <div id="postscript-five" class="region--postscript-five"><?php print render($page['postscript_five']); ?></div>
        <?php endif; ?>
        <?php if ($page['postscript_six']): ?>
          <div id="postscript-six" class="region--postscript-six"><?php print render($page['postscript_six']); ?></div>
        <?php endif; ?>
      </div><!-- /#postscript-layout -->
    </section> <!-- /#postscript-wrapper -->
  <?php endif; ?>
  
  <?php if ($page['footer']): ?>
    <footer id="footer-outer-wrapper" class="outer-wrapper clearfix">
      <div id="footer-layout" role="contentinfo" class="footer-layout inner-wrapper clearfix <?php print $region_classes['footer']; ?>">
        <div id="footer" class="region--footer">
          <?php print render($page['footer']); ?>
        </div>
      </div> <!-- /#footer -->
    </footer> <!-- /#footer-outer-wrapper -->
  <?php endif; ?>
  </div> <!-- /#page -->
</div> <!-- /#page-wrapper -->

<link rel="stylesheet" href="http://www.hzs168.com/sites/default/files/suspension/style.css"/>
<script src="http://www.hzs168.com/sites/default/files/suspension/jquery.min.js"></script>
<!--收缩的-->
<div id="xzt" style="display: none" onmouseleave="disappear()">
    <a class="an1" onclick="showdzt();" onmouseleave="disappear()"></a>
    <a onmouseover="display()" title="在线QQ客服" class="an2"></a>
    <div id="qq1">
        <img id="qqbg_shuo" src="/sites/default/files/suspension/qqbg.png" alt=""/>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=2263571863&site=qq&menu=yes" target="_blank" title="在线QQ客服" class="an2" id="zixunqq_shuo"></a>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=3100578132&site=qq&menu=yes" target="_blank" title="在线QQ客服" class="an2" id="zixunqq2_shuo"></a>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=2956537520&site=qq&menu=yes" target="_blank" title="在线QQ客服" class="an2" id="zixunqq3_shuo"></a>
    </div>
    <a href="#" class="an3" onmouseleave="disappear()"></a>
    <img id="phone" src="/sites/default/files/suspension/close-tel1.png" alt="" />
    <a href="#" class="an4" onmouseleave="disappear()"></a>
    <img id="ewm" src="/sites/default/files/suspension/twocode.png" alt=""/>
    <a class="an5" onclick="$(window).scrollTop(0);"></a>
</div>
<!--打开的-->
<div id="dzt" style="display: block" onmouseleave="disappear1()">
    <a class="dj1" onclick="showxzt();" onmouseleave="disappear1()")></a>
    <a href="/node/add/buydemand" class="dj2" onmouseleave="disappear1()"></a>
    <a onmouseover="display1()" title="在线QQ客服" class="dj3"></a>
    <div id="qq">
        <img id="qqbg" src="/sites/default/files/suspension/qqbg.png" alt=""/>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=2263571863&site=qq&menu=yes" target="_blank" title="在线QQ客服" class="an2" id="zixunqq"></a>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=3100578132&site=qq&menu=yes" target="_blank" title="在线QQ客服" class="an2" id="zixunqq2"></a>
        <a href="http://wpa.qq.com/msgrd?v=3&uin=2956537520&site=qq&menu=yes" target="_blank" title="在线QQ客服" class="an2" id="zixunqq3"></a>
    </div>
    <a href="#" class="dj4" onmouseleave="disappear1()"></a>
    <img id="app" src="/sites/default/files/suspension/app.png" alt=""/>
    <a href="#" class="dj5" onmouseleave="disappear1()"></a>
    <img id="wx" src="/sites/default/files/suspension/weixin.jpg" alt=""/>
    <a class="dj6" onmouseleave="disappear1()"></a>
    <a class="dj7" onmouseleave="disappear1()" onclick="$(window).scrollTop(0);"></a>
</div>

<!--效果-->
<script language="JavaScript">
//      收起QQ
    function display(){
        document.getElementById("qq1").style.display="block";
    }
    function disappear(){
        document.getElementById("qq1").style.display="none";
    }

//      咨询电话
    $("#xzt .an3").hover(function () {
                $("#xzt #phone").show();
            },
            function () {
                $("#xzt #phone").hide();
            });
//      二维码
    $("#xzt .an4").hover(function () {
                $("#xzt #ewm").show();
            },
            function () {
                $("#xzt #ewm").hide();
            });
//      返回顶部
    $(window).scroll(function () {
        if ($(this).scrollTop() != 0) {
            $("#xzt .an5").show();
            $("#dzt .dj7").show();
        } else {
            $("#xzt .an5").hide();
            $("#dzt .dj7").hide();
        }
    });
//      展开QQ
    function display1(){
        document.getElementById("qq").style.display="block";
    }
    function disappear1(){
        document.getElementById("qq").style.display="none";
    }

//      App
    $("#dzt .dj4").hover(function () {
                $("#dzt #app").show();
            },
            function () {
                $("#dzt #app").hide(null);
            });
//      微信
    $("#dzt .dj5").hover(function(){
                $("#dzt #wx").show();
    },
            function(){
                $("#dzt #wx").hide();
            }
    );
//      展开
function showdzt() {
    $('#xzt').hide(200);
    $('#dzt').show(200);
}
function showxzt() {
    $('#dzt').hide(200);
    $('#xzt').show(200);
}
</script>