# Google Sheets 設定說明

## 步驟 1：建立 Google Sheets

1. 前往 [Google Sheets](https://sheets.google.com/)
2. 建立新的空白試算表
3. 將試算表命名為「婚禮回覆表單」或你喜歡的名稱

## 步驟 2：建立 Google Apps Script

1. 在 Google Sheets 中，點擊上方選單的「擴充功能」>「Apps Script」
2. 會開啟新的 Apps Script 編輯器視窗
3. 刪除預設的程式碼
4. 複製 `google-apps-script.gs` 檔案中的所有程式碼
5. 貼上到 Apps Script 編輯器中
6. 點擊「儲存」圖示（或按 Ctrl+S / Cmd+S）
7. 將專案命名為「婚禮表單處理器」或你喜歡的名稱

## 步驟 3：部署為網頁應用程式

1. 在 Apps Script 編輯器中，點擊右上角的「部署」>「新增部署」
2. 點擊「選取類型」旁邊的齒輪圖示，選擇「網頁應用程式」
3. 設定以下選項：
   - **說明**：婚禮回覆表單處理器（可選）
   - **執行身份**：選擇「我」
   - **具有存取權的使用者**：選擇「所有人」
4. 點擊「部署」
5. 首次部署需要授權：
   - 點擊「授權存取權」
   - 選擇你的 Google 帳號
   - 點擊「進階」>「前往 [專案名稱]（不安全）」
   - 點擊「允許」
6. 複製「網頁應用程式 URL」（看起來像：`https://script.google.com/macros/s/...`）

## 步驟 4：更新網站程式碼

1. 開啟 `script.js` 檔案
2. 找到第 74 行：
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL';
   ```
3. 將 `YOUR_GOOGLE_SCRIPT_URL` 替換為你剛才複製的網頁應用程式 URL
4. 儲存檔案

## 步驟 5：測試

1. 開啟你的網站
2. 填寫表單並提交
3. 回到 Google Sheets，應該會看到新的資料列出現

## 查看回覆

- 所有回覆會自動寫入 Google Sheets
- 你可以在 Google Sheets 中查看、排序、篩選所有回覆
- 可以匯出為 Excel 或 CSV 格式
- 可以與他人共享 Google Sheets 來共同查看回覆

## 疑難排解

### 如果表單提交後沒有資料出現：

1. 檢查 Apps Script 是否有錯誤：
   - 在 Apps Script 編輯器中，點擊「執行」> 選擇 `test` 函數
   - 查看是否有錯誤訊息
2. 檢查網頁應用程式 URL 是否正確
3. 確認 Apps Script 的部署設定中「具有存取權的使用者」設為「所有人」
4. 檢查瀏覽器的開發者工具（F12）> Console 標籤，查看是否有錯誤訊息

### 如果需要修改欄位順序：

編輯 `google-apps-script.gs` 檔案中的 `sheet.appendRow([...])` 部分，調整欄位順序。

