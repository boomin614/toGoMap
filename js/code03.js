/*
 * 位置情報の取得
 *
 */

// グローバル変数
var watchID = 0;
var timerID = 0;
var TIMEOUT = 20000;
var initGetPosFlg = true;

// ( 1 )位置情報を取得します。
function get_location() {

	if (navigator.geolocation) {

		// タイマー起動
		// 指定ミリ秒経過するとtimeout()を実行
		// timerID = setInterval('timeout()', TIMEOUT);
		// console.log("GET timerID: ", timerID);

		var geo_options = {
			enableHighAccuracy : false,
			timeout : TIMEOUT
		};

		// 現在の位置情報取得を実施 正常に位置情報が取得できると、successCallbackをコールバック
		// watchID = navigator.geolocation.watchPosition(successCallback,
		// errorCallback,
		// geo_options);
		// watchID = navigator.geolocation.watchPosition(successCallback,
		// errorCallback);
		watchID = navigator.geolocation.getCurrentPosition(successCallback, errorCallback, geo_options);

//		console.log("GET watchID: ", watchID);

		// console.log("本ブラウザではGeolocationが使用可能");

	} else {
		// console.log("本ブラウザではGeolocationが使用不可");
	}
}

// ( 2 )位置情報が正常に取得されたら、global変数に位置をセット
function successCallback(pos) {

//	console.log("位置情報の取得に成功 watchID: ", watchID);

	// 現在位置取得開始
	myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

	// 結果を表示
	// document.getElementById("msg").value = "位置情報取得成功";

	// 現在位置情報へマーカーを描画
	myPosMarkerDrop();

	// 現在位置情報へ地図中心を移動
	map.panTo(myLatlng);

}

// ( 3 )位置情報が取得できなかったら、global変数に既定の初期位置をセット
function errorCallback(error) {
	// console.log("myLatlng: ", myLatlng);
	// message = "位置情報取得が不許可";

	console.log("errorCallback: ", +"(" + error.code + "): " + error.message);
	// alert('ERROR(' + error.code + '): ' + error.message);

	// 現在位置情報へマーカーを描画
	myPosMarkerDrop();

	// 現在位置情報へ地図中心を移動
	map.panTo(myLatlng);
}

function myPosMarkerDrop() {

	// console.log("現在位置マーカのドロップ");

	// 現在位置の削除
	if (myPosMarker != null) {
		// console.log("現在位置マーカの削除");
		myPosMarker.setMap(null);
		// myPosMarker = null;
	}

	// 現在位置情報へマーカーを描画
	myPosMarker = new google.maps.Marker({
		position : myLatlng,
		map : map,
		animation : google.maps.Animation.DROP,
		title : "My Position"
	});

	// 現在位置の描画
	myPosMarker.setMap(map);

	// 現在地の監視を停止
	stopWatchPosition();

}

function stopWatchPosition() {

//	console.log("stopWatchPosition呼び出し watchID: ", watchID);

	if (watchID > 0) {
		navigator.geolocation.clearWatch(watchID);
		watchID = 0;
	}

//	console.log("位置情報取得停止 watchID: ", watchID);

	// if (timerID > 0) {
	// timeout();
	// timerID = 0;
	// }
}

// タイムアウトの処理
// function timeout() {
//
// // console.log("timeout処理実行");
//
// // タイマーを終了する
// clearInterval(timerID);
// }
