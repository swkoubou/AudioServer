/*global _, ko, $, util */

$(function () {
    "use strict";

    var model = util.namespace("swkoubou.audioserver.model"),
        viewmodel = util.namespace("swkoubou.audioserver.viewmodel"),
        test = true,
        musicModel = new model.MusicModel({
            updateUrl: "api/musiclist.php",
            uploadUrl: "api/upload.php",
            removeUrl: "stub/music.php"
        }), playlistModel = new model.PlaylistModel({
            updateUrl: "api/playlist.php",
            createUrl: "api/playlist.php",
            removeUrl: "api/playlistdelete.php",
            currentClearUrl: "api/currentclear.php",
            addMusicUrl: "api/playlistmusicadd.php",
            removeMusicUrl: "api/playlistmusicdelete.php"
        }), statusModel = new model.StatusModel({
            updateUrl: test ? "stub/status.php" : "api/status.php",
            changeUrl: test ? "stub/status.php" : "api/status.php",
            stepForwardUrl: test ? "stub/status.php" : "api/status.php",
            stepBackUrl: test ? "stub/status.php" : "api/status.php",
            selectUrl: "api/selectmusic.php"
        }), userModel = new model.UserModel({
            updateUrl: "api/user.php"
        }), loadingViewModel = new viewmodel.LoadingViewModel({

        }), audioServerViewModel = new viewmodel.AudioServerViewModel({
            musicModel: musicModel,
            playlistModel: playlistModel,
            statusModel: statusModel,
            userModel: userModel
        }, {
            waitHideAlert: 2000,
            maxAlert: 5,
            alerts: {
//                updateSuccess: { },  // 同期成功時はメッセージ無し},
                updateError: {
                    title: "Error",
                    message: "同期失敗...",
                    isSuccess: false
                },
                statusUpdateSuccess: {
                    title: "Success!",
                    message: "ステータスを同期しました。",
                    isSuccess: true
                },
                statusUpdateError: {
                    title: "Error...",
                    message: "ステータスの同期に失敗しました。",
                    isSuccess: false
                },
                playSuccess: {
                    title: "Success!",
                    message: function () {
                        return statusModel.data.isPlay() ? "停止しました" : "再生しました。";
                    },
                    isSuccess: true
                },
                playError: {
                    title: "Error...",
                    message: function () {
                        return statusModel.data.isPlay() ? "再生に失敗しました。" : "停止に失敗しました。";
                    },
                    isSuccess: false
                },
                changeVolumeSuccess: {
                    title: "Success!",
                    message: function () {
                        return "音量を変更しました。(" + statusModel.data.volume() + ")";
                    },
                    isSuccess: true
                },
                changeVolumeError: {
                    title: "Error...",
                    message: function () {
                        return "音量を変更できませんでした。(" + statusModel.data.volume() + ")";
                    },
                    isSuccess: false
                },
                repeatSuccess: {
                    title: "Success!",
                    message: function () {
                        return statusModel.data.isRepeat() ? "リピートモードを解除しました。" : "リピートモードを有効にしました。" ;
                    },
                    isSuccess: true
                },
                repeatError: {
                    title: "Error...",
                    message: function () {
                        return statusModel.data.isRepeat() ? "リピートモードの有効化に失敗しました。" : "リピートモードの解除に失敗しました。";
                    },
                    isSuccess: false
                },
                randomSuccess: {
                    title: "Success!",
                    message: function () {
                        return statusModel.data.isRandom() ? "ランダムモードを解除しました。" : "ランダムモードを有効にしました。";
                    },
                    isSuccess: true
                },
                randomError: {
                    title: "Error...",
                    message: function () {
                        return statusModel.data.isRepeat() ? "ランダムモードの有効化に失敗しました。" : "ランダムモードの解除に失敗しました。";
                    },
                    isSuccess: false
                },
                createPlaylistSuccess: {
                    title: "Success!",
                    message: "プレイリストを作成しました。",
                    isSuccess: true
                },
                createPlaylistError: {
                    title: "Error...",
                    message: "プレイリストを作成できませんでした。",
                    isSuccess: false
                },
                uploadMusicSuccess: {
                    title: "Success!",
                    message: function () {
                        return "uploaded " + vm.uploadFileName()
                    },
                    isSuccess: true
                },
                uploadMusicError: {
                    title: "Error...",
                    message: function () {
                        return "cannot uploaded " + vm.uploadFileName() + " so cancel upload."
                    },
                    isSuccess: false
                },
                addMusicToPlaylistSuccess: {
                    title: "Success!",
                    message: "プレイリストに曲を追加しました。",
                    isSuccess: true
                },
                addMusicToPlaylistError: {
                    title: "Error...",
                    message: "プレイリストの曲追加に失敗しました。",
                    isSuccess: false
                },
                removeMusicFromPlaylistSuccess: {
                    title: "Success!",
                    message: "プレイリストの曲追加に成功しました。",
                    isSuccess: true
                },
                removeMusicFromPlaylistError: {
                    title: "Error...",
                    message: "プレイリストの曲削除に失敗しました。",
                    isSuccess: false
                },
                currentPlaylistClearSuccess: {
                    title: "Success!",
                    message: "カレントプレイリストをクリアしました。",
                    isSuccess: true
                },
                currentPlaylistClearError: {
                    title: "Error...",
                    message: "カレントプレイリストのクリアできませんでした。",
                    isSuccess: false
                },
                removePlaylistSuccess: {
                    title: "Success!",
                    message: "プレイリストを削除しました。。",
                    isSuccess: true
                },
                removePlaylistError: {
                    title: "Error...",
                    message: "プレイリストを削除できませんでした。",
                    isSuccess: false
                },
                stepForwardSuccess: {
                    title: "Success!",
                    message: "次の曲へ進みました。",
                    isSuccess: true
                },
                stepForwardError: {
                    title: "Error...",
                    message: "次の曲へ進めませんでした。",
                    isSuccess: false
                },
                stepBackSuccess: {
                    title: "Success!",
                    message: "前の曲へ進みました。",
                    isSuccess: true
                },
                stepBackError: {
                    title: "Error...",
                    message: "前の曲へ進めませんでした。",
                    isSuccess: false
                },
                selectMusicSuccess: {
                    title: "Success!",
                    message: "曲を選択しました。",
                    isSuccess: true
                },
                selectMusicError: {
                    title: "Error...",
                    message: "曲の選択に失敗しました。",
                    isSuccess: false
                }
            }
        }),
        vm = _.extend(audioServerViewModel, loadingViewModel),
        waitUpdate = 3000,
        initWait = 3000,
        update = function () {
            setTimeout(function () {
                vm.update().always(update);
            }, waitUpdate);
        },
        init = function () {
            vm.update()
                .done(function () {
                    // 再生プレイリストをカレントプレイリストにする
                    vm.currentPlaylist(vm.playlists()[0]);
                    // ローディングテキストのクリア
                    $(".loading-text").html("");
                    // コンテンツを可視状態にする
                    $(".wrapper").css("display", "block");
                    // VMを適用する
                    ko.applyBindings(vm);
                    // 移行
                    update();
                })
                .fail(function () {
                    $(".loading-text").html("<p>読み込みに失敗しています...</p>");
                    setTimeout(init, initWait);
                });
        };

    // loading wrapping
    loadingViewModel.wrapDeferredAll(audioServerViewModel, [
        "statusUpdate",
        "play",
        "changeVolume",
        "repeat",
        "random",
        "createNewPlaylist",
        "uploadMusic",
        "addMusicToPlaylist",
        "removeMusicFromPlaylist",
        "clearCurrentPlaylist",
        "removePlaylist",
        "stepForward",
        "stepBack",
        "selectMusic"
    ]);

    // cancel event ! 戻り値はfalseに固定される !
    util.wrapCancelEventAll(audioServerViewModel, [
        "changeVolume",
        "selectMusic"
    ]);

    // init
    init();

    // スマホで切り替え
    if (util.isSmartAgent()) {
        // スマホ

    } else {
        // PC
        // tooltipを有効にする
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="modal"]').tooltip();
    }
});
