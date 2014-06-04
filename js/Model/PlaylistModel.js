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

    ns.PlaylistModel = function (o) {
        var that = this,
            options = _.defaults(o || {}, defaultOptions);

        that.data = ko.observable({});

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

        that.create = function (name) {
            return $.ajax({
                type: options.createType,
                url: options.createUrl,
                data: { name: name },
                dataType: "json"
            });
        };

        that.remove = function (playlist_id) {
            return $.ajax({
                type: options.removeType,
                url: options.removeUrl,
                data: { playlist_id: playlist_id },
                dataType: "json"
            });
        };

        that.currentClear = function () {
            return $.ajax({
                type: options.currentClearType,
                url: options.currentClearUrl,
                dataType: "json"
            });
        };

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

        that.removeMusic = function (playlist_id, musics_id) {
            var dfd = $.Deferred().resolve();

            while (musics_id.length) {
                dfd = dfd.then($.ajax.bind(this, {
                    type: options.removeMusicType,
                    url: options.removeMusicUrl,
                    dataType: "json",
                    data: {
                        playlist_id: playlist_id,
                        music_id: musics_id.pop()
                    }
                }));
            }

            return dfd;
        };
    };

});