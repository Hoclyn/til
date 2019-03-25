/*
SpreadSheet�ɂ��炩���߈ȉ��̃V�[�g���쐬���Ă���
	log
	error
	config
���p���C�u����
	Moment	Version:9 key�FMHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48
�X�N���v�g�v���p�e�B
	�Ȃ�
*/

var thisBook_ = SpreadsheetApp.getActiveSpreadsheet();
var appConfig_ = {}; // config�V�[�g�Őݒ肷��ݒ�l�̘A�z�z��

// POST�󂯎��
function doPost(e) {
  // �󂯎����POST�f�[�^��log�V�[�g�ɋL�^����
  writeLog(e.postData.getDataAsString());
  var params = JSON.parse(e.postData.getDataAsString());
  
  main(params);

}

// ���C��
function main(p){
  try {
    // config�V�[�g�̓ǂݍ���
    readConfig();
    // ����
    doFoobar(p);
  } catch (error) {
    writeErrorLog(error);
  }
}

// �e�X�g�p
function test(){
  var params = JSON.parse(TEST_DATA_1);
  main(params);
}

// �ݒ�ǂݍ���
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

// log�L�^�p
function writeParameterLog(e) { 
  var log = [];
  log.push(e);
  writeLog('log',log);
  
}

// �G���[���O�L�^�p
function writeErrorLog(e) {  
  var log = [];
  log.push(e);
  writeLog('error',log);
}

// ����V�[�g�ɓ��t�t���ŏ����L�^
function writeLog(logSheetName, log) {
  var logSheet = THIS_BOOK.getSheetByName(logSheetName);
  var lastRow = logSheet.getLastRow();
  logSheet.getRange(lastRow+1, 1).setValue(getDateTime());
  for (var i = 0; i < log.length; i++) {
    logSheet.getRange(lastRow+1, (i+2)).setValue(log[i]);
  }
}

// ���݂̓��t�𕶎���Ŏ擾
function getDateTime() {
  var m = Moment.moment(); 
  return m.format("YYYY/MM/DD HH:mm:ss");
}
// ���[�����M
// backlog�̌�����Mail�̌����A�ڍׂƓo�^���[�U�[���˖{��
function sendMail(mailTempalteName, p) {
  // Mail�Ƀf�[�^���ߍ���
  var html = HtmlService.createTemplateFromFile(mailTempalteName);
  html.data = p.content.description.replace('\n\n','\n').split('\n'); 
  html.createdUser = p.createdUser.name;
  var mailHtml = html.evaluate().getContent();
  
  // ���M�I�v�V�����̐ݒ�
  var option = {};
  option.to = appConfig_['Mail.To'];
  option.subject = p.content.summary;	// ����
  option.from = appConfig_['Mail.From'];
  option.name = '���M��.';
  option.replyTo = appConfig_['Mail.ReplyTo'];
  option.htmlBody = mailHtml;
  GmailApp.sendEmail(option.to, option.subject, '', option);
}

