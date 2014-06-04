/*global _, $, util, ko */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.model"),
        defaultOptions = {
            updateUrl: null,
            updateType: "GET",
            uploadUrl: null,
            uploadType: "POST",
            removeUrl: null,
            removeType: "DELETE"
        };

    ns.MusicModel = function MusicModel(o) {
        var that = this,
            options = _.defaults(o || {}, defaultOptions);

        that.data = ko.observable({});

        that.update = function (o) {
            return $.ajax({
                type: options.updateType,
                url: options.updateUrl,
                dataType: "json"
            }).then(function (data, status, xhr) {
                _.each(data, function (x) {
                    x.name = util.htmlspecialchars_decode(x.name);
                });

                var oldData = that.data(),
                    newData = {},
                    both = _.intersection(_.keys(oldData), _.keys(data));

                // 新旧両方にあるものはそのままのオブジェクトを用いて中身更新
                _.each(both, function (x) {
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
            });
        };

        that. upload = function (data) {
            return $.ajax({
                type: options.uploadType,
                url: options.uploadUrl,
                data: data,
                dataType: "json",
                processData: false,
                contentType: false
            });
        };

        that.remove = function (data) {
            return $.ajax({
                type: options.removeType,
                url: options.removeUrl,
                data: data,
                dataType: "json"
            });
        };
    };

});
