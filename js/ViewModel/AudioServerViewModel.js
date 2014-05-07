/*global _, ko, $, util */

$(function () {
    "use strict";

    var ns = util.namespace("swkoubou.audioserver.viewmodel");

    ns.AudioServerViewModel = function (models, user_options) {
        var that = this,
            defaultOptions = {
                waitHideAlert: 5000,
                maxAlert: 5,
                alerts: {
                    updateSuccess: null,
                    updateError: null,
                    statusUpdateSuccess: null,
                    statusUpdateError: null,
                    playSuccess: null,
                    playError: null,
                    changeVolumeSuccess: null,
                    changeVolumeError: null,
                    repeatSuccess: null,
                    repeatError: null,
                    randomSuccess: null,
                    randomError: null,
                    createPlaylistSuccess: null,
                    createPlaylistError: null,
                    uploadMusicSuccess: null,
                    uploadMusicError: null,
                    addMusicToPlaylistSuccess: null,
                    addMusicToPlaylistError: null,
                    removeMusicFromPlaylistSuccess: null,
                    removeMusicFromPlaylistError: null,
                    currentPlaylistClearSuccess: null,
                    currentPlaylistClearError: null,
                    removePlaylistSuccess: null,
                    removePlaylistError: null,
                    stepForwardSuccess: null,
                    stepForwardError: null,
                    stepBackSuccess: null,
                    stepBackError: null,
                    selectMusicSuccess: null,
                    selectMusicError: null
                }
            },
            options = _.defaults(user_options || {}, defaultOptions),
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

        // アラートリスト
        that.alerts = ko.observableArray();

        // ロード中かどうか
        that.isLoading = ko.observable(false);

        /*
         * method
         */

        // ステータスを更新する
        that.statusUpdate = function (alert) {
            alert = _.isBoolean(alert) ? alert : true;
            that.isLoading(true);

            statusModel.update({
                success: function () {
                    alert && that.alert(options.alerts.statusUpdateSuccess);
                    that.isLoading(false);
                }, error: function () {
                    alert && that.alert(options.alerts.statusUpdateError);
                    that.isLoading(false);
                }
            })
        };

        // 全ての情報を更新する
        that.update = function (o) {
            var opt = _.defaults(o || {}, {
                success: function () { },
                error: function () { },
                loading: false
            }), success = function () {
                options.alerts.updateSuccess && that.alert(options.alerts.updateSuccess);
                opt.loading && that.isLoading(false);
                opt.success();
            }, error = function () {
                options.alerts.updateError && that.alert(options.alerts.updateError);
                opt.loading && that.isLoading(false);
                opt.error();
            };

            opt.loading && that.isLoading(true);

            musicModel.update({
                success: function () {
                    playlistModel.update({
                        success: function () {
                            statusModel.update({
                                success: function () {
                                    userModel.update({
                                        success: success,
                                        error: error
                                    })
                                },
                                error: error
                            });
                        },
                        error: error
                    });
                },
                error: error
            });
        };

        // 開始/停止する
        that.play = function () {
            that.isLoading(true);

            statusModel.change("play", !statusModel.data.isPlay(), {
                success: function () {
                    that.alert(options.alerts.playSuccess);
                    that.statusUpdate(false);
                },
                error: function () {
                    that.alert(options.alerts.playError);
                    that.isLoading(false);
                }
            });
        };

        // ボリュームを変更する
        that.changeVolume = function () {
            that.isLoading(true);

            console.log(statusModel.data.volume());

            statusModel.change("volume", statusModel.data.volume(), {
                success: function () {
                    that.alert(options.alerts.changeVolumeSuccess);
                    that.statusUpdate(false);
                },
                error: function () {
                    that.alert(options.alerts.changeVolumeError);
                    that.statusUpdate(false);
                }
            });

            return true; // enable event bubble
        };

        // リピート再生モードを切り替える
        that.repeat = function () {
            that.isLoading(true);

            statusModel.change("repeat", !statusModel.data.isRepeat(), {
                success: function (data) {
                    that.alert(options.alerts.repeatSuccess);
                    that.statusUpdate(false);
                },
                error: function () {
                    that.alert(options.alerts.repeatError);
                    that.isLoading(false);
                }
            });
        };

        // ランダム再生モードを切り替える
        that.random = function () {
            that.isLoading(true);

            statusModel.change("random", !statusModel.data.isRandom(), {
                success: function () {
                    that.alert(options.alerts.randomSuccess);
                    that.statusUpdate(false);
                },
                error: function () {
                    that.alert(options.alerts.randomError);
                    that.isLoading(false);
                }
            });
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

        // アラートを追加する
        that.alert = function (o) {
            var obj;

            if (!o) {
                return;
            }

            obj = _.defaults(o || {}, {
                title: "",
                message: "",
                isSuccess: false
            });

            that.alerts.unshift(obj);

            // maxAlert以上のアラートを削除
            that.alerts.splice(options.maxAlert);

            // x秒後に自動的に削除
            setTimeout(function () {
                that.alerts.remove(obj);
            }, options.waitHideAlert);
        };

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
        that.createNewPlaylist = function (o) {
            if (that.validationPlaylistName()) {
                that.isLoading(true);

                playlistModel.create(that.newPlaylistName(), {
                    success: function () {
                        that.alert(options.alerts.createPlaylistSuccess);
                        that.isLoading(false);
                        that.update(o);
                        that.newPlaylistName("");
                    },
                    error: function () {
                        that.alert(options.alerts.createPlaylistError);
                        that.isLoading(false);
                    }
                });
            }
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
                done = function () {
                    $(".modal").modal('hide');
                    that.isLoading(false);
                };

            fd.append("name", that.userName());

            (function loop (idx) {
                var file = files[idx];
                that.uploadFileName(file.name);
                fd.append("file", file);

                that.isLoading(true);

                musicModel.upload({
                    data: fd,
                    success: function () {
                        that.alert(options.alerts.uploadMusicSuccess);
                        if (idx + 1 === files.length) {
                            done();
                        }else {
                            loop(idx + 1);
                        }
                    },
                    error: function (xhr, thrown, status) {
			            console.log(xhr, thrown, status);
                        that.alert(options.alerts.uploadMusicError);
                        done();
                    }
                });

            }(0));
        };

        // イベントキャンセル
        that.cancelEvent = function (obj, e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        // dropイベント
        that.dropUploadMusic = function (obj, e) {
            console.log(e.originalEvent.dataTransfer.files);
            return that.cancelEvent(obj, e);
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
            that.isLoading(true);

            playlistModel.addMusic(that.whereAddPlaylist().id, that.checkCurrentMusicIds(), {
                success: function () {
                    that.alert(options.alerts.addMusicToPlaylistSuccess);
                    that.isLoading(false);
                    that.update();
                },
                error: function () {
                    that.alert(options.alerts.addMusicToPlaylistError);
                    that.isLoading(false);
                }
            });
        };

        /*
         * delete music from playlist
         */

        // 曲をプレイリストから削除
        that.removeMusicFromPlaylist = function () {
            that.isLoading(true);

            playlistModel.removeMusic(that.currentPlaylist().id, that.checkCurrentMusicIds(), {
                success: function () {
                    that.alert(options.alerts.removeMusicFromPlaylistSuccess);
                    that.isLoading(false);
                    that.update();
                },
                error: function (x, h, r) {
                    console.log(x, h, r);
                    that.alert(options.alerts.removeMusicFromPlaylistError);
                    that.isLoading(false);
                }
            });
        };

        /*
         * current clear
         */

        // カレントプレイリストのリセット
        that.clearCurrentPlaylist = function () {
            that.isLoading(true);

            playlistModel.currentClear({
                success: function () {
                    that.alert(options.alerts.currentPlaylistClearSuccess);
                    that.isLoading(false);
                    that.update();
                },
                error: function (x, h, r) {
                    console.log(x, h, r);
                    that.alert(options.alerts.currentPlaylistClearError);
                    that.isLoading(false);
                }
            });
        };

        /*
         * remove playlist
         */

        // プレイリストを削除
        that.removePlaylist = function () {
            that.isLoading(true);

            playlistModel.remove(that.currentPlaylist().id, {
                success: function () {
                    that.alert(options.alerts.removePlaylistSuccess);
                    that.isLoading(false);
                    that.currentPlaylist(that.playlists[0]);
                    that.update();
                },
                error: function (x, h, r) {
                    console.log(x, h, r);
                    that.alert(options.alerts.removePlaylistError);
                    that.isLoading(false);
                }
            });
        };

        /*
         * step
         */

        // 次の曲へ
        that.stepForward = function () {
            that.isLoading(true);

            statusModel.stepForward({
                success: function () {
                    that.alert(options.alerts.stepForwardSuccess);
                    that.isLoading(false);
                    that.update();
                },
                error: function (x, h, r) {
                    console.log(x, h, r);
                    that.alert(options.alerts.stepForwardError);
                    that.isLoading(false);
                }
            });
        };

        // 前の曲へ
        that.stepBack = function () {
            that.isLoading(true);

            statusModel.stepBack({
                success: function () {
                    that.alert(options.alerts.stepBackSuccess);
                    that.isLoading(false);
                    that.update();
                },
                error: function (x, h, r) {
                    console.log(x, h, r);
                    that.alert(options.alerts.stepBackError);
                    that.isLoading(false);
                }
            });
        };

        // 曲を選択
        that.selectMusic = function (id, obj, event) {
            that.isLoading(true);

            statusModel.select(id, {
                success: function () {
                    that.alert(options.alerts.selectMusicSuccess);
                    that.isLoading(false);
                    that.update();
                },
                error: function (x, h, r) {
                    console.log(x, h, r);
                    that.alert(options.alerts.selectMusicError);
                    that.isLoading(false);
                }
            });

            that.cancelEvent(obj, event); // cancel bubble
            return false;
        };

        return that;
    };
});
