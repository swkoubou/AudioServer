/*global _, ko, $, util */

$(function () {
    "use strict";

    var model = util.namespace("swkoubou.audioserver.model"),
        viewmodel = util.namespace("swkoubou.audioserver.viewmodel"),
        test = false,
        musicModel = new model.MusicModel(test ? {
            updateUrl: "stub/music.php",
            uploadUrl: "stub/music.php",
            removeUrl: "stub/music.php"
        } : {
            updateUrl: "api/musiclist.php",
            uploadUrl: "api/upload.php",
            removeUrl: "stub/music.php"
        }), playlistModel = new model.PlaylistModel(test ? {
            updateUrl: "stub/playlist.php",
            createUrl: "stub/playlist.php",
            removeUrl: "stub/playlist.php",
            currentRemoveUrl: "stub/playlist.php",
            addMusicUrl: "stub/playlist/music.php",
            removeMusicUrl: "stub/playlist/music.php"
        } : {
            updateUrl: "api/playlist.php",
            createUrl: "api/playlist.php",
            removeUrl: "api/playlistdelete.php",
            currentClearUrl: "api/currentclear.php",
            addMusicUrl: "api/playlistmusicadd.php",
            removeMusicUrl: "api/playlistmusicdelete.php"
        }), statusModel = new model.StatusModel(test ? {
            updateUrl: "stub/status.php",
            changeUrl: "stub/status.php",
            stepForwardUrl: "stub/status.php",
            stepBackUrl: "stub/status.php",
            selectUrl: "stub/status.php"
        } : {
            updateUrl: "api/status.php",
            changeUrl: "api/status.php",
            stepForwardUrl: "api/stepforward.php",
            stepBackUrl: "api/stepback.php",
            selectUrl: "api/selectmusic.php"
        }), userModel = new model.UserModel(test ? {
            updateUrl: "stub/user.php"
        } : {
            updateUrl: "api/user.php"
        }), vm = new viewmodel.AudioServerViewModel({
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
                    message: statusModel.data.isPlay() ? "再生しました。" : "停止しました",
                    isSuccess: true
                },
                playError: {
                    title: "Error...",
                    message: statusModel.data.isPlay() ? "停止に失敗しました。" : "再生に失敗しました。",
                    isSuccess: false
                },
                changeVolumeSuccess: {
                    title: "Success!",
                    message: "音量を変更しました。",
                    isSuccess: true
                },
                changeVolumeError: {
                    title: "Error...",
                    message: "音量を変更できませんでした。",
                    isSuccess: false
                },
                repeatSuccess: {
                    title: "Success!",
                    message: statusModel.data.isRepeat() ? "リピートモードを有効にしました。" : "リピートモードを解除しました。",
                    isSuccess: true
                },
                repeatError: {
                    title: "Error...",
                    message: statusModel.data.isRepeat() ? "リピートモードの解除に失敗しました。" : "リピートモードの有効化に失敗しました。",
                    isSuccess: false
                },
                randomSuccess: {
                    title: "Success!",
                    message: statusModel.data.isRandom() ? "ランダムモードを有効にしました。" : "ランダムモードを解除しました。",
                    isSuccess: true
                },
                randomError: {
                    title: "Error...",
                    message: statusModel.data.isRepeat() ? "ランダムモードの解除に失敗しました。" : "ランダムモードの有効化に失敗しました。",
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
                    message: "uploaded ",
                    isSuccess: true
                },
                uploadMusicError: {
                    title: "Error...",
                    message: "cannot uploaded ",
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
        waitUpdate = 3000,
        initWait = 3000,
        update = function () {
            setTimeout(function () {
                vm.update({
                    success: update,
                    error: update
                })
            }, waitUpdate);
        },
        init = function () {
            vm.update({
                success: function () {
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
                },
                error: function () {
                    $(".loading-text").html("<p>読み込みに失敗しています...</p>");
                    setTimeout(init, initWait);
                }
            });
        };

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