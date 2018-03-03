<?php

function _services_commerce_customer_profile_reosource_access() {
  return TRUE;
}

function _services_commerce_customer_profile_retrieve($id) {
  // $query = db_select('commerce_addressbook_defaults', 'addressbook');
  // $query->fields('addressbook', array('profile_id'));

  // $query->condition('addressbook.uid',$id);

  // $query->fields('profile', array('profile_id'));
  // $query -> leftJoin('commerce_customer_profile','profile', 'addressbook.profile_id=profile.profile_id');

  // $query->condition('profile.status', 1);
  // $query->condition('profile.type', 'shipping');
  // $result = $query->execute()->fetchField(0);

  // $query = db_select('china_address', 'china_address');
  // $query->fields('china_address', array('region_id','parent_id','region_name','region_type'));
  // $result1 = $query->execute()->fetchAll();

  // $commerce_customer_profile = commerce_customer_profile_load($result);

  // $commerce_customer_profile->field_commerce_customer_address['zh-hans'][0]['regions']=$result1;

  // return $commerce_customer_profile;
  return commerce_order_commerce_customer_profile_can_delete($id);
}

function _services_commerce_customer_profile_update($profile_id, $data){
  //$oldprofile = commerce_customer_profile_load($profile_id);
  $profile = new stdClass();
  $profile->profile_id = $profile_id;
  $profile->uid= $data['uid'];
  $profile->created = '';//$oldprofile->created;//time();//$data['created'];
  //$profile->revision_id =NULL;//$oldprofile->revision_id;//0;//$data['revision_id'];
  $profile->type='shipping';
  $profile->data=FALSE;
  $profile->status=1;
  $profile->log='';

  $profile->commerce_customer_address = array('und' =>array(0=>array(
    'administrative_area'=>$data['administrative_area'],
    'locality'=>$data['locality'],
    'dependent_locality'=>$data['dependent_locality'],

    'thoroughfare'=>$data['thoroughfare'],
    'name_line'=>$data['name_line'],
    'first_name'=>$data['name_line'],
    'last_name'=>'',
    'linkphone'=>$data['linkphone'],
    'postal_code'=>$data['postal_code'],
    'country'=>'CN',
    'premise'=>NULL,
    'sub_premise'=>NULL,
    'organisation_name'=>NULL,
    'data'=>NULL,
    )));



  $return = commerce_customer_profile_save($profile);
  if($data['default']){
    //$savedprofile = commerce_customer_profile_load($profile_id)
    commerce_addressbook_set_default_profile($profile);
  }
  //commerce_addressbook_commerce_customer_profile_update($savedprofile);
  //return $data['default'];
  return $return;
}

function _services_commerce_customer_profile_create($data){
  $profile = new stdClass();
  //$profile->profile_id = $profile_id;
  $profile->uid= $data['uid'];
  $profile->created = '';//$oldprofile->created;//time();//$data['created'];
  //$profile->revision_id =NULL;//$oldprofile->revision_id;//0;//$data['revision_id'];
  $profile->type='shipping';
  $profile->data=FALSE;
  $profile->status=1;
  $profile->log='';

  $profile->commerce_customer_address = array('und' =>array(0=>array(
    'administrative_area'=>$data['administrative_area'],
    'locality'=>$data['locality'],
    'dependent_locality'=>$data['dependent_locality'],

    'thoroughfare'=>$data['thoroughfare'],
    'name_line'=>$data['name_line'],
    'first_name'=>$data['name_line'],
    'last_name'=>'',
    'linkphone'=>$data['linkphone'],
    'postal_code'=>$data['postal_code'],
    'country'=>'CN',
    'premise'=>NULL,
    'sub_premise'=>NULL,
    'organisation_name'=>NULL,
    'data'=>NULL,
    )));


  $return =  commerce_customer_profile_save($profile);

  commerce_addressbook_commerce_customer_profile_update($profile);

  return $return;
}