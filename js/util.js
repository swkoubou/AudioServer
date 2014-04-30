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

	/***************************************************
  	  特殊文字を HTML エンティティに変換する
	 ***************************************************/
	htmlspecialchars: function(str) {
	  return str.replace(/[&"'<>]/g, function($0) {
	    if ($0 == "&")  return '&amp;';
	    if ($0 == "\"") return '&quot;';
	    if ($0 == "'")  return '&#039;';
	    if ($0 == "<")  return '&lt;';
	    if ($0 == ">")  return '&gt;';
	  });
	},

	/***************************************************
	
	    特殊な HTML エンティティを文字に戻す
	
	 ***************************************************/
	htmlspecialchars_decode: function(str) {
	  return str.replace(/&(gt|lt|#039|quot|amp);/ig, function($0, $1) {
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
        }
    };
});
