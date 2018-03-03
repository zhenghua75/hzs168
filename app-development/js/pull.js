/*jslint browser: true, sloppy: true, white: true, nomen: true, plusplus:true, maxerr: 50, indent: 2 */
/*global jQuery:false, iScroll:false */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true,
         undef:true, curly:true, browser:true, jquery:true, indent:2, maxerr:50,
         white:false, nomen:false */

// $(document).bind("mobileinit", function() {
//     $.mobile.defaultPageTransition = "slide";
// });
$(document).on("iscroll_init", function() {
    $.mobile.iscrollview.prototype.options.refreshDelay = 100;
});

(function mobileSafariFormsAssistantHack($) {
    "use strict";
    $(document).bind("pageinit",
        function installDelegation(pageEvent) {
            var $page = $(pageEvent.target);
            $page.delegate("input,textarea,select", "blur",
                function onBlur(inputEvent) {
                    setTimeout(function onAllBlurred() {
                            if ($page.find("input.ui-focus,textarea.ui-focus,select.ui-focus").length === 0) {
                                $.mobile.silentScroll(0);
                            }
                        },
                        0);
                });
        });
}(jQuery));

