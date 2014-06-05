/*global _, ko, $, util */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.viewmodel");

    ns.AudioServerViewModel = function (models) {
        var that = this,
            musicModel = models.musicModel,
            playlistModel = models.playlistModel,
            statusModel = models.statusModel,
            userModel = models.userModel;

        // 曲リスト
        that.musics = ko.computed(function () {
            var data = musicModel.data();
            return data ? _.values(musicModel.data()) : [];
        });

        // 全ての曲のIDリスト(All)
        that.allMusicIds = ko.observable([]);
        musicModel.data.subscribe(function () {
            that.allMusicIds(_.chain(musicModel.data()).keys().map(function (x) { return parseInt(x, 10); }).value());
        });

        // プレイリスト:All
        that.allMusicPlaylist = {
            id: 0,
            name: 'All',
            data: that.allMusicIds
        };

        // プレイリストに属してない曲リスト(Other)
        that.otherMusicIds = ko.observable([]);
        playlistModel.data.subscribe(function () {
            var in_playlist = _.chain(playlistModel.data()).omit(-1).values().map(function (x) {
                return x.data();
            }).flatten().unique().value();
            that.otherMusicIds(_.difference(that.allMusicIds(), in_playlist));
        });

        // プレイリスト:Other
        that.otherMusicPlaylist = {
            id: -2,
            name: 'Other',
            data: that.otherMusicIds
        };

        // プレイリストのリスト
        that.playlists = ko.computed(function () {
            var obj = playlistModel.data(),
                ary = [];

            if (obj) {
                ary = _.chain(obj).omit("-1").values(obj).value();
                ary.unshift(that.otherMusicPlaylist);
                ary.unshift(that.allMusicPlaylist);
                ary.unshift(obj["-1"]);
            }

            return ary;
        });

        // 再生中の曲
        that.nowMusic = ko.computed(function () {
            var id = statusModel.data.playingMusic();
            return musicModel.data()[id] || null;
        });

        // 再生中のプレイリスト
        that.nowPlaylist = ko.computed(function () {
            return playlistModel.data()['-1'] || [];
        });

        // ステータス
        that.status = statusModel.data;

        // 操作中のプレイリスト
        that.currentPlaylist = ko.observable();

        // 直前のcurrentMusicsのkey-value
        that.oldCurrentMusic = function () {
            var list = that.currentMusics ? that.currentMusics() : [],
                res = {};

            _.each(list, function (x) {
                res[x.data.id] = x;
            });
            return res;
        };

        // 操作中のプレイリストの曲リスト
        that.currentMusics = ko.computed(function () {
            var list = that.currentPlaylist(),
                ids = !_.isObject(list) ? [] : _.isFunction(list.data) ? list.data() : list.data,
                musics = musicModel.data(),
                old = that.oldCurrentMusic();

            return _.isObject(ids) ?
                _.reduce(ids, function (res, id) {
                    musics[id] && res.push({
                        data: musics[id],
                        checked: ko.observable(old[id] ? old[id].checked() : false)
                    });
                    return res;
                }, []) : [];
        });

        // 操作中のプレイリストのチェックリスト
        that.checkCurrentMusics = ko.computed(function () {
            return _.filter(that.currentMusics(), function (x) {
                return x.checked();
            });
        });

        // 操作中のプレイリストのチェックリストのIDリスト
        that.checkCurrentMusicIds = ko.computed(function () {
            return _.reduce(that.checkCurrentMusics(), function (xs, x) {
                xs.push(x.data.id);
                return xs;
            }, []);
        });

        /*
         * method
         */

        // ステータスを更新する
        that.statusUpdate = statusModel.update.bind(statusModel);

        // 全ての情報を更新する
        that.update = function () {
            return musicModel.update()
                .then(playlistModel.update.bind(playlistModel))
                .then(statusModel.update.bind(statusModel));
        };

        // 開始/停止する
        that.play = function () {
            return statusModel.change("play", !statusModel.data.isPlay())
                .always(function () { statusModel.update(); })
        };

        // ボリュームを変更する
        that.changeVolume = function () {
            statusModel.data.volume($(".music-volume").val());

            return statusModel.change("volume", statusModel.data.volume())
                .always(function () { statusModel.update(); });
        };

        // リピート再生モードを切り替える
        that.repeat = function () {
            return statusModel.change("repeat", !statusModel.data.isRepeat())
                .always(function () { statusModel.update(); })
        };

        // ランダム再生モードを切り替える
        that.random = function () {
            return statusModel.change("random", !statusModel.data.isRandom())
                .always(function () { statusModel.update(); });
        };

        // 曲のチェックをON/OFFする
        that.checkMusic = function () {
            this.checked(!this.checked());
            return true; // enable event bubble
        };

        // 全ての曲のチェックをON/OFFする
        that.allChecked = ko.computed(function () {
            var list = that.currentMusics();
            return list.length && _.every(list, function (x) {
                return x.checked();
            });
        }, that, {
            write: function (value) {
                value = _.isBoolean(value) ? value : !that.allChecked();
                _.each(that.currentMusics(), function (x) {
                    x.checked(value);
                });
            }
        });

        // プレイリストが変更されたら全てのチェックをOFFにする
        that.currentPlaylist.subscribe(function () {
            that.allChecked(false);
        });

        /*
         * user name
         */

        // ユーザ
        that.user = ko.observable("");

        // ユーザID
        that.userId = ko.observable();

        // ユーザ名
        that.userName = ko.computed(function () {
            var id = that.userId(),
                obj = that.user(),
                name = _.isFunction(obj.name) ? obj.name() : obj.name;

            return (obj.id == id && name) ? name : id;
        });

        // 新規ユーザ
        that.originalUser = {
            id: 0,
            name: ko.observable("New User")
        };

        // ユーザ名のバリデーション状態
        that.validationUserName = ko.computed(function () {
            return !!that.userId();
        });

        // ユーザ名リスト
        that.userList = ko.computed(function () {
            return userModel.data ?
                _.chain(userModel.data()).values().unshift(that.originalUser).value() : [];
        });

        //

        /*
         * new playlist
         */

        // 新規プレイリスト名
        that.newPlaylistName = ko.observable();

        // 新規プレイリスト名のバリデーション状態
        that.validationPlaylistName = ko.computed(function () {
            var name = that.newPlaylistName();
            return name && !_.some(playlistModel.data(), function (x) { return x.name === name; });
        });

        // 新規プレイリストを作成する
        that.createNewPlaylist = function () {
            if (!that.validationPlaylistName()) {
                return $.Deferred().reject();
            }

            return playlistModel.create(that.newPlaylistName())
                .done(function () {
                    that.update();
                    that.newPlaylistName("");
                });
        };

        /*
         * new music
         */

        that.uploadFileName = ko.observable();

        // Musicをアップロードする
        that.uploadMusic = function (e) {
            // FormData オブジェクトを作成
            var fd = new FormData(),
                files = e.file.files,
                name = that.userName(),
                dfd = $.Deferred().resolve();

            fd.append("name", that.userName());

            _.each(files, function (file) {
                var fd = new FormData();
                that.uploadFileName(file.name);
                fd.append("name", name);
                fd.append("file", file);

                dfd.then(function () {
                    musicModel.upload({ data: fd });
                });
            });

            dfd.always(function () {
                $(".modal").modal('hide');
            });

            return dfd;
        };

        // dropイベント
        that.dropUploadMusic = function (obj, e) {
            console.log(e.originalEvent.dataTransfer.files);
            return that.cancelBubble(obj, e);
        };

        /*
         * add music to playlist
         */

        // 曲の追加先プレイリストのリスト
        that.whereAddPlaylistList = ko.computed(function () {
            return _.without(that.playlists(), that.allMusicPlaylist, that.otherMusicPlaylist);
        });

        // 曲の追加先プレイリスト
        that.whereAddPlaylist = ko.observable(that.playlists()[0]);
        that.whereAddPlaylistList.subscribe(function (new_data) {
            var id = that.whereAddPlaylist() ? that.whereAddPlaylist().id : undefined;
            that.whereAddPlaylist(playlistModel.data()[id] ? playlistModel.data()[id] : new_data[0]);
        });

        // 曲をプレイリストに追加
        that.addMusicToPlaylist = function () {
            return playlistModel.addMusic(that.whereAddPlaylist().id, that.checkCurrentMusicIds())
                .done(function () { that.update(); });
        };

        /*
         * delete music from playlist
         */

        // 曲をプレイリストから削除
        that.removeMusicFromPlaylist = function () {
            return playlistModel.removeMusic(that.currentPlaylist().id, that.checkCurrentMusicIds())
                .done(function () { that.update(); });
        };

        /*
         * current clear
         */

        // カレントプレイリストのリセット
        that.clearCurrentPlaylist = function () {
            return playlistModel.currentClear()
                .done(function () { that.update(); });
        };

        /*
         * remove playlist
         */

        // プレイリストを削除
        that.removePlaylist = function () {
            return playlistModel.remove(that.currentPlaylist().id)
                .done(function () {
                    that.currentPlaylist(that.playlists[0]);
                    that.update();
                });
        };

        /*
         * step
         */

        // 次の曲へ
        that.stepForward = function () {
            return statusModel.stepForward()
                .done(function () { that.update(); });
        };

        // 前の曲へ
        that.stepBack = function () {
            return statusModel.stepBack()
                .done(function () { that.update(); });
        };

        // 曲を選択
        that.selectMusic = function (id) {
            return statusModel.select(id)
                .done(function () { that.update(); });
        };
    };
});
