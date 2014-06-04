/*global _, $, util, ko */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.model"),
        defaultOptions = {
            updateUrl: null,
            updateType: "GET"
        };

    ns.UserModel = function (o) {
        var that = this,
            options = _.defaults(o, defaultOptions);

        that.data = ko.observable({});

        that.update = function () {
            $.ajax({
                type: options.updateType,
                url: options.updateUrl,
                dataType: "json"
            }).then(function (data, status, xhr) {
                var oldData = that.data(),
                    newData = oldData,
                    both = _.intersection(_.keys(oldData), _.keys(data));

                // 新旧両方にあるものはそのままのオブジェクトを用いて中身更新
                _.each(both, function (x) {
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
            });
        };
    };

});