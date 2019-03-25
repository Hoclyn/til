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
    doFoobar(p);
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
function writeParameterLog(e) { 
  var log = [];
  log.push(e);
  writeLog('log',log);
  
}

// エラーログ記録用
function writeErrorLog(e) {  
  var log = [];
  log.push(e);
  writeLog('error',log);
}

// 特定シートに日付付きで情報を記録
function writeLog(logSheetName, log) {
  var logSheet = THIS_BOOK.getSheetByName(logSheetName);
  var lastRow = logSheet.getLastRow();
  logSheet.getRange(lastRow+1, 1).setValue(getDateTime());
  for (var i = 0; i < log.length; i++) {
    logSheet.getRange(lastRow+1, (i+2)).setValue(log[i]);
  }
}

// 現在の日付を文字列で取得
function getDateTime() {
  var m = Moment.moment(); 
  return m.format("YYYY/MM/DD HH:mm:ss");
}
// メール送信
// backlogの件名⇒Mailの件名、詳細と登録ユーザー名⇒本文
function sendMail(mailTempalteName, p) {
  // Mailにデータ埋め込み
  var html = HtmlService.createTemplateFromFile(mailTempalteName);
  html.data = p.content.description.replace('\n\n','\n').split('\n'); 
  html.createdUser = p.createdUser.name;
  var mailHtml = html.evaluate().getContent();
  
  // 送信オプションの設定
  var option = {};
  option.to = appConfig_['Mail.To'];
  option.subject = p.content.summary;	// 件名
  option.from = appConfig_['Mail.From'];
  option.name = '送信元.';
  option.replyTo = appConfig_['Mail.ReplyTo'];
  option.htmlBody = mailHtml;
  GmailApp.sendEmail(option.to, option.subject, '', option);
}

