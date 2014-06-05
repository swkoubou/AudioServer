/*global util, _*/

$(function () {
    "use strict";

    /**
     * * ユーティリティモジュール
     *
     * @type {{namespace: namespace, initArray: initArray, htmlspecialchars: htmlspecialchars,
     *     htmlspecialchars_decode: htmlspecialchars_decode, isSmartAgent: isSmartAgent,
     *     wrapEnableBubble: wrapEnableBubble, wrapEnableBubbleAll: wrapEnableBubbleAll,
     *     cancelBubble: cancelBubble, wrapCancelBubble: wrapCancelBubble, wrapCancelBubbleAll: wrapCancelBubbleAll}|*}
     */
    window.util = window.util || {
        /**
         * 名前空間解決関数
         *
         * @param {string} ns_string ネームパス
         * @returns {!Object} 名前空間
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
         *
         * @example
         * // returns [[[], [], []], [[], [], []]]
         * util.initArray([2, 3]);
         * @example
         * // returns [[[1], [2]], [[3], [4]]]
         * util.initArray([2, 2], (function () { var n = 0; return function () { return ++n; }; }()));
         * @param {Array} ns 多次元配列の要素数リスト
         * @param {function(): *=} init 初期化関数
         * @returns {Array}
         */
        initArray: function (ns, init) {
            var x = ns[0],
                xs = _.rest(ns),
                ary = [],
                i;

            for (i = 0; i < x; i++) {
                ary[i] = xs.length > 0 ? this.initArray(xs, init) : init ? init() : [];
            }

            return ary;
        },

        /**
         * HTMLエンコード
         *
         * @param {string} str 対象文字列
         * @returns {string} 変換済み文字列
         */
        htmlspecialchars: function (str) {
            return str.replace(/[&"'<>]/g, function ($0) {
                if ($0 == "&")  return '&amp;';
                if ($0 == "\"") return '&quot;';
                if ($0 == "'")  return '&#039;';
                if ($0 == "<")  return '&lt;';
                if ($0 == ">")  return '&gt;';
                return $0;
            });
        },

        /**
         * HTMLデコード
         *
         * @param {string} str 対象文字列
         * @returns {string} 変換済み文字列
         */
        htmlspecialchars_decode: function (str) {
            return str.replace(/&(gt|lt|#039|quot|amp);/ig, function ($0, $1) {
                if (/^gt$/i.test($1))   return ">";
                if (/^lt$/i.test($1))   return "<";
                if (/^#039$/.test($1))  return "'";
                if (/^quot$/i.test($1)) return "\"";
                if (/^amp$/i.test($1))  return "&";
                return $0;
            });
        },

        /**
         * ユーザエージェントがスマートフォンかどうかを判断する
         *
         * @returns {boolean} ユーザエージェントがスマートフォンかどうか
         */
        isSmartAgent: function () {
            return (navigator.userAgent.indexOf('iPhone') > 0 &&
                navigator.userAgent.indexOf('iPad') == -1) ||
                navigator.userAgent.indexOf('iPod') > 0 ||
                navigator.userAgent.indexOf('Android') > 0;
        },

        /**
         * DOMイベントバブルを明示的に有効にして関数をラッピングする
         *
         * @param {Function} func ラッピング対象の関数
         * @returns {Function} ラッピング済みの関数
         */
        wrapEnableBubble: function (func) {
            return function () {
                func.apply(this, arguments);
                return true;
            }
        },

        /**
         * object の持つ複数の関数に対してEnableBubbleラッピングを適用する（objectに対して破壊的）
         *
         * @param {!Object} object 対象のオブジェクト
         * @param {Array.<string>} methodNames 対象のオブジェクトが持つ、ラッピング対象のメソッド名群
         */
        wrapEnableBubbleAll: function (object, methodNames){
            var wrap_enable_bubble = this.wrapEnableBubble.bind(this);

            _.each(methodNames, function (methodName) {
                if (_.isFunction(object[methodName])) {
                    object[methodName] = wrap_enable_bubble(object[methodName]);
                }
            });
        },

        /**
         * DOMイベントバブルを無効にする
         *
         * @param {Event} e イベントオブジェクト
         * @returns {boolean} falseを返してキャンセルする
         */
        cancelBubble: function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        },

        /**
         * DOMイベントバブルを無効にして関数をラッピングする
         *
         * @param {Function} func ラッピング対象の関数
         * @returns {Function} ラッピング済みの関数
         */
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

        /**
         * object の持つ複数の関数に対してcancelBubbleラッピングを適用する（objectに対して破壊的）
         *
         * @param {!Object} object 対象のオブジェクト
         * @param {Array.<string>} methodNames 対象のオブジェクトが持つ、ラッピング対象のメソッド名群
         */
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
