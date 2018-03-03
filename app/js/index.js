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
        if ($("#node-create-product-form").valid()) {
            var nodeTitle = $('#node-create-product-title').val(),
                nodeBody = $('#node-create-product-body').val(),
                nodePrice = $('#node-create-product-price').val(),
                nodeCount = $('#node-create-product-prodcount').val(),
                nodeSku = new Date().getTime(),
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
            //data['node[field_product][und][form][field_images][und][items_count]'] = 2;
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
                                    $("#" + v.id + '-' + term.tid).prop("checked", false).checkboxradio("refresh");
                                }
                            }
                        }
                    }
                }
                imagefiles = [];
                detailImageFiles = [];
                var productFileDisplayArea = document.getElementById('productFileDisplayArea');
                productFileDisplayArea.innerHTML = '';
                var productDetailImageFileDisplayArea = document.getElementById('productDetailImageFileDisplayArea');
                productDetailImageFileDisplayArea.innerHTML = '';

                if (typeof cordova == 'undefined') {
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
    }

    function nodeModifyProduct() {
        if ($("#node-modify-product-form").valid()) {
            var nodeTitle = $('#node-modify-product-title').val(),
                nodeBody = $('#node-modify-product-body').val(),
                nodePrice = $('#node-modify-product-price').val(),
                nodeCount = $('#node-modify-product-prodcount').val(),
                //nodeSku = new Date().getTime(),
                nodePhone = $('#node-modify-product-linkphone').val(),
                nid = $('#node-modify-product-nid').val(),
                data = {
                    'node[type]': 'product',
                    'node[title]': nodeTitle,
                    //'node[field_product][und][form][sku]': nodeSku,
                    'node[body][und][0][value]': nodeBody,
                    //'node[field_demandstatus][und]': 37,
                    'node[field_product][und][form][commerce_price][und][0][amount]': nodePrice,
                    'node[field_prodcount][und][0][value]': nodeCount,
                    //'node[field_product][und][form][status]': 1,
                    'node[language]': 'und',
                    'node[field_linkphone][und][0][value]': nodePhone,
                };
            for (var index in productmodifytaxonomy) {
                var v = productmodifytaxonomy[index];
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
            //data['node[field_product][und][form][field_images][und][items_count]'] = 2;
            for (var i = 0; i < imagefiles.length; i++) {
                data['node[field_product][und][form][field_images][und]'].push(imagefiles[i]);
            };

            data['node[field_detailimages][und]'] = [];
            for (var i = 0; i < detailImageFiles.length; i++) {
                data['node[field_detailimages][und]'].push(detailImageFiles[i]);
            };

            services.NodeEdit(nid, data, function(result) {
                console.log('成功修改卖：' + nid);
                $('#node-modify-product-title').val('');
                $('#node-modify-product-body').val('');
                $('#node-modify-product-price').val('');
                $('#node-modify-product-prodcount').val('');
                $('#node-modify-product-linkphone').val('');
                $("#node-modify-product-button").button().text('请选择规格(*)');
                $("#node-modify-product-button").button().button('refresh');
                for (var index in producttaxonomy) {
                    var v = producttaxonomy[index];
                    if (v && v.vid) {
                        for (var index in nodes) {
                            var term = nodes[index].node;
                            if (term.vid == v.vid) {
                                var chk = document.getElementById(v.id + '-' + term.tid);
                                if (chk.checked) {
                                    $("#" + v.id + '-' + term.tid).prop("checked", false).checkboxradio("refresh");
                                }
                            }
                        }
                    }
                }
                imagefiles = [];
                detailImageFiles = [];
                var productFileDisplayArea = document.getElementById('productFileDisplayArea');
                productFileDisplayArea.innerHTML = '';
                var productDetailImageFileDisplayArea = document.getElementById('productDetailImageFileDisplayArea');
                productDetailImageFileDisplayArea.innerHTML = '';

                if (typeof cordova == 'undefined') {
                    var control = $("#node-modify-product-upload");
                    control.wrap('<form>').closest('form').get(0).reset();
                    control.unwrap();
                    var control1 = $("#node-modify-product-detailimage");
                    control1.wrap('<form>').closest('form').get(0).reset();
                    control1.unwrap();
                }
                $('body').pagecontainer('change', '#node-product?nid=' + nid);
            });
        }
    }

    function uploadImageFiles(file, did, files, callback) {
        var imageType = /image.*/;
        if (file.type.match(imageType)) {
            lrz(file, {
                width: 1024
            }).then(function (rst) {
                    var base64 = rst.base64.split("base64,")[1];
                    services.FileUpload(base64, file.name, function(data) {
                        files.push({
                            'fid': data.fid
                        });
                        var fileDisplayArea = document.getElementById(did);
                        fileDisplayArea.innerHTML += '<image src="' + rst.base64 + '" width="100px"/>';

                        $('#' + did).trigger('create');
                        if (callback) {
                            callback(data);
                        }
                    });
                return rst;
            });

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
            var html = '<a href="javascript:void(0);" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">关闭</a>';
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
        }
        //,
        // {
        //     'vid': 7,
        //     'vname': '等级',
        //     'field': 'field_level',
        //     'type': 'radio',
        //     'id': 'field_level'
        // }
        , {
            'vid': 5,
            'vname': '类别',
            'field': 'field_class',
            'type': 'radio',
            'id': 'field_class'
        }
    ];
    var productmodifytaxonomy = [{
            'vid': 3,
            'vname': '产地',
            'field': 'field_placeorigin',
            'type': 'radio',
            'id': 'field_placeorigin_modify'
        }, {
            'vid': 8,
            'vname': '单位',
            'field': 'field_unit',
            'type': 'radio',
            'id': 'field_unit_product_modify'
        }, {
            'vid': 4,
            'vname': '品种',
            'field': 'field_breed',
            'type': 'radio',
            'id': 'field_breed_modify'
        }, {
            'vid': 6,
            'vname': '直径',
            'field': 'field_diameter',
            'type': 'radio',
            'id': 'field_diameter_modify'
        }
        //,
        // {
        //     'vid': 7,
        //     'vname': '等级',
        //     'field': 'field_level',
        //     'type': 'radio',
        //     'id': 'field_level'
        // }
        , {
            'vid': 5,
            'vname': '类别',
            'field': 'field_class',
            'type': 'radio',
            'id': 'field_class_modify'
        }
    ];
    loadTaxonomy('node-create-product-taxonomy', producttaxonomy);
    loadTaxonomy('node-modify-product-taxonomy', productmodifytaxonomy);
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
        }
        // ,{
        //     'vid': 7,
        //     'vname': '等级',
        //     'field': 'field_multi_level',
        //     'type': 'checkbox',
        //     'id': 'field_multi_level'
        // }
        , {
            'vid': 5,
            'vname': '类别',
            'field': 'field_multi_class',
            'type': 'checkbox',
            'id': 'field_multi_class'
        }
    ];
    var buydemandmodifytaxonomy = [{
            'vid': 3,
            'vname': '产地',
            'field': 'field_multi_placeorigin',
            'type': 'checkbox',
            'id': 'field_multi_placeorigin_modify'
        }, {
            'vid': 8,
            'vname': '单位',
            'field': 'field_unit',
            'type': 'radio',
            'id': 'field_unit_buydemand_modify'
        }, {
            'vid': 4,
            'vname': '品种',
            'field': 'field_multi_breed',
            'type': 'checkbox',
            'id': 'field_multi_breed_modify'
        }, {
            'vid': 6,
            'vname': '直径',
            'field': 'field_multi_diameter',
            'type': 'checkbox',
            'id': 'field_multi_diameter_modify'
        }
        // ,{
        //     'vid': 7,
        //     'vname': '等级',
        //     'field': 'field_multi_level',
        //     'type': 'checkbox',
        //     'id': 'field_multi_level'
        // }
        , {
            'vid': 5,
            'vname': '类别',
            'field': 'field_multi_class',
            'type': 'checkbox',
            'id': 'field_multi_class_modify'
        }
    ];
    loadTaxonomy('node-create-buydemand-taxonomy', buydemandtaxonomy);
    loadTaxonomy('node-modify-buydemand-taxonomy', buydemandmodifytaxonomy);
    /**
     * 买
     */
    function nodeCreateBuydemand() {
        if ($("#node-create-buydemand-form").valid()) {
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
                                    $("#" + v.id + '-' + term.tid).prop("checked", false).checkboxradio("refresh");
                                }
                            }
                        }
                    }
                }
                imagefiles = [];
                var buydemandFileDisplayArea = document.getElementById('buydemandFileDisplayArea');
                buydemandFileDisplayArea.innerHTML = '';
                if (typeof cordova == 'undefined') {
                    var control = $("#node-create-buydemand-upload");
                    control.wrap('<form>').closest('form').get(0).reset();
                    control.unwrap();
                }
                $('body').pagecontainer('change', '#node?nid=' + data.nid);
            });
        }
    }

    function nodeModifyBuydemand() {
        if ($("#node-modify-buydemand-form").valid()) {
            var nodeTitle = $('#node-modify-buydemand-title').val(),
                nodeBody = $('#node-modify-buydemand-body').val(),
                nodePrice = $('#node-modify-buydemand-price').val(),
                nodeCount = $('#node-modify-buydemand-prodcount').val(),
                nodePhone = $('#node-modify-buydemand-linkphone').val(),
                nid = $('#node-modify-buydemand-nid').val(),
                data = {
                    'node[type]': 'buydemand',
                    'node[title]': nodeTitle,
                    'node[body][und][0][value]': nodeBody,
                    //'node[field_demandstatus][und]': 37,
                    'node[field_price][und][0][amount]': nodePrice,
                    'node[field_prodcount][und][0][value]': nodeCount,
                    //'node[language]': 'und',
                    'node[field_linkphone][und][0][value]': nodePhone,
                };
            for (var index in buydemandmodifytaxonomy) {
                var v = buydemandmodifytaxonomy[index];
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

            services.NodeEdit(nid, data, function(data) {
                console.log('成功修改买：' + nid);
                $('#node-modify-buydemand-title').val('');
                $('#node-modify-buydemand-body').val('');
                $('#node-modify-buydemand-price').val('');
                $('#node-modify-buydemand-prodcount').val('');
                $('#node-modify-buydemand-linkphone').val('');
                $("#node-modify-buydemand-button").button().text('请选择规格(*)');
                $("#node-modify-buydemand-button").button().button('refresh');
                for (var index in buydemandtaxonomy) {
                    var v = buydemandtaxonomy[index];
                    if (v && v.vid) {
                        for (var index in nodes) {
                            var term = nodes[index].node;
                            if (term.vid == v.vid) {
                                var chk = document.getElementById(v.id + '-' + term.tid);
                                if (chk.checked) {
                                    $("#" + v.id + '-' + term.tid).prop("checked", false).checkboxradio("refresh");
                                }
                            }
                        }
                    }
                }
                imagefiles = [];
                var buydemandFileDisplayArea = document.getElementById('buydemandFileDisplayArea');
                buydemandFileDisplayArea.innerHTML = '';
                if (typeof cordova == 'undefined') {
                    var control = $("#node-modify-buydemand-upload");
                    control.wrap('<form>').closest('form').get(0).reset();
                    control.unwrap();
                }
                $('body').pagecontainer('change', '#node?nid=' + nid);
            });
        }
    }

    /**
     * 创建其他需求
     */
    function nodeCreateArticle() {
        if ($("#node-create-article-form").valid()) {
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
    }

    function nodeModifyArticle() {
        if ($("#node-modify-article-form").valid()) {
            var nodeTitle = $('#node-modify-article-title').val(),
                nodeBody = $('#node-modify-article-body').val(),
                nodePhone = $('#node-modify-article-linkphone').val(),
                nid = $('#node-modify-article-nid').val(),
                data = {
                    'node[type]': 'article',
                    'node[title]': nodeTitle,
                    'node[body][und][0][value]': nodeBody,
                    'node[field_demandstatus][und]': 37,
                    'node[language]': 'und',
                    'node[field_linkphone][und][0][value]': nodePhone,
                };
            services.NodeEdit(nid, data, function(data) {
                console.log('成功修改其他需求:' + nid);
                $('#node-modify-article-title').val('');
                $('#node-modify-article-body').val('');
                $('#node-modify-article-linkphone').val('');
                $('body').pagecontainer('change', '#node?nid=' + nid);
            });
        }
    }

    /**
     * 创建用工信息
     */
    function nodeCreateEmployment() {
        if ($("#node-create-employment-form").valid()) {
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
    }

    function nodeModifyEmployment() {
        if ($("#node-modify-employment-form").valid()) {
            var nodeTitle = $('#node-modify-employment-title').val(),
                nodeBody = $('#node-modify-employment-body').val(),
                nodePhone = $('#node-modify-employment-linkphone').val(),
                nid = $('#node-modify-employment-nid').val(),
                user = getStorageUser(),
                data = {
                    'node[type]': 'employment',
                    'node[title]': nodeTitle,
                    'node[body][und][0][value]': nodeBody,
                    //'node[field_demandstatus][und]': 37,
                    //'node[language]': 'und',
                    'node[uid]': user.uid,
                    'node[field_linkphone][und][0][value]': nodePhone,
                };
            services.NodeEdit(nid, data, function(data) {
                console.log('成功修改用工信息：' + nid);
                $('#node-modify-employment-title').val('');
                $('#node-modify-employment-body').val('');
                $('#node-modify-employment-linkphone').val('');
                $('body').pagecontainer('change', '#node?nid=' + nid);
            });
        }
    }

    /**
     * 创建物流信息
     */
    function nodeCreateLogistics() {
        if ($("#node-create-logistics-form").valid()) {
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
    }

    function nodeModifyLogistics() {
        if ($("#node-modify-logistics-form").valid()) {
            var nodeTitle = $('#node-modify-logistics-title').val(),
                nodeBody = $('#node-modify-logistics-body').val(),
                nodePhone = $('#node-modify-logistics-linkphone').val(),
                nid = $('#node-modify-logistics-nid').val(),
                data = {
                    'node[type]': 'logistics',
                    'node[title]': nodeTitle,
                    'node[body][und][0][value]': nodeBody,
                    'node[field_demandstatus][und]': 37,
                    'node[language]': 'und',
                    'node[field_linkphone][und][0][value]': nodePhone,
                };
            services.NodeEdit(nid, data, function(data) {
                console.log('成功修改物流信息：' + nid);
                $('#node-modify-logistics-title').val('');
                $('#node-modify-logistics-body').val('');
                $('#node-modify-logistics-linkphone').val('');
                $('body').pagecontainer('change', '#node?nid=' + nid);
            });
        }
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


    function userLogin() {
        var loginData = {
            'username': $('#user-login-name').val(),
            'password': $('#user-login-password').val()
        };
        login(loginData);
    }

    function setCookie(name, value, expires, path, domain, secure) {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + expires);
        document.cookie = name + "=" + escape(value) +
            ((expires) ? "; expires=" + exdate.toGMTString() : "") +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
    }
    // utility function called by getCookie()
    function getCookieVal(offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    }
    // primary function to retrieve cookie by name
    function getCookie(name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return getCookieVal(j);
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) break;
        }
        return null;
    }
    // remove the cookie by setting ancient expiration date
    function deleteCookie(name, path, domain) {    
        if (getCookie(name)) {        
            document.cookie = name + "=" +       
            ((path) ? "; path=" + path : "") +       
            ((domain) ? "; domain=" + domain : "") +       
            "; expires=Thu, 01-Jan-1970 00:00:01 GMT";     
        }
    }

    function login(loginData) {
        services.CurrentUser(function(data) {
            var uid = data.user.uid;
            if (uid === "0") {
                services.UserLogin(loginData, function(result) {
                    setStorageUser(result);
                    setCookie('duoshuo_token', result.jwt,30);
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
                confirm_code = $('#user-register-validatecode').val(),
                realname = $('#user-register-realname').val(),
                province = $('#user-register-province').val(),
                city = $('#user-register-city').val(),
                county = $('#user-register-county').val();

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
                'field_realname[und][0][value]': realname,
                'field_area[und][0][province]': province,
                'field_area[und][0][city]': city,
                'field_area[und][0][county]': county
            };
            services.UserRegister(data, function(data) {
                //setStorageUser(data);
                //$('body').pagecontainer('change', '#user-login');
                var loginData = {
                    'username': phone,
                    'password': userPassword
                };
                login(loginData);
            }, function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseJSON['form_errors']['name']);
            });
        }
    }
    // 点击 登录 按钮时执行 userLogin()
    function getStorage(id) {
        var data = false;
        var tmp = localStorage.getItem(id);
        //if (localStorage.user) {
        if (tmp) {
            //user = JSON.parse(localStorage.user);
            data = JSON.parse(tmp);
        }
        return data;
    }

    function setStorage(id, data) {
        if (window.localStorage) {
            try {
                localStorage.setItem(id, JSON.stringify(data));
            } catch (error) {
                base.ErrorDialog('HTML5', '请关闭无痕浏览', error);
            }
        } else {
            base.ErrorDialog('HTML5', 'HTML5问题', '请使用支持HTML5机子!');
        }
    }

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
                var field_nickname = '';
                if (data.user.field_nickname['und']) {
                    field_nickname = data.user.field_nickname['und'][0]['safe_value']
                }
                var user = {
                    'uid': data.user.uid,
                    'name': data.user.name,
                    'field_nickname': field_nickname,
                    'picture': picture,
                    'created': data.user.created,
                    'jwt': data.jwt
                };
                localStorage.setItem('user', JSON.stringify(user));
            } catch (error) {
                base.ErrorDialog('HTML5', '请关闭无痕浏览', error);
            }
        } else {
            base.ErrorDialog('HTML5', 'HTML5问题', '请使用支持HTML5机子!');
        }
    }
    /**
     * 请求当前登录的用户相关信息
     */
    function getStorageUser() {
        return getStorage('user');
    }

    function setStorageNode(data) {
        setStorage('node', data);
    }

    function getStorageNode() {
        return getStorage("node");
    }

    function setStorageProduct(data) {
        setStorage('product', data);
    }

    function getStorageProduct() {
        return getStorage("product");
    }

    function getCurrentUser() {
        var user = getStorageUser();
        if (user) {
            var list = document.getElementById('user-profile-detail');
            list.innerHTML = '';
            //userName = localStorage.user.name;
            //userCreated = new Date(localStorage.user.created * 1000);
            var imgUrl = 'img/portrait.jpg';
            if (user.picture) {
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
                // switch (nodes[i].node.type) {
                //     case 'buydemand':
                //         var imgurl = base.default_img_path;
                //         if (nodes[i].node.field_images.src) {
                //             imgurl = nodes[i].node.field_images.src;
                //         }
                //         list.innerHTML +=
                //             '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //             '<image src="' + imgurl + '"/>' +
                //             '<h3>' + nodes[i].node.title + '</h3>' +
                //             '<p>' + nodes[i].node.body + '</p>' +
                //             '<p class="ui-li-aside">' + nodes[i].node.field_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                //             '</a></li>';
                //         break;
                //     case 'product':
                //         var imgurl = base.default_img_path;
                //         if (nodes[i].node.field_product_images.src) {
                //             imgurl = nodes[i].node.field_product_images.src;
                //         }
                //         list.innerHTML +=
                //             '<li><a href="#node-product?nid=' + nodes[i].node.nid + '">' +
                //             '<image src="' + imgurl + '"/>' +
                //             '<h3>' + nodes[i].node.title + '</h3>' +
                //             '<p>' + nodes[i].node.body + '</p>' +
                //             //'<p class="ui-li-aside">' + nodes[i].node.commerce_price + '</p>' +
                //             '<p class="ui-li-aside">' + nodes[i].node.commerce_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                //             '</a></li>';
                //         break;
                //     default:
                //         list.innerHTML +=
                //             '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //             //'<image src="' + imgurl + '"/>' +
                //             '<h3>' + nodes[i].node.title + '</h3>' +
                //             '<p>' + nodes[i].node.body + '</p>' +
                //             '</a></li>';
                //         break;
                // }
                getNodeListItemHtml(list, nodes[i].node);
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

    function userUpdate() {
        var user = getStorageUser();
        var realname = $('#user-setting-realname').val(),
            province = $('#user-setting-province').val(),
            city = $('#user-setting-city').val(),
            county = $('#user-setting-county').val();
        var data = {
            'field_nickname[und][0][value]': $('#user-setting-nickname').val(),
            'mail': $('#user-setting-email').val(),
            //{'picture':data.fid}
            'current_pass': $('#user-setting-password').val(),
            'pass': $('#user-setting-newpassword').val(),
            'field_realname[und][0][value]': realname,
            'field_area[und][0][province]': province,
            'field_area[und][0][city]': city,
            'field_area[und][0][county]': county
        };
        services.UserUpdate(user.uid, data, function(result) {
            var user = getStorageUser();
            user['field_nickname'] = $('#user-setting-nickname').val();
            user.jwt = result.jwt;
            //deleteCookie('duoshuo_token');
            setCookie('duoshuo_token', result.jwt,30);
            localStorage.setItem('user', JSON.stringify(user));
            base.ErrorDialog('设置', '修改完成', '');
        });
    }

    function userUpdatePassword(uid) {
        var data = {
            //'name':$('#user-newpassword-phone').val(),
            'pass': $('#user-newpassword-password').val(),
            'code': $('#user-newpassword-validatecode').val()
        };
        services.newpasswordreset(uid, data, function(result) {
            if (result && result[0]) {
                //base.ErrorDialog('修改密码','修改完成','');
                $("#user-newpassword-submit").button().button("disable");
                $("#user-newpassword-submit").button().button('refresh');
                $('#user-newpassword-uid').val('');
                $('#user-newpassword-password').val('');
                $('#user-newpassword-validatepassword').val('');
                $('#user-newpassword-validatecode').val('');
                $('body').pagecontainer('change', '#user-login');
            } else {
                base.ErrorDialog('修改密码', '验证码错误', '');
            }
        });
    }

    function loadSetting(uid) {
        services.List('app_user_address', uid, function(data) {
            console.log(data);
            var i,
                nodes = data.nodes,
                list = document.getElementById('address-list-info');
            //list.innerHTML = '';
            var html = '';
            for (i = 0; i < nodes.length; i += 1) {
                // var status = '<image src="jqm/images/icons-png/check-black.png"/>';
                // if(nodes[i].node.status == "否"){
                //    status = '<image src="jqm/images/icons-png/delete-black.png"/>';
                // }
                var defaultStr = "";
                if (nodes[i].node.profile_id == nodes[i].node.addressbook_profile_id) {
                    defaultStr = "[默认]";
                }
                var province = '';
                var city = '';
                var region = '';
                $.each(china_province, function(index, item) {
                    if (item.region_type == '1') {
                        if (item.region_id == nodes[i].node.commerce_customer_address_administrative_area) {
                            province = item.region_name;
                        }
                    }
                    if (item.region_type == '2' && item.parent_id == nodes[i].node.commerce_customer_address_administrative_area) {
                        if (item.region_id == nodes[i].node.commerce_customer_address_locality) {
                            city = item.region_name;
                        }
                    }
                    if (item.region_type == '3' && item.parent_id == nodes[i].node.commerce_customer_address_locality) {
                        if (item.region_id == nodes[i].node.commerce_customer_address_dependent_locality) {
                            region = item.region_name;
                        }
                    }
                });
                html +=
                    '<li><a href="#address-edit?aid=' +
                    nodes[i].node.profile_id + '"">' +
                    '<h2>' + nodes[i].node.commerce_customer_address_name_line + '</h2>' +         
                    '<p>' + defaultStr +
                    //nodes[i].node.commerce_customer_address_administrative_area +
                    //nodes[i].node.commerce_customer_address_locality +
                    //nodes[i].node.commerce_customer_address_dependent_locality +
                    province + city + region +
                    nodes[i].node.commerce_customer_address_thoroughfare + '</p>' +
                    '<p>' + nodes[i].node.created + '</p>' +
                    //'<p>' +nodes[i].node.commerce_customer_address_postal_code + '</p>' +
                    //status+
                    '<p class="ui-li-aside">' + nodes[i].node.commerce_customer_address_linkphone + '</p>';
                '</a></li>';
            }
            html += '<li><a href="#address-edit?aid=0"><h2></h2><p></p><p class="ui-li-aside">添加</p></a></li>';
            list.innerHTML = html;
            // 刷新列表视图
            $('#address-list-info').listview('refresh');
        });
        services.User(uid, function(data) {
            if (data['field_nickname']['und']) {
                $('#user-setting-nickname').val(data['field_nickname']['und'][0]['safe_value']);
            }
            $('#user-setting-email').val(data['mail']);
            if (data['field_realname']['und']) {
                $('#user-setting-realname').val(data['field_realname']['und'][0]['safe_value']);
            }
            var province = '30';
            var city = '367';
            var county = '3100';
            if (data['field_area']['und'][0]['province']) {
                province = data['field_area']['und'][0]['province']
            }
            if (data['field_area']['und'][0]['city']) {
                city = data['field_area']['und'][0]['city']
            }
            if (data['field_area']['und'][0]['county']) {
                county = data['field_area']['und'][0]['county']
            }
            $.each(china_province, function(index, item) {
                var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                if (item.region_type == '1') {
                    $('#user-setting-province').append(option);
                }
                if (item.region_type == '2' && item.parent_id == province) {
                    $('#user-setting-city').append(option);
                }
                if (item.region_type == '3' && item.parent_id == city) {
                    $('#user-setting-county').append(option);
                }
            });
            $('#user-setting-province').val(province);
            $('#user-setting-city').val(city);
            $('#user-setting-county').val(county);

            $('#user-setting-province').selectmenu('refresh', true);
            $('#user-setting-city').selectmenu('refresh', true);
            $('#user-setting-county').selectmenu('refresh', true);

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
        //$('#address-edit-default').button().button('disable');
        if (aid == "0") {
            $.each(china_province, function(index, item) {
                var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                if (item.region_type == '1') {
                    $('#commerce_customer_address_administrative_area').append(option);
                }
                if (item.region_type == '2' && item.parent_id == '30') {
                    $('#commerce_customer_address_locality').append(option);
                }
                if (item.region_type == '3' && item.parent_id == '367') {
                    $('#commerce_customer_address_dependent_locality').append(option);
                }
            });

            $('#commerce_customer_address_profile_id').val('0');
            $('#commerce_customer_address_administrative_area').val('30');
            $('#commerce_customer_address_locality').val('367');
            $('#commerce_customer_address_dependent_locality').val('3100');

            $('#commerce_customer_address_administrative_area').selectmenu('refresh', true);
            $('#commerce_customer_address_locality').selectmenu('refresh', true);
            $('#commerce_customer_address_dependent_locality').selectmenu('refresh', true);

            $('#commerce_customer_address_thoroughfare').val('');
            $('#commerce_customer_address_name_line').val('');
            $('#commerce_customer_address_linkphone').val('');
            $('#commerce_customer_address_postal_code').val('');
        } else {
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
                if (data.addressbook_profile_id == "0") {
                    $('#commerce_customer_address_default').prop("checked", false).checkboxradio("refresh");
                } else {
                    $('#commerce_customer_address_default').prop("checked", true).checkboxradio("refresh");
                }
            });
        }
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
                                '<a onclick="index.lineItemUpdate(' + line_item_id + ')" class="ui-link" href="javascript:void(0);">更新</a></p>' +
                                '<label for="commerce_cart_line_item_quantity_' + line_item_id +
                                '">数量</label>' +
                                '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">' +
                                '<input type="number" id="commerce_cart_line_item_quantity_' + line_item_id +
                                '" value="' + line_item.quantity +
                                '" min="1" step="1"></div>' +
                                '<p><a onclick="index.lineItemDelete(' + line_item_id + ')" class="ui-link" href="javascript:void(0);">删除</a></p>' +
                                '</li>';
                        });
                        html += '</ul>';
                        html += '<h3 class="ui-bar ui-bar-a ui-corner-all">总计:' + order.commerce_order_total_formatted + '</h3>';
                        html += '<a id="" href="javascript:void(0);" onclick="index.checkout(' + order_id + ');" data-role="button">结帐</a>';
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
    my.addToCart = function() {

        if (isNodeClose()) {
            base.ErrorDialog('', '需求已关闭，不能交易', '');
            return false;
        }
        var product = getStorageProduct();
        if (product) {
            var productid = product.product_id;
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
        if (user) {
            var data = {
                'flag_name': 'bookmarks',
                'entity_id': nid,
                'uid': user.uid,
            };
            services.isflag(data, function(result) {
                updateFlagCss(result, bid);
            });
        } else {
            updateFlagCss([false], bid);
        }
    }

    function flag(nid, bid) {
        //nid = 453;
        if (isNodeClose()) {
            base.ErrorDialog('', '需求已关闭，不能收藏', '');
            return false;
        }
        var user = getStorageUser();
        if (user) {
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
        } else {
            updateFlagCss([false], bid);
            base.ErrorDialog('', '请登录', '');
        }
    }
    my.modifyNode = function() {
        var node = getStorageNode();
        if (node) {
            imagefiles = [];
            detailImageFiles = [];
            switch (node.type) {
                case 'article':
                    $('body').pagecontainer('change', '#node-modify-article?nid=' + node.nid);
                    break;
                case 'product':
                    $('body').pagecontainer('change', '#node-modify-product?nid=' + node.nid);
                    break;
                case 'buydemand':
                    $('body').pagecontainer('change', '#node-modify-buydemand?nid=' + node.nid);
                    break;
                case 'employment':
                    $('body').pagecontainer('change', '#node-modify-employment?nid=' + node.nid);
                    break;
                case 'logistics':
                    $('body').pagecontainer('change', '#node-modify-logistics?nid=' + node.nid);
                    break;
            }
        }
    };
    my.toggleDuoshuoComments = function(containerid) {
        var node = getStorageNode();
        if (node) {
            var el = document.createElement('div');
            el.setAttribute('data-thread-key', node.nid);
            el.setAttribute('data-title', node.title)
            el.setAttribute('data-url', 'http://www.hzs168.com/app/index.html#node?nid=' + node.nid);
            el.setAttribute('data-author-key', node.uid);
            DUOSHUO.EmbedThread(el);
            var txt = $(event.target).text();
            if(txt=='展开评论'){
                $(containerid).append(el);
                $(event.target).text('收起评论');
            }else{
                $(containerid).html('');
                $(event.target).text('展开评论');
            }
        }
    };

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
                    setStorageNode({
                        'nid': node.nid,
                        'uid': node.uid,
                        'name': node.name,
                        'created': node.created,
                        'field_demandstatus': node.field_demandstatus,
                        'type': node.type,
                        'title': node.title
                    });
                    var html = '';
                    var user = getStorageUser();
                    var html2 = '';
                    var nodehtml = '<div data-role="navbar" data-tap-toggle="false"><ul>' +
                        '<li><a id="node-flag" onclick="index.nodeFlag()" href="javascript:void(0);" data-icon="bookmark" class="">收藏</a></li>' +
                        '<li><a href="#popupnodemessage" data-rel="popup" data-position-to="window" data-icon="message" data-transition="slideup">发消息</a></li>' +
                        '</ul></div>';
                    if (user && user.uid === node.uid) {
                        //显示关闭与撤销
                        html2 += '<div data-role="controlgroup" data-type="horizontal">';
                        //var created = new Date(node.created);
                        var curDate = new Date();
                        var s = node.created;
                        var created = new Date(Date.parse(s.replace(/-/g, "/")));
                        var result = Math.round(curDate - created) / (1000 * 60);
                        if (result < 30) {
                            html2 += '<button class="ui-btn ui-corner-all ui-btn-a" id="node-cancel" onclick="index.nodeCancel();">撤销</button>';
                        }
                        if (node.field_demandstatus == '进行中') {
                            html2 += '<button class="ui-btn ui-corner-all ui-btn-a" id="node-close" onclick="index.nodeClose();">关闭</button>';
                        }
                        html2 += '</div>';
                        nodehtml = '<div data-role="navbar" data-tap-toggle="false"><ul>' +
                            '<li><a id="node-flag" onclick="index.nodeFlag()" href="javascript:void(0);" data-icon="bookmark" class="">收藏</a></li>' +
                            '<li><a href="javascript:void(0);" onclick="index.modifyNode()" data-icon="modify" class="">修改</a></li>' +
                            '<li><a href="#popupnodemessage" data-rel="popup" data-position-to="window" data-icon="message" data-transition="slideup">发消息</a></li>' +
                            '</ul></div>';
                    }
                    content.innerHTML = '';
                    switch (node.type) {
                        case 'buydemand':
                            html += '<h3>' + node.title + '</h3>';
                            html += '<p><strong>联系电话</strong>:<a href="tel:' + node.field_linkphone + '">' + node.field_linkphone + '</a></p>';
                            html += '<p>' + node.body + '</p>';
                            html += '<p><strong>数量</strong>:' + node.field_prodcount + '(' + node.field_unit + ')</p>';
                            html += '<p><strong>单价</strong>:' + node.field_price + '</p>';
                            html += '<p><strong>直径</strong>:' + node.field_multi_diameter + '</p>';
                            //html += '<p><strong>等级</strong>:' + node.field_multi_level + '</p>';
                            html += '<p><strong>产地</strong>:' + node.field_multi_placeorigin + '</p>';
                            html += '<p><strong>品种</strong>:' + node.field_multi_breed + '</p>';
                            html += '<p><strong>类别</strong>:' + node.field_multi_class + '</p>';
                            html += html2;
                            html += '<a href="javascript:void(0);" data-role="button" onclick="index.toggleDuoshuoComments(\'#comment-box\');">展开评论</a>';
                            html += '<div id="comment-box" ></div>';

                            content.innerHTML = html;
                            isflag(node.nid, 'node-flag');
                            var swiper = new Swiper('#' + slideshowid, {
                                pagination: '#slideshow-node-page',
                                paginationClickable: true,
                                spaceBetween: 0,
                                loop: true,
                                autoplay: 2500,
                                autoplayDisableOnInteraction: true,
                                preloadImages: false,
                                lazyLoading: true,
                            });
                            $('#' + contentid).trigger('create');
                            $('#node-footer').html(nodehtml).trigger('create');
                            //var myScroll = new IScroll('#node-page-main');
                            break;
                        case 'product':
                            html += '<div data-role="tabs">' +     
                                '<div data-role="navbar">' +
                                '<ul><li><a href="#product-one" class="ui-btn-active" data-ajax="false">基本</a></li>' +     '<li><a href="#product-two" data-ajax="false">详情</a></li></ul></div>' +
                                '<div id="product-one"></div><div id="product-two"></div></div>';
                            $('#' + contentid).html(html).trigger('create');
                            services.List('app_product_detail', node.field_product, function(productdata) {
                                $.each(productdata.nodes, function(index, productobject) {
                                    var product = productobject.node;
                                    setStorageProduct({
                                        'product_id': product.product_id
                                    });
                                    var onehtml = '';
                                    onehtml += '<h3>' + node.title + '</h3>';
                                    onehtml += '<p><strong>联系电话</strong>:<a href="tel:' + node.field_linkphone + '">' + node.field_linkphone + '</a></p>';
                                    onehtml += '<p>' + node.body + '</p>';
                                    onehtml += '<p><strong>数量</strong>:' + node.field_prodcount + node.field_unit + '</p>';
                                    onehtml += '<p><strong>单价</strong>:' + product.commerce_price + '</p>';
                                    onehtml += '<p><strong>直径</strong>:' + product.field_diameter + '</p>';
                                    //onehtml += '<p><strong>等级</strong>:' + product.field_level + '</p>';
                                    onehtml += '<p><strong>产地</strong>:' + node.field_placeorigin + '</p>';
                                    onehtml += '<p><strong>品种</strong>:' + node.field_breed + '</p>';
                                    onehtml += '<p><strong>类别</strong>:' + node.field_class + '</p>';
                                    onehtml += html2;
                                    onehtml += '<a href="javascript:void(0);" data-role="button" onclick="index.toggleDuoshuoComments(\'#comment-box-product\');">展开评论</a>';
                                    onehtml += '<div id="comment-box-product" ></div>';
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
                                        pagination: '#slideshow-node-product-page',
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
                            isflag(node.nid, 'node-product-flag');
                            var nodeproducthtml = '<div data-role="navbar" data-tap-toggle="false"><ul data-role="navbar" data-tap-toggle="false">' +
                                '<li><a id="node-product-flag" onclick="index.nodeProductFlag()" href="javascript:void(0);" data-icon="bookmark" class="">收藏</a></li>' +
                                '<li><a href="#popupproductmessage" data-rel="popup" data-position-to="window" data-icon="message" data-transition="slideup">发消息</a></li>' +
                                '<li><a id="addToCart" onclick="index.addToCart()" data-icon="cart" class="">加入购物车</a></li>' +
                                '</ul></div>';
                            if (user && user.uid === node.uid) {
                                nodeproducthtml = '<div data-role="navbar" data-tap-toggle="false"><ul data-role="navbar" data-tap-toggle="false">' +
                                    '<li><a id="node-product-flag" onclick="index.nodeProductFlag()" href="javascript:void(0);" data-icon="bookmark" class="">收藏</a></li>' +
                                    '<li><a href="javascript:void(0);" onclick="index.modifyNode()" data-icon="modify" class="">修改</a></li>' +
                                    '<li><a href="#popupproductmessage" data-rel="popup" data-position-to="window" data-icon="message" data-transition="slideup">发消息</a></li>' +
                                    '<li><a id="addToCart" onclick="index.addToCart()" data-icon="cart" class="">加入购物车</a></li>' +
                                    '</ul></div>';
                            }
                            $('#node-product-footer').html(nodeproducthtml).trigger('create');
                            break;
                        case 'article':
                        case 'employment':
                        case 'logistics':
                        case 'association':
                            html += '<h3>' + node.title + '</h3>';
                            html += '<p><strong>联系电话</strong>:' + node.field_linkphone + '</p>';
                            html += '<p>' + node.body + '</p>';
                            html += html2;
                            html += '<a href="javascript:void(0);" data-role="button" onclick="index.toggleDuoshuoComments(\'#comment-box-other\');">展开评论</a>';
                            html += '<div id="comment-box-other" ></div>';
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
                            $('#'+contentid).trigger('create');
                            $('#node-footer').html(nodehtml).trigger('create');
                            break;
                        case 'news':
                            html += '<h3>' + node.title + '</h3>';
                            // html += '<p><strong>联系电话</strong>:' + node.field_linkphone + '</p>';
                            html += '<p>' + node.body + '</p>';
                            html += html2;
                            html += '<a href="javascript:void(0);" data-role="button" onclick="index.toggleDuoshuoComments(\'#comment-box-news\');">展开评论</a>';
                            html += '<div id="comment-box-news" ></div>';
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
                            $('#'+contentid).trigger('create');
                            $('#node-footer').html(nodehtml).trigger('create');
                            break;
                    }
                });
            }
        });
    }

    function loadNode(nid) {
        services.Node(nid, function(data) {
            switch (data.type) {
                case 'article':
                    $('#node-modify-article-nid').val(data.nid);
                    $('#node-modify-article-title').val(data.title);
                    $('#node-modify-article-linkphone').val(data['field_linkphone']['und'][0]['safe_value']);
                    $('#node-modify-article-body').val(data['body']['und'][0]['safe_value']);
                    break;
                case 'product':
                    $('#node-modify-product-nid').val(data.nid);
                    $('#node-modify-product-title').val(data.title);
                    if (data['field_linkphone']['und']) {
                        $('#node-modify-product-linkphone').val(data['field_linkphone']['und'][0]['safe_value']);
                    }
                    if (data['body']['und']) {
                        $('#node-modify-product-body').val(data['body']['und'][0]['safe_value']);
                    }
                    $('#node-modify-product-prodcount').val(data['field_prodcount']['und'][0]['value']);
                    $('#field_placeorigin_modify-' + data['field_placeorigin']['und'][0]['tid']).prop("checked", true).checkboxradio("refresh");
                    $('#field_unit_product_modify-' + data['field_unit']['und'][0]['tid']).prop("checked", true).checkboxradio("refresh");
                    $('#field_breed_modify-' + data['field_breed']['und'][0]['tid']).prop("checked", true).checkboxradio("refresh");
                    $('#field_class_modify-' + data['field_class']['und'][0]['tid']).prop("checked", true).checkboxradio("refresh");
                    var pid = data['field_product']['und'][0]['product_id'];
                    detailImageFiles = [];
                    if (data['field_detailimages']['und']) {
                        var fileDisplayArea = document.getElementById('modifyproductDetailImageFileDisplayArea');
                        var fileDisplayAreaHtml = '';
                        $.each(data['field_detailimages']['und'], function(idx, item) {
                            detailImageFiles.push({
                                'fid': item.fid
                            });

                            var imgurl = 'http://www.hzs168.com/sites/default/files/' + item.uri.replace('public://', '');


                            fileDisplayAreaHtml += '<image src="' + imgurl + '" width="100px"/>';

                            $('#modifyproductDetailImageFileDisplayArea').trigger('create');
                        });
                        fileDisplayArea.innerHTML = fileDisplayAreaHtml;
                    }
                    services.Product(pid, function(pdata) {
                        var price = pdata['commerce_price']['amount'];
                        $('#node-modify-product-price').val(parseFloat(price) / 100.0);
                        $('#field_diameter_modify-' + pdata['field_diameter']).prop("checked", true).checkboxradio("refresh");
                        imagefiles = [];
                        var fileDisplayArea = document.getElementById('modifyproductFileDisplayArea');
                        var fileDisplayAreaHtml = '';
                        $.each(pdata['field_images'], function(idx, item) {
                            imagefiles.push({
                                'fid': item.fid
                            });

                            var imgurl = 'http://www.hzs168.com/sites/default/files/' + item.uri.replace('public://', ''); //pdata['field_images_url'][idx];

                            fileDisplayAreaHtml += '<image src="' + imgurl + '" width="100px"/>';

                            $('#modifyproductFileDisplayArea').trigger('create');
                        });
                        fileDisplayArea.innerHTML = fileDisplayAreaHtml;
                    });
                    break;
                case 'buydemand':
                    $('#node-modify-buydemand-nid').val(data.nid);
                    $('#node-modify-buydemand-title').val(data.title);
                    $('#node-modify-buydemand-linkphone').val(data['field_linkphone']['und'][0]['safe_value']);
                    $('#node-modify-buydemand-body').val(data['body']['und'][0]['safe_value']);
                    $('#node-modify-buydemand-prodcount').val(data['field_prodcount']['und'][0]['value']);

                    var price = data['field_price']['und'][0]['amount'];
                    $('#node-modify-buydemand-price').val(parseFloat(price) / 100.0);
                    if (data['field_unit']['und']) {
                        $('#field_unit_buydemand_modify-' + data['field_unit']['und'][0]['tid']).prop("checked", true).checkboxradio("refresh");
                    }
                    if (data['field_multi_breed']['und']) {
                        $.each(data['field_multi_breed']['und'], function(idx, item) {
                            $('#field_multi_breed_modify-' + item.tid).prop("checked", true).checkboxradio("refresh");
                        });
                    }
                    if (data['field_multi_class']['und']) {
                        $.each(data['field_multi_class']['und'], function(idx, item) {
                            $('#field_multi_class_modify-' + item.tid).prop("checked", true).checkboxradio("refresh");
                        });
                    }
                    if (data['field_multi_diameter']['und']) {
                        $.each(data['field_multi_diameter']['und'], function(idx, item) {
                            $('#field_multi_diameter_modify-' + item.tid).prop("checked", true).checkboxradio("refresh");
                        });
                    }
                    // $.each(data['field_multi_level']['und'],function(idx,item){
                    //     $('#field_multi_level_modify-'+item.tid).prop("checked", true).checkboxradio("refresh");
                    // });
                    if (data['field_multi_placeorigin']['und']) {
                        $.each(data['field_multi_placeorigin']['und'], function(idx, item) {
                            $('#field_multi_placeorigin_modify-' + item.tid).prop("checked", true).checkboxradio("refresh");
                        });
                    }
                    imagefiles = [];
                    $.each(data['field_images']['und'], function(idx, item) {
                        imagefiles.push({
                            'fid': item.fid
                        });

                        var imgurl = 'http://www.hzs168.com/sites/default/files/' + item.filename;
                        var fileDisplayArea = document.getElementById('modifybuydemandFileDisplayArea');
                        fileDisplayArea.innerHTML += '<image src="' + imgurl + '" width="100px"/>';

                        $('#modifybuydemandFileDisplayArea').trigger('create');
                    });

                    break;
                case 'employment':
                    $('#node-modify-employment-nid').val(data.nid);
                    $('#node-modify-employment-title').val(data.title);
                    $('#node-modify-employment-linkphone').val(data['field_linkphone']['und'][0]['safe_value']);
                    $('#node-modify-employment-body').val(data['body']['und'][0]['safe_value']);
                    break;
                case 'logistics':
                    $('#node-modify-logistics-nid').val(data.nid);
                    $('#node-modify-logistics-title').val(data.title);
                    $('#node-modify-logistics-linkphone').val(data['field_linkphone']['und'][0]['safe_value']);
                    $('#node-modify-logistics-body').val(data['body']['und'][0]['safe_value']);
                    break;
            }
        });
    }

    function displayMessage(threadid) {
        services.Message(threadid, function(data) {
            var list = document.getElementById('messagebody-list');
            var html =
                '<li>' +
                '<h3>' + data.subject + '</h3>' +
                '<input type="hidden" id="messagebody-list-thread-id" value="' + data.thread_id + '"/>' +
                '</li>';
            for (var i = 0; i < data.messages.length; i++) {
                var msg = data.messages[i];
                var imgurl = "img/portrait.jpg";
                if (msg.author.picture) {
                    imgurl = msg.picture;
                }
                html +=
                    '<li>' +
                    '<image src="' + imgurl + '"/>' +
                    '<h3>' + msg.field_nickname + '</h3>' +
                    '<p>' + msg.body + '</p>' +
                    '<p>' + msg.created + '</p>' +
                    '</li>';
            };

            list.innerHTML = html;
            $('#messagebody-list').listview('refresh');
        });
    }

    function isNodeClose() {
        var demandstatus = $('#node-field-demandstatus').val();
        if (demandstatus === '关闭') {
            return true;
        }
        return false;
    }

    function postMessage() {
        var msgbody = $('#popupmessage-body').val().trim();
        var thread_id = $('#messagebody-list-thread-id').val();
        if (msgbody) {
            var data = {
                'body': msgbody,
                'thread_id': thread_id
            };
            services.PostMessage(data, function(result) {
                if (result && result[0]) {
                    $('#popupmessage').popup().popup('close');
                    $('#popupmessage-body').val('');
                    displayMessage(thread_id);
                }
            });
        }
    }

    function postProductMessage() {
        if (isNodeClose()) {
            base.ErrorDialog('', '需求已关闭，不能发消息', '');
            return false;
        }
        var user = getStorageUser(),
            node = getStorageNode();
        if (user && node) {
            var msgbody = $('#popupproductmessage-body').val().trim();
            var msgsubject = user.field_nickname + '(' + user.name + ')' + ' 发送 ' + getCurDateString(); //$('#popupproductmessage-subject').val().trim();
            var recipients = node.name;
            if (msgbody) {
                var data = {
                    'subject': msgsubject,
                    'body': msgbody,
                    'recipients': recipients
                };
                services.PostMessage(data, function(result) {
                    if (result && result.thread_id) {
                        $('#popupproductmessage').popup().popup('close');
                        $('#popupproductmessage-body').val('');
                        $('#popupproductmessage-subject').val('');
                    }
                });
            }
        } else {
            base.ErrorDialog('', '请登录', '');
        }
    }

    function getCurDateString() {
        var curDate = new Date();
        return curDate.getFullYear() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getDate() + ' ' + (curDate.getHours() + 1) + ':' + (curDate.getMinutes() + 1) + ':' + (curDate.getSeconds() + 1);
    }

    function postNodeMessage() {
        if (isNodeClose()) {
            base.ErrorDialog('', '需求已关闭，不能发消息', '');
            return false;
        }
        var user = getStorageUser();
        if (user) {
            var msgbody = $('#popupnodemessage-body').val().trim();
            var msgsubject = user.field_nickname + '(' + user.name + ')' + ' 发送 ' + getCurDateString(); //$('#popupnodemessage-subject').val().trim();
            var recipients = $('#node-user-name').val();
            if (msgbody) {
                var data = {
                    'subject': msgsubject,
                    'body': msgbody,
                    'recipients': recipients
                };
                services.PostMessage(data, function(result) {
                    if (result && result.thread_id) {
                        $('#popupnodemessage').popup().popup('close');
                        $('#popupnodemessage-body').val('');
                        $('#popupnodemessage-subject').val('');
                    }
                });
            }
        } else {
            base.ErrorDialog('', '请登录', '');
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
    function getNodeListItemHtml(nodeListInfo, node) {

        switch (node.type) {
            case 'buydemand':
                var imgurl = base.default_img_path;
                if (node.field_images.src) {
                    imgurl = node.field_images.src;
                }
                nodeListInfo.innerHTML +=
                    '<li><a href="#node?nid=' + node.nid + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<p><strong>买</strong>:' + node.title + '</p>' +
                    '<p><strong>' + node.field_price + '</strong>(' + node.field_prodcount + node.field_unit + ')' + '</p>' +
                    '<p>' + node.body + '</p>' +
                    '<p><strong>发布于</strong>:' + node.created + '</p>' +
                    '</a></li>';
                break;
            case 'product':
                var imgurl = base.default_img_path;
                if (node.field_product_images.src) {
                    imgurl = node.field_product_images.src;
                }
                nodeListInfo.innerHTML +=
                    '<li><a href="#node-product?nid=' + node.nid + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<p><strong>卖</strong>:' + node.title + '</p>' +
                    '<p><strong>' + node.commerce_price + '</strong>(' + node.field_prodcount + node.field_unit + ')' + '</p>' +
                    '<p>' + node.body + '</p>' +
                    '<p><strong>发布于</strong>:' + node.created + '</p>' +
                    '</a></li>';
                break;
            case 'association':
                var imgurl = base.default_img_path;
                if (node.field_newsimages.src) {
                    imgurl = node.field_newsimages.src;
                }
                nodeListInfo.innerHTML +=
                    '<li><a href="#node?nid=' + node.nid + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<p><strong>' + node.title + '</strong></p>' +
                    '<p>' + node.body + '</p>' +
                    '<p><strong>发布于</strong>:' + node.created + '</p>' +
                    '</a></li>';
                break;
            case 'logistics':
                nodeListInfo.innerHTML +=
                    '<li><a href="#node?nid=' + node.nid + '">' +
                    //'<image src="' + imgurl + '"/>' +
                    '<p><strong>物流</strong>:' + node.title + '</p>' +
                    '<p>' + node.body + '</p>' +
                    '<p><strong>发布于</strong>:' + node.created + '</p>' +
                    '</a></li>';
                break;
            case 'employment':
                nodeListInfo.innerHTML +=
                    '<li><a href="#node?nid=' + node.nid + '">' +
                    //'<image src="' + imgurl + '"/>' +
                    '<p><strong>用工</strong>:' + node.title + '</p>' +
                    '<p>' + node.body + '</p>' +
                    '<p><strong>发布于</strong>:' + node.created + '</p>' +
                    '</a></li>';
                break;
            case 'article':
                nodeListInfo.innerHTML +=
                    '<li><a href="#node?nid=' + node.nid + '">' +
                    //'<image src="' + imgurl + '"/>' +
                    '<p><strong>其他需求</strong>:' + node.title + '</p>' +
                    '<p>' + node.body + '</p>' +
                    '<p><strong>发布于</strong>:' + node.created + '</p>' +
                    '</a></li>';
                break;
            default:
                nodeListInfo.innerHTML +=
                    '<li><a href="#node?nid=' + node.nid + '">' +
                    //'<image src="' + imgurl + '"/>' +
                    '<h3>' + node.title + '</h3>' +
                    '<p>' + node.body + '</p>' +
                    '<p><strong>发布于</strong>:' + node.created + '</p>' +
                    '</a></li>';
                break;
        }
    }

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
                getNodeListItemHtml(nodeListInfo, nodes[i].node);
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
                // switch (nodes[i].node.type) {
                //     case 'buydemand':
                //         var imgurl = base.default_img_path;
                //         if (nodes[i].node.field_images.src) {
                //             imgurl = nodes[i].node.field_images.src;
                //         }
                //         nodeListInfo.innerHTML +=
                //             '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //             '<image src="' + imgurl + '"/>' +
                //             '<p><strong>买</strong>:' + nodes[i].node.title + '</p>' +
                //             '<p>' + nodes[i].node.body + '</p>' +
                //             '<p><strong>' + nodes[i].node.field_price + '</strong>(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                //             '</a></li>';
                //         break;
                //     case 'product':
                //         var imgurl = base.default_img_path;
                //         if (nodes[i].node.field_product_images.src) {
                //             imgurl = nodes[i].node.field_product_images.src;
                //         }
                //         nodeListInfo.innerHTML +=
                //             '<li><a href="#node-product?nid=' + nodes[i].node.nid + '">' +
                //             '<image src="' + imgurl + '"/>' +
                //             '<p><strong>卖</strong>:' + nodes[i].node.title + '</p>' +
                //             '<p>' + nodes[i].node.body + '</p>' +
                //             '<p><strong>' + nodes[i].node.commerce_price + '</strong>(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                //             '</a></li>';
                //         break;
                //     default:
                //         nodeListInfo.innerHTML +=
                //             '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //             //'<image src="' + imgurl + '"/>' +
                //             '<h3>' + nodes[i].node.title + '</h3>' +
                //             '<p>' + nodes[i].node.body + '</p>' +
                //             '</a></li>';
                //         break;
                // }
                getNodeListItemHtml(nodeListInfo, nodes[i].node);
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
                if (msg.author.picture) {
                    imgurl = msg.author.picture;
                }
                //var created = new Date(data.timestamp);
                nodeListInfo.innerHTML +=
                    '<li><a href="#message?threadid=' + msg.thread_id + '">' +
                    '<image src="' + imgurl + '"/>' +
                    '<h3>' + msg.author.field_nickname + '</h3>' +
                    '<p>' + msg.subject + '</p>' +
                    '<p class="ui-li-aside">' + msg.created + '(' + msg.count + ')</p>' +
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
                // nodeListInfo.innerHTML +=
                //     '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //     '<image src="' + imgurl + '"/>' +
                //     '<p><strong>需求</strong>:' + nodes[i].node.title + '</p>' +
                //     '<p>' + nodes[i].node.body + '</p>' +
                //     '</a></li>';
                getNodeListItemHtml(nodeListInfo, nodes[i].node);
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
                // var imgurl = base.default_img_path;
                // if (nodes[i].node.field_images.src) {
                //     imgurl = nodes[i].node.field_images.src;
                // }
                // nodeListInfo.innerHTML +=
                //     '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //     '<image src="' + imgurl + '"/>' +
                //     '<p><strong>需求</strong>:' + nodes[i].node.title + '</p>' +
                //     '<p>' + nodes[i].node.body + '</p>' +
                //     '</a></li>';
                getNodeListItemHtml(nodeListInfo, nodes[i].node);
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
                    getNodeListItemHtml(nodeListInfo, nodes[i].node);
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
                getNodeListItemHtml(nodeListInfo, nodes[i].node);
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
                getNodeListItemHtml(nodeListInfo, nodes[i].node);
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
                nodes = data.nodes;
            for (i = 0; i < nodes.length; i += 1) {
                // var imgurl = base.default_img_path;
                // if (nodes[i].node.field_images.src) {
                //     imgurl = nodes[i].node.field_images.src;
                // }
                // articlelist.innerHTML +=
                //     '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //     '<image src="' + imgurl + '"/>' +
                //     '<p><strong>需求</strong>:' + nodes[i].node.title + '</p>' +
                //     '<p>' + nodes[i].node.body + '</p>' +
                //     '</a></li>';
                getNodeListItemHtml(nodeListInfo, nodes[i].node);
            }

            // 刷新列表视图
            $('#article-list').listview('refresh');
        });
    }

    my.loadFrontPage = function(){
        loadSlideshow();
        loadRecommendStoreList();
        loadRecommendList();
    };

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
            var swiper = new Swiper('#front-slideshow', {
                pagination: '#front-slideshow-page',
                paginationClickable: true,
                spaceBetween: 0,
                loop: true,
                autoplay: 2500,
                autoplayDisableOnInteraction: true,
                preloadImages: false,
                lazyLoading: true,
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
                storeInfoIntro.innerHTML +=//<a href="javascript:void(0);" class="store-title"></a>
                    '<li>' +
                    '<image src="' + nodes[i].node.field_storelogo.src + '"/>' +
                    '<h3>' + nodes[i].node.title + '</h3>' +
                    '<p>&nbsp;</p>'+
                    '<p>&nbsp;</p>'+
                    '</li>';
                storeInfoDetail.innerHTML += '<p><b>店铺简介：</b>' + nodes[i].node.field_introduction + '</p>';

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
                // switch (nodes[i].node.type) {
                //     case 'buydemand':
                //         var imgurl = base.default_img_path;
                //         if (nodes[i].node.field_images.src) {
                //             imgurl = nodes[i].node.field_images.src;
                //         }
                //         list.innerHTML +=
                //             '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //             '<image src="' + imgurl + '"/>' +
                //             '<h3>' + nodes[i].node.title + '</h3>' +
                //             '<p>' + nodes[i].node.body + '</p>' +
                //             '<p class="ui-li-aside">' + nodes[i].node.field_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                //             '</a></li>';
                //         break;
                //     case 'product':
                //         var imgurl = base.default_img_path;
                //         if (nodes[i].node.field_product_images.src) {
                //             imgurl = nodes[i].node.field_product_images.src;
                //         }
                //         list.innerHTML +=
                //             '<li><a href="#node-product?nid=' + nodes[i].node.nid + '">' +
                //             '<image src="' + imgurl + '"/>' +
                //             '<h3>' + nodes[i].node.title + '</h3>' +
                //             '<p>' + nodes[i].node.body + '</p>' +
                //             '<p class="ui-li-aside">' + nodes[i].node.commerce_price + '(' + nodes[i].node.field_prodcount + nodes[i].node.field_unit + ')' + '</p>' +
                //             '</a></li>';
                //         break;
                //     default:
                //         list.innerHTML +=
                //             '<li><a href="#node?nid=' + nodes[i].node.nid + '">' +
                //             '<h3>' + nodes[i].node.title + '</h3>' +
                //             '<p>' + nodes[i].node.body + '</p>' +
                //             '</a></li>';
                //         break;
                // }
                getNodeListItemHtml(list, nodes[i].node);
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
    // function pullImplementationPage(did, callback) {
    //     //var listSelector = did + " ul.ui-listview",
    //     var   lastItemSelector = did + " .lastElement";

    //     function gotPullDownData(event, data) {
    //         callback(0);
    //         data.iscrollview.refresh();
    //     }

    //     function onPullDown(event, data) {
    //         setTimeout(function fakeRetrieveDataTimeout() {
    //                 gotPullDownData(event, data);
    //             },
    //             0);
    //     }

    //     function gotPullUpData(event, data) {
    //         var iscrollview = data.iscrollview;
    //         callback();

    //         iscrollview.refresh(null, null,
    //             $.proxy(function afterRefreshCallback(iscrollview) {
    //                 this.scrollToElement(lastItemSelector, 400);
    //             }, iscrollview));
    //     }

    //     function onPullUp(event, data) {
    //         setTimeout(function fakeRetrieveDataTimeout() {
    //                 gotPullUpData(event, data);
    //             },
    //             0);
    //     }
    //     $(document).delegate(did, "pageinit",
    //         function bindPullPagePullCallbacks(event) {
    //             $(".iscroll-wrapper", this).bind({
    //                 iscroll_onpulldown: onPullDown,
    //                 iscroll_onpullup: onPullUp
    //             });
    //         });
    // }
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

    function uploadDeviceImage(filename, did, files, height, quality, pictureSourceType) {
        var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        var pzh = 50;
        if (quality) {
            pzh = quality;
        }
        if (pictureSourceType) {
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
        } else {
            settings.targetWidth = 1137;
        }
        navigator.camera.getPicture(function onSuccess(imageData) {

            services.FileUpload(imageData, filename, function(data) {
                files.push({
                    'fid': data.fid
                });
                var fileDisplayArea = document.getElementById(did);
                fileDisplayArea.innerHTML += '<image src="' + "data:image/jpeg;base64," + imageData + '" width="100px"/>';
                $('#' + did).trigger('create');
            });
        }, function onFail(message) {
            console.log('Failed because: ' + message);
        }, settings);
    }
    my.nodeCancel = function() {
        var node = getStorageNode();
        if (node) {
            services.NodeCancel(node.nid, function(result) {
                if (result && result[0]) {
                    $('body').pagecontainer('change', '#front');
                }
            });
        }
    }
    my.nodeClose = function() {
        var nid = $('#node-id').val();
        var node = getStorageNode();
        if (node) {
            var data = {
                'node[field_demandstatus][und]': 38,
            };
            services.NodeEdit(node.nid, data, function(result) {
                if (result) { // && result[0]) {
                    $("#node-close").button().button("disable");
                }
            });
        }
    }
    my.nodeFlag = function() {
        var node = getStorageNode();
        if (node) {
            flag(node.nid, 'node-flag');
        }
    };
    my.nodeProductFlag = function() {
        var node = getStorageNode();
        if (node) {
            flag(node.nid, 'node-product-flag');
        }
    };
    my.init = function() {


        //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        pullImplementation('#node-logistics-list', my.loadNodeLogisticsList);
        pullImplementation('#store-list', my.loadStoreList);
        pullImplementation('#node-list', my.loadNodeList);
        pullImplementation('#buydemand', my.loadBuydemandList);
        pullImplementation('#saledemand', my.loadSaledemandList);
        pullImplementation('#article', my.loadArticleList);
        pullImplementation('#node-employment-list', my.loadNodeEmploymentList);
        pullImplementation('#node-association-list', my.loadNodeAssociationList);
        pullImplementation('#myinfo', my.myinfo);
        pullImplementation('#message-list', my.loadMessageList);
        //pullImplementationPage('#front-page-main', my.loadFrontPage);

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
                '<div data-role="controlgroup" data-type="horizontal">' +
                '<legend>添加图片</legend>' +
                '<button class="ui-btn ui-corner-all ui-btn-a" id="node-create-buydemand-upload-photo">照片图库</button>' +
                '<button class="ui-btn ui-corner-all ui-btn-a  ui-icon-camera" id="node-create-buydemand-upload-camera">拍照</button>' +
                '</div>';
            $('#node-create-buydemand-images').trigger('create');

            var buydemandFileInput = document.getElementById('node-create-buydemand-upload-photo');
            buydemandFileInput.addEventListener('click', function(e) {
                uploadDeviceImage('buydemand-photo.jpg', 'buydemandFileDisplayArea', imagefiles, 300, 50, Camera.PictureSourceType.PHOTOLIBRARY);
            });

            var buydemandFileInput2 = document.getElementById('node-create-buydemand-upload-camera');
            buydemandFileInput2.addEventListener('click', function(e) {
                uploadDeviceImage('buydemand-camera.jpg', 'buydemandFileDisplayArea', imagefiles, 300, 50, Camera.PictureSourceType.CAMERA);
            });

        } else {
            nodecreatebuydemandimages.innerHTML = '<label for="node-create-buydemand-upload">图片:</label>' +
                '<div id="buydemandFileDisplayArea"></div>' +
                '<input type="file" accept="image/*" name="node-create-buydemand-upload" id="node-create-buydemand-upload" value="">';
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
                '<div data-role="controlgroup" data-type="horizontal">' +
                '<legend>添加商品小图</legend>' +
                '<button class="ui-btn ui-corner-all ui-btn-a" id="node-create-product-upload-photo">照片图库</button>' +
                '<button class="ui-btn ui-corner-all ui-btn-a ui-icon-camera" id="node-create-product-upload-camera">拍照</button>' +
                '</div>' +
                '<div id="productDetailImageFileDisplayArea"></div>' +
                '<div data-role="controlgroup" data-type="horizontal">' +
                '<legend>添加详情图片</legend>' +
                '<button class="ui-btn ui-corner-all ui-btn-a" id="node-create-product-detailimage-photo">照片图库</button>' +
                '<button class="ui-btn ui-corner-all ui-btn-a  ui-icon-camera" id="node-create-product-detailimage-camera">拍照</button>' +
                '</div>';
            $('#node-create-product-images').trigger('create');

            var productFileInput = document.getElementById('node-create-product-upload-photo');
            productFileInput.addEventListener('click', function(e) {
                uploadDeviceImage('small-photo.jpg', 'productFileDisplayArea', imagefiles, 300, 50, Camera.PictureSourceType.PHOTOLIBRARY);
            });
            var productFileInput2 = document.getElementById('node-create-product-upload-camera');
            productFileInput2.addEventListener('click', function(e) {
                uploadDeviceImage('small-camera.jpg', 'productFileDisplayArea', imagefiles, 300, 50, Camera.PictureSourceType.CAMERA);
            });


            var detailimageInput = document.getElementById('node-create-product-detailimage-photo');
            detailimageInput.addEventListener('click', function(e) {
                uploadDeviceImage('detail-photo.jpg', 'productDetailImageFileDisplayArea', detailImageFiles, false, 50, Camera.PictureSourceType.PHOTOLIBRARY);
            });
            var detailimageInput2 = document.getElementById('node-create-product-detailimage-camera');
            detailimageInput2.addEventListener('click', function(e) {
                uploadDeviceImage('detail-camera.jpg', 'productDetailImageFileDisplayArea', detailImageFiles, false, 50, Camera.PictureSourceType.CAMERA);
            });
        } else {
            nodecreateproductimages.innerHTML = '<label for="node-create-product-upload">商品小图(*):</label>' +
                '<div id="productFileDisplayArea"></div>' +
                '<input type="file" accept="image/*" name="node-create-product-upload" id="node-create-product-upload" value="">' +
                '<label for="node-create-product-detailimage">详情图片:</label>' +
                '<div id="productDetailImageFileDisplayArea"></div>' +
                '<input type="file" accept="image/*" name="node-create-product-detailimage" id="node-create-product-detailimage" value="">';
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
        //修改
        var nodemodifybuydemandimages = document.getElementById('node-modify-buydemand-images');
        if (typeof cordova != 'undefined') {
            nodemodifybuydemandimages.innerHTML = '<div id="modifybuydemandFileDisplayArea"></div>' +
                '<div data-role="controlgroup" data-type="horizontal">' +
                '<legend>添加图片</legend>' +
                '<button class="ui-btn ui-corner-all ui-btn-a" id="node-modify-buydemand-upload-photo">照片图库</button>' +
                '<button class="ui-btn ui-corner-all ui-btn-a  ui-icon-camera" id="node-modify-buydemand-upload-camera">拍照</button>' +
                '</div>';
            $('#node-modify-buydemand-images').trigger('create');

            var modifybuydemandFileInput = document.getElementById('node-modify-buydemand-upload-photo');
            modifybuydemandFileInput.addEventListener('click', function(e) {
                uploadDeviceImage('buydemand-photo.jpg', 'modifybuydemandFileDisplayArea', imagefiles, 300, 50, Camera.PictureSourceType.PHOTOLIBRARY);
            });

            var modifybuydemandFileInput2 = document.getElementById('node-modify-buydemand-upload-camera');
            modifybuydemandFileInput2.addEventListener('click', function(e) {
                uploadDeviceImage('buydemand-camera.jpg', 'modifybuydemandFileDisplayArea', imagefiles, 300, 50, Camera.PictureSourceType.CAMERA);
            });

        } else {
            nodemodifybuydemandimages.innerHTML = '<label for="node-modify-buydemand-upload">图片:</label>' +
                '<div id="modifybuydemandFileDisplayArea"></div>' +
                '<input type="file" accept="image/*" name="node-modify-buydemand-upload" id="node-modify-buydemand-upload" value="">';
            $('#node-modify-buydemand-images').trigger('create');

            var modifybuydemandFileInput = document.getElementById('node-modify-buydemand-upload');
            modifybuydemandFileInput.addEventListener('change', function(e) {
                var file = modifybuydemandFileInput.files[0];
                uploadImageFiles(file, 'modifybuydemandFileDisplayArea', imagefiles);
            });
        }

        var nodemodifyproductimages = document.getElementById('node-modify-product-images');
        if (typeof cordova != 'undefined') {
            nodemodifyproductimages.innerHTML = '<div id="modifyproductFileDisplayArea"></div>' +
                '<div data-role="controlgroup" data-type="horizontal">' +
                '<legend>添加商品小图</legend>' +
                '<button class="ui-btn ui-corner-all ui-btn-a" id="node-modify-product-upload-photo">照片图库</button>' +
                '<button class="ui-btn ui-corner-all ui-btn-a ui-icon-camera" id="node-modify-product-upload-camera">拍照</button>' +
                '</div>' +
                '<div id="modifyproductDetailImageFileDisplayArea"></div>' +
                '<div data-role="controlgroup" data-type="horizontal">' +
                '<legend>添加详情图片</legend>' +
                '<button class="ui-btn ui-corner-all ui-btn-a" id="node-modify-product-detailimage-photo">照片图库</button>' +
                '<button class="ui-btn ui-corner-all ui-btn-a  ui-icon-camera" id="node-modify-product-detailimage-camera">拍照</button>' +
                '</div>';
            $('#node-modify-product-images').trigger('create');

            var modifyproductFileInput = document.getElementById('node-modify-product-upload-photo');
            modifyproductFileInput.addEventListener('click', function(e) {
                uploadDeviceImage('small-photo.jpg', 'modifyproductFileDisplayArea', imagefiles, 300, 50, Camera.PictureSourceType.PHOTOLIBRARY);
            });
            var modifyproductFileInput2 = document.getElementById('node-modify-product-upload-camera');
            modifyproductFileInput2.addEventListener('click', function(e) {
                uploadDeviceImage('small-camera.jpg', 'modifyproductFileDisplayArea', imagefiles, 300, 50, Camera.PictureSourceType.CAMERA);
            });


            var modifydetailimageInput = document.getElementById('node-modify-product-detailimage-photo');
            modifydetailimageInput.addEventListener('click', function(e) {
                uploadDeviceImage('detail-photo.jpg', 'modifyproductDetailImageFileDisplayArea', detailImageFiles, false, 50, Camera.PictureSourceType.PHOTOLIBRARY);
            });
            var modifydetailimageInput2 = document.getElementById('node-modify-product-detailimage-camera');
            modifydetailimageInput2.addEventListener('click', function(e) {
                uploadDeviceImage('detail-camera.jpg', 'modifyproductDetailImageFileDisplayArea', detailImageFiles, false, 50, Camera.PictureSourceType.CAMERA);
            });
        } else {
            nodemodifyproductimages.innerHTML = '<label for="node-modify-product-upload">商品小图(*):</label>' +
                '<div id="modifyproductFileDisplayArea"></div>' +
                '<input type="file" accept="image/*" name="node-modify-product-upload" id="node-modify-product-upload" value="">' +
                '<label for="node-modify-product-detailimage">详情图片:</label>' +
                '<div id="modifyproductDetailImageFileDisplayArea"></div>' +
                '<input type="file" accept="image/*" name="node-modify-product-detailimage" id="node-modify-product-detailimage" value="">';
            $('#node-modify-product-images').trigger('create');
            var modifyproductFileInput = document.getElementById('node-modify-product-upload');
            modifyproductFileInput.addEventListener('change', function(e) {
                var file = modifyproductFileInput.files[0];
                uploadImageFiles(file, 'modifyproductFileDisplayArea', imagefiles);
            });
            var modifydetailimageInput = document.getElementById('node-modify-product-detailimage');
            modifydetailimageInput.addEventListener('change', function(e) {
                var file = modifydetailimageInput.files[0];
                uploadImageFiles(file, 'modifyproductDetailImageFileDisplayArea', detailImageFiles);
            });
        }
        //end修改
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
            if (profileid == '0') {
                var user = getStorageUser();
                var data = {
                    'administrative_area': $('#commerce_customer_address_administrative_area').val(),
                    'locality': $('#commerce_customer_address_locality').val(),
                    'dependent_locality': $('#commerce_customer_address_dependent_locality').val(),
                    'thoroughfare': $('#commerce_customer_address_thoroughfare').val(),
                    'name_line': $('#commerce_customer_address_name_line').val(),
                    'linkphone': $('#commerce_customer_address_linkphone').val(),
                    'postal_code': $('#commerce_customer_address_postal_code').val(),
                    'uid': user.uid
                };
                services.CreateCommerceCustomerAddress(data, function(data) {
                    $('body').pagecontainer('change', '#setting');
                });
            } else {
                services.CommerceCustomerAddressCanModify(profileid, function(data) {
                    if (data) {
                        var user = getStorageUser();
                        var data = {
                            'administrative_area': $('#commerce_customer_address_administrative_area').val(),
                            'locality': $('#commerce_customer_address_locality').val(),
                            'dependent_locality': $('#commerce_customer_address_dependent_locality').val(),
                            'thoroughfare': $('#commerce_customer_address_thoroughfare').val(),
                            'name_line': $('#commerce_customer_address_name_line').val(),
                            'linkphone': $('#commerce_customer_address_linkphone').val(),
                            'postal_code': $('#commerce_customer_address_postal_code').val(),
                            'uid': user.uid,
                            'default': $('#commerce_customer_address_default').prop("checked")
                        };
                        services.CommerceCustomerAddress(profileid, data, function(data) {
                            $('body').pagecontainer('change', '#setting');
                        });
                    }
                });
            }
        });

        var user_login_submit = document.getElementById('user-login-submit');
        user_login_submit.addEventListener('click', userLogin);

        var user_register_submit = document.getElementById('user-register-submit');
        user_register_submit.addEventListener('click', userRegister);

        var user_register_province = document.getElementById('user-register-province');
        user_register_province.addEventListener('change', function(e) {
            var province_id = $('#user-register-province').val();
            var city_id = '';
            $('#user-register-city').empty();
            $.each(china_province, function(index, item) {
                if (item.region_type == '2' && item.parent_id == province_id) {
                    var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                    $('#user-register-city').append(option);
                    if (city_id === '') {
                        city_id = item.region_id;
                    }
                }
            });
            $('#user-register-county').empty();
            $.each(china_province, function(index, item) {
                if (item.region_type == '3' && item.parent_id == city_id) {
                    var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                    $('#user-register-county').append(option);
                }
            });
            $('#user-register-city').selectmenu('refresh', true);
            $('#user-register-county').selectmenu('refresh', true);
        });

        var user_register_city = document.getElementById('user-register-city');
        user_register_city.addEventListener('change', function(e) {
            var city_id = $('#user-register-city').val();
            $('#user-register-county').empty();
            $.each(china_province, function(index, item) {
                if (item.region_type == '3' && item.parent_id == city_id) {
                    var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                    $('#user-register-county').append(option);
                }
            });
            $('#user-register-county').selectmenu('refresh', true);
        });

        $(document).on("pageinit", "#user-register", function() {
            $.each(china_province, function(index, item) {
                var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                if (item.region_type == '1') {
                    $('#user-register-province').append(option);
                }
                if (item.region_type == '2' && item.parent_id == '30') {
                    $('#user-register-city').append(option);
                }
                if (item.region_type == '3' && item.parent_id == '367') {
                    $('#user-register-county').append(option);
                }
            });
            $('#user-register-province').val('30');
            $('#user-register-city').val('367');
            $('#user-register-county').val('3100');

            $('#user-register-province').selectmenu('refresh', true);
            $('#user-register-city').selectmenu('refresh', true);
            $('#user-register-county').selectmenu('refresh', true);
        });

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

        $('#node-modify-employment-submit').click(nodeModifyEmployment);
        $('#node-modify-product-submit').click(nodeModifyProduct);
        $('#node-modify-buydemand-submit').click(nodeModifyBuydemand);
        $('#node-modify-article-submit').click(nodeModifyArticle);
        $('#node-modify-logistics-submit').click(nodeModifyLogistics);



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
            if ($("#user-newpassword-form").valid()) {
                var uid = $('#user-newpassword-uid').val();
                if (uid) {
                    userUpdatePassword(uid);
                }
            }
        });

        var usersettingsubmit = document.getElementById('user-setting-submit');
        usersettingsubmit.addEventListener('click', function(e) {
            e.preventDefault();
            if ($("#user-setting-form").valid()) {
                userUpdate();
            }
        });

        var user_setting_province = document.getElementById('user-setting-province');
        user_register_province.addEventListener('change', function(e) {
            var province_id = $('#user-setting-province').val();
            var city_id = '';
            $('#user-setting-city').empty();
            $.each(china_province, function(index, item) {
                if (item.region_type == '2' && item.parent_id == province_id) {
                    var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                    $('#user-setting-city').append(option);
                    if (city_id === '') {
                        city_id = item.region_id;
                    }
                }
            });
            $('#user-setting-county').empty();
            $.each(china_province, function(index, item) {
                if (item.region_type == '3' && item.parent_id == city_id) {
                    var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                    $('#user-setting-county').append(option);
                }
            });
            $('#user-setting-city').selectmenu('refresh', true);
            $('#user-setting-county').selectmenu('refresh', true);
        });

        var user_setting_city = document.getElementById('user-setting-city');
        user_setting_city.addEventListener('change', function(e) {
            var city_id = $('#user-setting-city').val();
            $('#user-setting-county').empty();
            $.each(china_province, function(index, item) {
                if (item.region_type == '3' && item.parent_id == city_id) {
                    var option = $('<option></option>').attr("value", item.region_id).text(item.region_name);
                    $('#user-setting-county').append(option);
                }
            });
            $('#user-setting-county').selectmenu('refresh', true);
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
            submitHandler: function(form) {
                return false;
            }
        });
        jQuery.validator.addMethod("phoneCN", function(phone_number, element) {
            phone_number = phone_number.replace(/\s+/g, "");
            return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/^(((13[0-9]{1})|145|147|(15[0-9]{1})|170|176|177|178|(18[0-9]{1}))+\d{8})$/);
        }, "请输入手机号码");

        $("#node-create-product-form").validate({
            rules: {
                'node-create-product-title': {
                    required: true,
                },
                'node-create-product-linkphone': {
                    required: true,
                    phoneCN: true
                },
                'node-create-product-price': {
                    required: true,
                    number: true
                },
                'node-create-product-prodcount': {
                    required: true,
                    number: true
                },
            },
            messages: {
                'node-create-product-title': {
                    required: "请输入标题",
                },
                'node-create-product-linkphone': '请输入手机号码',
                'node-create-product-price': '请输入数字',
                'node-create-product-prodcount': '请输入数字',
            },
        });
        $("#node-modify-product-form").validate({
            rules: {
                'node-modify-product-title': {
                    required: true,
                },
                'node-modify-product-linkphone': {
                    required: true,
                    phoneCN: true
                },
                'node-modify-product-price': {
                    required: true,
                    number: true
                },
                'node-modify-product-prodcount': {
                    required: true,
                    number: true
                },
            },
            messages: {
                'node-modify-product-title': {
                    required: "请输入标题",
                },
                'node-modify-product-linkphone': '请输入手机号码',
                'node-modify-product-price': '请输入数字',
                'node-modify-product-prodcount': '请输入数字',
            },
        });
        $("#node-create-buydemand-form").validate({
            rules: {
                'node-create-buydemand-title': {
                    required: true
                },
                'node-create-buydemand-linkphone': {
                    required: true,
                    phoneCN: true
                },
                'node-create-buydemand-price': {
                    required: true,
                    number: true
                },
                'node-create-buydemand-prodcount': {
                    required: true,
                    number: true
                },
            },
            messages: {
                'node-create-buydemand-title': {
                    required: "请输入标题",
                },
                'node-create-buydemand-linkphone': '请输入手机号码',
                'node-create-buydemand-price': '请输入数字',
                'node-create-buydemand-prodcount': '请输入数字',
            },
        });
        $("#node-modify-buydemand-form").validate({
            rules: {
                'node-modify-buydemand-title': {
                    required: true
                },
                'node-modify-buydemand-linkphone': {
                    required: true,
                    phoneCN: true
                },
                'node-modify-buydemand-price': {
                    required: true,
                    number: true
                },
                'node-modify-buydemand-prodcount': {
                    required: true,
                    number: true
                },
            },
            messages: {
                'node-modify-buydemand-title': {
                    required: "请输入标题",
                },
                'node-modify-buydemand-linkphone': '请输入手机号码',
                'node-modify-buydemand-price': '请输入数字',
                'node-modify-buydemand-prodcount': '请输入数字',
            },
        });
        $("#node-create-article-form").validate({
            rules: {
                'node-create-article-title': {
                    required: true
                },
                'node-create-article-linkphone': {
                    required: true,
                    phoneCN: true
                }
            },
            messages: {
                'node-create-article-title': {
                    required: "请输入标题",
                },
                'node-create-article-linkphone': '请输入手机号码',
            },
        });
        $("#node-modify-article-form").validate({
            rules: {
                'node-modify-article-title': {
                    required: true
                },
                'node-modify-article-linkphone': {
                    required: true,
                    phoneCN: true
                }
            },
            messages: {
                'node-modify-article-title': {
                    required: "请输入标题",
                },
                'node-modify-article-linkphone': '请输入手机号码',
            },
        });
        $("#node-create-employment-form").validate({
            rules: {
                'node-create-employment-title': {
                    required: true
                },
                'node-create-employment-linkphone': {
                    required: true,
                    phoneCN: true
                }
            },
            messages: {
                'node-create-employment-title': {
                    required: "请输入标题",
                },
                'node-create-employment-linkphone': '请输入手机号码',
            },
        });
        $("#node-modify-employment-form").validate({
            rules: {
                'node-modify-employment-title': {
                    required: true
                },
                'node-modify-employment-linkphone': {
                    required: true,
                    phoneCN: true
                }
            },
            messages: {
                'node-modify-employment-title': {
                    required: "请输入标题",
                },
                'node-modify-employment-linkphone': '请输入手机号码',
            },
        });
        $("#node-create-logistics-form").validate({
            rules: {
                'node-create-logistics-title': {
                    required: true
                },
                'node-create-logistics-linkphone': {
                    required: true,
                    phoneCN: true
                }
            },
            messages: {
                'node-create-logistics-title': {
                    required: "请输入标题",
                },
                'node-create-logistics-linkphone': '请输入手机号码',
            },
        });
        $("#node-modify-logistics-form").validate({
            rules: {
                'node-modify-logistics-title': {
                    required: true
                },
                'node-modify-logistics-linkphone': {
                    required: true,
                    phoneCN: true
                }
            },
            messages: {
                'node-modify-logistics-title': {
                    required: "请输入标题",
                },
                'node-modify-logistics-linkphone': '请输入手机号码',
            },
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

        $(document).on("pageinit", "#front", function(event) {
            loadSlideshow();
            loadRecommendStoreList();
            loadRecommendList();
        });

        $(document).on("pageinit", "#node-create-product", function() {
            $("#node-create-product-taxonomy").on({
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
                                        text += term.tname + ' ';
                                    }
                                }
                            }
                        }
                    }
                    if (text !== '') {
                        $("#node-create-product-button").button().text(text);
                        $("#node-create-product-button").button().button('refresh');
                    }
                }
            });
        });
        $(document).on("pageinit", "#node-modify-product", function() {
            $("#node-modify-product-taxonomy").on({
                popupafterclose: function() {
                    var text = '';
                    for (var index in productmodifytaxonomy) {
                        var v = productmodifytaxonomy[index];
                        if (v && v.vid) {
                            for (var index in nodes) {
                                var term = nodes[index].node;
                                if (term.vid == v.vid) {
                                    var chk = document.getElementById(v.id + '-' + term.tid);
                                    if (chk.checked) {
                                        text += term.tname + ' ';
                                    }
                                }
                            }
                        }
                    }
                    if (text !== '') {
                        $("#node-modify-product-button").button().text(text);
                        $("#node-modify-product-button").button().button('refresh');
                    }
                }
            });
        });
        $(document).on("pageinit", "#node-create-buydemand", function() {
            $("#node-create-buydemand-taxonomy").on({
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
                                        text += term.tname + ' ';
                                    }
                                }
                            }
                        }
                    }
                    if (text !== '') {
                        $("#node-create-buydemand-button").button().text(text);
                        $("#node-create-buydemand-button").button().button('refresh');
                    }
                }
            });
        });
        $(document).on("pageinit", "#node-modify-buydemand", function() {
            $("#node-modify-buydemand-taxonomy").on({
                popupafterclose: function() {
                    var text = '';
                    for (var index in buydemandmodifytaxonomy) {
                        var v = buydemandmodifytaxonomy[index];
                        if (v && v.vid) {
                            for (var index in nodes) {
                                var term = nodes[index].node;
                                if (term.vid == v.vid) {
                                    var chk = document.getElementById(v.id + '-' + term.tid);
                                    if (chk.checked) {
                                        text += term.tname + ' ';
                                    }
                                }
                            }
                        }
                    }
                    if (text !== '') {
                        $("#node-modify-buydemand-button").button().text(text);
                        $("#node-modify-buydemand-button").button().button('refresh');
                    }
                }
            });
        });
        $('body').on('pagecontainershow', function(event, ui) {
            // 默认的过渡效果设置为 'none'
            var processedHash = processHash(window.location.hash);
            //alert(JSON.stringify(processedHash.queryParameters));
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
                        //var nodeproductcontent = document.getElementById('node-product-content');
                        //nodeproductcontent.innerHTML='';
                        displayNode(currentNode, 'slideshow-node-list', 'node-content', 'slideshow-node-container');
                    }
                    break;
                case 'node-product':
                    if (currentNode) {
                        //var nodecontent = document.getElementById('node-content');
                        //nodecontent.innerHTML='';
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
                case 'node-modify-product':
                    if (currentNode) {
                        loadNode(currentNode);
                    }
                    break;
                case 'node-modify-buydemand':
                    if (currentNode) {
                        loadNode(currentNode);
                    }
                    break;
                case 'node-modify-article':
                    if (currentNode) {
                        loadNode(currentNode);
                    }
                    break;
                case 'node-modify-employment':
                    if (currentNode) {
                        loadNode(currentNode);
                    }
                    break;
                case 'node-modify-logistics':
                    if (currentNode) {
                        loadNode(currentNode);
                    }
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
