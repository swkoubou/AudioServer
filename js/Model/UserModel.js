/*global _, $, util, ko */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.model");

    ns.UserModel = function (options) {
        var that = this,
            defaultOptions = {
                updateUrl: null,
                updateType: "GET"
            };

        that = {
            options: _.defaults(options, defaultOptions),

            data: ko.observable({}),

            update: function (o) {
                o = o || {};

                $.ajax({
                    type: that.options.updateType,
                    url: that.options.updateUrl,
                    dataType: "json",
                    success: function (data, status, xhr) {
                        var oldData = that.data(),
                            newData = oldData,
                            both = _.intersection(_.keys(oldData), _.keys(data));

                        // 新旧両方にあるものはそのままのオブジェクトを用いて中身更新
                        _.each(both, function(x) {
                            newData[x].name(data[x].name);
                        });

                        // 旧データにない新しいデータは挿入
                        _.chain(data).omit(_.keys(oldData)).each(function (v, k) {
                            newData[k] = {
                                id: v.id,
                                name: ko.observable(v.name)
                            }
                        });

                        // 更新
                        that.data(newData);

                        o.success && o.success();
                    },
                    error: o.error || null
                });
            }
        };

        return that;
    };
});