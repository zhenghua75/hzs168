var base = (function(my) {
    'use strict';
    my.services_path = 'http://www.hzs168.com/drupalgap'; //'http://hzs.cn/drupalgap';//
    my.default_code = 'und';
    my.site_path = 'http://www.hzs168.com'; //'http://hzs.cn';//
    my.base_path = '/';
    my.file_public_path = 'sites/default/files';
    my.file_private_path = 'sites/default/files/styles';
    my.default_img_path = 'img/7.jpg';
    my.default_store_img_path = 'img/7.jpg';
    my.path = {
        'login': my.services_path + '/user/login',
        'logout': my.services_path + '/user/logout',
        'register': my.services_path + '/user/register',
        'connect': my.services_path + '/system/connect',
        'user': my.services_path + '/user',
        'file': my.services_path + '/file',
        'attachfile': my.services_path + '/node/attach_file',
        'node': my.services_path + '/node',
        'cart': my.services_path + '/cart',
        'lineitem': my.services_path + '/line-item',
        'checkout_complete': my.services_path + '/checkout_complete',
        'commercecustomerprofile': my.services_path + '/commerce_customer_profile',
        'searchnode': my.services_path + '/search_node/retrieve',
        'token': my.services_path + '/user/token',
        'message': my.services_path + '/privatemsg',
        'flag':my.services_path+'/flag/flag',
        'isflag':my.services_path+'/flag/is_flagged',
        'sms':my.services_path+'/user/sms',
        'newpasswordsms':my.services_path+'/user/newpassword_sms',
        'newpasswordreset':my.services_path+'/user/newpassword_reset',
    };
    my.onError = function(jqXHR, textStatus, errorThrown) {
        console.log('出错了！')
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
        $.mobile.loading('hide');
        switch (jqXHR.status) {
            case 500:
                my.ErrorDialog(textStatus, jqXHR.status, errorThrown);
                break;
            default:
                if (jqXHR.responseJSON) {
                    if(jqXHR.responseJSON.form_errors){
                        var errors = '';
                        $.each(jqXHR.responseJSON.form_errors, function(idx, error) {
                            errors += error+'<br/>';
                        });
                        my.ErrorDialog(textStatus, jqXHR.status, errors);
                    }else{
                        my.ErrorDialog(textStatus, jqXHR.status, jqXHR.responseJSON[0]);
                    }
                }
                break;
        }
    };
    my.ErrorDialog = function(header, mainheader, maincontent) {
        $('#dialog-error-header').html(header);
        $('#dialog-error-main-header').html(mainheader);
        $('#dialog-error-main-content').html(maincontent);
        $.mobile.changePage('#dialog-error', {
            transition: 'pop'
        });
    };
    my.TokenAjax = function(options) {
        my.ajax(false, {
            url: base.path.token,
            type: 'POST',
            success: function(CSRFToken) {
                console.log(CSRFToken);
                my.ajax(CSRFToken.token, options);
            }
        })
    };
    my.OperAjax = function(options) {
        my.ajax(false, {
            url: base.path.token,
            type: 'POST',
            success: function(CSRFToken) {
                console.log(CSRFToken);
                if (CSRFToken.uid === 0) {
                    localStorage.clear();
                    $('body').pagecontainer('change', '#user-login');
                } else {
                    my.ajax(CSRFToken.token, options);
                }
            }
        })
    };
    my.ajax = function(token, options) {

        if (options) {
            var defaults = {
                error: my.onError,
                dataType: 'json',
                type: 'GET',
            };
            if (token) {
                defaults.beforeSend = function(request) {
                    request.setRequestHeader('X-CSRF-Token', token);
                };
            }
            var settings = $.extend({}, defaults, options);
            $.ajax(settings);
        } else {
            console.log('base ajax options is null');
        }
    };
    my.image_url = function(uri) {
        try {
            var src = my.site_path + my.base_path + my.uri;
            if (src.indexOf('public://') != -1) {
                src = src.replace('public://', my.file_public_path + '/');
            } else if (src.indexOf('private://') != -1) {
                src = src.replace(
                    'private://',
                    my.file_private_path + '/'
                );
            }
            return src;
        } catch (error) {
            console.log('drupalgap_image_path - ' + error);
        }
    };
    my.image_style_url = function(style_name, path) {
        try {
            var src = my.site_path + my.base_path + my.path;
            if (src.indexOf('public://') != -1) {
                src = src.replace(
                    'public://',
                    my.file_public_path +
                    '/styles/' +
                    style_name +
                    '/public/'
                );
            } else if (src.indexOf('private://') != -1) {
                src = src.replace(
                    'private://',
                    my.file_private_path +
                    '/styles/' +
                    style_name +
                    '/private/'
                );
            }
            return src;
        } catch (error) {
            console.log('image_style_url - ' + error);
        }
    };
    return my;
}(base || {}));

/*===========================
base AMD Export
===========================*/
if (typeof(module) !== 'undefined') {
    module.exports = base;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        'use strict';
        return base;
    });
}
