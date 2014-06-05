/*global _, ko, $, util */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.viewmodel");

    ns.LoadingViewModel = function () {
        var that = this;

        that.isLoading = ko.observable(false);

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

        that.wrapDeferredAll = function (object, methodNames) {
            _.each(methodNames, function (methodName) {
                if (_.isFunction(object[methodName])) {
                    object[methodName] = that.wrapDeferred(object[methodName]);
                }
            });
        }
    };

});
