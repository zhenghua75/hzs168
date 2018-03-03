/***************************************************
 * Drupal Web Services by kmdx.cn              *
 ***************************************************/

/*jslint browser: true*/
/*global console, $*/

var index = (function(my) {
    'use strict';

    var nodes = [],
        imagefiles = [],
        detailImageFiles = [],
        mathrand;
    // var frontsearch = document.getElementById('frontsearch');
    // frontsearch.addEventListener('change', function(e) {
    //     $('body').pagecontainer('change', '#search');
    // });
    // $('.ui-input-search').focus(function(){
    //     $('body').pagecontainer('change', '#search');
    // });
    /**
     * 删除内容
     */
    function nodeDelete(nid) {
        services.NodeDelete(nid, function(data) {
            console.log('成功删除了内容！');
            $('body').pagecontainer('change', '#front');
        });
    }

    /**
     * 卖
     */
    function nodeCreateProduct() {
        //event.preventDefault();
        var nodeTitle = $('#node-create-product-title').val(),
            nodeBody = $('#node-create-product-body').val(),
            nodePrice = $('#node-create-product-price').val(),
            nodeCount = $('#node-create-product-prodcount').val(),
            nodeSku = new Date().getTime(),//$('#node-create-product-sku').val(),
            nodePhone = $('#node-create-product-linkphone').val(),
            data = {
                'node[type]': 'product',
                'node[title]': nodeTitle,
                'node[field_product][und][form][sku]': nodeSku,
                'node[body][und][0][value]': nodeBody,
                'node[field_demandstatus][und]': 37,
                'node[field_product][und][form][commerce_price][und][0][amount]': nodePrice,
                'node[field_prodcount][und][0][value]': nodeCount,
                'node[field_product][und][form][status]': 1,
                'node[language]': 'und',
                'node[field_linkphone][und][0][value]': nodePhone,
            };
        for (var index in producttaxonomy) {
            var v = producttaxonomy[index];
            if (v && v.vid) {
                for (var index in nodes) {
                    var term = nodes[index].node;
                    if (term.vid == v.vid) {
                        var chk = document.getElementById(v.id + '-' + term.tid);
                        if (chk.checked) {
                            if (v.field == 'field_diameter' || v.field == 'field_level') {
                                if (!data['node[field_product][und][form][' + v.field + '][und]']) {
                                    data['node[field_product][und][form][' + v.field + '][und]'] = [];
                                }
                                data['node[field_product][und][form][' + v.field + '][und]'].push(term.tid);
                            } else {
                                if (!data['node[' + v.field + '][und]']) {
                                    data['node[' + v.field + '][und]'] = [];
                                }
                                data['node[' + v.field + '][und]'].push(term.tid);
                            }
                        }
                    }
                }
            }
        }
        data['node[field_product][und][form][field_images][und]'] = [];
        for (var i = 0; i < imagefiles.length; i++) {
            data['node[field_product][und][form][field_images][und]'].push(imagefiles[i]);
        };

        data['node[field_detailimages][und]'] = [];
        for (var i = 0; i < detailImageFiles.length; i++) {
            data['node[field_detailimages][und]'].push(detailImageFiles[i]);
        };

        services.NodeCreate(data, function(data) {
            console.log('成功创建卖：' + data.nid);
            $('#node-create-product-title').val('');
            $('#node-create-product-body').val('');
            $('#node-create-product-price').val('');
            $('#node-create-product-prodcount').val('');
            $('#node-create-product-linkphone').val('');
            $("#node-create-product-button").button().text('请选择规格(*)');
            $("#node-create-product-button").button().button('refresh');
            for (var index in producttaxonomy) {
                var v = producttaxonomy[index];
                if (v && v.vid) {
                    for (var index in nodes) {
                        var term = nodes[index].node;
                        if (term.vid == v.vid) {
                            var chk = document.getElementById(v.id + '-' + term.tid);
                            if (chk.checked) {
                                $( "#"+v.id + '-' + term.tid ).prop( "checked", false ).checkboxradio( "refresh" );
                            }
                        }
                    }
                }
            }
            imagefiles = [];
            detailImageFiles=[];
            var productFileDisplayArea = document.getElementById('productFileDisplayArea');
            productFileDisplayArea.innerHTML = '';
            var productDetailImageFileDisplayArea = document.getElementById('productDetailImageFileDisplayArea');
            productDetailImageFileDisplayArea.innerHTML = '';

            if (typeof cordova == 'undefined'){
                var control = $("#node-create-product-upload");
                control.wrap('<form>').closest('form').get(0).reset();
                control.unwrap();
                var control1 = $("#node-create-product-detailimage");
                control1.wrap('<form>').closest('form').get(0).reset();
                control1.unwrap();
            }
            $('body').pagecontainer('change', '#node-product?nid=' + data.nid);
        });
    }

    function uploadImageFiles(file, did, files, callback) {
        var imageType = /image.*/;
        if (file.type.match(imageType)) {
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                var img = new Image();
                img.src = e.target.result;
                var height = img.height;
                if (height > 100) {
                    height = 100;
                }
                var width = img.width;
                if (width > 100) {
                    if (img.height > 100) {
                        width = width * 100 / img.height;
                    }
                }
                var base64 = e.target.result.split("base64,")[1];
                //alert(e.target.result);
                services.FileUpload(base64, file.name, function(data) {
                    files.push({
                        'fid': data.fid
                    });
                    var fileDisplayArea = document.getElementById(did);
                    fileDisplayArea.innerHTML += '<image src="' + e.target.result + '" width="' + width + 'px" height="' + height + 'px"/>';

                    $('#' + did).trigger('create');
                    if (callback) {
                        callback(data);
                    }
                });
            };
            fileReader.readAsDataURL(file);
        } else {
            fileDisplayArea.innerHTML = "请选择图片文件";
        }
    }

    function sortWeight(a, b) {
        return a.node.vweight - b.node.vweight + a.node.tweight - b.node.tweight;
    }

    function loadTaxonomy(did, taxonomy) {
        services.List('app_content_taxonomy', '', function(result) {
            nodes = result.nodes;
            nodes.sort(sortWeight);
            var vdiv = document.getElementById(did);
            var html = '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">关闭</a>';
            for (var index in taxonomy) {
                var v = taxonomy[index];
                if (v && v.vid) {
                    html += '<fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">';
                    html += '<legend>' + v.vname + '</legend>';
                    for (var index in nodes) {
                        var term = nodes[index].node;
                        if (term.vid == v.vid) {
                            html += '<input type="' + v.type + '" name="' + v.field + '" id="' + v.id + '-' + term.tid + '" value="' + term.tid + '">' +         
                                '<label for="' + v.id + '-' + term.tid + '">' + term.tname + '</label>';
                        }
                    }
                    html += '</fieldset>';
                }
            }
            vdiv.innerHTML = html;
            $('#' + did).trigger('create');
            $('#' + did).popup();
        });
    }

    var producttaxonomy = [{
        'vid': 3,
        'vname': '产地',
        'field': 'field_placeorigin',
        'type': 'radio',
        'id': 'field_placeorigin'
    }, {
        'vid': 8,
        'vname': '单位',
        'field': 'field_unit',
        'type': 'radio',
        'id': 'field_unit_product'
    }, {
        'vid': 4,
        'vname': '品种',
        'field': 'field_breed',
        'type': 'radio',
        'id': 'field_breed'
    }, {
        'vid': 6,
        'vname': '直径',
        'field': 'field_diameter',
        'type': 'radio',
        'id': 'field_diameter'
    }, {
        'vid': 7,
        'vname': '等级',
        'field': 'field_level',
        'type': 'radio',
        'id': 'field_level'
    }, {
        'vid': 5,
        'vname': '类别',
        'field': 'field_class',
        'type': 'radio',
        'id': 'field_class'
    }];
    loadTaxonomy('node-create-product-taxonomy', producttaxonomy);
    var buydemandtaxonomy = [{
        'vid': 3,
        'vname': '产地',
        'field': 'field_multi_placeorigin',
        'type': 'checkbox',
        'id': 'field_multi_placeorigin'
    }, {
        'vid': 8,
        'vname': '单位',
        'field': 'field_unit',
        'type': 'radio',
        'id': 'field_unit_buydemand'
    }, {
        'vid': 4,
        'vname': '品种',
        'field': 'field_multi_breed',
        'type': 'checkbox',
        'id': 'field_multi_breed'
    }, {
        'vid': 6,
        'vname': '直径',
        'field': 'field_multi_diameter',
        'type': 'checkbox',
        'id': 'field_multi_diameter'
    }, {
        'vid': 7,
        'vname': '等级',
        'field': 'field_multi_level',
        'type': 'checkbox',
        'id': 'field_multi_level'
    }, {
        'vid': 5,
        'vname': '类别',
        'field': 'field_multi_class',
        'type': 'checkbox',
        'id': 'field_multi_class'
    }];
    loadTaxonomy('node-create-buydemand-taxonomy', buydemandtaxonomy);
    /**
     * 买
     */
    function nodeCreateBuydemand() {
        var nodeTitle = $('#node-create-buydemand-title').val(),
            nodeBody = $('#node-create-buydemand-body').val(),
            nodePrice = $('#node-create-buydemand-price').val(),
            nodeCount = $('#node-create-buydemand-prodcount').val(),
            nodePhone = $('#node-create-buydemand-linkphone').val(),
            data = {
                'node[type]': 'buydemand',
                'node[title]': nodeTitle,
                'node[body][und][0][value]': nodeBody,
                'node[field_demandstatus][und]': 37,
                'node[field_price][und][0][amount]': nodePrice,
                'node[field_prodcount][und][0][value]': nodeCount,
                'node[language]': 'und',
                'node[field_linkphone][und][0][value]': nodePhone,
            };
        for (var index in buydemandtaxonomy) {
            var v = buydemandtaxonomy[index];
            if (v && v.vid) {
                for (var index in nodes) {
                    var term = nodes[index].node;
                    if (term.vid == v.vid) {
                        var chk = document.getElementById(v.id + '-' + term.tid);
                        if (chk.checked) {
                            if (!data['node[' + v.field + '][und]']) {
                                data['node[' + v.field + '][und]'] = [];
                            }
                            data['node[' + v.field + '][und]'].push(term.tid);
                        }
                    }
                }
            }
        }
        data['node[field_images][und]'] = [];
        for (var i = 0; i < imagefiles.length; i++) {
            data['node[field_images][und]'].push(imagefiles[i]);
        };

        services.NodeCreate(data, function(data) {
            console.log('成功创建买：' + data.nid);
            $('#node-create-buydemand-title').val('');
            $('#node-create-buydemand-body').val('');
            $('#node-create-buydemand-price').val('');
            $('#node-create-buydemand-prodcount').val('');
            $('#node-create-buydemand-linkphone').val('');
            $("#node-create-buydemand-button").button().text('请选择规格(*)');
            $("#node-create-buydemand-button").button().button('refresh');
            for (var index in buydemandtaxonomy) {
                var v = buydemandtaxonomy[index];
                if (v && v.vid) {
                    for (var index in nodes) {
                        var term = nodes[index].node;
                        if (term.vid == v.vid) {
                            var chk = document.getElementById(v.id + '-' + term.tid);
                            if (chk.checked) {
                                $( "#"+v.id + '-' + term.tid ).prop( "checked", false ).checkboxradio( "refresh" );
                            }
                        }
                    }
                }
            }
            imagefiles = [];
            var buydemandFileDisplayArea = document.getElementById('buydemandFileDisplayArea');
            buydemandFileDisplayArea.innerHTML = '';
            if (typeof cordova == 'undefined'){
                var control = $("#node-create-buydemand-upload");
                control.wrap('<form>').closest('form').get(0).reset();
                control.unwrap();
            }
            $('body').pagecontainer('change', '#node?nid=' + data.nid);
        });
    }


    /**
     * 创建其他需求
     */
    function nodeCreateArticle() {
        var nodeTitle = $('#node-create-article-title').val(),
            nodeBody = $('#node-create-article-body').val(),
            nodePhone = $('#node-create-article-linkphone').val(),
            data = {
                'node[type]': 'article',
                'node[title]': nodeTitle,
                'node[body][und][0][value]': nodeBody,
                'node[field_demandstatus][und]': 37,
                'node[language]': 'und',
                'node[field_linkphone][und][0][value]': nodePhone,
            };
        services.NodeCreate(data, function(data) {
            console.log('成功创建其他需求：' + data.nid);
            $('#node-create-article-title').val('');
            $('#node-create-article-body').val('');
            $('#node-create-article-linkphone').val('');
            $('body').pagecontainer('change', '#node?nid=' + data.nid);
        });

    }

    /**
     * 创建用工信息
     */
    function nodeCreateEmployment() {
        //event.preventDefault();
        var nodeTitle = $('#node-create-employment-title').val(),
            nodeBody = $('#node-create-employment-body').val(),
            nodePhone = $('#node-create-employment-linkphone').val(),
            user = getStorageUser(),
            data = {
                'node[type]': 'employment',
                'node[title]': nodeTitle,
                'node[body][und][0][value]': nodeBody,
                'node[field_demandstatus][und]': 37,
                'node[language]': 'und',
                'node[uid]': user.uid,
                'node[field_linkphone][und][0][value]': nodePhone,
            };
        services.NodeCreate(data, function(data) {
            console.log('成功创建用工信息：' + data.nid);
            $('#node-create-employment-title').val('');
            $('#node-create-employment-body').val('');
            $('#node-create-employment-linkphone').val('');
            $('body').pagecontainer('change', '#node?nid=' + data.nid);
        });
    }

    /**
     * 创建物流信息
     */
    function nodeCreateLogistics() {
        var nodeTitle = $('#node-create-logistics-title').val(),
            nodeBody = $('#node-create-logistics-body').val(),
            nodePhone = $('#node-create-logistics-linkphone').val(),
            data = {
                'node[type]': 'logistics',
                'node[title]': nodeTitle,
                'node[body][und][0][value]': nodeBody,
                'node[field_demandstatus][und]': 37,
                'node[language]': 'und',
                'node[field_linkphone][und][0][value]': nodePhone,
            };
        services.NodeCreate(data, function(data) {
            console.log('成功创建物流信息：' + data.nid);
            $('#node-create-logistics-title').val('');
            $('#node-create-logistics-body').val('');
            $('#node-create-logistics-linkphone').val('');
            $('body').pagecontainer('change', '#node?nid=' + data.nid);
        });
    }

    /**
     * 编辑内容
     */

    function nodeEditSubmit(nodeTitle, nodeBody, nid) {
        services.NodeEdit(nodeTitle, nodeBody, nid, function(data) {
            console.log('更新成功！');
            $('body').pagecontainer('change', '#node');
        });
    }

    function nodeEdit(nid) {
        services.Node(nid, function(data) {
            $('#node-edit-title').val(data.title);
            $('#node-edit-body').val(data.body[default_code][0].value);
            console.log('正在编辑的内容是：' + data.title);
            $('#node-edit-submit').click(function() {
                var nodeTitle = $('#node-edit-title').val(),
                    nodeBody = $('#node-edit-body').val();
                nodeEditSubmit(nodeTitle, nodeBody, nid);
            });
        });
    }

    /**
     * 请求用户登录
     */
    function setStorageUser(data) {
        if (window.localStorage) {
            try {
                localStorage.setItem('token', data.token);
                localStorage.setItem('sessid', data.sessid);
                localStorage.setItem('session_name', data.session_name);
                var picture = '';
                if (data.user.picture) {
                    picture = data.user.picture.url;
                }
                var user = {
                    'uid': data.user.uid,
                    'name': data.user.name,
                    'field_nickname': data.user.field_nickname['und'][0]['safe_value'],
                    'picture': picture,
                    'created': data.user.created,
                };
                localStorage.setItem('user', JSON.stringify(user));
            } catch (error) {
                base.ErrorDialog('HTML5', '请关闭无痕浏览', error);
            }
        } else {
            base.ErrorDialog('HTML5', 'HTML5问题', '请使用支持HTML5机子!');
        }
    }

    function userLogin() {
        var loginData = {
            'username': $('#user-login-name').val(),
            'password': $('#user-login-password').val()
        };
        services.CurrentUser(function(data) {
            var uid = data.user.uid;
            if (uid === "0") {
                services.UserLogin(loginData, function(result) {
                    setStorageUser(result);
                    $('body').pagecontainer('change', '#user-profile');
                });
            } else {
                setStorageUser(data);
                $('body').pagecontainer('change', '#user-profile');
            }
        });
    }

    function userRegister() {
        if ($("#user-register-form").valid()) {
            var phone = $('#user-register-phone').val(),
                userPassword = $('#user-register-password').val(),
                confirm_code = $('#user-register-validatecode').val();

            if (confirm_code != mathrand) {
                base.ErrorDialog('注册', '验证码不正确', '');
                return false;
            }
            var data = {
                //'field_nickname[und][0][value]': userNickname,
                'sms_user[number]': phone,
                'name': phone,
                'pass': userPassword,
                'confirm_code': confirm_code,
            };
            services.UserRegister(data, function(data) {
                //setStorageUser(data);
                $('body').pagecontainer('change', '#user-login');
            }, function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseJSON['form_errors']['name']);
            });
        }
    }
    // 点击 登录 按钮时执行 userLogin()

    /**
     * 请求当前登录的用户相关信息
     */
    function getStorageUser() {
        var user = false;
        var tmp = localStorage.getItem("user")
            //if (localStorage.user) {
        if (tmp) {
            //user = JSON.parse(localStorage.user);
            user = JSON.parse(tmp);
        }
        return user;
    }

    function getCurrentUser() {
        var user = getStorageUser();
        if (user) {
            var list = document.getElementById('user-profile-detail');
            list.innerHTML = '';
            //userName = localStorage.user.name;
            //userCreated = new Date(localStorage.user.created * 1000);
            var imgUrl = 'img/portrait.jpg';
            if(user.picture){
                imgUrl = user.picture;
            }
            list.innerHTML += '<li data-icon="gear"><a href="#setting">' +
                '<image src="' + imgUrl + '" class="user-picture"/>' +
                '<h3>' + user.name + '</h3>' +
                '<p>' + user.field_nickname + '</p>' +
                '<p></p>' +
                '</a></li>';
            $('#user-profile-detail').listview('refresh');
        } else {
            // services.CurrentUser(function(data) {
            //     setStorageUser();
            //     var uid = data.user.uid,
            //         userName = null,
            //         userCreated = null,
            //         field_nickname = null,
            //         list = document.getElementById('user-profile-detail');
            //     if (uid === 0) {
            //         $('body').pagecontainer('change', '#user-login');
            //     } else {
            //         list.innerHTML = '';
            //         userName = data.user.name;
            //         userCreated = new Date(data.user.created * 1000);
            //         field_nickname=data.user.field_nickname['und'][0]['safe_value']
            //         list.innerHTML += '<li data-icon="gear"><a href="#address-list">' +
            //             '<image src="" class="user-picture"/>' +
            //             '<h3>' + userName + '</h3>' +
            //             '</a></li>';

            //         getFileUrl(data.user.picture, function(result) {
            //             $(".user-picture").attr("src", result.uri_full);
            //         });
            //         $('#user-profile-detail').listview('refresh');
            //         //localStorage.setItem('currentUser', uid);
            //     }
            // });
            $('body').pagecontainer('change', '#user-login');
        }
    }

    /**
     * 请求退出当前登录
     */

    function userLogout() {
        services.CurrentUser(function(data) {
            var uid = data.user.uid;
            if (uid === "0") {
                localStorage.clear();
                $('body').pagecontainer('change', '#user-login');
            } else {
                services.UserLogout(function(data) {
                    localStorage.clear();
                    $('body').pagecontainer('change', '#user-login');
                }, function(jqXHR, textStatus, errorThrown) {
                    localStorage.clear();
                    $('body').pagecontainer('change', '#user-login');
                });
            }
        });
    }


    /**
     *
     */
    function getFileUrl(fid, callback) {
        services.FileUrl(fid, function(data) {
            callback(data);
        });
    }


    /**
     * 载入用户收藏的商品
     */

    function loadBookmarkGoodList(uid) {
        services.List('app_bookmark_good', uid, function(data) {
            var i,
                nodes = data.nodes,
                list = document.getElementById('bookmark-good-list-info');
            list.innerHTML = '';
            for (i = 0; i < nodes.length; i += 1) {
                // var imgurl = base.default_img_path;
                // if (nodes[i].node.field_images.src) {
                //     imgurl = nodes[i].node.field_images.src;
                // }
                // if (nodes[i].node.field_product_images.src) {
                //     imgurl = nodes[i].node.field_product_images.src;
                // }

                // list.innerHTML +=
                //     '<li><a href="#node?nid=' +
                //     nodes[i].node.nid + '">' +
                //     '<image src="' + imgurl + '"/>' +
                //     '<h3>产品名称：' + nodes[i].node.title + '</h3>' +
                //     '<p><b>产品简介：</b>' + nodes[i].node.body + '</p>' +
                //     '</a></li>';
                switch (nodes[i].node.type) {
                    case 'buydemand':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_images.src) {
                            imgurl = nodes[i].node.field_images.src;
                        }
                        list.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.field_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '</a></li>';
                        break;
                    case 'product':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_product_images.src) {
                            imgurl = nodes[i].node.field_product_images.src;
                        }
                        list.innerHTML +=
                            '<li><a href="#node-product?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            //'<p class="ui-li-aside">' + nodes[i].node.commerce_price + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.commerce_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '</a></li>';
                        break;
                    default:
                        list.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            //'<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '</a></li>';
                        break;
                }
            }

            // 刷新列表视图
            $('#bookmark-good-list-info').listview('refresh');
        });
    }

    /**
     * 载入用户收藏的店铺
     */

    function loadBookmarkStoreList(uid) {
        services.List('app_bookmark_store', uid, function(data) {
            console.log(data);
            var i,
                nodes = data.nodes,
                list = document.getElementById('bookmark-store-list-info');
            list.innerHTML = '';
            for (i = 0; i < nodes.length; i += 1) {
                var imgurl = base.default_store_img_path;
                if (nodes[i].node.field_storelogo.src) {
                    imgurl = nodes[i].node.field_storelogo.src;
                }
                list.innerHTML +=
                    '<li><a href="#store-info?sid=' +
                    nodes[i].node.id + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<h3>' + nodes[i].node.title + '</h3>' +
                    '<p>' + nodes[i].node.field_introduction + '</p>'
                '</a></li>';
            }
            // 刷新列表视图
            $('#bookmark-store-list-info').listview('refresh');
        });
    }

    /**
     * 载入用户订单
     */

    function loadOrderList(uid) {
        services.List('app_user_orders', uid, function(data) {
            console.log(data);
            var i,
                nodes = data.nodes,
                list = document.getElementById('order-list-info');
            list.innerHTML = '';
            for (i = 0; i < nodes.length; i += 1) {
                list.innerHTML +=
                    '<li><a href="#order-info?oid=' +
                    nodes[i].node.order_id + '"">' +
                    '<h2>' + nodes[i].node.order_number + '</h2>' +         
                    '<p>' + nodes[i].node.type + '</p>' +
                    '<p>' + nodes[i].node.status + '</p>' +
                    '<p>' + nodes[i].node.created + '</p>' +
                    '<p class="ui-li-aside">' + nodes[i].node.commerce_order_total + '</p>';
                '</a></li>';
            }
            // 刷新列表视图
            $('#order-list-info').listview('refresh');
        });
    }

    function loadOrderInfo(orderid) {
        services.List('drupalgap/order', orderid, function(order) {
            var list = document.getElementById('order-info-content');
            var html = '';

            if (order.commerce_line_items_entities) {
                html += '<ul id="order-good-list" data-role="listview" data-icon="false">';
                //total.innerHTML += order.commerce_order_total_formatted;
                $.each(order.commerce_line_items_entities, function(line_item_id, line_item) {
                    html += '<li><h2>' + line_item.line_item_title + '</h2>' +
                        '<p><strong>单价</strong>:' + line_item.commerce_unit_price_formatted + '</p>' +
                        '<p><strong>数量:</strong>: ' + line_item.quantity + '</p>' +
                        '<p class="ui-li-aside"><strong>合计:</strong>: ' + line_item.commerce_total_formatted + '</p></li>';
                });
                html += '</ul>';
                html += '<h3 class="ui-bar ui-bar-a ui-corner-all">总计:' + order.commerce_order_total_formatted + '</h3>';
                list.innerHTML = html;
            } else {
                list.innerHTML = '<div class="c-msg"><section class="c-msg-img warn"></section>' +
                    '<section class="c-msg-info">' +
                    '<p>购物车快饿瘪了T.T</p>' +
                    '<p class="opt">主人快给我挑点宝贝吧</p>' +
                    '<a href="#front" data-role="button">去逛逛</a></section></div>';
            }
            $('#order-info-content').trigger('create');
            return false;
            //});
            //}
            // 刷新列表视图
            //$('#user-profile-cart-list').listview('refresh');

        });
    }

    /**
     * 载入用户配置
     */
    // var user_picture_file = document.getElementById('user-picture-file');
    // user_picture_file.addEventListener('change', function(e) {
    //     var file = user_picture_file.files[0];
    //     var fileDisplayArea = document.getElementById('user-picture');
    //     uploadImageFiles(file, fileDisplayArea,[],function(data){
    //         var user = getStorageUser();
    //         services.UserUpdate(user.uid,{'picture':data.fid},function(){});
    //     });
    // });
    function userUpdate(){
        var user = getStorageUser();
        //
        var data ={
            'field_nickname[und][0][value]':$('#user-setting-nickname').val(),
            'mail':$('#user-setting-email').val(),
            //{'picture':data.fid}
            'current_pass':$('#user-setting-password').val(),
            'pass':$('#user-setting-newpassword').val(),
        };
        services.UserUpdate(user.uid,data,function(result){
            var user = getStorageUser();
            user['field_nickname']=$('#user-setting-nickname').val();
            localStorage.setItem('user', JSON.stringify(user));
            base.ErrorDialog('设置','修改完成','');
        });
    }

    function userUpdatePassword(uid){
        var data ={
            //'name':$('#user-newpassword-phone').val(),
            'pass':$('#user-newpassword-password').val(),
            'code':$('#user-newpassword-validatecode').val()
        };
        services.newpasswordreset(uid,data,function(result){
            if(result && result[0]){
                //base.ErrorDialog('修改密码','修改完成','');
                $("#user-newpassword-submit").button().button("disable");
                $("#user-newpassword-submit").button().button('refresh');
                $('#user-newpassword-uid').val('');
                $('#user-newpassword-password').val('');
                $('#user-newpassword-validatepassword').val('');
                $('#user-newpassword-validatecode').val('');
                $('body').pagecontainer('change', '#user-login');
            }else{
                base.ErrorDialog('修改密码','验证码错误','');
            }
        });
    }

    function loadSetting(uid) {
        services.List('app_user_address', uid, function(data) {
            console.log(data);
            var i,
                nodes = data.nodes,
                list = document.getElementById('address-list-info');
            list.innerHTML = '';
            for (i = 0; i < nodes.length; i += 1) {
                // var status = '<image src="jqm/images/icons-png/check-black.png"/>';
                // if(nodes[i].node.status == "否"){
                //    status = '<image src="jqm/images/icons-png/delete-black.png"/>';
                // }
                var defaultStr = "";
                if (nodes[i].node.profile_id == nodes[i].node.addressbook_profile_id) {
                    defaultStr = "[默认]";
                }
                list.innerHTML +=
                    '<li><a href="#address-edit?aid=' +
                    nodes[i].node.profile_id + '"">' +
                    '<h2>' + nodes[i].node.commerce_customer_address_name_line + '</h2>' +         
                    '<p>' + defaultStr +
                    nodes[i].node.commerce_customer_address_administrative_area +
                    nodes[i].node.commerce_customer_address_locality +
                    nodes[i].node.commerce_customer_address_dependent_locality +
                    nodes[i].node.commerce_customer_address_thoroughfare + '</p>' +
                    //'<p>' +nodes[i].node.commerce_customer_address_postal_code + '</p>' +
                    //status+
                    '<p class="ui-li-aside">' + nodes[i].node.commerce_customer_address_linkphone + '</p>';
                '</a></li>';
            }
            // 刷新列表视图
            $('#address-list-info').listview('refresh');
        });
        services.User(uid,function(data){
            $('#user-setting-nickname').val(data['field_nickname']['und'][0]['safe_value']);
            $('#user-setting-email').val(data['mail']);
        });
        // var user = getStorageUser();
        // var picture = false;
        // if(user.picture){
        //     picture = user.picture;
        // }
        // var user_picture = document.getElementById('user-picture');
        // if(picture){
        //     user_picture.innerHTML = '<image src="' + picture + '"/>';
        // }
    }

    function editAddress(aid) {
        services.List('app_address_info', aid, function(result) {
            var data = result.nodes[0].node;
            $.each(china_province, function(index, item) {
                var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                if (item.region_type == '1') {
                    $('#commerce_customer_address_administrative_area').append(option);
                }
                if (item.region_type == '2' && item.parent_id == data.commerce_customer_address_administrative_area) {
                    $('#commerce_customer_address_locality').append(option);
                }
                if (item.region_type == '3' && item.parent_id == data.commerce_customer_address_locality) {
                    $('#commerce_customer_address_dependent_locality').append(option);
                }
            });

            $('#commerce_customer_address_profile_id').val(data.profile_id);
            $('#commerce_customer_address_administrative_area').val(data.commerce_customer_address_administrative_area);
            $('#commerce_customer_address_locality').val(data.commerce_customer_address_locality);
            $('#commerce_customer_address_dependent_locality').val(data.commerce_customer_address_dependent_locality);

            $('#commerce_customer_address_administrative_area').selectmenu('refresh', true);
            $('#commerce_customer_address_locality').selectmenu('refresh', true);
            $('#commerce_customer_address_dependent_locality').selectmenu('refresh', true);

            $('#commerce_customer_address_thoroughfare').val(data.commerce_customer_address_thoroughfare);
            $('#commerce_customer_address_name_line').val(data.commerce_customer_address_name_line);
            $('#commerce_customer_address_linkphone').val(data.commerce_customer_address_linkphone);
            $('#commerce_customer_address_postal_code').val(data.commerce_customer_address_postal_code);
        });
    }
    /**
     * 载入购物车
     */
    my.lineItemDelete = function(lineitemid) {
        services.LineItemDelete(lineitemid, function(data) {
            loadCart();
        })
    };

    my.lineItemUpdate = function(lineitemid) {
        var quantity = $('#commerce_cart_line_item_quantity_' + lineitemid).val();
        services.LineItemUpdate(lineitemid, quantity, function(data) {
            loadCart();
        })
    };
    my.checkout = function(orderid) {
        services.Checkout(orderid, function() {
            $('body').pagecontainer('change', '#order-list');
        });
    }

    function loadCart() {
        services.Cart(function(data) {
            var list = document.getElementById('cart-list');
            //list.innerHTML = '';
            var empty = '<div class="c-msg"><section class="c-msg-img warn"></section>' +
                '<section class="c-msg-info">' +
                '<p>购物车快饿瘪了T.T</p>' +
                '<p class="opt">主人快给我挑点宝贝吧</p>' +
                '<a href="#front" data-role="button">去逛逛</a></section></div>';
            if (data.length != 0) {
                $.each(data, function(order_id, order) {

                    if (order.commerce_line_items_entities) {
                        var html = '';
                        html += '<ul id="cart-good-list" data-role="listview" data-icon="false">';
                        //total.innerHTML += order.commerce_order_total_formatted;
                        $.each(order.commerce_line_items_entities, function(line_item_id, line_item) {
                            html +=
                                '<li>' +
                                '<h2>' + line_item.line_item_title + '</h2>' +
                                '<p><strong>单价</strong>:' + line_item.commerce_unit_price_formatted + '</p>' +
                                '<p class="ui-li-aside"><strong>合计:</strong>: ' + line_item.commerce_total_formatted +
                                '<a onclick="index.lineItemUpdate(' + line_item_id + ')" class="ui-link" href="#">更新</a></p>' +
                                '<label for="commerce_cart_line_item_quantity_' + line_item_id +
                                '">数量</label>' +
                                '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">' +
                                '<input type="number" id="commerce_cart_line_item_quantity_' + line_item_id +
                                '" value="' + line_item.quantity +
                                '" min="1" step="1"></div>' +
                                '<p><a onclick="index.lineItemDelete(' + line_item_id + ')" class="ui-link" href="#">删除</a></p>' +
                                '</li>';
                        });
                        html += '</ul>';
                        html += '<h3 class="ui-bar ui-bar-a ui-corner-all">总计:' + order.commerce_order_total_formatted + '</h3>';
                        html += '<a id="" href="#" onclick="index.checkout(' + order_id + ');" data-role="button">结帐</a>';
                        list.innerHTML = html;
                        // var address_edit_submit = document.getElementById('address-edit-submit');
                        // address_edit_submit.addEventListener('click', function(e) {

                    } else {
                        list.innerHTML = empty;
                    }
                    //$('#cart-list').trigger('create');
                    return false;
                });
            } else {
                // 刷新列表视图
                list.innerHTML = empty;
            }
            $('#cart-list').trigger('create');
            //$('#user-profile-cart-list').listview('refresh');

        });
    }

    /**
     * 显示内容
     */
    function addToCart(productid) {
        if(isNodeClose()){
            base.ErrorDialog('','需求已关闭，不能交易','');
            return false;
        }
        services.Cart(function(data) {
            if (data.length == 0) {
                services.CartCreate(function(order) {
                    services.LineItemCreate(order.order_id, productid, function(result) {
                        $('body').pagecontainer('change', '#cart');
                    });
                });
            } else {
                var exists = false;
                $.each(data, function(order_id, order) {
                    if (order.commerce_line_items_entities) {
                        $.each(order.commerce_line_items_entities, function(line_item_id, line_item) {
                            if (line_item.commerce_product && line_item.commerce_product == productid) {
                                var quantity = parseFloat(line_item.quantity) + 1;
                                exists = true;
                                services.LineItemUpdate(line_item_id, quantity, function(result) {
                                    $('body').pagecontainer('change', '#cart');
                                });
                            }
                        });
                    }
                    if (!exists) {
                        services.LineItemCreate(order_id, productid, function(result) {
                            $('body').pagecontainer('change', '#cart');
                        });
                    }
                    return false;
                });
            }
        });
    }

    var BindEvent = function(dom, event, handle, ex) {
        if ('addEventListener' in document) {
            BindEvent = function(dom, event, handle, ex) {
                dom.addEventListener(event, handle, ex || false);
            }
        } else if ('attachEvent' in document) {
            BindEvent = function(dom, event, handle) {
                dom.attachEvent('on' + event, handle);
            }
        } else {
            BindEvent = function(dom, event, handle) {
                dom['on' + event] = handle;
            }
        }
        BindEvent(dom, event, handle, ex);
    };

    function updateFlagCss(data, bid) {
        if (data[0]) {
            $("#" + bid).removeClass("ui-icon-bookmark");
            $("#" + bid).addClass("ui-icon-bookmarked");
        } else {
            $("#" + bid).removeClass("ui-icon-bookmarked");
            $("#" + bid).addClass("ui-icon-bookmark");
        }
    }

    function isflag(nid, bid) {
        var user = getStorageUser();
        if(user){
            var data = {
                'flag_name': 'bookmarks',
                'entity_id': nid,
                'uid': user.uid,
            };
            services.isflag(data, function(result) {
                updateFlagCss(result, bid);
            });
        }else{
            updateFlagCss([false], bid);
        }
    }

    function flag(nid, bid) {
        //nid = 453;
        if(isNodeClose()){
            base.ErrorDialog('','需求已关闭，不能收藏','');
            return false;
        }
        var user = getStorageUser();
        if(user){
            var data = {
                'flag_name': 'bookmarks',
                'entity_id': nid,
                'action': 'flag',
                'uid': user.uid,
                'skip_permission_check': true
            };
            services.flag(data, function(result) {
                updateFlagCss(result, bid);
            });
        }else{
            updateFlagCss([false], bid);
            base.ErrorDialog('','请登录','');
        }
    }

    function displayNode(nid, listid, contentid, slideshowid) {
        services.List('app_demand_detail', nid, function(data) {
            if (data.nodes.length > 0) {
                $.each(data.nodes, function(index, object) {
                    var node = object.node,
                        list = document.getElementById(listid),
                        content = document.getElementById(contentid);
                    var images = node.field_images;
                    if (node.field_newsimages) {
                        images = node.field_newsimages;
                    }
                    if (!$.isArray(images)) {
                        images = [images];
                    }
                    var listhtml = '';
                    for (var i = 0; i < images.length; i += 1) {
                        if (images[i].src) {
                            listhtml += '<div class="swiper-slide">' +
                                '<image src="' + images[i].src + '"/></div>';
                        }
                    }
                    list.innerHTML = listhtml;
                    var html = '<input type="hidden" id="node-flag-id" value="' + node.nid + '"/>';
                    html+='<input type="hidden" id="node-user-id" value="' + node.uid + '"/>';
                    html+='<input type="hidden" id="node-id" value="' + node.nid + '"/>';
                    html+='<input type="hidden" id="node-user-name" value="' + node.name + '"/>';
                    html+='<input type="hidden" id="node-created" value="' + node.created + '"/>';
                    html+='<input type="hidden" id="node-field-demandstatus" value="' + node.field_demandstatus + '"/>';
                    var user = getStorageUser();
                    var html2='';
                    if(user && user.uid === node.uid){
                        //显示关闭与撤销
                        html2 +='<div data-role="controlgroup" data-type="horizontal">';
                        //var created = new Date(node.created);
                        var curDate=new Date();
                        var s = node.created;
                        var created = new Date(Date.parse(s.replace(/-/g, "/")));
                        var result = Math.round(curDate-created)/(1000*60);
                        if(result<30){
                            html2 +='<button class="ui-btn ui-corner-all ui-btn-a" id="node-cancel" onclick="index.nodeCancel();">撤销</button>' ;
                        }
                        if(node.field_demandstatus=='进行中'){
                            html2 +='<button class="ui-btn ui-corner-all ui-btn-a" id="node-close" onclick="index.nodeClose();">关闭</button>' ;
                        }
                        html2 +='</div>';
                    }
                    content.innerHTML = '';
                    switch (node.type) {
                        case 'buydemand':
                            html += '<h3>' + node.title + '</h3>';
                            html += '<p><strong>联系电话</strong>:' + node.field_linkphone + '</p>';
                            html += '<p>' + node.body + '</p>';
                            html += '<p><strong>数量</strong>:' + node.field_prodcount + '(' + node.field_unit + ')</p>';
                            html += '<p><strong>单价</strong>:' + node.field_price + '</p>';
                            html += '<p><strong>直径</strong>:' + node.field_multi_diameter + '</p>';
                            html += '<p><strong>等级</strong>:' + node.field_multi_level + '</p>';
                            html += '<p><strong>产地</strong>:' + node.field_multi_placeorigin + '</p>';
                            html += '<p><strong>品种</strong>:' + node.field_multi_breed + '</p>';
                            html += '<p><strong>类别</strong>:' + node.field_multi_class + '</p>';
                            html += html2;
                            content.innerHTML = html;
                            isflag(node.nid, 'node-flag');
                            var swiper = new Swiper('#' + slideshowid, {
                                pagination: '.swiper-pagination',
                                paginationClickable: true,
                                spaceBetween: 0,
                                loop: true,
                                autoplay: 2500,
                                autoplayDisableOnInteraction: true,
                                preloadImages: false,
                                lazyLoading: true,
                            });
                            break;
                        case 'product':
                            html += '<input type="hidden" id="node-product-flag-id" value="' + node.nid + '"/>';
                            //html+='<input type="hidden" id="node-user-id" value="' + node.uid + '"/>';
                            //html+='<input type="hidden" id="node-user-name" value="' + node.name + '"/>';
                            //html+='<input type="hidden" id="node-id" value="' + node.nid + '"/>';
                            html += '<div data-role="tabs">' +     
                                '<div data-role="navbar">' +
                                '<ul><li><a href="#product-one" class="ui-btn-active" data-ajax="false">基本</a></li>' +     '<li><a href="#product-two" data-ajax="false">详情</a></li></ul></div>' +
                                '<div id="product-one"></div><div id="product-two"></div></div>';
                            $('#' + contentid).html(html).trigger('create');
                            services.List('app_product_detail', node.field_product, function(productdata) {
                                $.each(productdata.nodes, function(index, productobject) {
                                    var product = productobject.node;
                                    var onehtml = '<input id="cartproductid" type="hidden" value="' + product.product_id + '"/>';
                                    onehtml += '<h3>' + node.title + '</h3>';
                                    onehtml += '<p><strong>联系电话</strong>:' + node.field_linkphone + '</p>';
                                    onehtml += '<p>' + node.body + '</p>';
                                    onehtml += '<p><strong>单价</strong>:' + product.commerce_price + '(' + node.field_unit + ')</p>';
                                    onehtml += '<p><strong>直径</strong>:' + product.field_diameter + '</p>';
                                    onehtml += '<p><strong>等级</strong>:' + product.field_level + '</p>';
                                    onehtml += '<p><strong>产地</strong>:' + node.field_placeorigin + '</p>';
                                    onehtml += '<p><strong>品种</strong>:' + node.field_breed + '</p>';
                                    onehtml += '<p><strong>类别</strong>:' + node.field_class + '</p>';
                                    onehtml += html2;
                                    $('#product-one').append(onehtml).trigger('create');
                                    //var productone = document.getElementById('product-one');
                                    //productone.innerHTML = onehtml;
                                    //html.replace('{productone}',onehtml);
                                    var images = product.field_images;
                                    if (!$.isArray(images)) {
                                        images = [images];
                                    }
                                    var listhtml = '';
                                    for (var i = 0; i < images.length; i += 1) {
                                        if (images[i].src) {
                                            listhtml += '<div class="swiper-slide">' +
                                                '<image src="' + images[i].src + '"/></div>';
                                        }
                                    }
                                    list.innerHTML = listhtml;
                                    var swiper = new Swiper('#' + slideshowid, {
                                        pagination: '.swiper-pagination',
                                        paginationClickable: true,
                                        spaceBetween: 0,
                                        loop: true,
                                        autoplay: 2500,
                                        autoplayDisableOnInteraction: true,
                                        preloadImages: false,
                                        lazyLoading: true,
                                    });
                                });
                            });
                            var twohtml = ''
                            var detailimages = node.field_detailimages;
                            if (!$.isArray(detailimages)) {
                                detailimages = [detailimages];
                            }
                            for (var i = 0; i < detailimages.length; i += 1) {
                                if (detailimages[i].src) {
                                    twohtml += '<image src="' + detailimages[i].src + '" width="100%" height="100%"/>';
                                }
                            }

                            $('#product-two').html(twohtml);
                            //var producttwo = document.getElementById('product-two');
                            //producttwo.innerHTML = twohtml;

                            if (node.cmp_store) {
                                services.List('app_store_detail', node.cmp_store, function(storedata) {
                                    $.each(storedata.nodes, function(index, storeobject) {
                                        var store = storeobject.node;
                                        var storehtml = '<ul data-role="listview" data-icon="false" data-inset="true">' +
                                            '<li><a href="#store-info?sid=' +
                                            store.id + '">' +
                                            '<image src="' + store.field_storelogo.src + '"/>' +
                                            '<h3>' + store.title + '</h3>' +
                                            '<p>' + store.field_introduction + '</p>'
                                        '</a></li></ul>';
                                        $('#product-one').append(storehtml).trigger('create');
                                    });
                                });
                            }
                            // var footerhtml = '<div data-role="navbar"><ul>'+
                            //     '<li><a href="#" data-icon="star" class="">收藏</a></li>'+
                            //     '<li><a href="#" data-icon="front" class="">加入购物车</a></li>'+
                            //     '</ul></div>';
                            // $('#node-buy').html(footerhtml).trigger('create');
                            isflag(node.nid, 'node-product-flag');
                            break;
                        case 'article':
                        case 'employment':
                        case 'logistics':
                        case 'association':
                             html += '<h3>' + node.title + '</h3>';
                            html += '<p><strong>联系电话</strong>:' + node.field_linkphone + '</p>';
                            html += '<p>' + node.body + '</p>';
                            html += html2;
                            content.innerHTML = html;
                            isflag(node.nid, 'node-flag');
                            var swiper = new Swiper('#' + slideshowid, {
                                pagination: '.swiper-pagination',
                                paginationClickable: true,
                                spaceBetween: 0,
                                loop: true,
                                autoplay: 2500,
                                autoplayDisableOnInteraction: true,
                                preloadImages: false,
                                lazyLoading: true,
                            });
                            break;
                        case 'news':
                            html += '<h3>' + node.title + '</h3>';
                            // html += '<p><strong>联系电话</strong>:' + node.field_linkphone + '</p>';
                            html += '<p>' + node.body + '</p>';
                            html += html2;
                            content.innerHTML = html;
                            isflag(node.nid, 'node-flag');
                            var swiper = new Swiper('#' + slideshowid, {
                                pagination: '.swiper-pagination',
                                paginationClickable: true,
                                spaceBetween: 0,
                                loop: true,
                                autoplay: 2500,
                                autoplayDisableOnInteraction: true,
                                preloadImages: false,
                                lazyLoading: true,
                            });
                            break;
                    }
                });
            }
        });
    }

    function displayMessage(threadid) {
        services.Message(threadid,function(data) {
            var list = document.getElementById('messagebody-list');
            var html =
                    '<li>' +
                    '<h3>' + data.subject + '</h3>' +
                    '<input type="hidden" id="messagebody-list-thread-id" value="'+data.thread_id+'"/>'+
                    '</li>';
            for (var i = 0; i < data.messages.length; i++) {
                var msg = data.messages[i];
                var imgurl = "img/portrait.jpg";
                if(msg.author.picture){
                    imgurl = msg.picture;
                }
                html +=
                    '<li>' +
                    '<image src="' + imgurl + '"/>' +
                    '<h3>' + msg.field_nickname + '</h3>' +
                    '<p>' + msg.body + '</p>' +
                    '<p>'+msg.created+'</p>'+
                    '</li>';
            };

            list.innerHTML = html;
            $('#messagebody-list').listview('refresh');
        });
    }
    function isNodeClose(){
        var demandstatus = $('#node-field-demandstatus').val();
        if(demandstatus==='关闭'){
            return true;
        }
        return false;
    }
    function postMessage(){
        var msgbody = $('#popupmessage-body').val().trim();
        var thread_id = $('#messagebody-list-thread-id').val();
        if(msgbody){
            var data={
                'body':msgbody,
                'thread_id':thread_id
            };
            services.PostMessage(data,function(result){
                if(result && result[0]){
                    $('#popupmessage').popup().popup('close');
                    $('#popupmessage-body').val('');
                    displayMessage(thread_id);
                }
            });
        }
    }

    function postProductMessage(){
        if(isNodeClose()){
            base.ErrorDialog('','需求已关闭，不能发消息','');
            return false;
        }
        var user = getStorageUser();
        if(user){
            var msgbody = $('#popupproductmessage-body').val().trim();
            var msgsubject = $('#popupproductmessage-subject').val().trim();
            var recipients = $('#node-user-name').val();
            if(msgbody){
                var data={
                    'subject':msgsubject,
                    'body':msgbody,
                    'recipients':recipients
                };
                services.PostMessage(data,function(result){
                    if(result && result.thread_id){
                        $('#popupproductmessage').popup().popup('close');
                        $('#popupproductmessage-body').val('');
                        $('#popupproductmessage-subject').val('');
                    }
                });
            }
        }else{
            base.ErrorDialog('','请登录','');
        }
    }

    function postNodeMessage(){
        if(isNodeClose()){
            base.ErrorDialog('','需求已关闭，不能发消息','');
            return false;
        }
        var user = getStorageUser();
        if(user){
            var msgbody = $('#popupnodemessage-body').val().trim();
            var msgsubject = $('#popupnodemessage-subject').val().trim();
            var recipients = $('#node-user-name').val();
            if(msgbody){
                var data={
                    'subject':msgsubject,
                    'body':msgbody,
                    'recipients':recipients
                };
                services.PostMessage(data,function(result){
                    if(result && result.thread_id){
                        $('#popupnodemessage').popup().popup('close');
                        $('#popupnodemessage-body').val('');
                        $('#popupnodemessage-subject').val('');
                    }
                });
            }
        }else{
            base.ErrorDialog('','请登录','');
        }
    }

    /**
     * 载入推荐商家列表
     */

    function loadRecommendStoreList() {
        services.List('app_store_info', '', function(data) {
            var i,
                nodes = data.nodes,
                recommendStoreList = document.getElementById('recommend-store-list');
            $('#recommend-store-list').html('');
            for (i = 0; i < nodes.length; i += 1) {
                var imgurl = base.default_store_img_path;
                if (nodes[i].node.field_storelogo.src) {
                    imgurl = nodes[i].node.field_storelogo.src;
                }
                var vote = 0;
                if (nodes[i].node.vote) {
                    vote = parseInt(nodes[i].node.vote) / 20;
                }
                recommendStoreList.innerHTML +=
                    '<li><a href="#store-info?sid=' +
                    nodes[i].node.id + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<p><strong>' + nodes[i].node.title +
                    '</strong></p>' +
                    '<div class="rateit" data-rateit-min="0" data-rateit-max="5" data-rateit-value="' + vote + '" data-rateit-ispreset="true" data-rateit-readonly="true"></div>' +
                    '<p>' + nodes[i].node.field_introduction + '</p>' +
                    '<p style="float: right;"><image src="img/4-3.png"/></p>' +
                    '</a>' +
                    '</li>';

            }
            // 刷新列表视图
            $('#recommend-store-list').listview('refresh');
            $('.rateit').rateit();
        });
    }

    /**
     * 载入推荐内容列表
     */

    function loadRecommendList() {
        services.List('app_content_recommend', '', function(data) {
            var i,
                nodes = data.nodes,
                list = document.getElementById('recommend-list');
            $('#recommend-list').html('');
            for (i = 0; i < nodes.length; i += 1) {
                var imgurl = base.default_img_path;
                if (nodes[i].node.field_images.src) {
                    imgurl = nodes[i].node.field_images.src;
                }
                // articleList.innerHTML +=
                //     '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //     '<image src="' + imgurl + '"/>' +
                //     '<p><strong>' + nodes[i].node.title + '</strong></p>' +
                //     '<p>' + nodes[i].node.body + '</p>' +
                //     '<p style="float: right;"><image src="img/4-4.png"/></p>' +
                //     '</a></li>';
                switch (nodes[i].node.type) {
                    case 'buydemand':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_images.src) {
                            imgurl = nodes[i].node.field_images.src;
                        }
                        list.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.field_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '<p style="float: right;"><image src="img/4-4.png"/></p>' +
                            '</a></li>';
                        break;
                    case 'product':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_product_images.src) {
                            imgurl = nodes[i].node.field_product_images.src;
                        }
                        list.innerHTML +=
                            '<li><a href="#node-product?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            //'<p class="ui-li-aside">' + nodes[i].node.commerce_price + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.commerce_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '<p style="float: right;"><image src="img/4-4.png"/></p>' +
                            '</a></li>';
                        break;
                    default:
                        list.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            //'<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '<p style="float: right;"><image src="img/4-4.png"/></p>' +
                            '</a></li>';
                        break;
                }
            }

            // 刷新列表视图
            $('#recommend-list').listview('refresh');
        });
    }

    /**
     * 载入内容列表
     */

    my.loadNodeList = function(page) {
        var nodeListInfo = document.getElementById('node-list-info');
        if (page === 0) {
            nodeListInfo.innerHTML = '';
            localStorage.setItem('nodepage', 0);
        } else {
            var page = localStorage.getItem('nodepage');
            page = parseInt(page) + 1;
            localStorage.setItem('nodepage', page);
        }
        services.List('app_content_list?page=' + page, '', function(data) {
            console.log(data);
            var i,
                nodes = data.nodes,
                nodeListInfo = document.getElementById('node-list-info');
            for (i = 0; i < nodes.length; i += 1) {
                var imgurl = base.default_img_path;
                if (nodes[i].node.field_images.src) {
                    imgurl = nodes[i].node.field_images.src;
                }
                // nodeListInfo.innerHTML +=
                //     '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //     '<image src="' + imgurl + '"/>' +
                //     '<h3>' + nodes[i].node.title + '</h3>' +
                //     '<p>' + nodes[i].node.body + '</p>' +
                //     '</a></li>';
                switch (nodes[i].node.type) {
                    case 'buydemand':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_images.src) {
                            imgurl = nodes[i].node.field_images.src;
                        }
                        nodeListInfo.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.field_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '</a></li>';
                        break;
                    case 'product':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_product_images.src) {
                            imgurl = nodes[i].node.field_product_images.src;
                        }
                        nodeListInfo.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            //'<p class="ui-li-aside">' + nodes[i].node.commerce_price + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.commerce_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '</a></li>';
                        break;
                    default:
                        nodeListInfo.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            //'<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '</a></li>';
                        break;
                }
            }

            // 刷新列表视图
            $('#node-list-info').listview('refresh');
        });
    }
    my.myinfo = function(page) {
        var nodeListInfo = document.getElementById('myinfo-list');
        if (page === 0) {
            nodeListInfo.innerHTML = '';
            localStorage.setItem('myinfopage', 0);
        } else {
            var page = localStorage.getItem('myinfopage');
            page = parseInt(page) + 1;
            localStorage.setItem('myinfopage', page);
        }
        var user = getStorageUser();
        services.List('app_content_myinfo/' + user.uid + '?page=' + page, '', function(data) {
            console.log(data);
            var i,
                nodes = data.nodes,
                nodeListInfo = document.getElementById('myinfo-list');
            for (i = 0; i < nodes.length; i += 1) {
                switch (nodes[i].node.type) {
                    case 'buydemand':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_images.src) {
                            imgurl = nodes[i].node.field_images.src;
                        }
                        nodeListInfo.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.field_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '</a></li>';
                        break;
                    case 'product':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_product_images.src) {
                            imgurl = nodes[i].node.field_product_images.src;
                        }
                        nodeListInfo.innerHTML +=
                            '<li><a href="#node-product?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            //'<p class="ui-li-aside">' + nodes[i].node.commerce_price + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.commerce_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '</a></li>';
                        break;
                    default:
                        nodeListInfo.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            //'<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '</a></li>';
                        break;
                }

            }

            // 刷新列表视图
            $('#myinfo-list').listview('refresh');
        });
    }
    my.loadMessageList = function(page) {
        var nodeListInfo = document.getElementById('message-list-info');

        if (page === 0) {
            nodeListInfo.innerHTML = '';
            localStorage.setItem('messagepage', 0);
        } else {
            var page = localStorage.getItem('messagepage');
            page = parseInt(page) + 1;
            localStorage.setItem('messagepage', page);
        }

        services.Message('', function(data) {
            for (var i = 0; i < data.length; i++) {
                var msg = data[i];
                var imgurl = "img/portrait.jpg";
                if(msg.author.picture){
                    imgurl = msg.author.picture;
                }
                //var created = new Date(data.timestamp);
                nodeListInfo.innerHTML +=
                    '<li><a href="#message?threadid=' + msg.thread_id + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<h3>' + msg.author.field_nickname + '</h3>' +
                    '<p>' + msg.subject + '</p>' +
                    '<p class="ui-li-aside">'+msg.created+'('+msg.count+')</p>'+
                    '</a></li>';
            };

            $('#message-list-info').listview('refresh');
        });
    }

    my.loadNodeNewsList = function(page) {
            var nodeListInfo = document.getElementById('node-news-list-info');

            if (page === 0) {
                nodeListInfo.innerHTML = '';
                localStorage.setItem('nodenewspage', 0);
            } else {
                var page = localStorage.getItem('nodenewspage');
                page = parseInt(page) + 1;
                localStorage.setItem('nodenewspage', page);
            }

            services.List('app_content_news?page=' + page, '', function(data) {
                console.log(data);
                var i,
                    nodes = data.nodes;
                //nodeListInfo = document.getElementById('node-news-list-info');
                for (i = 0; i < nodes.length; i += 1) {
                    // var imgurl = base.default_img_path;
                    // if (nodes[i].node.field_images.src) {
                    //     imgurl = nodes[i].node.field_images.src;
                    // }
                    nodeListInfo.innerHTML +=
                        '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                        //'<image src="' + imgurl + '"/>' +
                        '<h3>' + nodes[i].node.title + '</h3>' +
                        '<p>' + nodes[i].node.body + '</p>' +
                        '</a></li>';
                }

                // 刷新列表视图
                $('#node-news-list-info').listview('refresh');
            });
        }
        /**
         * 载入用工信息列表
         */

    my.loadNodeEmploymentList = function(page) {
        var nodeListInfo = document.getElementById('node-employment-list-info');
        if (page === 0) {
            nodeListInfo.innerHTML = '';
            localStorage.setItem('employmentpage', 0);
        } else {
            var page = localStorage.getItem('employmentpage');
            page = parseInt(page) + 1;
            localStorage.setItem('employmentpage', page);
        }
        services.List('app_content_employment?page=' + page, '', function(data) {
            var i,
                nodes = data.nodes,
                nodeListInfo = document.getElementById('node-employment-list-info');
            for (i = 0; i < nodes.length; i += 1) {
                var imgurl = base.default_img_path;
                if (nodes[i].node.field_images.src) {
                    imgurl = nodes[i].node.field_images.src;
                }
                nodeListInfo.innerHTML +=
                    '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<p><strong>需求</strong>:' + nodes[i].node.title + '</p>' +
                    '<p>' + nodes[i].node.body + '</p>' +
                    '</a></li>';
            }

            // 刷新列表视图
            $('#node-employment-list-info').listview('refresh');
        });
    }

    /**
     * 载入物流信息列表
     */
    my.loadNodeLogisticsList = function(page) {
        var nodeListInfo = document.getElementById('node-logistics-list-info');
        if (page === 0) {
            nodeListInfo.innerHTML = '';
            localStorage.setItem('logisticspage', 0);
        } else {
            var page = localStorage.getItem('logisticspage');
            page = parseInt(page) + 1;
            localStorage.setItem('logisticspage', page);
        }

        services.List('app_content_logistics?page=' + page, '', function(data) {
            var i,
                nodes = data.nodes;
            //$('#node-logistics-list-info').html('');
            for (i = 0; i < nodes.length; i += 1) {
                var imgurl = base.default_img_path;
                if (nodes[i].node.field_images.src) {
                    imgurl = nodes[i].node.field_images.src;
                }
                nodeListInfo.innerHTML +=
                    '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<p><strong>需求</strong>:' + nodes[i].node.title + '</p>' +
                    '<p>' + nodes[i].node.body + '</p>' +
                    '</a></li>';
            }

            // 刷新列表视图
            $('#node-logistics-list-info').listview('refresh');
        });
    };

    /**
     * 载入核桃协会信息列表
     */

    my.loadNodeAssociationList = function(page) {
            var nodeListInfo = document.getElementById('node-association-list-info');
            if (page === 0) {
                nodeListInfo.innerHTML = '';
                localStorage.setItem('associationpage', 0);
            } else {
                var page = localStorage.getItem('associationpage');
                page = parseInt(page) + 1;
                localStorage.setItem('associationpage', page);
            }
            services.List('app_content_association?page=' + page, '', function(data) {
                var i,
                    nodes = data.nodes,
                    nodeListInfo = document.getElementById('node-association-list-info');
                for (i = 0; i < nodes.length; i += 1) {
                    var imgurl = base.default_img_path;
                    if (nodes[i].node.field_newsimages.src) {
                        imgurl = nodes[i].node.field_newsimages.src;
                    }
                    nodeListInfo.innerHTML +=
                        '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                        '<image src="' + imgurl + '"/>' +
                        '<p><strong>' + nodes[i].node.title + '</strong></p>' +
                        '<p>' + nodes[i].node.body + '</p>' +
                        '</a></li>';
                }

                // 刷新列表视图
                $('#node-association-list-info').listview('refresh');
            });
    }
        /**
         * 载入买列表
         */

    my.loadBuydemandList = function(page) {
        var nodeListInfo = document.getElementById('buydemand-list');
        if (page === 0) {
            nodeListInfo.innerHTML = '';
            localStorage.setItem('buydemandpage', 0);
        } else {
            var page = localStorage.getItem('buydemandpage');
            page = parseInt(page) + 1;
            localStorage.setItem('buydemandpage', page);
        }
        services.List('app_content_buydemand?page=' + page, '', function(data) {
            var i,
                nodes = data.nodes,
                buydemandlist = document.getElementById('buydemand-list');
            for (i = 0; i < nodes.length; i += 1) {
                var imgurl = base.default_img_path;
                if (nodes[i].node.field_images.src) {
                    imgurl = nodes[i].node.field_images.src;
                }
                buydemandlist.innerHTML +=
                    '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<p><strong>需求</strong>:' + nodes[i].node.title + '</p>' +
                    '<p>' + nodes[i].node.body + '</p>' +
                    '<p class="ui-li-aside">' + nodes[i].node.field_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                    '</a></li>';
            }

            // 刷新列表视图
            $('#buydemand-list').listview('refresh');
        });
    }

    /**
     * 载入卖列表
     */

    my.loadSaledemandList = function(page) {
        var nodeListInfo = document.getElementById('saledemand-list');
        if (page === 0) {
            nodeListInfo.innerHTML = '';
            localStorage.setItem('saledemandpage', 0);
        } else {
            var page = localStorage.getItem('saledemandpage');
            page = parseInt(page) + 1;
            localStorage.setItem('saledemandpage', page);
        }
        services.List('app_content_product?page=' + page, '', function(data) {
            var i,
                nodes = data.nodes,
                saledemandlist = document.getElementById('saledemand-list');
            for (i = 0; i < nodes.length; i += 1) {
                var imgurl = base.default_img_path;
                if (nodes[i].node.field_images.src) {
                    imgurl = nodes[i].node.field_images.src;
                }
                saledemandlist.innerHTML +=
                    '<li><a href="#node-product?nid=' + nodes[i].node.nid + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<p><strong>需求</strong>:' + nodes[i].node.title + '</p>' +
                    '<p>' + nodes[i].node.body + '</p>' +
                    //'<p class="ui-li-aside">' + nodes[i].node.commerce_price + '</p>' +
                    '<p class="ui-li-aside">' + nodes[i].node.commerce_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                    '</a></li>';
            }

            // 刷新列表视图
            $('#saledemand-list').listview('refresh');
        });
    }

    /**
     * 载入其他需求列表
     */

    my.loadArticleList = function(page) {
        var nodeListInfo = document.getElementById('article-list');
        if (page === 0) {
            nodeListInfo.innerHTML = '';
            localStorage.setItem('articlepage', 0);
        } else {
            var page = localStorage.getItem('articlepage');
            page = parseInt(page) + 1;
            localStorage.setItem('articlepage', page);
        }
        services.List('app_content_article?page=' + page, '', function(data) {
            var i,
                nodes = data.nodes,
                articlelist = document.getElementById('article-list');
            for (i = 0; i < nodes.length; i += 1) {
                var imgurl = base.default_img_path;
                if (nodes[i].node.field_images.src) {
                    imgurl = nodes[i].node.field_images.src;
                }
                articlelist.innerHTML +=
                    '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<p><strong>需求</strong>:' + nodes[i].node.title + '</p>' +
                    '<p>' + nodes[i].node.body + '</p>' +
                    '</a></li>';
            }

            // 刷新列表视图
            $('#article-list').listview('refresh');
        });
    }

    /**
     * 载入幻灯片
     */

    function loadSlideshow() {
        services.List('app_content_slideshow', '', function(data) {
            var i,
                nodes = data.nodes,
                slideshowList = document.getElementById('slideshow-list');
            $('#slideshow-list').html('');
            for (i = 0; i < nodes.length; i += 1) {
                var link = false;
                if (nodes[i].node.field_nid) {
                    link = '"#node?nid=' + nodes[i].node.field_nid + '"';
                } else {
                    link = '"#"';
                }
                slideshowList.innerHTML +=
                    '<div class="swiper-slide">' +
                    '<a href=' + link + '>' +
                    '<image src="' + nodes[i].node.field_image.src + '"/>'
                '<h3>' + nodes[i].node.title + '</h3>' +
                    '<p>' + nodes[i].node.body + '</p>'
                '</a></div>';
            }
            // 刷新列表视图
            //$('#slideshow-list').listview('refresh');
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true,
                spaceBetween: 0,
                loop: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: true,
                preloadImages: false,
                lazyLoading: true,
                //width : window.innerWidth,

            });

        });
    }

    /**
     * 载入商家列表
     */

    my.loadStoreList = function(page) {
        var nodeListInfo = document.getElementById('store-list-info');
        if (page === 0) {
            nodeListInfo.innerHTML = '';
            localStorage.setItem('storepage', 0);
        } else {
            var page = localStorage.getItem('storepage');
            page = parseInt(page) + 1;
            localStorage.setItem('storepage', page);
        }
        services.List('app_store_list?page=' + page, '', function(data) {
            var i,
                nodes = data.nodes,
                storeListInfo = document.getElementById('store-list-info');
            for (i = 0; i < nodes.length; i += 1) {
                storeListInfo.innerHTML +=
                    '<li><a href="#store-info?sid=' + nodes[i].node.id + '"">' +
                    '<image src="' + nodes[i].node.field_storelogo.src + '"/>' +
                    '<h3>' + nodes[i].node.title + '</h3>' +
                    '<p>' + nodes[i].node.field_introduction + '</p>'
                '</a></li>';
            }
            // 刷新列表视图
            $('#store-list-info').listview('refresh');
        });
    }

    /**
     * 载入商家信息
     */

    function displayStoreInfo(sid) {
        services.List('app_store_detail', sid, function(data) {
            $('.node-page-title').html(data.title);
            var i,
                nodes = data.nodes,
                storeInfoIntro = document.getElementById('store-info-intro'),
                storeInfoDetail = document.getElementById('store-info-detail');
            $('#store-info-intro').html('');
            $('#store-info-detail').html('');
            for (i = 0; i < nodes.length; i += 1) {
                storeInfoIntro.innerHTML +=
                    '<li><a href="#" class="store-title">' +
                    '<image src="' + nodes[i].node.field_storelogo.src + '"/>' +
                    '<h3>' + nodes[i].node.title + '</h3>' +
                    '</a></li>';
                storeInfoDetail.innerHTML +='<p><b>店铺简介：</b>' + nodes[i].node.field_introduction + '</p>';

                var images = nodes[i].node.field_storeimages;
                    if (!$.isArray(images)) {
                        images = [images];
                    }
                for (var i = 0; i < images.length; i += 1) {
                        if (images[i].src) {
                            storeInfoDetail.innerHTML += '<image src="' + images[i].src + '"/>';
                        }
                    }
            }

            // 刷新列表视图
            $('#store-info-intro').listview('refresh');
            $('#store-info-allproducts').click(loadStoreProductList(sid));
        });
    }

    /**
     * 载入商家商品列表
     */

    function loadStoreProductList(sid) {
        services.List('app_store_demand/', sid, function(data) {
            var i,
                nodes = data.nodes,
                list = document.getElementById('store-info-products-list');
            $('#store-info-products-list').html('');
            for (i = 0; i < nodes.length; i += 1) {
                switch (nodes[i].node.type) {
                    case 'buydemand':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_images.src) {
                            imgurl = nodes[i].node.field_images.src;
                        }
                        list.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.field_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '</a></li>';
                        break;
                    case 'product':
                        var imgurl = base.default_img_path;
                        if (nodes[i].node.field_product_images.src) {
                            imgurl = nodes[i].node.field_product_images.src;
                        }
                        list.innerHTML +=
                            '<li><a href="#node-product?nid=' + nodes[i].node.nid + '">' +
                            '<image src="' + imgurl + '"/>' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '<p class="ui-li-aside">' + nodes[i].node.commerce_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                            '</a></li>';
                        break;
                    default:
                        list.innerHTML +=
                            '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                            '<h3>' + nodes[i].node.title + '</h3>' +
                            '<p>' + nodes[i].node.body + '</p>' +
                            '</a></li>';
                        break;
                }
            }
            // 刷新列表视图
            $('#store-info-products-list').listview('refresh');
        });
    }

    function searchfocus() {
        $('body').pagecontainer('change', '#search');
    }

    function processHash(url) {    
        var parsed = $.mobile.path.parseUrl(url),
                    queryParameters = {},
                    hashQuery = parsed.hash.split("?");

        $.each((hashQuery.length > 1 ? hashQuery[1] : "").split("&"), function() {        
            var pair = this.split("=");        
            if (pair.length > 0 && pair[0]) {            
                queryParameters[pair[0]] = (pair.length > 1 ? pair[1] : true);        
            }    
        });    
        return {        
            parsed: parsed,
            cleanHash: (hashQuery.length > 0 ? hashQuery[0] : ""),
            queryParameters: queryParameters    
        };
    }

    function pullImplementation(did, callback) {
        var listSelector = did + " ul.ui-listview",
            lastItemSelector = listSelector + " > li:last-child";

        function gotPullDownData(event, data) {
            callback(0);
            data.iscrollview.refresh();
        }

        function onPullDown(event, data) {
            setTimeout(function fakeRetrieveDataTimeout() {
                    gotPullDownData(event, data);
                },
                0);
        }

        function gotPullUpData(event, data) {
            var iscrollview = data.iscrollview;
            callback();

            iscrollview.refresh(null, null,
                $.proxy(function afterRefreshCallback(iscrollview) {
                    this.scrollToElement(lastItemSelector, 400);
                }, iscrollview));
        }

        function onPullUp(event, data) {
            setTimeout(function fakeRetrieveDataTimeout() {
                    gotPullUpData(event, data);
                },
                0);
        }
        $(document).delegate(did, "pageinit",
            function bindPullPagePullCallbacks(event) {
                $(".iscroll-wrapper", this).bind({
                    iscroll_onpulldown: onPullDown,
                    iscroll_onpullup: onPullUp
                });
            });
    }

    function MathRand() {
        var Num = "";
        for (var i = 0; i < 6; i++) {
            Num += Math.floor(Math.random() * 10);
        }
        return Num;
    }

    var InterValObj;        
    var count = 60;        
    var curCount;        
    function sendMessage() {            
        curCount = count;
        $("#user-register-getvalidatecode").button().button("disable");
        $("#user-register-getvalidatecode").button().text("在" + curCount + "秒之后重发");
        $("#user-register-getvalidatecode").button().button('refresh');            
        InterValObj = window.setInterval(SetRemainTime, 1000);        
    } 
            
    function SetRemainTime() {            
        if (curCount == 0) {                
            window.clearInterval(InterValObj);
            $("#user-register-getvalidatecode").button().button("enable");                
            $("#user-register-getvalidatecode").button().text("重新发送");
            $("#user-register-getvalidatecode").button().button('refresh');            
        }            
        else {                
            curCount--;                
            $("#user-register-getvalidatecode").button().text("在" + curCount + "秒之后重发");
            $("#user-register-getvalidatecode").button().button('refresh');            
        }        
    }

    var InterValObj2;        
    var count2 = 60;        
    var curCount2;        
    function sendNewPasswordMessage() {            
        curCount2 = count2;
        $("#user-newpassword-getvalidatecode").button().button("disable");
        $("#user-newpassword-getvalidatecode").button().text("在" + curCount2 + "秒之后重发");
        $("#user-newpassword-getvalidatecode").button().button('refresh');            
        InterValObj2 = window.setInterval(SetNewPasswordRemainTime, 1000);        
    } 
            
    function SetNewPasswordRemainTime() {            
        if (curCount2 == 0) {                
            window.clearInterval(InterValObj2);
            $("#user-newpassword-getvalidatecode").button().button("enable");                
            $("#user-newpassword-getvalidatecode").button().text("重新发送");
            $("#user-newpassword-getvalidatecode").button().button('refresh');            
        }            
        else {                
            curCount2--;                
            $("#user-newpassword-getvalidatecode").button().text("在" + curCount2 + "秒之后重发");
            $("#user-newpassword-getvalidatecode").button().button('refresh');            
        }        
    }

    function uploadDeviceImage(filename, did, files, height,quality,pictureSourceType) {
            var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
            var pzh = 50;
            if(quality){
                pzh = quality;
            }
            if(pictureSourceType){
                sourceType = pictureSourceType
            }
            var settings = {
                quality: pzh,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: sourceType,
                encodingType: Camera.EncodingType.JPEG,
                saveToPhotoAlbum: false
            };
            if (height) {
                settings.targetHeight = height;
            }else{
                settings.targetWidth = 1137;
            }
            navigator.camera.getPicture(function onSuccess(imageData) {
                var img = new Image();
                img.src = "data:image/jpeg;base64," + imageData;
                var height = img.height;
                if (height > 100) {
                    height = 100;
                }
                var width = img.width;
                if (width > 100) {
                    if (img.height > 100) {
                        width = width * 100 / img.height;
                    }
                }

                services.FileUpload(imageData, filename, function(data) {
                    files.push({
                        'fid': data.fid
                    });
                    var fileDisplayArea = document.getElementById(did);
                    fileDisplayArea.innerHTML += '<image src="' + "data:image/jpeg;base64," + imageData + '" width="' + width + 'px" height="' + height + 'px"/>';
                    $('#' + did).trigger('create');
                });
            }, function onFail(message) {
                console.log('Failed because: ' + message);
            }, settings);
    }
    my.nodeCancel=function (){
        var nid = $('#node-id').val();
        if(nid){
            services.NodeCancel(nid,function(result){
                if(result && result[0]){
                    $('body').pagecontainer('change', '#front');
                }
            });
        }
    }
    my.nodeClose=function (){
        var nid = $('#node-id').val();
        var data={
            'node[field_demandstatus][und]': 38,
        };
        if(nid){
            services.NodeEdit(nid,data,function(result){
                $("#node-close").button().button("disable");
            });
        }
    }
    // $.mobile.document.on("pagecontainerbeforetransition", function(event, ui) {        
    //     var processedHash;        
    //     console.log(ui.absUrl); 
    // });
    my.init = function() {

        var cart = document.getElementById('addToCart');
        BindEvent(cart, 'click', function() {
            var productid = $('#cartproductid').val();
            addToCart(productid);
        });

        pullImplementation('#node-logistics-list', my.loadNodeLogisticsList);
        pullImplementation('#store-list', my.loadStoreList);
        pullImplementation('#node-list', my.loadNodeList);
        pullImplementation('#buydemand', my.loadBuydemandList);
        pullImplementation('#saledemand', my.loadSaledemandList);
        pullImplementation('#article', my.loadArticleList);
        pullImplementation('#node-employment-list', my.loadNodeEmploymentList);
        pullImplementation('#node-association-list', my.loadNodeAssociationList);
        pullImplementation('#myinfo', my.myinfo);
        //pullImplementation('#message-list', my.loadMessageList);

        $.mobile.document.on("pagecontainerbeforechange", function(event, ui) {        
            var processedHash;        
            if (typeof ui.toPage === "string") {   
                var processedHash = processHash(ui.toPage); 
                $(processedHash.cleanHash).jqmData("url", processedHash.parsed.hash);
                //console.log(ui);      
            }    
        });

        var nodecreatebuydemandimages = document.getElementById('node-create-buydemand-images');
        if (typeof cordova != 'undefined') {
            nodecreatebuydemandimages.innerHTML = '<div id="buydemandFileDisplayArea"></div>' +
                '<div data-role="controlgroup" data-type="horizontal">'+
                '<legend>添加图片</legend>'+
                '<button class="ui-btn ui-corner-all ui-btn-a" id="node-create-buydemand-upload-photo">照片图库</button>'+
                '<button class="ui-btn ui-corner-all ui-btn-a  ui-icon-camera" id="node-create-buydemand-upload-camera">拍照</button>'+
                '</div>';
            $('#node-create-buydemand-images').trigger('create');

            var buydemandFileInput = document.getElementById('node-create-buydemand-upload-photo');
            buydemandFileInput.addEventListener('click', function(e) {
                uploadDeviceImage('buydemand-photo.jpg', 'buydemandFileDisplayArea', imagefiles, 300,50,Camera.PictureSourceType.PHOTOLIBRARY);
            });

            var buydemandFileInput2 = document.getElementById('node-create-buydemand-upload-camera');
            buydemandFileInput2.addEventListener('click', function(e) {
                uploadDeviceImage('buydemand-camera.jpg', 'buydemandFileDisplayArea', imagefiles, 300,50,Camera.PictureSourceType.CAMERA);
            });

        } else {
            nodecreatebuydemandimages.innerHTML = '<label for="node-create-buydemand-upload">图片:</label>' +
                '<div id="buydemandFileDisplayArea"></div>' +
                '<input type="file" name="node-create-buydemand-upload" id="node-create-buydemand-upload" value="">';
            $('#node-create-buydemand-images').trigger('create');

            var buydemandFileInput = document.getElementById('node-create-buydemand-upload');
            buydemandFileInput.addEventListener('change', function(e) {
                var file = buydemandFileInput.files[0];
                uploadImageFiles(file, 'buydemandFileDisplayArea', imagefiles);
            });
        }

        var nodecreateproductimages = document.getElementById('node-create-product-images');
        if (typeof cordova != 'undefined') {
            nodecreateproductimages.innerHTML = '<div id="productFileDisplayArea"></div>' +
                '<div data-role="controlgroup" data-type="horizontal">'+
                '<legend>添加商品小图</legend>'+
                '<button class="ui-btn ui-corner-all ui-btn-a" id="node-create-product-upload-photo">照片图库</button>' +
                '<button class="ui-btn ui-corner-all ui-btn-a ui-icon-camera" id="node-create-product-upload-camera">拍照</button>' +
                '</div>'+
                '<div id="productDetailImageFileDisplayArea"></div>' +
                '<div data-role="controlgroup" data-type="horizontal">'+
                '<legend>添加详情图片</legend>'+
                '<button class="ui-btn ui-corner-all ui-btn-a" id="node-create-product-detailimage-photo">照片图库</button>'+
                '<button class="ui-btn ui-corner-all ui-btn-a  ui-icon-camera" id="node-create-product-detailimage-camera">拍照</button>'+
                '</div>';
            $('#node-create-product-images').trigger('create');

            var productFileInput = document.getElementById('node-create-product-upload-photo');
            productFileInput.addEventListener('click', function(e) {
                uploadDeviceImage('small-photo.jpg', 'productFileDisplayArea', imagefiles, 300,50,Camera.PictureSourceType.PHOTOLIBRARY);
            });
            var productFileInput2 = document.getElementById('node-create-product-upload-camera');
            productFileInput2.addEventListener('click', function(e) {
                uploadDeviceImage('small-camera.jpg', 'productFileDisplayArea', imagefiles, 300,50,Camera.PictureSourceType.CAMERA);
            });


            var detailimageInput = document.getElementById('node-create-product-detailimage-photo');
            detailimageInput.addEventListener('click', function(e) {
                uploadDeviceImage('detail-photo.jpg', 'productDetailImageFileDisplayArea', detailImageFiles, false,50,Camera.PictureSourceType.PHOTOLIBRARY);
            });
            var detailimageInput2 = document.getElementById('node-create-product-detailimage-camera');
            detailimageInput2.addEventListener('click', function(e) {
                uploadDeviceImage('detail-camera.jpg', 'productDetailImageFileDisplayArea', detailImageFiles, false,50,Camera.PictureSourceType.CAMERA);
            });
        } else {
            nodecreateproductimages.innerHTML = '<label for="node-create-product-upload">商品小图(*):</label>' +
                '<div id="productFileDisplayArea"></div>' +
                '<input type="file" name="node-create-product-upload" id="node-create-product-upload" value="">' +
                '<label for="node-create-product-detailimage">详情图片:</label>' +
                '<div id="productDetailImageFileDisplayArea"></div>' +
                '<input type="file" name="node-create-product-detailimage" id="node-create-product-detailimage" value="">';
            $('#node-create-product-images').trigger('create');
            var productFileInput = document.getElementById('node-create-product-upload');
            productFileInput.addEventListener('change', function(e) {
                var file = productFileInput.files[0];
                uploadImageFiles(file, 'productFileDisplayArea', imagefiles);
            });
            var detailimageInput = document.getElementById('node-create-product-detailimage');
            detailimageInput.addEventListener('change', function(e) {
                var file = detailimageInput.files[0];
                uploadImageFiles(file, 'productDetailImageFileDisplayArea', detailImageFiles);
            });
        }

        var commerce_customer_address_administrative_area = document.getElementById('commerce_customer_address_administrative_area');
        commerce_customer_address_administrative_area.addEventListener('change', function(e) {
            var province_id = $('#commerce_customer_address_administrative_area').val();
            var city_id = '';
            $('#commerce_customer_address_locality').empty();
            $.each(china_province, function(index, item) {
                if (item.region_type == '2' && item.parent_id == province_id) {
                    var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                    $('#commerce_customer_address_locality').append(option);
                    if (city_id === '') {
                        city_id = item.region_id;
                    }
                }
            });
            $('#commerce_customer_address_dependent_locality').empty();
            $.each(china_province, function(index, item) {
                if (item.region_type == '3' && item.parent_id == city_id) {
                    var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                    $('#commerce_customer_address_dependent_locality').append(option);
                }
            });
            $('#commerce_customer_address_locality').selectmenu('refresh', true);
            $('#commerce_customer_address_dependent_locality').selectmenu('refresh', true);
        });

        var commerce_customer_address_locality = document.getElementById('commerce_customer_address_locality');
        commerce_customer_address_locality.addEventListener('change', function(e) {
            var city_id = $('#commerce_customer_address_locality').val();
            $('#commerce_customer_address_dependent_locality').empty();
            $.each(china_province, function(index, item) {
                if (item.region_type == '3' && item.parent_id == city_id) {
                    var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                    $('#commerce_customer_address_dependent_locality').append(option);
                }
            });
            $('#commerce_customer_address_dependent_locality').selectmenu('refresh', true);
        });

        var address_edit_submit = document.getElementById('address-edit-submit');
        address_edit_submit.addEventListener('click', function(e) {
            var profileid = $('#commerce_customer_address_profile_id').val();
            services.CommerceCustomerAddressCanModify(profileid, function(data) {
                if (data) {
                    var data = {
                        'administrative_area': $('#commerce_customer_address_administrative_area').val(),
                        'locality': $('#commerce_customer_address_locality').val(),
                        'dependent_locality': $('#commerce_customer_address_dependent_locality').val(),
                        'thoroughfare': $('#commerce_customer_address_thoroughfare').val(),
                        'name_line': $('#commerce_customer_address_name_line').val(),
                        'linkphone': $('#commerce_customer_address_linkphone').val(),
                        'postal_code': $('#commerce_customer_address_postal_code').val(),
                        'uid': localStorage.currentUser
                    };
                    services.CommerceCustomerAddress(profileid, data, function(data) {
                        $('body').pagecontainer('change', '#setting');
                    });
                }
            });
        });

        var user_login_submit = document.getElementById('user-login-submit');
        user_login_submit.addEventListener('click', userLogin);

        var user_register_submit = document.getElementById('user-register-submit');
        user_register_submit.addEventListener('click', userRegister);

        // 点击登出按钮时执行 userLogout()
        $('.user-logout').click(userLogout);
        // 防止表单默认的行为
        $('form').on('submit', function(event) {
            event.preventDefault();
        });

        $('#node-create-employment-submit').click(nodeCreateEmployment);
        $('#node-create-product-submit').click(nodeCreateProduct);
        $('#node-create-buydemand-submit').click(nodeCreateBuydemand);
        $('#node-create-article-submit').click(nodeCreateArticle);
        $('#node-create-logistics-submit').click(nodeCreateLogistics);


        var nodeflag = document.getElementById('node-flag');
        nodeflag.addEventListener('click', function(e) {
            var nid = $('#node-flag-id').val();
            flag(nid, 'node-flag');
        });

        var nodeproductflag = document.getElementById('node-product-flag');
        nodeproductflag.addEventListener('click', function(e) {
            var nid = $('#node-product-flag-id').val();
            flag(nid, 'node-product-flag');
        });

        var sms = document.getElementById('user-register-getvalidatecode');
        sms.addEventListener('click', function(e) {
            var phone = $('#user-register-phone').val().trim();
            if (phone.length != 11) {
                base.ErrorDialog('验证码', '请输入手机号', '');
                return false;
            }
            mathrand = MathRand();
            var data = {
                'phone': phone,
                'code': mathrand
            };
            services.sms(data, function(data) {
                if (data && data[0]) {
                    sendMessage();
                } else {
                    base.ErrorDialog('验证码', '手机号已使用', '');
                }
            });
        });

        var newpasswordsms = document.getElementById('user-newpassword-getvalidatecode');
        newpasswordsms.addEventListener('click', function(e) {
            var phone = $('#user-newpassword-phone').val().trim();
            if (phone.length != 11) {
                base.ErrorDialog('验证码', '请输入手机号', '');
                return false;
            }
            mathrand = MathRand();
            var data = {
                'phone': phone
            };
            services.newpasswordsms(data, function(data) {
                if (data && data.uid) {
                    sendNewPasswordMessage();
                    $("#user-newpassword-submit").button().button("enable"); 
                    $("#user-newpassword-submit").button().button('refresh'); 
                    $('#user-newpassword-uid').val(data.uid);
                } else {
                    base.ErrorDialog('验证码', '无法获取验证码', '');
                }
            });
        });

        var newpasswordsubmit = document.getElementById('user-newpassword-submit');
        newpasswordsubmit.addEventListener('click', function(e) {
            if($("#user-newpassword-form").valid()){
                var uid=$('#user-newpassword-uid').val();
                if(uid){
                    userUpdatePassword(uid);
                }
            }
        });

        var usersettingsubmit = document.getElementById('user-setting-submit');
        usersettingsubmit.addEventListener('click', function(e) {
            if($("#user-setting-form").valid()){
                userUpdate();
            }
        });

        $("#user-register-form").validate({
            rules: {
                'user-register-phone': {
                    required: true,
                    minlength: 11
                },
                'user-register-password': {
                    required: true,
                    minlength: 6
                },
                'user-register-validatepassword': {
                    required: true,
                    minlength: 6,
                    equalTo: "#user-register-password"
                },
                'user-register-validatecode': {
                    required: true,
                    minlength: 6
                },
            },
            messages: {
                'user-register-phone': {
                    required: "请输入电话号码",
                    minlength: "电话号码为11位"
                },
                'user-register-password': {
                    required: "请输入密码",
                    minlength: "密码至少6位"
                },
                'user-register-validatepassword': {
                    required: "请输入确认密码",
                    minlength: "确认密码至少6位",
                    equalTo: "和密码不一致"
                },
                'user-register-validatecode': {
                    required: "请输入验证码",
                    minlength: "验证码为6位"
                },
            },
            // submitHandler: function(form) {
            //     userRegister();
            // }
        });

        $("#user-newpassword-form").validate({
            rules: {
                'user-newpassword-phone': {
                    required: true,
                    minlength: 11
                },
                'user-newpassword-password': {
                    required: true,
                    minlength: 6
                },
                'user-newpassword-validatepassword': {
                    required: true,
                    minlength: 6,
                    equalTo: "#user-newpassword-password"
                },
                'user-newpassword-validatecode': {
                    required: true,
                    minlength: 6
                },
            },
            messages: {
                'user-newpassword-phone': {
                    required: "请输入电话号码",
                    minlength: "电话号码为11位"
                },
                'user-newpassword-password': {
                    required: "请输入密码",
                    minlength: "密码至少6位"
                },
                'user-newpassword-validatepassword': {
                    required: "请输入确认密码",
                    minlength: "确认密码至少6位",
                    equalTo: "和密码不一致"
                },
                'user-newpassword-validatecode': {
                    required: "请输入验证码",
                    minlength: "验证码为6位"
                },
            },
            // submitHandler: function(form) {

            // }
        });

        $("#user-setting-form").validate({
            rules: {
                'user-setting-nickname': {
                    required: true,
                },
                'user-setting-email': {
                    required: true,
                    email: true
                },
                'user-setting-newpassword': {
                    //required: true,
                    minlength: 6
                },
                'user-setting-validatepassword': {
                    //required: true,
                    minlength: 6,
                    equalTo: "#user-setting-newpassword"
                },
            },
            messages: {
                'user-setting-nickname': {
                    required: "请输入昵称",
                },
                'user-setting-email': '请输入正确的邮箱格式',
                'user-setting-newpassword': {
                    //required: "请输入密码",
                    minlength: "密码至少6位"
                },
                'user-setting-validatepassword': {
                    //required: "请输入确认密码",
                    minlength: "确认密码至少6位",
                    equalTo: "和密码不一致"
                },
            },
            // submitHandler: function(form) {
            //     userUpdate();
            // }
        });

        var popupmessagesubmit = document.getElementById('popupmessage-submit');
        popupmessagesubmit.addEventListener('click', function(e) {
            postMessage();
        });

        var popupproductmessagesubmit = document.getElementById('popupproductmessage-submit');
        popupproductmessagesubmit.addEventListener('click', function(e) {
            postProductMessage();
        });

        var popupnodemessagesubmit = document.getElementById('popupnodemessage-submit');
        popupnodemessagesubmit.addEventListener('click', function(e) {
            postNodeMessage();
        });

        $( document ).on( "pageinit", "#front", function( event ) {
          loadSlideshow();
          loadRecommendStoreList();
          loadRecommendList();
        });

        $( document ).on( "pageinit", "#node-create-product", function() {
            $( "#node-create-product-taxonomy" ).on({
                popupafterclose: function() {
                    var text = '';
                    for (var index in producttaxonomy) {
                        var v = producttaxonomy[index];
                        if (v && v.vid) {
                            for (var index in nodes) {
                                var term = nodes[index].node;
                                if (term.vid == v.vid) {
                                    var chk = document.getElementById(v.id + '-' + term.tid);
                                    if (chk.checked) {
                                        text+=term.tname+' ';
                                    }
                                }
                            }
                        }
                    }
                    if(text!==''){
                        $("#node-create-product-button").button().text(text);
                        $("#node-create-product-button").button().button('refresh');
                    }
                }
            });
        });

        $( document ).on( "pageinit", "#node-create-buydemand", function() {
            $( "#node-create-buydemand-taxonomy" ).on({
                popupafterclose: function() {
                    var text = '';
                    for (var index in buydemandtaxonomy) {
                        var v = buydemandtaxonomy[index];
                        if (v && v.vid) {
                            for (var index in nodes) {
                                var term = nodes[index].node;
                                if (term.vid == v.vid) {
                                    var chk = document.getElementById(v.id + '-' + term.tid);
                                    if (chk.checked) {
                                        text+=term.tname+' ';
                                    }
                                }
                            }
                        }
                    }
                    if(text!==''){
                        $("#node-create-buydemand-button").button().text(text);
                        $("#node-create-buydemand-button").button().button('refresh');
                    }
                }
            });
        });
        $( "body" ).on( "pagecontainerbeforechange", function( event, ui ) {
            console.log(event);
            console.log(ui);
            var currentPage = $('body').pagecontainer('getActivePage'),
                currentPageId = currentPage[0].id;
                console.log(currentPageId);
        } );
        $('body').on('pagecontainershow', function(event, ui) {
            // 默认的过渡效果设置为 'none'
            var processedHash = processHash(window.location.hash);
            $.mobile.defaultPageTransition = 'none';
            // 获得当前活动的页面
            var currentPage = $('body').pagecontainer('getActivePage'),
                currentPageId = currentPage[0].id,
                currentNode = processedHash.queryParameters.nid,
                currentStore = processedHash.queryParameters.sid,
                //currentUser = processedHash.queryParameters.uid,
                currentAddress = processedHash.queryParameters.aid,
                currentOrder = processedHash.queryParameters.oid,
                currentThread = processedHash.queryParameters.threadid,
                user = getStorageUser();
            switch (currentPageId) {
                // 如果当前页面是 user-profile
                case 'user-profile':
                    getCurrentUser();
                    break;
                    // 如果当前页面是 front
                case 'front':
                    break;
                    // 如果当前页面是 node
                case 'node':
                    if (currentNode) {
                        displayNode(currentNode, 'slideshow-node-list', 'node-content', 'slideshow-node-container');
                    }
                    break;
                case 'node-product':
                    if (currentNode) {
                        displayNode(currentNode, 'slideshow-node-product-list', 'node-product-content', 'slideshow-node-product-container');
                    }
                    break;
                case 'message':
                    if (currentThread) {
                        displayMessage(currentThread);
                    }
                    break;
                    // 如果当前页面是 node-edit
                case 'node-edit':
                    if (currentNode) {
                        editNode(currentNode);
                    }
                    break;
                    // 如果当前页面是 node-create
                case 'node-create-product':

                    break;
                case 'node-create-buydemand':

                    break;
                case 'node-create-article':
                    break;
                case 'node-create-employment':

                    break;
                case 'node-create-logistics':

                    break;
                case 'request-new-password':
                    $("#user-newpassword-submit").button().button("disable");
                    $("#user-newpassword-submit").button().button('refresh');
                    break;
                case 'store-list':
                    var list = document.getElementById('store-list-info');
                    if (list.innerHTML.length == 0) {
                        my.loadStoreList(0);
                    }
                    break;
                case 'message-list':
                    //var list = document.getElementById('message-list-info');
                    //if (list.innerHTML.length == 0) {
                        my.loadMessageList(0);
                    //}
                    break;
                case 'store-info':
                    if (currentStore) {
                        displayStoreInfo(currentStore);
                    }
                    break;
                case 'node-list':
                    var list = document.getElementById('node-list-info');
                    if (list.innerHTML.length == 0) {
                        my.loadNodeList(0);
                    }
                    break;
                case 'node-news-list':
                    var list = document.getElementById('node-news-list-info');
                    if (list.innerHTML.length == 0) {
                        my.loadNodeNewsList(0);
                    }
                    break;
                case 'node-employment-list':
                    var list = document.getElementById('node-employment-list-info');
                    if (list.innerHTML.length == 0) {
                        my.loadNodeEmploymentList(0);
                    }
                    break;
                case 'node-logistics-list':
                    var nodeListInfo = document.getElementById('node-logistics-list-info');
                    if (nodeListInfo.innerHTML.length == 0) {
                        my.loadNodeLogisticsList(0);
                    }
                    //$("#node-logistics-list").iscrollview("refresh");
                    break;
                case 'node-association-list':
                    var list = document.getElementById('node-association-list-info');
                    if (list.innerHTML.length == 0) {
                        my.loadNodeAssociationList(0);
                    }
                    break;
                case 'buydemand':
                    var list = document.getElementById('buydemand-list');
                    if (list.innerHTML.length == 0) {
                        my.loadBuydemandList(0);
                    }
                    break;
                case 'saledemand':
                    var list = document.getElementById('saledemand-list');
                    if (list.innerHTML.length == 0) {
                        my.loadSaledemandList(0);
                    }
                    break;
                case 'article':
                    var list = document.getElementById('article-list');
                    if (list.innerHTML.length == 0) {
                        my.loadArticleList(0);
                    }
                    break;
                case 'myinfo':
                    var list = document.getElementById('myinfo-list');
                    if (list.innerHTML.length == 0) {
                        my.myinfo(0);
                    }
                    break;
                case 'order-list':
                    if (user) {
                        loadOrderList(user.uid);
                    } else {
                        $('body').pagecontainer('change', '#user-login');
                    }
                    break;
                case 'order-info':
                    if (currentOrder) {
                        loadOrderInfo(currentOrder);
                    }
                    break;
                case 'bookmark-good-list':
                    if (user) {
                        loadBookmarkGoodList(user.uid);
                    } else {
                        $('body').pagecontainer('change', '#user-login');
                    }
                    break;
                case 'bookmark-store-list':
                    if (user) {
                        loadBookmarkStoreList(user.uid);
                    } else {
                        $('body').pagecontainer('change', '#user-login');
                    }
                    break;
                case 'setting':
                    if (user) {
                        loadSetting(user.uid);
                    } else {
                        $('body').pagecontainer('change', '#user-login');
                    }
                    break;
                case 'address-edit':
                    if (currentAddress) {
                        editAddress(currentAddress);
                    }
                    break;
                case 'cart':
                    if (!user) {
                        $('body').pagecontainer('change', '#user-login');
                    }
                    loadCart();
                    break;
                case 'user-login':
                    if (user) {
                        $('body').pagecontainer('change', '#user-profile');
                    }
                    break;
                case 'demand':
                    if (!user) {
                        $('body').pagecontainer('change', '#user-login');
                    }
                    break;

            }
        });
    };
    return my;
}(index || {}));

/*===========================
base AMD Export
===========================*/
if (typeof(module) !== 'undefined') {
    module.exports = index;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        'use strict';
        return index;
    });
}



// $(document).ready(function () {
//         $("#mysearch").on("inupt", function (e) {
//             //searchNode();
//             //
//             alert('test');
//         });
// });
function searchNode(element) {
    var $inputElem = $(element);
    // trigger only when at least 2 characters have been entered.
    var keywords = $inputElem.val();
    if (keywords.length < 2) {
        return;
    }
    services.SearchNode(keywords, function(data) {
        $('#suggestionsList').html('');
        if (data.length > 0) {
            var listItemsHtml = '';
            $.each(data, function(i, val) {
                listItemsHtml += '<li><a href="#node?nid=' + val.node + '">' + val.title + '</a></li>';
            });
            $('#suggestionsList').html(listItemsHtml);
        }
        $('#suggestionsList').listview("refresh");
    });
}

function uploadAndSubmit() {
    var form = document.forms["demoForm"];

    if (form["file"].files.length > 0) {
        var file = form["file"].files[0];

        // try sending
        var reader = new FileReader();

        reader.onloadstart = function() {
            console.log("onloadstart");

            document.getElementById("bytesTotal").textContent = file.size;
        }

        reader.onprogress = function(p) {
            console.log("onprogress");
            document.getElementById("bytesRead").textContent = p.loaded;
        }

        reader.onload = function() {
            console.log("load complete");
        }

        reader.onloadend = function() {
            if (reader.error) {
                console.log(reader.error);
            } else {
                document.getElementById("bytesRead").textContent = file.size;
                var xhr = new XMLHttpRequest();
                xhr.open( /* method */ "POST", /* target url */ "http://www.hzs168.com/drupalgap/file?fileName=" + file.name /*, async, default to true */ );
                xhr.overrideMimeType("application/octet-stream");
                xhr.sendAsBinary(reader.result);

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            console.log("upload complete");
                            console.log("response: " + xhr.responseText);
                        }
                    }
                }
            }

        }


        reader.readAsBinaryString(file);
    } else {
        alert("Please choose a file.");
    }
}


//app.updateApp();
