# 概要
SpreadsheetにPOSTされたJSONデータを記録します。
さらにPOSTされた情報を使ってメール送信します。

# ファイル構成
### SampleSpreadSheet.xlsx
最初にGoogel Driveにアプロードし、SpreadSheetにコンバートします。
コンバート後はアップロード済のExcelファイルは削除してもOKです。

### Main.gs
メインプログラム

### FoobarProcess.gs
サンプルビジネスロジックプログラム

### TestData.gs
テストデータ定義ファイル

### FoobarMail.html
HTMLメールのテンプレート

## 注意点
メールの送信元はスクリプトオーナーまたはスクリプトオーナーが所有する送信元エイリアスでなくてはいけません。
参考）[公式Reference](https://developers.google.com/apps-script/reference/gmail/gmail-app#sendEmail(String,String,String,Object)) , [別のアドレスからメールを送信する](https://www.ka-net.org/blog/?p=4441)