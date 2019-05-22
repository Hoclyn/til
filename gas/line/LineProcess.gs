var LINE_CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESS_TOKEN');
var LINE_ENDPOINT_URL = 'https://api.line.me/v2/bot/message/reply';

// LINE送受信処理の実装
function doLine(p) {

  var receiveMessage = p.events[0].message.text;
  
  //返信するためのトークン取得
  var replyToken= p.events[0].replyToken;
  if (typeof replyToken === 'undefined') {
    return;
  }
  
  // コントロールメッセージのチェック
  var checkMessage = checkControlMessage(receiveMessage)
  if (checkMessage != '') {
    sendMessageToLine(replyToken, checkMessage);
    return;
  }
  
  // 受信したメッセージテキストを取得
  var texts = [];
  texts.push(receiveMessage);
  writeLog('text',texts);
  
  // 翻訳
  var fromLang = appConfig_['from'];
  var toLang = appConfig_['to'];
  var translatedResult = LanguageApp.translate(receiveMessage, fromLang, toLang);
  
  // メッセージを返信
  var replyMessage =  translatedResult;
  sendMessageToLine(replyToken, replyMessage);     

}

// メッセージをチェックしてコントロールメッセージならreply用のメッセージ文字列を返す
function checkControlMessage(userMessage) {
  var msg = userMessage.toLowerCase();
  
  if (msg.substring(0, 'from '.length) === 'from ') {
    var fromLang = msg.substring('from '.length, msg.lengh).trim();
    updateConfig('from', fromLang);
    return '翻訳元言語を' + fromLang + 'へ変更しました';
  } else if (msg.substring(0, 'to '.length) === 'to ') {
    var toLang = msg.substring('to '.length, msg.lengh).trim()
    updateConfig('to', toLang);
    return '翻訳後言語を' + toLang + 'へ変更しました';
  } 
  
  return '';
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