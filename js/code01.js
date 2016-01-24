/*
 * global編集の定義
 *
 * https://icomoon.io/app/#/select/font
 */

// mappオブジェクト
var map;
// マーカのデータセット
var datalist = [];
// 最後に開いた情報ウィンドウを記憶
var infoWindow;
// 外部データファイルのパス
var filePath = "./loc/toraja00.json";
// 地図の初期中心位置
var iniLatlng = new google.maps.LatLng(35.454954, 139.631386);
// 地図の初期中心位置
var myLatlng = new google.maps.LatLng(35.454954, 139.631386);
// 現在位置のマーカー
var myPosMarker = null;
// 表示中のmapの名前
var mapName = "";
// 表示メッセージ
var message;
// ルート検索の目的地
var goLatlng = null;
// ルート検索方法
var myTravelMode = google.maps.DirectionsTravelMode.WALKING;
// ルート検索再描画用
var directionsRenderer;
var directionsService = new google.maps.DirectionsService();
// 行先データのリスト
var datalist = new Array();
// Markerのリスト
var marker_list = new google.maps.MVCArray();

// // 日本語ピンの定義（関数encodeURI()を使う）
// var customIcons = {
// 	1 : {
// 		icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + '|FF0000|000000'
// 	},
// 	2 : {
// 		icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + '|0000FF|FFFFFF'
// 	},
// 	3 : {
// 		icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + '|FFFF00|000000'
// 	},
// 	4 : {
// 		icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + '|FF0000|000000'
// 	},
// 	5 : {
// 		icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + '|00FF00|000000'
// 	},
// 	6 : {
// 		icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + '|FF00FF|0000FF'
// 	},
// 	7 : {
// 		icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + '|FF0000|000000'
// 	},
// 	8 : {
// 		icon : 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + '|FF00FF|000000'
// 	},
// };

// 日本語ピンの定義（関数encodeURI()を使う）
var plotPins = {
  "nowPos"  : "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + "|FF0000|000000",//現在地
	"notyet"  : "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + "|00FF00|000000",//まだ
  "done"    : "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + "|555555|000000",//もういった
};
