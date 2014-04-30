/*global _, $, util, ko */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.model");

    ns.MusicModel = function (options) {
        var that = this,
            defaultOptions = {
                updateUrl: null,
                updateType: "GET",
                uploadUrl: null,
                uploadType: "POST",
                removeUrl: null,
                removeType: "DELETE"
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
			_.each(data, function (x) {
			    x.name = util.htmlspecialchars_decode(x.name);
			});

                        var oldData = that.data(),
                            newData = {},
                            both = _.intersection(_.keys(oldData), _.keys(data));

                        // 新旧両方にあるものはそのままのオブジェクトを用いて中身更新
                        _.each(both, function(x) {
                            newData[x] = oldData[x];
                            newData[x].data(data[x].data);
                            newData[x].name(data[x].name);
                        });

                        // 旧データにない新しいデータは挿入
                        _.chain(data).omit(_.keys(oldData)).each(function (v, k) {
                            newData[k] = {
                                id: v.id,
                                name: ko.observable(v.name),
                                data: ko.observable(v.data)
                            }
                        });

                        // 更新
                        that.data(newData);

                        o.success && o.success();
                    },
                    error: o.error || null
                });
            },

            upload: function (o) {
                o = o || {};

                $.ajax({
                    type: that.options.uploadType,
                    url: that.options.uploadUrl,
                    data: o.data || null,
                    dataType: "json",
                    processData: false,
                    contentType: false,
                    success: o.success || null,
                    error: o.error || null
                });
            },

            remove: function (o) {
                o = o || {};

                $.ajax({
                    type: that.options.removeType,
                    url: that.options.removeUrl,
                    data: o.data || null,
                    dataType: "json",
                    success: o.success || null,
                    error: o.error || null
                });
            }
        };

        return that;
    };
});
