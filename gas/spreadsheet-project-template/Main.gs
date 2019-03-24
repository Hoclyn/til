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
function writeLog(e) {
  var logSheet = thisBook_.getSheetByName('log');
  var lastRow = logSheet.getLastRow();

  logSheet.getRange(lastRow+1, 1).setValue(getDateTime());
  logSheet.getRange(lastRow+1, 2).setValue(e);
}

// �G���[���O�L�^�p
function writeErrorLog(e) {
  var logSheet = thisBook_.getSheetByName('error');
  var lastRow = logSheet.getLastRow();

  logSheet.getRange(lastRow+1, 1).setValue(getDateTime());
  logSheet.getRange(lastRow+1, 2).setValue(e);
}

// ���݂̓��t�𕶎���Ŏ擾
function getDateTime() {
  var m = Moment.moment(); 
  return m.format("YYYY/MM/DD HH:mm:ss");
}