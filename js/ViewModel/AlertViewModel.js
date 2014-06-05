/*global _, ko, $, util */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.viewmodel"),
        defaultOptions = {
            maxAlertNum: 5,
            waitHideTime: 8000
        },
        AlertContent = function AlertContent(o) {
            o = _.isObject(o) ? o : {};
            this.title = o.title === undefined ? "" : o.title;
            this.message = o.message === undefined ? "" : o.message;
            this.isSuccess = o.isSuccess === undefined ? false : o.isSuccess
        };

    ns.AlertViewModel = function (o) {
        var that = this,
            options = _.defaults(o || {}, defaultOptions);

        // アラートリスト
        that.alerts = ko.observableArray();

        // アラートを追加する
        that.pushAlert = function (content) {
            var obj = new AlertContent(content);

            that.alerts.unshift(obj);

            // maxAlert以上のアラートを削除
            that.alerts.splice(options.maxAlertNum);

            // x秒後に自動的に削除
            setTimeout(function () {
                that.alerts.remove(obj);
            }, options.waitHideTime);
        };

        that.wrapDeferred = function (deferred, success_message, error_message) {
            if (!_.isFunction(deferred)) {
                return deferred;
            }

            return function () {
                return deferred.apply(this, arguments)
                    .done(function () {
                        if (success_message !== undefined) {
                            that.pushAlert({
                                title: "success!",
                                isSuccess: true,
                                message: _.isFunction(success_message) ? success_message() : success_message
                            });
                        }
                    })
                    .fail(function () {
                        if (error_message !== undefined) {
                            that.pushAlert({
                                title: "error...",
                                isSuccess: false,
                                message: _.isFunction(error_message) ? error_message() : error_message
                            });
                        }
                    })
            }
        };

        that.wrapDeferredAll = function (object, params) {
            _.each(params, function (param) {
                if (_.isObject(param) && _.isFunction(object[param.methodName])) {
                    object[param.methodName] = that.wrapDeferred(
                        object[param.methodName],
                        param.successMessage,
                        param.errorMessage
                    );
                }
            });
        };

    };

});
