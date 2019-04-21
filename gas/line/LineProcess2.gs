var LINE_CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
var LINE_ENDPOINT_URL = 'https://api.line.me/v2/bot/message/reply';

// LINE送受信処理の実装
function doLine(p) {
  // 受信したメッセージテキストを取得
  var texts = [];
  texts.push(p.events[0].message.text);
  writeLog('text',texts);
  
  //返信するためのトークン取得
  var replyToken= p.events[0].replyToken;
  if (typeof replyToken === 'undefined') {
    return;
  }
  
  // spreadsheetで翻訳
  var logSheet = thisBook_.getSheetByName('text');
  var lastRow = logSheet.getLastRow();
  var translatedColumn = logSheet.getRange(lastRow, 3); // 翻訳結果カラム
  var srcColumn = 'B' + lastRow; // 入力文字列カラム
  translatedColumn.setFormula('=GOOGLETRANSLATE(' + srcColumn + ', "ja","en")'); // 翻訳結果カラムに翻訳関数をセット
  var translatedResult = translatedColumn.getValue();
  
  
  // メッセージを返信
  var replyMessage =  translatedResult;
  sendMessageToLine(replyToken, replyMessage);     

}

function sendMessageToLine(replyToken, replyMessage) {  
  // メッセージを返信
   var replyData = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + LINE_CHANNEL_ACCESS_TOKEN,
    },
    "payload" : JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': replyMessage,
      }],
    }),
  };
  var res = UrlFetchApp.fetch(LINE_ENDPOINT_URL,replyData);
  return res.getResponseCode();
  // return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}