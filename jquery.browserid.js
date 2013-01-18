/*
* jQuery BrowserID plug-in v0.1.2
*
* Copyright (c) 2011-2013 Christian Wenz
*
* Licensed under the BSD license:
*   http://opensource.org/licenses/BSD-3-Clause
*/

(function ($) {
    $.fn.browserid = function (assertionCallback, options) {
        var settings = {
            // path to the BrowserID JavaScript library
            scriptLibraryPath: 'https://browserid.org/include.js',
            // JavaScript callback after successful assertion
            assertionSuccessFunction: function () { }
        };
        if (options) {
            $.extend(settings, options);
        }

        $.getScript(settings.scriptLibraryPath);

        return this.each(function () {
            $(this).bind('click.browserid', function () {
                if (navigator && navigator.id && navigator.id.getVerifiedEmail) {
                    navigator.id.getVerifiedEmail(function (assertion) {
                        if (assertion) {
                            // if callback is a function, execute it
                            if (typeof assertionCallback === 'function') {
                                assertionCallback.apply(this, [assertion]);
                            } else {
                                // callback is a string, so assume it's a URL to post the assertion to
                                var serviceSettings = {};
                                // assertion param name is "assertion" by default, unless defined otherwise
                                serviceSettings[(settings.assertionParam || 'assertion')] = assertion;
                                $.post(assertionCallback, serviceSettings, settings.assertionSuccessFunction);
                            }
                        } else {
                            // in case of an error call error handler, if available
                            if (settings.errorHandler) {
                                settings.errorHandler.apply(this);
                            }
                        }
                    });
                }
            });
        });
    }
})(jQuery);