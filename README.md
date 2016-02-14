# About this program
* This application shows the map which you want to go to.
  - ルート検索の都合上、現在位置情報を使用します。
  この位置情報は、ブラウザ上とルート検索のための地図サービスサイト間でのみ使用されます。
  Webアプリが実行されている、Webサーバへ情報が送信されることはありません。
* In addition, you can find the most direct route to one's destination.
* plotting your favorite or hoping places.
* changing the place status : already done, or not yet

# Let's try
- webアプリとして、ブラウザ上で動作します
* [こちらからお試しください](http://ec2-52-68-59-248.ap-northeast-1.compute.amazonaws.com/toGoMap/)

# Confirmed operation environment
* firefox 64bit版 44.0.1
* chrome 48.0.2564.103 m
* IE v11

# Run on the Electron
- クロスプラットフォームアプリである、[Electron](http://electron.atom.io/)でも動きます。  
というか、実は[Electron](http://electron.atom.io/)で動かすことを想定しています。
- windows
  * electronを起動した後、electronのwindowsに、calcMeetingCostのディレクトリごとD＆Dしてください。  
  クロスプラットフォーム環境でのスタンドアロンデスクトップアプリとなります。
- macOS
  * 基本的にはwindowsと同じです。  
  詳細は、[Electron](http://electron.atom.io/)の公式ページを確認してください。
- Linux
  * 自分で試してないのでわかりませんが、同じように動くはず。  
  詳細は、[Electron](http://electron.atom.io/)の公式ページを確認してください。  
  動かなかったら、それはelectronのせい。

# To Do
* to add the new place which we want to go to.
* to download the place list via KML file format
* to upload KML file via D&D
* to edit the information of the place point
