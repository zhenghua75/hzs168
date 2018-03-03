<?php

/**
 * Override of theme_breadcrumb().
 */
//function hezuoshe_breadcrumb($breadcrumb) {
  // $breadcrumb = $variables['breadcrumb'];

  // if (!empty($breadcrumb)) {
  //   // Provide a navigational heading to give context for breadcrumb links to
  //   // screen-reader users. Make the heading invisible with .element-invisible.
  //   $output = '<h2 class="element-invisible">' . t('You are here') . '</h2>';

  //   $output .= '<div class="breadcrumb">' . implode(' › ', $breadcrumb) . '</div>';
  //   return $output;
  // }
//}

/**
 * Implements hook_theme().
 */
function hezuoshe_theme() {
  $items = array();
  $items['user_login'] = array(
    'render element' => 'form',
    'path' => drupal_get_path('theme', 'hezuoshe') . '/templates',
    'template' => 'user-login',
    'preprocess functions' => array(
       'hezuoshe_preprocess_user_login'
    ),
  );
  $items['user_register_form'] = array(
    'render element' => 'form',
    'path' => drupal_get_path('theme', 'hezuoshe') . '/templates',
    'template' => 'user-register',
    'preprocess functions' => array(
      'hezuoshe_preprocess_user_register'
    ),
  );

  return $items;
}

function hezuoshe_preprocess_user_login(&$vars) {
  $vars['intro_text'] = t('Login to the HEZUOSHE');
  $vars['form']['name']['#description']='';
  $vars['form']['pass']['#description']='';
  $vars['form']['name']['#attributes']=array('placeholder' => t('Please enter your phonenumber or email'));
  $items = array();
  $items[] = l(t('Forget password'), 'user/password', array('attributes' => array('title' => t('Request new password via e-mail.'))));
  if (variable_get('user_register', USER_REGISTER_VISITORS_ADMINISTRATIVE_APPROVAL)) {
    $items[] = l(t('Create new account'), 'user/register', array('attributes' => array('title' => t('Create a new user account.'))));
  }

  $vars['links'] = array('#markup' => theme('item_list', array('items' => $items)));
}

function hezuoshe_preprocess_user_register(&$vars) {
  $vars['intro_text'] = t('Regist to the HEZUOSHE');
  $vars['agreement'] = array(
    '#type' => 'checkbox',
    '#title' => t('I have readed and agree').l(t('<<register about>>'), 'node/192', array('attributes' => array('target' => '_blank'))),
    '#checked' => 'checked',
    '#attributes' => array('class' => array("readmecheck", 'checkbox-processed'),'id' => array("readme")),
  );
  $vars['prom_agree'] = t('Please agree the agreement');
}

function hezuoshe_preprocess_page(&$vars) {
  $releasedemands=array('node/add/buydemand','node/add/product','node/add/logistics','node/add/employment','node/add/article');
  if(in_array(current_path(), $releasedemands) && array_key_exists('block_10', $vars['page']['highlighted'])){
    $block10rel=$vars['page']['highlighted']['block_10']['#markup'];
    switch (current_path()) {
      case 'node/add/buydemand':
        $strold='a href="http://www.hzs168.com/node/add/buydemand"';
        $strnew='a class="active" href="http://www.hzs168.com/node/add/buydemand"';
        $block10rel=str_replace($strold, $strnew, $block10rel);
        break;
      case 'node/add/product':
        $strold='a href="http://www.hzs168.com/node/add/product"';
        $strnew='a class="active" href="http://www.hzs168.com/node/add/product"';
        $block10rel=str_replace($strold, $strnew, $block10rel);
        break;
      case 'node/add/logistics':
        $strold='a href="http://www.hzs168.com/node/add/logistics"';
        $strnew='a class="active" href="http://www.hzs168.com/node/add/logistics"';
        $block10rel=str_replace($strold, $strnew, $block10rel);
        break;
      case 'node/add/employment':
        $strold='a href="http://www.hzs168.com/node/add/employment"';
        $strnew='a class="active" href="http://www.hzs168.com/node/add/employment"';
        $block10rel=str_replace($strold, $strnew, $block10rel);
        break;
      case 'node/add/article':
        $strold='a href="http://www.hzs168.com/node/add/article"';
        $strnew='a class="active" href="http://www.hzs168.com/node/add/article"';
        $block10rel=str_replace($strold, $strnew, $block10rel);
        break;
      default:
        # code...
        break;
    }
    $vars['page']['highlighted']['block_10']['#markup']=$block10rel;
  }
}

function hezuoshe_preprocess_node(&$variables) {
  $uid=$variables['uid'];
  $account=user_load($uid);
  if(array_key_exists('und', $account->field_nickname)){
    $nickname=$account->field_nickname['und'][0]['value'];
  }else{
    $nickname=$account->field_nickname['value'];
  }

  $variables['nickname'] = l($nickname, 'user/'.$uid, array('attributes' => array('class' => 'nickname')));
  $variables['submitted'] = t('Submitted by !nickname on !datetime', array('!nickname' => $variables['nickname'], '!datetime' => $variables['date']));
  // <a href="/users/123456" title="查看用户资料" class="username" xml:lang="" about="/users/123456" typeof="sioc:UserAccount" property="foaf:name" datatype="">123456</a>
}

function hezuoshe_preprocess_comment(&$variables) {
  $uid=$variables['comment']->uid;
  $account=user_load($uid);
  if(array_key_exists('und', $account->field_nickname)){
    $nickname=$account->field_nickname['und'][0]['value'];
  }else{
    $nickname=$account->field_nickname['value'];
  }
  $variables['nickname'] = l($nickname, 'user/'.$uid, array('attributes' => array('class' => 'nickname')));
  $variables['submitted'] = t('Submitted by !nickname on !datetime', array('!nickname' => $variables['nickname'], '!datetime' => $variables['created']));
}

function hezuoshe_breadcrumb($breadcrumb) {
  // if(current_path()=='node/add/buydemand'){
  //   $breadcrumbs = '<a href="/">'.t('Home').'</a>" » "';
  //   $breadcrumbs = $breadcrumbs.'<a href="/node/add/buydemand">'.t('Add buydemand').'</a></div>';

  //   $breadcrumb = array();
  //   $breadcrumb[] = l(t('Home'), '<front>');
  //   $breadcrumb[] = l(t('Add buydemand'), '/node/add/buydemand');
  //   return '<div class="breadcrumb">'. implode(' ›› ', $breadcrumb) .'</div>';
  // }
}
