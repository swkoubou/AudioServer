<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>sample</title>
</head>
<body>
<h4 class="modal-title" id="myModalLabel">Upload Music</h4>
    <form action="upload.php" method="post" enctype="multipart/form-data">

                <label class="control-label">User name</label>
                <input type="file" name="file" multiple="multiple" data-bind="">
            <button type="submit" class="btn btn-primary col-xs-5 pull-right"
                    data-bind="css: { disabled: !validationUserName() }">Upload</button>
    </form>
</body>
</html>