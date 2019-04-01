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
  
  // メッセージを返信
  var replyMessage = 'あなたは' + texts[0] + 'と言った';
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