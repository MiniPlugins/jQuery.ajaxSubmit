/* global jQuery*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.ajaxSubmitNow = function (settings, extraData) {
        if ($.isFunction(settings)) {
            settings = {success: settings};
        }

        if (this.data('confirm') && !confirm(this.data('confirm'))) {
            return false;
        }

        var method = this.prop('method');
        var data;
        var defaultSettings = {};

        if(method.toUpperCase() === 'POST') {
            data = new FormData(this[0]);

            defaultSettings = {
                processData: false,
                contentType: false
            };

        } else {
            data = this.serializeArray();
        }

        var ajaxSettings = $.extend(defaultSettings, {
            url: this.attr('action') || '',
            data: data,
            type: method
        }, settings);

        if (extraData) {
            for (var n = extraData.length - 1; n >= 0; n--) {

                if(method.toUpperCase() === 'POST') {
                    ajaxSettings.data.append(extraData[n].name, extraData[n].value);
                } else {
                    ajaxSettings.data.push(extraData[n]);

                    if (window.history.replaceState) {
                        window.history.replaceState(null, null, location.pathname + '?' + this.serialize());
                    }
                }
            }
        }

        return $.ajax(ajaxSettings);
    };

    $.fn.ajaxSubmit = function (settings) {
        this.on('submit', function () {
            $(this).ajaxSubmitNow(settings);

            return false;
        });
    };
}));
