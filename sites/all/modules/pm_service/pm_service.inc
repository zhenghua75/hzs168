<?php

// $Id$

/**
 * @file
 *  Link general private message module functionalities to services module.
 */

function pm_service_access(){
	return TRUE;
}

/**
 * Get all of the logged in user's private messages.
 *
 * @param $type
 * String. Which type of messages you would like to retrieve.
 * Possibilities are inbox or sent.
 *
 * @param $load_full
 * Boolean. Whether to load the full message for each message or not.
 *
 * @param $offset
 *   Integer (optional). An offset integer for paging.
 * @param $limit
 *   Integer (optional). A limit integer for paging.
 *
 * @return
 *   An array of messages.
 *
 */

function pm_service_get($type = 'inbox', $offset = 0, $limit = 0){
	$messages = array();
	$pms = array();

	// If no type passed set default type to inbox.

	if (!$type) {
		$type = 'inbox';
	}

	// User needs to be authenticated to proceed.

	global $user;
	if (!user_is_logged_in()) {
		return services_error(t('This user is not logged in.') , 403);
	}

	// Use the current user for the account.

	else {
		$account = $user;
	}

	// Construct the query and retrieve the correct set of messages.

	$query = db_query(_privatemsg_assemble_query('list', $account, '')->execute());
	//return $query;
	foreach($query as $thread_id => $msg) {
		$thread = privatemsg_thread_load($msg->thread_id);
		foreach($thread['messages'] as $msgid=>$tmsg){
			$author= $tmsg->author;
			$participants1 = user_load($author->uid);
			$participants = clone $participants1;
			services_remove_user_data($participants);

			$authorresult = array(
				'field_nickname'=>$participants->field_nickname['und'][0]['safe_value'],
				'picture'=>$participants->picture->url
			);

			$msg->author = $authorresult;
			$timestamp = $tmsg->timestamp;
			$date = new DateTime("@$timestamp");
			$tz = new DateTimeZone('Asia/ShangHai');
			$date->setTimezone($tz);
			$msg->created = $date->format('Y-m-d H:i:s');
			$messages[] = $msg;
		}

	}

	// Return messages.

	return $messages;
}

/**
 * Get the number of unread private messages of the logged-in user.
 *
 * @return
 *   The unread count.
 */

function pm_service_unread_count($uid = ''){

	// User needs to be authenticated to proceed.

	global $user;
	if (!user_is_logged_in()) {
		return services_error(t('This user is not logged in.') , 403);
	}

	// If a user id other than the current user's ID is passed,
	// validate that the authenticated user has the correct
	// permissions to read another user's messages.

	if (is_numeric($uid) && ($uid != $user->uid)) {
		if (user_access("read all private messages")) {
			$account = user_load($uid);
		}
		else {
			return services_error(t('This user does not have permissions to use this service.') , 403);
		}
	}

	// Use the current user for the account.

	else {
		$account = $user;
	}

	// Return unread count.

	return privatemsg_unread_count($account);
}

/**
 * Send a private message to one or more recipients.
 *
 * @param $recipients
 * String. A comma separated list of usernames for recipients of the message.
 *
 * @param $subject
 * String. A message subject
 *
 * @param $body
 * String. A message body
 *
 * @param $thread_id
 * Integer. A thread ID. pass this parameter if you are sending a message reply.
 *
 * @return
 * Boolean. Return TRUE if sending the message was successful.
 */

function pm_service_send(array $message){
	$subject = $message['subject'];
	$body = $message['body'];
	$recipients=$message['recipients'];
	$thread_id = $message['thread_id'];
	$form_state = array();
	// Make sure the message author is logged in.

	global $user;
	$account = user_load($user->uid);
	if (!user_is_logged_in()) {
		return services_error(t('Author is not logged in.') , 403);
	}

	// Validate at least 1 recipient has been passed in.

	if ($recipients == '' && !$thread_id) {
		return services_error(t('There are no recipients, please enter a recipient for the message.') , 400);
	}
	elseif (!$thread_id) {

		// No thread ID - we are sending a new message.
		// Convert the recipients string to an array of user objects.

		list($recipients, $invalid) = _privatemsg_parse_userstring($recipients);
		if (!empty($invalid)) {

			// At least one of the recipients could not be found.

			$invalid_usernames = array(
				'@names' => implode(', ', $invalid)
			);
			return services_error(t('One or more usernames are invalid: @names', $invalid_usernames) , 400);
		}

		$result = privatemsg_new_thread($recipients, $subject, $body, array(
			'author' => $account
		));
		if ($result['success']) {
			return pm_service_thread_load($result["message"]->thread_id);
		}
		else {
			return services_error(implode("\n", $result['messages']['error']) , 400);
		}
	}
	else {

		// There is a thread id so we are sending a reply.

		$result = privatemsg_reply($thread_id, $body, array(
			'author' => $account
		));
		if ($result['success']) {
			return TRUE;
		}
		elseif (!empty($result[0])) {

			// If $result[0] this means the thread could not be loaded.

			return services_error($result[0], 404);
		}
		else {

			// Rlse there was some other problem.

			return services_error(implode("\n", $result['messages']['error']) , 400);
		}
	}
}

/**
 * Get all messages in a thread.
 *
 * @param <int> @thread_id
 *   ID of the thread to be loaded.
 * @param <int> $offset
 *   Optional: Message offset from the start of the thread.
 * @return
 *   An array of messages in a thread.
 */

function pm_service_get_thread($thread_id, $offset = 0){

	// Return if wrong paramters are passed.

	if (!$thread_id || !is_numeric($thread_id)) {
		return services_error(t('Invalid parameters passed') , 400);
	}

	// Make sure the user is logged in.

	global $user;
	$account = user_load($user->uid);
	if (!user_is_logged_in()) {
		return services_error(t('The user is not logged in.') , 403);
	}

	// Return the full thread.

	return pm_service_thread_load($thread_id, $account, $offset);
}

function pm_service_thread_load($pmtid){
	$thread = privatemsg_thread_load($pmtid);

	$result = array(
		'thread_id' => $thread['thread_id'],
		'subject' => $thread['subject'],
		'participants' => array(),
		'messages' => array(),
	);
	foreach ($thread['participants'] as $user){
		$result['participants'][] = $user->uid;
	}
	foreach ($thread['messages'] as $message){
		$timestamp = $message->timestamp;
		$date = new DateTime("@$timestamp");
		$tz = new DateTimeZone('Asia/ShangHai');
		$date->setTimezone($tz);
		$created = $date->format('Y-m-d H:i:s');

		$result['messages'][] = array(
			'mid' => $message->mid,
			'author' => $message->author->uid,
			'created' => $created,
			'body' => $message->body,
			'is_new' => $message->is_new,
			'field_nickname'=>$message->author->field_nickname['und'][0]['safe_value'],
			'picture'=>$message->author->picture
		);
	}
	return $result;
}
