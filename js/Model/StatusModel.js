/*global _, $, util, ko */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.model");

    ns.StatusModel = function (options) {
        var that = this,
            defaultOptions = {
                updateUrl: null,
                updateType: "GET",
                changeUrl: null,
                changeType: "POST",
                stepForwardUrl: null,
                stepForwardType: "POST",
                stepBackUrl: null,
                stepBackType: "POST",
                selectUrl: null,
                selectType: "POST"
            };

        that = {
            options: _.defaults(options, defaultOptions),

            data: {
                isPlay: ko.observable(),
                isRepeat: ko.observable(),
                isRandom: ko.observable(),
                volume: ko.observable(),
                playingMusic: ko.observable()
            },

            update: function (o) {
                o = o || {};

                $.ajax({
                    type: that.options.updateType,
                    url: that.options.updateUrl,
                    dataType: "json",
                    success: function (data, status, xhr) {
                        that.data.isPlay(data.isPlay === "true");
                        that.data.isRepeat(data.isRepeat === "on");
                        that.data.isRandom(data.isRandom === "on");
                        that.data.volume(data.volume);
                        that.data.playingMusic(data.musicID);

                        o.success && o.success();
                    },
                    error: o.error || null
                });
            },

            change: function (type, value, o) {
                o = o || {};

                $.ajax({
                    type: that.options.changeType,
                    url: that.options.changeUrl,
                    data: {
                        type: type,
                        value: _.isBoolean(value) ?
                            (value ? "on" : "off") : value
                    },
                    dataType: "json",
                    success: o.success || null,
                    error: o.error || null
                });
            },

            stepForward: function (o) {
                o = o || {};

                $.ajax({
                    type: that.options.stepForwardType,
                    url: that.options.stepForwardUrl,
                    dataType: "json",
                    data: { type: "next" },
                    success: o.success || null,
                    error: o.error || null
                });
            },

            stepBack: function (o) {
                o = o || {};

                $.ajax({
                    type: that.options.stepBackType,
                    url: that.options.stepBackUrl,
                    dataType: "json",
                    data: { type: "prev" },
                    success: o.success || null,
                    error: o.error || null
                });
            },

            select: function (music_id, o) {
                o = o || {};

                $.ajax({
                    type: that.options.selectType,
                    url: that.options.selectUrl,
                    data: {
                        music_id: music_id
                    },
                    dataType: "json",
                    success: o.success || null,
                    error: o.error || null
                });
            }
        };

        return that;
    };
});
