/*global _, ko, $, util */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.viewmodel");

    /**
     * ローディング状態のViewModelコンストラクタ関数
     *
     * @constructor
     */
    ns.LoadingViewModel = function LoadingViewModel() {
        var that = this;

        /**
         * ローディング状態かどうか
         *
         * @type {boolean}
         */
        that.isLoading = ko.observable(false);

        /**
         * Deferredインターフェースを備えた関数に対し、Loadingの状態変更を前後に挿入しラッピングする
         * 対象の関数が実行される前に isLoading が true になり、対象のの処理が終了したら isLoading が false になる
         *
         * @param {function(...): Deferred} deferred Deferredインターフェースを備えているラッピング対象の関数
         * @returns {function(...): Deferred} Deferredインターフェースを備えたラッピング済み関数
         */
        that.wrapDeferred = function (deferred) {
            if (!_.isFunction(deferred)) {
                return deferred;
            }

            return function () {
                that.isLoading(true);

                return deferred.apply(this, arguments).always(function () {
                    that.isLoading(false);
                });
            };
        };

        /**
         * object の持つ複数の関数に対してLoadingラッピングを適用する（objectに対して破壊的）
         *
         * @param {!Object} object 対象のオブジェクト
         * @param {Array.<string>} methodNames 対象のオブジェクトが持つ、Loadingラッピングの対象メソッド名群
         */
        that.wrapDeferredAll = function (object, methodNames) {
            _.each(methodNames, function (methodName) {
                if (_.isFunction(object[methodName])) {
                    object[methodName] = that.wrapDeferred(object[methodName]);
                }
            });
        }
    };

});
