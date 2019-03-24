/*
SpreadSheetにあらかじめ以下のシートを作成しておく
	log
	error
	config
利用ライブラリ
	Moment	Version:9 key：MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48
スクリプトプロパティ
	なし
*/

var thisBook_ = SpreadsheetApp.getActiveSpreadsheet();
var appConfig_ = {}; // configシートで設定する設定値の連想配列

// POST受け取り
function doPost(e) {
  // 受け取ったPOSTデータをlogシートに記録する
  writeLog(e.postData.getDataAsString());
  var params = JSON.parse(e.postData.getDataAsString());
  
  main(params);

}

// メイン
function main(p){
  try {
    // configシートの読み込み
    readConfig();
    // 処理
  } catch (error) {
    writeErrorLog(error);
  }
}

// テスト用
function test(){
  var params = JSON.parse(TEST_DATA_1);
  main(params);
}

// 設定読み込み
function readConfig() {
  var configSheet = thisBook_.getSheetByName('config');
  var lastRow = configSheet.getLastRow();
  for (var i = 1; i <= lastRow; i++) {
    var key = configSheet.getRange(i, 1).getValue();
    var val = configSheet.getRange(i, 2).getValue();
    if (key.trim()) {
      appConfig_[key] = val;
    }
  }
}

// log記録用
function writeLog(e) {
  var logSheet = thisBook_.getSheetByName('log');
  var lastRow = logSheet.getLastRow();

  logSheet.getRange(lastRow+1, 1).setValue(getDateTime());
  logSheet.getRange(lastRow+1, 2).setValue(e);
}

// エラーログ記録用
function writeErrorLog(e) {
  var logSheet = thisBook_.getSheetByName('error');
  var lastRow = logSheet.getLastRow();

  logSheet.getRange(lastRow+1, 1).setValue(getDateTime());
  logSheet.getRange(lastRow+1, 2).setValue(e);
}

// 現在の日付を文字列で取得
function getDateTime() {
  var m = Moment.moment(); 
  return m.format("YYYY/MM/DD HH:mm:ss");
}