/*
 * ルート検索
 *
 * google map はdirestionサービスを日本向けにサービス提供していないようなので、
 * 何とかして乗り換え案内とか使って実装してみたい。
 *
 * http://lovelog.eternal-tears.com/web/google-map-api-web/google-map-url-parameters/
 *
 */


function setMyTravelMode(clicked_id) {

	//	console.log("TravelMode: ", clicked_id);

	switch (clicked_id) {
	case "DRIVING":
		myTravelMode = google.maps.DirectionsTravelMode.DRIVING;
		break;
	case "BICYCLING":
		myTravelMode = google.maps.DirectionsTravelMode.BICYCLING;
		break;
	case "TRANSIT":
		myTravelMode = google.maps.DirectionsTravelMode.TRANSIT;
		break;
	case "WALKING":
		myTravelMode = google.maps.DirectionsTravelMode.WALKING;
		break;
	}
	// console.log("myTravelMode is changed: ", myTravelMode);

	if(goLatlng){
		calcRoute();
	}

}

function calcRoute() {

	// 情報ウィンドウのクローズ
	infoWindow.close();

	if (!goLatlng) {
		// console.log("目的地が未設定");
		// document.getElementById("msg").value = msg;
		return -1;
	}

	/*
	 * google.maps.TravelMode.DRIVING（デフォルト）: 道路網を利用した標準の運転ルートです。
	 * google.maps.TravelMode.BICYCLING: 自転車専用道路と優先道路を使用した自転車ルートをリクエストします。
	 * google.maps.TravelMode.TRANSIT: 公共交通機関を使用したルートをリクエストします。
	 * google.maps.TravelMode.WALKING: 歩行者専用道路と歩道を使用した徒歩ルートをリクエストします。
	 */
	var RouteReq = {

		origin : myLatlng,
		destination : goLatlng,
		travelMode : myTravelMode,
		unitSystem : google.maps.DirectionsUnitSystem.METRIC

	};

	// console.log("RouteReq: ", RouteReq);

	directionsService.route(RouteReq, function(response, status) {

		if (status == google.maps.DirectionsStatus.OK) {

			// ルート検索結果の描画
			directionsRenderer.setDirections(response);

			drowRoute = true;

			// 移動距離の取得
			var distance = response.routes[0].legs[0].distance.value;

			if (distance >= 1000) {
				// 小数点第2位で四捨五入
				distance = Math.round((distance / 1000) * 100) / 100 + 'km';
			} else {
				distance = response.routes[0].legs[0].distance.value + 'm';
			}

			// 移動距離と表示
			// console.log("distance: ", distance);
			document.getElementById("journey").value = distance;

			// 移動時間の取得と表示
			var duration = response.routes[0].legs[0].duration.text;
			// console.log("duration: ", duration);
			document.getElementById("duration").value = duration;

		} else {

			if (status == google.maps.DirectionsStatus.INVALID_REQUEST) {
				msg = "検索失敗:リクエスト無効";
			} else if (status == google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED) {
				msg = "検索失敗:ウェイポイント（経由地点）が8を超えました";
			} else if (status == google.maps.DirectionsStatus.NOT_FOUND) {
				msg = "検索失敗:出発地か到着地のジオコード取得に失敗しました";
			} else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
				msg = "検索失敗:リクエストの制限回数を超えました";
			} else if (status == google.maps.DirectionsStatus.REQUEST_DENIED) {
				msg = "検索失敗:ルート検索は使えません";
			} else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
				msg = "検索失敗:ルートが見つかりませんでした";
			} else if (status == google.maps.DirectionsStatus.UNKNOWN_ERROR) {
				msg = "検索失敗:サーバーエラー/リトライすれば成功する可能性があります";
			}
			console.log("ルート検索失敗: ", msg);
		}

	});
}
