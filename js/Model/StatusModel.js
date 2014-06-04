/*global _, $, util, ko */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.model"),
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

    ns.StatusModel = function (o) {
        var that = this,
            options = _.defaults(o || {}, defaultOptions);

        that.data = {
            isPlay: ko.observable(),
            isRepeat: ko.observable(),
            isRandom: ko.observable(),
            volume: ko.observable(),
            playingMusic: ko.observable()
        };

        that.update = function () {
            return $.ajax({
                type: options.updateType,
                url: options.updateUrl,
                dataType: "json"
            }).then(function (data, status, xhr) {
                that.data.isPlay(data.isPlay === "true");
                that.data.isRepeat(data.isRepeat === "on");
                that.data.isRandom(data.isRandom === "on");
                that.data.volume(data.volume);
                that.data.playingMusic(data.musicID);
            });
        };

        that.change = function (type, value) {
            return $.ajax({
                type: options.changeType,
                url: options.changeUrl,
                data: {
                    type: type,
                    value: _.isBoolean(value) ?
                        (value ? "on" : "off") : value
                },
                dataType: "json"
            });
        };

        that.stepForward = function () {
            return $.ajax({
                type: options.stepForwardType,
                url: options.stepForwardUrl,
                dataType: "json",
                data: { type: "next" }
            });
        };

        that.stepBack = function () {
            return $.ajax({
                type: options.stepBackType,
                url: options.stepBackUrl,
                dataType: "json",
                data: { type: "prev" }
            });
        };

        that.select = function (music_id) {
            return $.ajax({
                type: options.selectType,
                url: options.selectUrl,
                data: { music_id: music_id },
                dataType: "json"
            });
        };
    };

});
