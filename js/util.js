/*global util, _*/

$(function () {
    "use strict";

    /**
     * ユーティリティモジュール
     * @type {*|{}}
     */
    window.util = window.util || {
        /**
         * 名前空間解決関数
         */
        namespace: function (ns_string) {
            var parts = ns_string.split('.'),
                parent = window,
                i;

            for (i = 0; i < parts.length; i++) {
                if (parent[parts[i]] === undefined) {
                    parent[parts[i]] = {};
                }
                parent = parent[parts[i]];
            }
            return parent;
        },

        /**
         * 多次元配列の初期化
         */
        initArray: function (ns, init) {
            var x = ns[0],
                xs = _.rest(ns),
                ary = [x],
                i;

            for (i = 0; i < x; i++) {
                ary[i] = xs.length > 0 ? this.initArray(xs, init) : init ? init() : [];
            }

            return ary;
        },

        htmlspecialchars: function (str) {
            return str.replace(/[&"'<>]/g, function ($0) {
                if ($0 == "&")  return '&amp;';
                if ($0 == "\"") return '&quot;';
                if ($0 == "'")  return '&#039;';
                if ($0 == "<")  return '&lt;';
                if ($0 == ">")  return '&gt;';
            });
        },

        htmlspecialchars_decode: function (str) {
            return str.replace(/&(gt|lt|#039|quot|amp);/ig, function ($0, $1) {
                if (/^gt$/i.test($1))   return ">";
                if (/^lt$/i.test($1))   return "<";
                if (/^#039$/.test($1))  return "'";
                if (/^quot$/i.test($1)) return "\"";
                if (/^amp$/i.test($1))  return "&";
            });
        },

        isSmartAgent: function () {
            return (navigator.userAgent.indexOf('iPhone') > 0 &&
                navigator.userAgent.indexOf('iPad') == -1) ||
                navigator.userAgent.indexOf('iPod') > 0 ||
                navigator.userAgent.indexOf('Android') > 0;
        },

        wrapEnableBubble: function (func) {
            return function () {
                func.apply(this, arguments);
                return true;
            }
        },

        wrapEnableBubbleAll: function (object, methodNames){
            var wrap_enable_bubble = this.wrapEnableBubble.bind(this);

            _.each(methodNames, function (methodName) {
                if (_.isFunction(object[methodName])) {
                    object[methodName] = wrap_enable_bubble(object[methodName]);
                }
            });
        },

        cancelBubble: function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        },

        wrapCancelBubble: function (func) {
            var cancel_event = this.cancelBubble;

            return function (item, obj, e) {
                if (arguments.length < 2) {
                    func();
                }else if (arguments.length < 3) {
                    func();
                    cancel_event(arguments[1]);
                }else {
                    func(item);
                    cancel_event(arguments[arguments.length - 1]);
                }

                return true;
            }
        },

        wrapCancelBubbleAll: function (object, methodNames) {
            var wrap_cancel_event = this.wrapCancelBubble.bind(this);

            _.each(methodNames, function (methodName) {
                if (_.isFunction(object[methodName])) {
                    object[methodName] = wrap_cancel_event(object[methodName]);
                }
            });
        }
    };
});
