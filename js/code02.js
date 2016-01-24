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
  LoadData();

  // 位置情報の取得
  get_location();

  // console.log("01: ", myLatlng);
}

/*
* 外部ファイルからのデータ読み込み＆格納
*
*/
function LoadData() {

  $(document).ready(function () {
    $.getJSON(filePath, function(data){

      for(var i in data){
        for( var j in data[i].list ) {
          datalist[j] = {
            // 本来は、データ中の値を取得してくるべき
            id        : j,                          // ID
            name      : data[i].list[j].name,       // 名称
            address   : data[i].list[j].address,    // 住所
            category  : data[i].list[j].category,   // カテゴリ
            position  : new google.maps.LatLng(data[i].list[j].lon, data[i].list[j].lat), // 緯度経度
            tel       : data[i].list[j].tel,        // 電話番号
            url       : data[i].list[j].url,        // url
            done      : data[i].list[j].done        // 0:まだ、1:もう行った
          };
          // console.log("datalist: ", datalist[j]);
        }
      }

      replotTargetPins("all");

    });
  });
}


/*
* プロットピンを再描画する。再描画対象は引数で受け取る。
*/
function replotTargetPins(status) {
  nowViewStatus = status;

  console.log("replotTargetPins: ", status);

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

  // ピンを全消去した後に、対象を再描画する
  for (i = 0; i < datalist.length; i++) {

    // plot対象の選択
    if(datalist[i].done != digitStatus && digitStatus != 2 ){
      continue;
    }

    // 再描画と同時に、マーカーリストに追加
    marker_list.push(drowPins(datalist[i]));

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
function drowPins(plotData){
  // プロットするアイコンの指定
  var gicons = plotData.done != 0 ? plotPins.done : plotPins.notyet;

  // 個別マーカー設定
  var myMarker = new google.maps.Marker({
    icon : gicons,             // マーカーアイコンの設定
    title : plotData.name,  // オンマウスで表示させる文字
    position : plotData.position,
    animation: google.maps.Animation.DROP,
    map : map
  });

  // 情報ウィンドウへの表示内容作成
  var infoWindowStr = makeHtml(plotData);

  // リスナー定義の部分を別関数化
  addListenerPoint(myMarker, infoWindowStr);

  // console.log("infoWindow: ", infoWindow);

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
function makeHtml(plotData) {

  // console.log("04: ", i + ": " + datalist[i].content);

  var tmpStr = "";
  var tmp = plotData.url;

  // console.log("tmp: ", tmp + ": " + tmp);

  if (plotData.url == null) {
    tmpStr = '<div style="margin:5px;">' + plotData.name + '</div>';
  } else {
    tmpStr = '<div style="margin:5px;"><a href="' + plotData.url + '" target="_blank">' + plotData.name + '</a></div>';
  }

  tmpStr += '<small>';

  if (plotData.tel == null) {
    tmpStr += "電話番号不明" + '<br>';
  } else {
    tmpStr += plotData.tel + '<br>';
  }

  tmpStr += plotData.address + '<br>';
  tmpStr += '<input type="button" class="btn btn-danger btn-xs" value="ここに行く" onclick="calcRoute()">';
  tmpStr += '&nbsp;&nbsp;';
  tmpStr += '<input type="button" id="'+ plotData.id +'" class="btn btn-success btn-xs" value="もう行った" onclick="alreadyDone(this.id,1)">';
  tmpStr += '&nbsp;&nbsp;';
  tmpStr += '<input type="button" id="'+ plotData.id +'" class="btn btn-primary btn-xs" value="やっぱまだ" onclick="alreadyDone(this.id,0)">';
  tmpStr += '</small>';

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
      maxWidth : 320, // 情報ウィンドウの最大幅をピクセルで設定
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
function alreadyDone(id,state){
  console.log("alreadyDone: ", id);
  // console.log("data: ", datalist[id]);
  datalist[id].done = state;

  replotTargetPins(nowViewStatus);
}
