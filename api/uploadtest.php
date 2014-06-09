<!doctype html>
<html>
<head>
    <meta charset="utf-8">
<title>upload test</title>
</head>
<body>
<h4 class="modal-title" id="myModalLabel">Upload Music</h4>
    <form action="upload.php" method="post" enctype="multipart/form-data">

                <label class="control-label">User name</label>
                <input type="file" name="file" multiple="multiple" data-bind="">
                <input type="hidden" name="name" value="xyz" />
            <input type="submit" value="Upload" class="btn btn-primary col-xs-5 pull-right"
                    data-bind="css: { disabled: !validationUserName() }" />
    </form>
</body>
</html>