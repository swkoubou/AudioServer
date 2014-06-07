/*global _, $, util, ko */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.model"),
        defaultOptions = {
            updateUrl: null,
            updateType: "GET",
            changeUrl: null,
            changeType: "POST",
            selectUrl: null,
            selectType: "POST"
        };

    /**
     * ステータスに関するModel
     *
     * @param {!Object} o
     * @param {string} o.updateUrl
     * @param {string} o.changeUrl
     * @param {string} o.selectUrl
     * @param {string} [o.updateType="GET"]
     * @param {string} [o.changeType="POST"]
     * @param {string} [o.selectType="POST"]
     * @constructor
     */
    ns.StatusModel = function (o) {
        var that = this,
            options = _.defaults(o || {}, defaultOptions);

        /**
         * 各ステータスの値を持つ連想配列
         * volume は[1,100]の数値
         * playlistMusic は再生中の曲ID
         *
         * @type {{isPlay: boolean, isRepeat: boolean, isRandom: boolean, volume: number, playingMusic: number}}
         */
        that.data = {
            isPlay: ko.observable(),
            isRepeat: ko.observable(),
            isRandom: ko.observable(),
            volume: ko.observable(),
            playingMusic: ko.observable()
        };

        /**
         * ステータスを更新する
         *
         * @returns {Deferred}
         */
        that.update = function () {
            return $.ajax({
                type: options.updateType,
                url: options.updateUrl,
                dataType: "json"
            }).then(function (data) {
                that.data.isPlay(data.isPlay === "true");
                that.data.isRepeat(data.isRepeat === "on");
                that.data.isRandom(data.isRandom === "on");
                that.data.volume(data.volume);
                that.data.playingMusic(data.musicID);
            });
        };

        /**
         * ステータスを変更する
         *
         * @param {string} type 変更するステータス名
         * @param {*} value 適用する値
         * @returns {Deferred}
         */
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

        /**
         * 次の曲へ進む
         *
         * @returns {Deferred}
         */
        that.stepForward = function () {
            return $.ajax({
                type: options.changeType,
                url: options.changeUrl,
                dataType: "json",
                data: { type: "next" }
            });
        };

        /**
         * 前の曲へ戻る
         *
         * @returns {Deferred}
         */
        that.stepBack = function () {
            return $.ajax({
                type: options.changeType,
                url: options.changeUrl,
                dataType: "json",
                data: { type: "prev" }
            });
        };

        /**
         * 曲を選択する
         *
         * @param {number} music_id 再生する曲ID
         * @returns {Deferred}
         */
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
