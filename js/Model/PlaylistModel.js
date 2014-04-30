/*global _, $, util, ko */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.model");

    ns.PlaylistModel = function (options) {
        var that = this,
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

                        // Currentを先頭に
                        newData = _.omit(newData, -1);

                        // 更新
                        that.data(newData);

                        o.success && o.success();
                    },
                    error: o.error || null
                });
            },

            create: function (name, o) {
                o = o || {};

                $.ajax({
                    type: that.options.createType,
                    url: that.options.createUrl,
                    data: {
                        name: name
                    },
                    dataType: "json",
                    success: o.success || null,
                    error: o.error || null
                });
            },

            remove: function (playlist_id, o) {
                o = o || {};

                $.ajax({
                    type: that.options.removeType,
                    url: that.options.removeUrl,
                    data: {
                        playlist_id: playlist_id
                    },
                    dataType: "json",
                    success: o.success || null,
                    error: o.error || null
                });
            },

            currentClear: function (o) {
                o = o || {};

                $.ajax({
                    type: that.options.currentClearType,
                    url: that.options.currentClearUrl,
                    dataType: "json",
                    success: o.success || null,
                    error: o.error || null
                });
            },

            addMusic: function (playlist_id, musics_id, o) {
                o = o || {};

                $.ajax({
                    type: that.options.addMusicType,
                    url: that.options.addMusicUrl,
                    data: {
                        playlist_id: playlist_id,
                        music_id: musics_id
                    },
                    dataType: "json",
                    success: o.success || null,
                    error: o.error || null
                });
            },

            removeMusic: function (playlist_id, musics_id, o) {
                o = _.defaults(o || {}, {
                    success: function () { },
                    error: function () { }
                });

                $.ajax({
                    type: that.options.removeMusicType,
                    url: that.options.removeMusicUrl,
                    data: {
                        playlist_id: playlist_id,
                        music_id: musics_id.pop()
                    },
                    dataType: "json",
                    success: function (data, type) {
                        if (musics_id.length) {
                            that.removeMusic(playlist_id, musics_id, o);
                        }else {
                            o.success(data, type);
                        }
                    },
                    error: o.error
                });
            }
        };

        return that;
    };
});