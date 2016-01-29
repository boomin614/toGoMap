/*
* メインルーチン
*
* Googleマップ V3 設置法 ～ Google Maps API V2 から V3 への移行方法
*  http:// kikuchisan.net/gmap/gmapv3.html
*  →　チェックボックスでマーカ切り替え記載あり
*
*/
google.maps.event.addDomListener(window, 'load', initialize);
var nowViewStatus = 2;

function initialize() {

  var mapOptions = {
    zoom : 12,
    center : myLatlng,

    // 移動コントロールを非表示
    panControl : false,
    // ストリートビューコントロールを非表示
    streetViewControl : false,
    // ズームコントロールを非表示
    zoomControl : true,

    // ズームコントロールを左上に配置
    zoomControlOptions : {
      position : google.maps.ControlPosition.TOP_LEFT
    },

    // マップタイプコントロールを非表示
    mapTypeControl : false,
    // 地図の左下に表示されるスケールコントロールを表示する
    scaleControl : false,
    // 地図の右下に表示される折りたたみ可能な概観地図を表示する
    overviewMapControl : false,
    // 地図の左上に表示される回転コントロールを表示する
    RotateControl : false,

    scrollwheel : true,
    mapTypeId : google.maps.MapTypeId.ROADMAP
  };

  // 地図の描画
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // ルート検索再描画の定義
  directionsRenderer = new google.maps.DirectionsRenderer({
    map : map,
    suppressMarkers : true
  });

  // 表示データの読み込みと表示
  // LoadData();
  plotPlaceMark(map);


  // 位置情報の取得
  get_location();

  // console.log("01: ", myLatlng);
}


function plotPlaceMark(map){

  // ここはjQueryを使ってのKMLデータ読み込み処理
  $(function(){
    $.get(kmlFilePath,function(kmlData){

      // Map名称を取得してHTMLへ埋め込む
      var title;
      $(kmlData).find("name").each(function(idx, name){
        var name = $(this);
        if(idx==0){
          // console.log("name1: ", name.text());
          title = name.text();
        }
      });

      $("#pagetitle").html(title);
      $("#maptitle").html(title);

      $(kmlData).find("Placemark").each(function(idx, placeMark){
        var placeMark = $(this);
        var id = placeMark.attr("id");
        // console.log("idx: ", idx);
        // console.log("id: ", id);
        // console.log("name: ", placeMark.find("name").text());
        // console.log("address: ", placeMark.find("address").text());
        // console.log("coordinates: ", placeMark.find("Point").find("coordinates").text());
        // カンマ区切りの座標を分割して一時配列posへ格納
        var pos = placeMark.find("Point").find("coordinates").text().split(",");
        // console.log("coordinates: ", pos[0], pos[1]);
        id=idx;

        datalist[id] = {
          id        : id,                // ID
          name      : placeMark.find("name").text(),       // 名称
          address   : placeMark.find("address").text(),    // 住所
          position  : new google.maps.LatLng(pos[0], pos[1]), // 緯度経度
          tel       : placeMark.find("phoneNumber").text(),// 電話番号
          url       : "",                                  // url
          category  : "",                                  // カテゴリ
          done      : ""                                   // 0:まだ、1:もう行った
        }

        placeMark.find("Data").each(function(idx_0, Data){
          var Data=$(this);
          var tagName = Data.attr("name");
          // console.log("url: ", tagName);

          switch (tagName) {
            case "url":
            // console.log("url: ", Data.find("value").text());
            datalist[id].url = Data.find("value").text();
            break;
            case "category":
            // console.log("category: ", Data.find("value").text());
            datalist[id].category = Data.find("value").text();
            break;
            case "done":
            // console.log("done: ", Data.find("value").text());
            datalist[id].done = parseInt(Data.find("value").text(), 10);
            break;
          }
        });
        // console.log("datalist: ", datalist[id]);
      });
    })
    .success(function(json) {
      console.log("kml読込成功");
    })
    .error(function(jqXHR, textStatus, errorThrown) {
      console.log("kml読込エラー：" + textStatus);
      console.log("kml読込エラー内容：" + jqXHR.responseText);
    })
    .complete(function() {
      console.log("kml読込完了");
      replotTargetPins("all");
    });
  });
}

/*
* プロットピンを再描画する。再描画対象は引数で受け取る。
*/
function replotTargetPins(status) {
  // global変数に格納
  nowViewStatus = status;
  // console.log("replotTargetPins: ", status);

  // まず最初に、全てのピンを消す
  removeMarkers();
  marker_list = new google.maps.MVCArray();

  var digitStatus;
  switch (status) {
    case "notyet":
    digitStatus = 0;
    break;
    case "done":
    digitStatus = 1;
    break;
    case "all":
    digitStatus = 2;
    break;
  }

  // console.log("datalist.length: ", datalist.length);
  // ピンを全消去した後に、対象を再描画する
  for(id in datalist){
    if(datalist[id].done != digitStatus && digitStatus != 2 ){
      // plot対象の選択
      continue;
    }
    // console.log("datalist[id]: ", datalist[id]);
    // 再描画と同時に、マーカーリストに追加
    marker_list.push(drowPins(datalist[id]));
  }
}

/*
* 全てのmarkerを削除する
*/
function removeMarkers() {
  //ボタンが押されたら、マーカーの配列に対してsetMap(null)を実行し、地図から削除
  marker_list.forEach(function(marker, idx) {
    marker.setMap(null);
  });
}

/*
* markerを描画する
*/
function drowPins(palceMark){
  // プロットするアイコンの指定
  var gicons = palceMark.done != 0 ? plotPins.done : plotPins.notyet;

  // 個別マーカー設定
  var myMarker = new google.maps.Marker({
    icon : gicons,             // マーカーアイコンの設定
    title : palceMark.name,  // オンマウスで表示させる文字
    position : palceMark.position,
    animation: google.maps.Animation.DROP,
    map : map
  });

  // 情報ウィンドウへの表示内容作成
  var infoWindowStr = makeHtml(palceMark);
  // console.log("palceMark: ", palceMark);
  // console.log("infoWindowStr: ", infoWindowStr);

  // リスナー定義の部分を別関数化
  addListenerPoint(myMarker, infoWindowStr);

  // 地図上クリックで情報ウィンドウを非表示
  google.maps.event.addListener(map, "click", function() {

    // 情報ウィンドウをクローズ
    infoWindow.close();

    // ルート検索の目的地をクリア
    goLatlng = null;

  });

  return myMarker;
}


/*
* 情報ウィンドウの表示内容作成
*/
function makeHtml(palceMark) {

  // console.log("04: ", i + ": " + datalist[i].content);
  var tmpStr = "";
  var tmp = palceMark.url;

  // console.log("tmp: ", tmp + ": " + tmp);

  if (palceMark.url == null) {
    tmpStr = '<div style="margin:5px;">' + palceMark.name + '</div>';
  } else {
    tmpStr = '<div style="margin:5px;"><a href="' + palceMark.url + '" target="_blank">' + palceMark.name + '</a></div>';
  }

  tmpStr += '<small>';

  if (palceMark.tel == null) {
    tmpStr += "電話番号不明" + '<br>';
  } else {
    tmpStr += palceMark.tel + '<br>';
  }

  tmpStr += palceMark.address + '<br>';
  tmpStr += '<input type="button" class="btn btn-danger btn-xs" value="ここに行く" onclick="calcRoute()">';
  tmpStr += '&nbsp;&nbsp;';
  tmpStr += '<input type="button" id="'+ palceMark.id +'" class="btn btn-success btn-xs" value="もう行った" onclick="alreadyDone(this.id,1)">';
  tmpStr += '&nbsp;&nbsp;';
  tmpStr += '<input type="button" id="'+ palceMark.id +'" class="btn btn-primary btn-xs" value="やっぱまだ" onclick="alreadyDone(this.id,0)">';
  tmpStr += '</small>';

  // console.log("infoWindow: ", tmpStr);
  return tmpStr;
}

/*
* Google Mapsで複数マーカーを取り扱う – リスナーの追加 http://lifelog.main.jp/wordpress/?p=248
*
* 変数myMarkerがリスナー定義の中でも有効なため、クリックして開く情報ウィンドウがが最後のマーカーに
* 紐付けられてしまう(contentも全て同じになる)。そこで、リスナー定義の部分を別関数にすることで意図どおりの動作を実現。
*/
function addListenerPoint(m_marker, m_content) {
  google.maps.event.addListener(m_marker, 'click', function(event) {

    //		console.log("infoWindow: ", infoWindow);
    if (infoWindow != null) {
      //			console.log("infoWindowが開かれているので閉じる");
      infoWindow.close();
    }

    infoWindow = new google.maps.InfoWindow({
      maxWidth : 300, // 情報ウィンドウの最大幅をピクセルで設定
      content : m_content
    });

    infoWindow.open(map, m_marker);

    // ルート検索の目的地を画面に表示
    // console.log("店名: ", m_marker.getTitle());
    // document.getElementById("goal").value = m_marker.getTitle();

    // ルート検索の目的地を設定
    // console.log("目的地: ", m_marker.getPosition());
    goLatlng = m_marker.getPosition();

  });
}

/*
* まだ行ってない、もうもう行った、を切り替える。
*/
function alreadyDone(idx,state){
  console.log("alreadyDone: ", idx);
  // console.log("data: ", datalist[id]);
  datalist[idx].done = state;

  replotTargetPins(nowViewStatus);
}
