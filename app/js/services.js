var services = (function(my) {
    'use strict';
    my.UserToken = function(callback) {
        base.ajax(false, {
            url: base.path.token,
            type: 'POST',
            success: function(data) {
                console.log(data);
                callback(data);
            },
        });
    };
    my.UserLogin = function(data, callback) {
        base.TokenAjax({
            url: base.path.login,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.Message = function(threadid, callback) {
        base.OperAjax({
            url: base.path.message + '/' + threadid,
            // data: {
            //     'type': 'inbox',
            //     'offset': 0,
            //     'limit': 10
            // },
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.PostMessage = function(data, callback) {
        base.OperAjax({
            url: base.path.message,
            type:'POST',
            data:data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.UserLogout = function(callback) {
        base.TokenAjax({
            url: base.path.logout,
            type: 'POST',
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.UserRegister = function(data, callback) {
        base.ajax(false, {
            url: base.path.register,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.sms = function(data, callback) {
        base.ajax(false, {
            url: base.path.sms,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.newpasswordsms = function(data, callback) {
        base.ajax(false, {
            url: base.path.newpasswordsms,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.newpasswordreset = function(uid,data, callback) {
        base.ajax(false, {
            url: base.path.newpasswordreset+'/'+uid,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.UserUpdate = function(uid, data, callback) {
        base.OperAjax({
            url: base.path.user + '/' + uid,
            type: 'PUT',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.User = function(uid, callback) {
        base.OperAjax({
            url: base.path.user + '/' + uid,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.CurrentUser = function(callback) {
        base.TokenAjax({
            url: base.path.connect,
            type: 'POST',
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.FileUrl = function(fid, callback) {
        base.OperAjax({
            url: base.path.file + '/' + fid,
            data: {
                'file_contents': 0
            },
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.loading = function(text) {
        $.mobile.loading("show", {
            text: text,
            textVisible: true,
            theme: "z",
            html: ""
        });
    };
    my.HideLoading = function() {
        $.mobile.loading('hide');
    };
    my.FileUpload = function(file, filename, callback) {
        if (!file) return;
        var data = {
            "file": {
                "file": file,
                "filename": filename,
            }
        };
        my.loading('图片上传中...')
        base.OperAjax({
            url: base.path.file,
            type: 'POST',
            data: data,
            success: function(result) {
                my.HideLoading();
                console.log(result);
                callback(result);
            }
        });
    };
    my.flag = function(data, callback) {
        base.OperAjax({
            url: base.path.flag,
            type: 'POST',
            data: data,
            success: function(result) {
                console.log(result);
                callback(result);
            }
        });
    };
    my.isflag = function(data, callback) {
        base.OperAjax({
            url: base.path.isflag,
            type: 'POST',
            data: data,
            success: function(result) {
                console.log(result);
                callback(result);
            }
        });
    };
    my.NodeFile = function(data, callback) {
        base.OperAjax({
            url: base.path.attachfile,
            type: 'POST',
            data: data,
            processData: false,
            contentType: 'multipart/form-data', //false,
            enctype: 'multipart/form-data',
            success: function(result) {
                console.log(result);
                callback(result);
            }
        });
    };

    my.NodeDelete = function(nid, callback) {
        base.OperAjax({
            url: base.path.node + '/' + nid,
            type: 'DELETE',
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.NodeCreate = function(data, callback) {
        my.loading('');
        base.OperAjax({
            url: base.path.node,
            type: 'POST',
            data: data,
            success: function(data) {
                my.HideLoading();
                console.log(data);
                callback(data);
            }
        });
    };

    my.NodeEdit = function(nid,data, callback) {
        //'node[title]=' + nodeTitle + '&node[body][' + language_code + '][0][value]=' + nodeBody,
        base.OperAjax({
            url: base.path.node + '/' + nid,
            type: 'PUT',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.NodeCancel = function(nid,callback) {
        base.OperAjax({
            url: base.path.node + '/cancel/'+nid,
            type: 'POST',
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.NodeClose = function(nid,callback) {
        base.OperAjax({
            url: base.path.node + '/close/'+nid,
            type: 'POST',
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.Node = function(nid, callback) {
        base.ajax(false, {
            url: base.path.node + '/' + nid,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.Product = function(pid, callback) {
        base.ajax(false, {
            url: base.path.product + '/' + pid,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.Cart = function(callback) {
        base.OperAjax({
            url: base.path.cart,
            success: function(data) {
                console.log('services cart');
                console.log(data);
                callback(data);
            }
        });
    };

    my.CartCreate = function(callback) {
        base.OperAjax({
            url: base.path.cart,
            type: 'POST',
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.LineItemCreate = function(orderid, productid, callback) {
        var data = {
            order_id: orderid,
            type: 'product',
            commerce_product: productid
        };
        base.OperAjax({
            url: base.path.lineitem,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.LineItemUpdate = function(lineitemid, quantity, callback) {
        var data = {
            'quantity': quantity
        };
        base.OperAjax({
            url: base.path.lineitem + '/' + lineitemid,
            type: 'PUT',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.LineItemDelete = function(lineitemid, callback) {
        base.OperAjax({
            url: base.path.lineitem + '/' + lineitemid,
            type: 'DELETE',
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.Checkout = function(orderid, callback) {
        var data = {
            order_id: orderid
        };
        base.OperAjax({
            url: base.path.checkout_complete,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.CommerceCustomerAddressCanModify = function(profileid, callback) {
        base.OperAjax({
            url: base.path.commercecustomerprofile + '/' + profileid,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.CommerceCustomerAddress = function(profileid, data, callback) {
        base.OperAjax({
            url: base.path.commercecustomerprofile + '/' + profileid,
            type: 'PUT',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.CreateCommerceCustomerAddress = function(data, callback) {
        base.OperAjax({
            url: base.path.commercecustomerprofile,
            type: 'POST',
            data: data,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };
    my.List = function(path, id, callback) {
        base.ajax(false, {
            url: base.site_path + '/' + path + '/' + id,
            success: function(data) {
                console.log(data);
                callback(data);
            }
        });
    };

    my.SearchNode = function(keywords, callback) {
        base.ajax(false, {
            url: base.path.searchnode,
            data: {
                'keys': keywords,
                'simple': 1
            },
            timeout: 3000,
            success: function(data) {
                console.log(data);
                callback(data);
            },
            error: function() {}
        });
    };
    return my;
}(services || {}));

/*===========================
base AMD Export
===========================*/
if (typeof(module) !== 'undefined') {
    module.exports = services;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        'use strict';
        return services;
    });
}
