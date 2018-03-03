(function ($) {

/**
 * Attach handlers to evaluate the strength of any password fields and to check
 * that its confirmation is correct.
 */
Drupal.behaviors.password = {
  attach: function (context, settings) {
    var translate = settings.password;
    $('input.password-field', context).once('password', function () {
      var passwordInput = $(this);
      var innerWrapper = $(this).parent();
      var outerWrapper = $(this).parent().parent();

      // Add identifying class to password element parent.
      innerWrapper.addClass('password-parent');

      // Add the password confirmation layer.
      $('input.password-confirm', outerWrapper).parent().prepend('<div class="password-confirm">' + translate['confirmTitle'] + ' <span></span></div>').addClass('confirm-parent');
      var confirmInput = $('input.password-confirm', outerWrapper);
      var confirmResult = $('div.password-confirm', outerWrapper);
      var confirmChild = $('span', confirmResult);

      // Add the description box.
      var passwordMeter = '<div class="password-strength"><div class="password-strength-title">' + translate['strengthTitle'] + '</div><div class="password-strength-text" aria-live="assertive"></div><div class="password-indicator"><div class="indicator"></div></div></div>';
      $(confirmInput).parent().after('<div class="password-suggestions description"></div>');
      $(innerWrapper).prepend(passwordMeter);
      var passwordDescription = $('div.password-suggestions', outerWrapper).hide();

      // Check the password strength.
      var passwordCheck = function () {
        $('div.password-strength', outerWrapper).css({ display: 'block' });
        if(passwordInput.val()){
          var passwordresult = $('div.password-strength', outerWrapper).css({ visibility: 'visible' });
        }
        // Evaluate the password strength.
        var result = Drupal.evaluatePasswordStrength(passwordInput.val(), settings.password);

        // Update the suggestions for how to improve the password.
        if (passwordDescription.html() != result.message) {
          passwordDescription.html(result.message);
        }

        // Only show the description box if there is a weakness in the password.
        if (result.strength == 100) {
          passwordDescription.hide();
        }
        else {
          passwordDescription.show();
        }

        // Adjust the length of the strength indicator.
        $(innerWrapper).find('.indicator').css('width', result.strength + '%');

        // Update the strength indication text.
        $(innerWrapper).find('.password-strength-text').html(result.indicatorText);

        passwordCheckMatch();
      };

      // Check that password and confirmation inputs match.
      var passwordCheckMatch = function () {

        if (confirmInput.val()) {
          var success = passwordInput.val() === confirmInput.val();

          // Show the confirm result.
          confirmResult.css({ display: 'block' });
          confirmResult.css({ visibility: 'visible' });

          // Remove the previous styling if any exists.
          if (this.confirmClass) {
            confirmChild.removeClass(this.confirmClass);
          }

          // Fill in the success message and set the class accordingly.
          var confirmClass = success ? 'ok' : 'error';
          confirmChild.html(translate['confirm' + (success ? 'Success' : 'Failure')]).addClass(confirmClass);
          this.confirmClass = confirmClass;
        }
        else {
          confirmResult.css({ visibility: 'hidden' });
          confirmResult.css({ display: 'none' });
        }
      };

      // Monitor keyup and blur events.
      // Blur must be used because a mouse paste does not trigger keyup.
      passwordInput.keyup(passwordCheck).blur(passwordCheck);
      confirmInput.keyup(passwordCheckMatch).blur(passwordCheckMatch);
    });
  }
};

/**
 * Evaluate the strength of a user's password.
 *
 * Returns the estimated strength and the relevant output message.
 */
Drupal.evaluatePasswordStrength = function (password, translate) {
  var weaknesses = 0, strength = 100, msg = [];

  var hasLowercase = /[a-z]+/.test(password);
  var hasUppercase = /[A-Z]+/.test(password);
  var hasNumbers = /[0-9]+/.test(password);
  var hasPunctuation = /[^a-zA-Z0-9]+/.test(password);

  // If there is a username edit box on the page, compare password to that, otherwise
  // use value from the database.
  var usernameBox = $('input.username');
  var username = (usernameBox.length > 0) ? usernameBox.val() : translate.username;

  // Lose 5 points for every character less than 6, plus a 30 point penalty.
  if (password.length < 6) {
    msg.push(translate.tooShort);
    strength -= ((6 - password.length) * 5) + 30;
  }

  // Count weaknesses.
  if (!hasLowercase) {
    msg.push(translate.addLowerCase);
    weaknesses++;
  }
  if (!hasUppercase) {
    msg.push(translate.addUpperCase);
    weaknesses++;
  }
  if (!hasNumbers) {
    msg.push(translate.addNumbers);
    weaknesses++;
  }
  if (!hasPunctuation) {
    msg.push(translate.addPunctuation);
    weaknesses++;
  }

  // Apply penalty for each weakness (balanced against length penalty).
  switch (weaknesses) {
    case 1:
      strength -= 12.5;
      break;

    case 2:
      strength -= 25;
      break;

    case 3:
      strength -= 40;
      break;

    case 4:
      strength -= 40;
      break;
  }

  // Check if password is the same as the username.
  if (password !== '' && password.toLowerCase() === username.toLowerCase()) {
    msg.push(translate.sameAsUsername);
    // Passwords the same as username are always very weak.
    strength = 5;
  }

  // Based on the strength, work out what text should be shown by the password strength meter.
  if (strength < 60) {
    indicatorText = translate.weak;
  } else if (strength < 70) {
    indicatorText = translate.fair;
  } else if (strength < 80) {
    indicatorText = translate.good;
  } else if (strength <= 100) {
    indicatorText = translate.strong;
  }

  // Assemble the final message.
  msg = translate.hasWeaknesses + '<ul><li>' + msg.join('</li><li>') + '</li></ul>';
  return { strength: strength, message: msg, indicatorText: indicatorText };

};

/**
 * Field instance settings screen: force the 'Display on registration form'
 * checkbox checked whenever 'Required' is checked.
 */
Drupal.behaviors.fieldUserRegistration = {
  attach: function (context, settings) {
    var $checkbox = $('form#field-ui-field-edit-form input#edit-instance-settings-user-register-form');

    if ($checkbox.length) {
      $('input#edit-instance-required', context).once('user-register-form-checkbox', function () {
        $(this).bind('change', function (e) {
          if ($(this).attr('checked')) {
            $checkbox.attr('checked', true);
          }
        });
      });

    }
  }
};

Drupal.behaviors.numbervalidate = {
  attach: function (context, settings) {
    var numbertext=$('input#edit-sms-user-number');
    var timer;
    var send_time = 1 ? 1 : 1;
    var maxtime = send_time * 60-(1442806634-parseInt());
    var auth='register';
    var type ='mobile';
    var click_release_get_code_time = 0;
    $('#edit-get-code').val('获取验证码');
    if(maxtime<=send_time * 60){
      timer = setInterval(countDown ,1000);
    }
    var countDown = function () {
      if (maxtime >= 1) {
        $('#edit-get-code').attr('disabled', 'disabled').val(maxtime + '秒后重新获取').addClass("getwait");
        --maxtime;
      } else {
        clearInterval(timer);
        var htm_str = "重获验证码";
        if($('#edit-get-code').val() == '获取验证码'){
          htm_str = "获取验证码";
        }
        $('#edit-get-code').removeAttr('disabled').val(htm_str).removeClass('getwait');
      }
    };
    $('input#edit-get-code.form-submit.ajax-processed', context).once('submit',function () {
      $(this).bind('mousedown', function (e) {
        var number=numbertext.val();
        if(number.length==0)
        {
           alert('请输入手机号码！');
           numbertext.focus();
           return false;
        }    
        if(number.length!=11)
        {
            alert('请输入有效的手机号码！');
            numbertext.focus();
            return false;
        }
        
        var myreg = /^(((13[0-9]{1})|145|147|(15[0-9]{1})|170|176|177|178|(18[0-9]{1}))+\d{8})$/;
        if(!myreg.test(number))
        {
            alert('请输入有效的手机号码！');
            numbertext.focus();
            return false;
        }

        maxtime = send_time * 60;
        timer = setInterval(countDown, 1000);
        if($("#maxtime_mobile").length>0){
          $("#maxtime_mobile").val(maxtime);
          maxtime_mobile = maxtime;
          timer_tmp = setInterval(countDown_tmp, 1000);
        }
        if(typeof(noshow) == "undefined"){
          showDialog(json.msg, 'right', '操作提示');
        }
      });
    });
  }
};

Drupal.behaviors.checkbox = {
  attach: function (context, settings) {
    var $proto_error=$('label#protocol_error');
    var $readmecheck=$('input#readme');
    $('input#readme', context).click(function () {
        if ($(this).attr('checked')) {
          $proto_error.hide();
        }
        else{
          $proto_error.show();
        }
      });
  }
};

Drupal.behaviors.submit = {
  attach: function (context, settings) {
    var $readmecheck=$('input#readme');
    $('form#user-register-form input#edit-submit', context).click(function () {
        if (!$readmecheck.attr('checked')) {
          return false;
        }
      });
  }
};

})(jQuery);
