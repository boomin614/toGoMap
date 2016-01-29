// console.log("import fileOp.js");

// File API実装チェック
if (window.File) {
  // window.alert("File APIが実装されてます。");
  // File APIが実装されている場合には、dropイベントを登録
  $("#map-canvas").bind("map-canvas", onDrop, false);
} else {
  window.alert("本ブラウザではFile APIが使えません");
}

// Drop領域にドロップした際のファイルのプロパティ情報読み取り処理
function onDrop(event) {
  console.log("onDrop");

  // ドロップされたファイルのfilesプロパティを参照
  var files = event.dataTransfer.files;

  checkAndReadkmlFile(files);

  // ブラウザ上でファイルを展開する挙動を抑止
  event.preventDefault();
}

function onDragOver(event) {
  // ブラウザ上でファイルを展開する挙動を抑止
  event.preventDefault();
}

function getExtension(fileName) {
  var ret;
  if (!fileName) {
    return ret;
  }
  var fileTypes = fileName.split(".");
  var len = fileTypes.length;
  if (len === 0) {
    return ret;
  }
  ret = fileTypes[len - 1];
  return ret;
}

function isExtFile(fileName, ext) {
  var Extension = getExtension(fileName);
  if (Extension.toLowerCase() === ext) {
    return true;
  } else {
    return false;
  }
}


function checkAndReadkmlFile(files){
  console.log("checkAndReadkmlFile");
  console.log("files: ", files);

  // Only process image files.
  for (var i = 0, f; f = files[i]; i++) {
    // Only process image files.
    if (!isExtFile(f.name, "kml")) {
      alert('拡張子がkmlではありません');
      continue;
    }
    if (f.type != "") {
      if (!f.type.match('application/kml')) {
        alert('MIME TYPEがkmlじゃありません');
        console.log("MIME TYPEがkmlじゃない");
        continue;
      }
    }
    // checkkmlFile(f);
    // disp.append("ファイル名 :" + f.name + ", ");
    // disp.append("ファイルの型 :" + f.type + ", ");
    // disp.append("ファイルサイズ名 :" + f.size / 1000 + " KB, ");
    // disp.append("ファイル最終更新日時 :" + f.lastModifiedDate);
    // disp.append("<br />");

    // Closure to capture the file information.
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        var kmlObj;
        try {
          kmlObj = kml.parse(e.target.result);
        } catch (e) {
          alert('kml形式のファイルではありません');
        }
        parsekml(kmlObj);
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
  }
}

/*================================================
ボタンを押した時の処理
=================================================*/
$('#file_select_icon').on('click', function() {
  $('#file_select').click();
});

$('#file_select').parent().on('change', '#file_select', function() {

  var files = $('#file_select').prop('files');
  checkAndReadkmlFile(files);

  // var filename = files[0].name;
  // console.log("filename: ", filename);
});

// 選択されたファイル名を取得.
$('#btn_filename').on('click', function() {
  // alert($('#file_select').val());
  if ($('#file_select').prop('files').length == 0) {
    alert('ファイルが選択されていません.');
  } else {
    alert($('#file_select').prop('files')[0].name);
  }
});
