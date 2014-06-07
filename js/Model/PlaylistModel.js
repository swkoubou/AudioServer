/*global _, $, util, ko */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.model"),
        defaultOptions = {
            updateUrl: null,
            updateType: "GET",
            createUrl: null,
            createType: "POST",
            removeUrl: null,
            removeType: "POST",
            currentClearUrl: null,
            currentClearType: "POST",
            addMusicUrl: null,
            addMusicType: "POST",
            removeMusicUrl: null,
            removeMusicType: "POST"
        };

    /**
     * プレイリストに関するModel
     *
     * @param {!Object} o
     * @param {string} o.updateUrl
     * @param {string} o.createUrl
     * @param {string} o.removeUrl
     * @param {string} o.currentClearUrl
     * @param {string} o.addMusicUrl
     * @param {string} o.removeMusicUrl
     * @param {string} [o.updateType="GET"]
     * @param {string} [o.createType="POST"]
     * @param {string} [o.removeType="POST"]
     * @param {string} [o.currentClearType="POST"]
     * @param {string} [o.addMusicType="POST"]
     * @param {string} [o.removeMusicType="POST"]
     * @constructor
     */
    ns.PlaylistModel = function (o) {
        var that = this,
            options = _.defaults(o || {}, defaultOptions);

        /**
         * 全てのプレイリストを持つ連想配列
         * プレイリストIDがキーとなる
         *
         * @type {Object}
         */
        that.data = ko.observable({});

        /**
         * プレイリストリストを更新する
         *
         * @returns {Deferred}
         */
        that.update = function () {
            return $.ajax({
                type: options.updateType,
                url: options.updateUrl,
                dataType: "json"
            }).then(function (data, status, xhr) {
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

                // Currentを先頭に
                newData = _.omit(newData, -1);

                // 更新
                that.data(newData);
            });
        };

        /**
         * プレイリストを作成する
         *
         * @param {string} name プレイリスト名
         * @returns {Deferred}
         */
        that.create = function (name) {
            return $.ajax({
                type: options.createType,
                url: options.createUrl,
                data: { name: name },
                dataType: "json"
            });
        };

        /**
         * プレイリストを削除する
         *
         * @param {number} playlist_id プレイリストID
         * @returns {Deferred}
         */
        that.remove = function (playlist_id) {
            return $.ajax({
                type: options.removeType,
                url: options.removeUrl,
                data: { playlist_id: playlist_id },
                dataType: "json"
            });
        };

        /**
         * カレントプレイリストをクリアする
         *
         * @returns {Deferred}
         */
        that.currentClear = function () {
            return $.ajax({
                type: options.currentClearType,
                url: options.currentClearUrl,
                dataType: "json"
            });
        };

        /**
         * プレイリストに曲を追加する
         *
         * @param playlist_id 追加先のプレイリストID
         * @param musics_id 追加する曲ID
         * @returns {Deferred}
         */
        that.addMusic = function (playlist_id, musics_id) {
            return $.ajax({
                type: options.addMusicType,
                url: options.addMusicUrl,
                data: {
                    playlist_id: playlist_id,
                    music_id: musics_id
                },
                dataType: "json"
            });
        };

        /**
         * プレイリストから曲を削除する
         *
         * @param playlist_id 削除元のプレイリストID
         * @param musics_id 削除する曲ID
         * @returns {Deferred}
         */
        that.removeMusic = function (playlist_id, musics_id) {
            return _.reduce(musics_id, function (dfd, music_id) {
                return dfd.then($.ajax.bind(this, {
                    type: options.removeMusicType,
                    url: options.removeMusicUrl,
                    dataType: "json",
                    data: {
                        playlist_id: playlist_id,
                        music_id: music_id
                    }
                }));
            }, $.Deferred().resolve());
        };
    };

});