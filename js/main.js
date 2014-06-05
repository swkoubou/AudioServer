/*global _, ko, $, util */

$(function () {
    "use strict";

    var model = util.namespace("swkoubou.audioserver.model"),
        viewmodel = util.namespace("swkoubou.audioserver.viewmodel"),
        test = true, // trueのときはstubApiを叩く (また、そのようにコーディングする）
        musicModel = new model.MusicModel({
            updateUrl: "api/musiclist.php",
            uploadUrl: "api/upload.php",
            removeUrl: "stub/music.php"
        }),
        playlistModel = new model.PlaylistModel({
            updateUrl: "api/playlist.php",
            createUrl: "api/playlist.php",
            removeUrl: "api/playlistdelete.php",
            currentClearUrl: "api/currentclear.php",
            addMusicUrl: "api/playlistmusicadd.php",
            removeMusicUrl: "api/playlistmusicdelete.php"
        }),
        statusModel = new model.StatusModel({
            updateUrl: test ? "stub/status.php" : "api/status.php",
            changeUrl: test ? "stub/status.php" : "api/status.php",
            stepForwardUrl: test ? "stub/status.php" : "api/status.php",
            stepBackUrl: test ? "stub/status.php" : "api/status.php",
            selectUrl: "api/selectmusic.php"
        }),
        userModel = new model.UserModel({
            updateUrl: "api/user.php"
        }),
        loadingViewModel = new viewmodel.LoadingViewModel(),
        audioServerViewModel = new viewmodel.AudioServerViewModel({
            musicModel: musicModel,
            playlistModel: playlistModel,
            statusModel: statusModel,
            userModel: userModel
        }),
        alertViewModel = new viewmodel.AlertViewModel(),
        vm = _.extend(audioServerViewModel, loadingViewModel, alertViewModel),
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

    // message wrapping
    alertViewModel.wrapDeferredAll(audioServerViewModel, [
        {
            methodName: "update",
            errorMessage: "同期失敗..."
        }, {
            methodName: "statusUpdate",
            successMessage: "ステータスを同期しました。",
            errorMessage: "ステータスの同期に失敗しました。"
        }, {
            methodName: "play",
            successMessage: function () {
                return statusModel.data.isPlay() ? "停止しました" : "再生しました。";
            },
            errorMessage: function () {
                return statusModel.data.isPlay() ? "再生に失敗しました。" : "停止に失敗しました。";
            }
        }, {
            methodName: "changeVolume",
            successMessage: function () {
                return "音量を変更しました。(" + statusModel.data.volume() + ")";
            },
            errorMessage: function () {
                return "音量を変更できませんでした。(" + statusModel.data.volume() + ")";
            }
        }, {
            methodName: "repeat",
            successMessage: function () {
                return statusModel.data.isRepeat() ? "リピートモードを解除しました。" : "リピートモードを有効にしました。" ;
            },
            errorMessage: function () {
                return statusModel.data.isRepeat() ? "リピートモードの有効化に失敗しました。" : "リピートモードの解除に失敗しました。";
            }
        }, {
            methodName: "random",
            successMessage: function () {
                return statusModel.data.isRandom() ? "ランダムモードを解除しました。" : "ランダムモードを有効にしました。";
            },
            errorMessage: function () {
                return statusModel.data.isRepeat() ? "ランダムモードの有効化に失敗しました。" : "ランダムモードの解除に失敗しました。";
            }
        }, {
            methodName: "createNewPlaylist",
            successMessage: "プレイリストを作成しました。",
            errorMessage: "プレイリストを作成できませんでした。"
        }, {
            methodName: "uploadMusic",
            successMessage: function () {
                return "uploaded " + vm.uploadFileName()
            },
            errorMessage: function () {
                return "cannot uploaded " + vm.uploadFileName() + " so cancel upload."
            }
        }, {
            methodName: "addMusicToPlaylist",
            successMessage:  "プレイリストに曲を追加しました。",
            errorMessage: "プレイリストの曲追加に失敗しました。"
        }, {
            methodName: "removeMusicFromPlaylist",
            successMessage: "プレイリストの曲追加に成功しました。",
            errorMessage: "プレイリストの曲削除に失敗しました。"
        }, {
            methodName: "currentPlaylistClear",
            successMessage: "カレントプレイリストをクリアしました。",
            errorMessage: "カレントプレイリストのクリアできませんでした。"
        }, {
            methodName: "removePlaylist",
            successMessage: "プレイリストを削除しました。。",
            errorMessage: "プレイリストを削除できませんでした。"
        }, {
            methodName: "stepForward",
            successMessage: "次の曲へ進みました。",
            errorMessage: "次の曲へ進めませんでした。"
        }, {
            methodName: "stepBack",
            successMessage: "前の曲へ進みました。",
            errorMessage: "前の曲へ進めませんでした。"
        }, {
            methodName: "selectMusic",
            successMessage: "曲を選択しました。",
            errorMessage: "曲の選択に失敗しました。"
        }
    ]);

    // event bubble 制御 !!! Deferredのチェーンは途切れます！ !!!
    util.wrapCancelBubbleAll(audioServerViewModel, [
        "selectMusic"
    ]);
    util.wrapEnableBubbleAll(audioServerViewModel, [
        "changeVolume"
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
