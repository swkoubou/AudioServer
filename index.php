<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">

    <title>ソフトウェア工房AudioServer</title>

    <link href="plugin/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="plugin/selectize/css/selectize.bootstrap3.css" rel="stylesheet">
    <link href="css/base.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>

<!-- load animation -->
<div class="loading" data-bind="visible: isLoading">
    <img src="img/load.gif">
    <div class="loading-text"></div>
</div>

<!-- navigation -->
<div class="wrapper" data-bind="enable: !isLoading()">
    <div class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <!-- playing music name -->
                <a class="navbar-brand navbar-link" href="#"
                   data-bind="text: nowMusic() ? nowMusic().name : 'not playing...'"></a>
                <!-- /playing music name -->
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-btn">
                    <li>
                        <!-- play -->
                        <button class="btn btn-default col-xs-4 " data-bind="click: play, visible: !status.isPlay()"
                                data-toggle="tooltip" data-placement="bottom" title="Play">
                            <span class="glyphicon glyphicon-play"></span>
                        </button>
                        <button class="btn btn-default col-xs-4 " data-bind="click: play, visible: status.isPlay()"
                                data-toggle="tooltip" data-placement="bottom" title="Stop">
                            <span class="glyphicon glyphicon-pause"></span>
                        </button>

                        <!-- step -->
                        <button class="btn btn-default col-xs-4 text-btn" data-bind="click: stepBack"
                                data-toggle="tooltip" data-placement="bottom" title="Prev">
                            <span class="glyphicon glyphicon-step-backward"></span>
                        </button>
                        <button class="btn btn-default col-xs-4 text-btn" data-bind="click: stepForward"
                                data-toggle="tooltip" data-placement="bottom" title="Next">
                            <span class="glyphicon glyphicon-step-forward"></span>
                        </button>

                        <!-- repeat -->
                        <button class="btn btn-default col-xs-4 text-btn" data-bind="click: repeat, visible: !status.isRepeat()"
                                data-toggle="tooltip" data-placement="bottom" title="Repeat">
                            <span class="glyphicon glyphicon-arrow-right"></span>
                        </button>
                        <button class="btn btn-default col-xs-4 text-btn" data-bind="click: repeat, visible: status.isRepeat()"
                                data-toggle="tooltip" data-placement="bottom" title="Repeat">
                            <span class="glyphicon glyphicon-repeat"></span>
                        </button>

                        <!-- random -->
                        <button class="btn btn-default col-xs-4 text-btn" data-bind="click: random, visible: !status.isRandom()"
                                data-toggle="tooltip" data-placement="bottom" title="Random">
                            <span class="glyphicon glyphicon-arrow-right"></span>
                        </button>
                        <button class="btn btn-default col-xs-4 text-btn" data-bind="click: random, visible: status.isRandom()"
                                data-toggle="tooltip" data-placement="bottom" title="Random">
                            <span class="glyphicon glyphicon-random"></span>
                        </button>

                        <!-- volume -->
                        <div class="col-xs-12 range">
                            <label class="sr-only" for="volume">volume</label>
                            <input id="volume" type="range" min=0, max=100, step=1 class="music-volume"
                                   data-bind="value: status.volume, event: { mouseup: changeVolume, touchend: changeVolume }"
                                   data-toggle="tooltip" data-placement="bottom" title="Volume">
                        </div>

                        <!-- new playlist -->
                        <button type="button" class="btn col-xs-4 btn-default"
                                data-placement="bottom" title="New Playlist" data-toggle="modal" data-target="#newPlaylistModal">
                            <span class="glyphicon glyphicon-music"></span>
                        </button>

                        <!-- delete playlist -->
                        <button type="button" class="btn col-xs-4 btn-default"
                                data-placement="bottom" title="Delete Playlist" data-toggle="modal" data-target="#deletePlaylistModal">
                            <span class="glyphicon glyphicon-trash"></span>
                        </button>

                        <!-- add music to playlist -->
                        <button type="button" class="btn col-xs-4 btn-default"
                                data-placement="bottom" title="Add Music" data-toggle="modal" data-target="#addMusicTo"
                                data-bind="enable: checkCurrentMusics().length > 0">
                            <span class="glyphicon glyphicon-plus"></span>
                        </button>

                        <!-- remove music from playlist -->
                        <button type="button" class="btn col-xs-4 btn-default"
                                data-placement="top" title="Remove Music" data-toggle="modal" data-target="#removeMusicFrom"
                                data-bind="enable: checkCurrentMusics().length > 0">
                            <span class="glyphicon glyphicon-minus"></span>
                        </button>

                        <!-- upload new music -->
                        <button type="button" class="btn col-xs-4 btn-default"
                                data-placement="top" title="Upload" data-toggle="modal" data-target="#uploadMusic">
                            <span class="glyphicon glyphicon-open"></span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!-- /navigation -->

    <div class="container-fluid">
        <div class="row">
            <!-- sidebar  -->
            <div class="col-sm-3 col-md-2 sidebar">
                <!-- playlist -->
                <ul class="nav nav-sidebar current">
                    <li class="active" data-bind="css { active: currentPlaylist() == nowPlaylist() }">
                        <a href="#" data-bind="click: currentPlaylist.bind($root, nowPlaylist())">
                            <span data-bind="text: nowPlaylist().name"></span>
                            <span class="badge panel-warning pull-right" data-bind="text: nowPlaylist().data().length"></span>
                        </a>
                    </li>
                </ul>
                <ul class="nav nav-sidebar nav-playlist" data-bind="foreach: _.rest(playlists())">
                    <li class="active" data-bind="css { active: $root.currentPlaylist() == $data }">
                        <a href="#" data-bind="click: $root.currentPlaylist">
                            <span data-bind="text: name"></span>
                            <span class="badge badge-warning pull-right" data-bind="text: data().length"></span>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                <!-- playlists -->
                <div class="visible-xs">
                    <label class="sr-only" for="playlists">Playlists</label>
                    <select id="playlists" class="form-control" data-toggle="tooltip" data-placement="top" title="Playlist"
                            data-bind="foreach: playlists, value: currentPlaylist">
                        <option data-bind="text: name, value: $data"></option>
                    </select>
                </div>

                <!-- musics in current playlist -->
                <table class="table table-striped table-hover musics">
                    <thead>
                    <tr>
                        <th class="music-checkbox"><input type="checkbox" data-bind="checked: allChecked"></th>
                        <!-- ko if: $root.currentPlaylist() === $root.nowPlaylist() -->
                        <th data-bind=></th>
                        <!-- /ko -->
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody data-bind="foreach: currentMusics">
                    <tr data-bind="click: $root.checkMusic">
                        <td class="music-checkbox">
                            <input type="checkbox" data-bind="checked: checked, click: $root.checkMusic">
                        </td>
                        <!-- ko if: $root.currentPlaylist() === $root.nowPlaylist() -->
                        <td class="music-select">
                            <a class="text-justify" data-bind="if: $root.nowMusic() && $root.nowMusic().id === data.id,
                                            click: $root.cancelEvent">
                                <span class="glyphicon glyphicon-volume-up"></span>
                            </a>
                            <a class="text-muted" data-bind="if: !$root.nowMusic() || $root.nowMusic().id !== data.id,
                                            click: $root.selectMusic.bind($data, data.id)">
                                <span class="glyphicon glyphicon-volume-down"></span>
                            </a>
                        </td>
                        <!-- /ko -->
                        <td data-bind="text: data.name"></td>
                    </tr>
                    </tbody>
                </table>

                <!-- alerts -->
                <div class="alerts" data-bind="foreach: alerts">
                    <div class="alert fade in" data-bind="css: { 'alert-success': isSuccess, 'alert-danger': !isSuccess }">
                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                        <strong data-bind="text: title+': '"></strong>
                        <span data-bind="text: message"></span>
                    </div>
                </div>

                <!-- Modals -->
                <!-- New Playlist -->
                <div class="modal fade" id="newPlaylistModal" tabindex="-1" role="dialog" aria-labelledby="newPlaylistModal" aria-hidden="true">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 class="modal-title" id="myModalLabel">New Playlist</h4>
                            </div>
                            <div class="modal-body">
                                <div class="form-group"
                                     data-bind="css { 'has-success': validationUserName(), 'has-error': !validationUserName() }">
                                    <label class="control-label">User name</label>
                                    <select id="users" class="form-control users"
                                            data-bind="selectize: userList, value: userId, object: user, optionsCreate: originalUser"></select>
                                </div>
                                <div class="form-group"
                                     data-bind="css { 'has-success': validationPlaylistName(), 'has-error': !validationPlaylistName() }">
                                    <label class="control-label">Playlist name</label>
                                    <input type="text" placeholder="new playlist name" class="form-control"
                                           data-bind="value: newPlaylistName, valueUpdate: 'afterkeydown'">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default col-xs-5 pull-left" data-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary col-xs-5 pull-right" data-dismiss="modal"
                                        data-bind="click: createNewPlaylist, css: { disabled: !validationPlaylistName() }">New</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Delete Playlist -->
                <div class="modal fade" id="deletePlaylistModal" tabindex="-1" role="dialog" aria-labelledby="deletePlaylistModal" aria-hidden="true">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 class="modal-title" id="myModalLabel">Delete Playlist</h4>
                            </div>
                            <div class="modal-body">
                                <div class="form-group has-warning">
                                    <div class="form-group">
                                        <label class="control-label">Delete playlist name: </label>
                                        <div>
                                            <p class="form-control-static" data-bind="text: currentPlaylist().name"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default col-xs-5 pull-left" data-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger col-xs-5 pull-right" data-dismiss="modal"
                                        data-bind="click: currentPlaylist().id == -1 ? clearCurrentPlaylist : removePlaylist">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Upload Music -->
                <div class="modal fade" id="uploadMusic" tabindex="-1" role="dialog" aria-labelledby="uploadMusic" aria-hidden="true"">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content"">
                            <form data-bind="submit: uploadMusic">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    <h4 class="modal-title" id="myModalLabel">Upload Music</h4>
                                </div>
                                <div class="modal-body">
                                    <div class="form-group" data-bind="css { 'has-success': validationUserName(), 'has-error': !validationUserName() }">
                                        <label class="control-label">User name</label>
                                        <select id="users" class="form-control users"
                                                data-bind="selectize: userList, value: userId, object: user, optionsCreate: originalUser"></select>
                                    </div>
                                    <div class="form-group">
                                        <input type="file" name="file" multiple="multiple" data-bind="">
                                        <!--                                    <div class="droparea" dropzone data-bind="event: {-->
                                        <!--                                         dragenter: cancelEvent,-->
                                        <!--                                         dragover: cancelEvent,-->
                                        <!--                                         drop: dropUploadMusic }">-->
                                        <!--                                        drop-->
                                        <!--                                    </div>-->
                                    </div>
<!--                                    <div class="form-group">-->
<!--                                        <label class="control-label">Add to playlist</label>-->
<!--                                        <select id="users" class="form-control users" data-bind="-->
<!--                                        selectize: whereAddPlaylistListWithUpload,-->
<!--                                        value: whereAddPlaylistIdWithUpload,-->
<!--                                        object: whereAddPlaylistWithUpload,-->
<!--                                        optionsCreate: whereAddPlaylistOriginalWithUpload"></select>-->
<!--                                        <p class="help-block">-->
<!--                                            <span data-bind="if: !whereAddPlaylistIdWithUpload()">-->
<!--                                                don't added-->
<!--                                            </span>-->
<!--                                            <span data-bind="if: whereAddPlaylistIdWithUpload() === '0'">-->
<!--                                                create new playlist and is added-->
<!--                                            </span>-->
<!--                                        </p>-->
<!--                                    </div>-->
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-default col-xs-5 pull-left" data-dismiss="modal">Cancel</button>
                                    <button type="submit" class="btn btn-primary col-xs-5 pull-right"
                                            data-bind="css: { disabled: !validationUserName() }">Upload</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- add music to playlist -->
                <div class="modal fade add-music-to" id="addMusicTo" tabindex="-1" role="dialog" aria-labelledby="addMusicTo" aria-hidden="true">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 class="modal-title" id="myModalLabel">Add music to playlist</h4>
                            </div>
                            <div class="modal-body">
                                <div class="form-group">
                                    <div class="form-group">
                                        <label class="control-label">Add to playlist</label>
                                        <select id="playlists" class="form-control" data-toggle="tooltip" data-placement="top" title="Playlist"
                                                data-bind="foreach: whereAddPlaylistList, value: whereAddPlaylist">
                                            <option data-bind="text: name, value: $data"></option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default col-xs-5 pull-left" data-dismiss="modal">Cancel</button>
                                <button type="submit" class="btn btn-primary col-xs-5 pull-right" data-dismiss="modal"
                                        data-bind="click: addMusicToPlaylist">Add</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Remove music from playlist -->
                <div class="modal fade" id="removeMusicFrom" tabindex="-1" role="dialog" aria-labelledby="removeMusicFrom" aria-hidden="true">
                    <div class="modal-dialog modal-sm">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                <h4 class="modal-title" id="myModalLabel">Remove music from playlist</h4>
                            </div>
                            <div class="modal-body">
                                <div class="form-group has-warning">
                                    <div class="form-group">
                                        <label class="control-label">Remove from playlis: </label>
                                        <div>
                                            <p class="form-control-static" data-bind="text: currentPlaylist().name"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default col-xs-5 pull-left" data-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger col-xs-5 pull-right" data-dismiss="modal"
                                        data-bind="click: removeMusicFromPlaylist">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- JavaScript -->
<script src="plugin/jquery-1.10.2.min.js"></script>
<script src="plugin/bootstrap/js/bootstrap.min.js"></script>
<script src="plugin/knockout/knockout-3.0.0.js"></script>
<script src="plugin/underscore-min.js"></script>
<script src="plugin/selectize/js/standalone/selectize.min.js"></script>
<script src="plugin/knockout/plugin/knockout-selectize.js"></script>
<script src="js/util.js"></script>
<script src="js/Model/MusicModel.js"></script>
<script src="js/Model/PlaylistModel.js"></script>
<script src="js/Model/StatusModel.js"></script>
<script src="js/Model/UserModel.js"></script>
<script src="js/ViewModel/LoadingViewModel.js"></script>
<script src="js/ViewModel/AudioServerViewModel.js"></script>
<script src="js/main.js"></script>
</body>
</html>
