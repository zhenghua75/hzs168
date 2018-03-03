var app = (function(my) {
    my.initialize = function() {
        my.bindEvents();
    };
    my.bindEvents = function() {
        document.addEventListener('deviceready', my.onDeviceReady, false);
    };
    my.onDeviceReady = function() {
        my.receivedEvent('deviceready');
    };
    my.successHandler = function(result) {
        //alert('success ='+result);
    };
    my.errorHandler = function(error) {
        alert('error = ' + error);
    };
    my.storeToken = function(token) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'http://ylst.kmdx.cn/index.php?g=Wap&m=Index&a=InsertDeviceToken&devicetoken=' + token + '&apptoken=zlsxjj1440489378&token=zlsxjj1440489378', true);
        xmlhttp.send(null);
    };
    my.onNotificationAPN = function(event) {
        if (event.alert) {
            alert(event.alert);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
        if (event.badge) {
            pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
        }
    };
    my.onNotification = function(e) {
        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    my.storeToken(e.regid);
                }
                break;
            case 'message':
                if (e.foreground) {
                    var soundfile = e.soundname || e.payload.sound;
                    var my_media = new Media('/android_asset/www/' + soundfile);
                    my_media.play();
                }
                alert(e.payload.message);
                break;
            case 'error':
                alert(e.msg);
                break;
            default:
                break;
        }
    };
    my.tokenHandler = function(result) {
        my.storeToken(result);
    };
    my.updateApp = function() {

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function gotFS(fileSystem) {
            fileSystem.root.getDirectory("download", {
                create: true
            }, function fileSystemSuccess(fileSystem) {
                fileSystem.getFile("zlsxjj1440489378.apk", {
                    create: true,
                    exclusive: false
                }, function gotFileEntry(fileEntry) {
                    var path = fileEntry.toURL();
                    //fileEntry.remove();
                    var fileTransfer = new FileTransfer();
                    fileTransfer.download('http://ylst.kmdx.cn:9000/download/zlsxjj1440489378/zlsxjj1440489378.apk', path, function(theFile) {
                        //alert("File Downloaded Successfully 2 " + theFile.toURI());
						//installApk.install(theFile.toURI());
                        window.plugins.webintent.startActivity({
                                action: window.plugins.webintent.ACTION_VIEW,
                                url: theFile.toURI(),
                                type: 'application/vnd.android.package-archive'
                            },
                            function() {},
                            function(e) {
                                alert('Error launching app update');
                            }
                        );
                    }, function(error) {
                        //alert("File Transfer failed message:" + JSON.stringify(error));
                    });
                }, function() {
                    //alert('getFile error');
                });
            }, function() {
                //alert('getDirectory error');
            });
        }, function(e) {
            //alert("requestFileSystem error: " + e.target.error.code);
        });
    };
    my.receivedEvent = function(id) {
        pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android') {
            pushNotification.register(
                this.successHandler,
                this.errorHandler, {
                    'senderID': '',
                    'ecb': 'app.onNotification'
                });
        } else {
            pushNotification.register(
                this.tokenHandler,
                this.errorHandler, {
                    'badge': 'true',
                    'sound': 'true',
                    'alert': 'true',
                    'ecb': 'app.onNotificationAPN'
                });
        }

        cordova.plugins.autoupdate.assets({
            updateOnResume: true,
            request: {
                url: 'http://www.hzs168.com/app/autoupdate/index.php',
            },
            files: {
                'css/style.css': {
                    type: 'css',
                    version: '1.0.2'
                },
                'css/theme-c.css': {
                    type: 'css',
                    version: '1.0.1'
                },
                'css/theme-d.css': {
                    type: 'css',
                    version: '1.0.1'
                },
                'css/theme-e.css': {
                    type: 'css',
                    version: '1.0.1'
                },
                'css/theme-f.css': {
                    type: 'css',
                    version: '1.0.1'
                },
                'js/app.js': {
                    type: 'js',
                    version: '1.0.3'
                },
                'js/base.js': {
                    type: 'js',
                    version: '1.0.1'
                },
                'js/china_province.js': {
                    type: 'js',
                    version: '1.0.1'
                },
                'js/index.js': {
                    type: 'js',
                    version: '1.0.2'
                },
                'js/pull.js': {
                    type: 'js',
                    version: '1.0.1'
                },
                'js/services.js': {
                    type: 'js',
                    version: '1.0.1',
                },
                'img/top.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/xx.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/xh.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-1-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-1-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-1-3.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-2-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-2-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-2-3.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-3.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-3-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-3-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-3-3.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-3-4.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/1-4.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-1-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-1-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-2-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-2-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-3.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-3-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-3-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-4-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-4-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-5-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/2-5-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/3-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/3-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/3-3.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/4.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/4-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/4-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/4-3.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/4-4.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/5.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/6.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/7.jpg': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/8.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/9.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-1-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-1-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-2-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-2-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-3-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-3-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-4-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-4-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-5-1.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/10-5-2.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/c-msg-bg.gif': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/home.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'img/return.png': {
                    type: 'img',
                    version: '1.0.1',
                },
                'app/zlsxjj1440489378.apk': {
                    type: 'app',
                    version: '1.0.0',
                },
            }
        });

        if (device.platform == 'android' || device.platform == 'Android') {
            base.ajax(false, {
                url: 'http://www.hzs168.com/app/autoupdate/index.php?v[app/zlsxjj1440489378.apk]=1.0.28',
                success: function(data) {
                    console.log(data);
    				if(data && data['app/zlsxjj1440489378.apk']){
    					my.updateApp();
    				}

                },
            });
        }
        navigator.splashscreen.hide();
    };
    return my;
}(app || {}));

/*===========================
base AMD Export
===========================*/
if (typeof(module) !== 'undefined') {
    module.exports = app;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        'use strict';
        return app;
    });
}
