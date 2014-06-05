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

    /**
     * 曲に関するModel
     *
     * @param {!Object} o
     * @param {string} o.updateUrl
     * @param {string} o.uploadUrl
     * @param {string} o.removeUrl
     * @param {string} [o.updateType="GET"]
     * @param {string} [o.uploadType="POST"]
     * @param {string} [o.removeType="DELETE"]
     * @constructor
     */
    ns.MusicModel = function MusicModel(o) {
        var that = this,
            options = _.defaults(o || {}, defaultOptions);

        /**
         * 全ての曲データを持つ連想配列
         * 曲IDがキーとなる
         *
         * @type {Object}
         */
        that.data = ko.observable({});

        /**
         * 曲リストを更新する
         *
         * @returns {Deferred}
         */
        that.update = function () {
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

        /**
         * 曲をアップロードする
         *
         * @param data アップロードする曲のデータ
         * @returns {Deferred}
         */
        that.upload = function (data) {
            return $.ajax({
                type: options.uploadType,
                url: options.uploadUrl,
                data: data,
                dataType: "json",
                processData: false,
                contentType: false
            });
        };

        /**
         * 曲を削除する（未実装）
         *
         * @param data 削除する曲のデータ
         * @returns {Deferred}
         */
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
