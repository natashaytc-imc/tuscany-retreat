/**
 * Google Apps Script 用於接收表單數據並寫入 Google Sheets
 * 
 * 設定步驟：
 * 1. 建立新的 Google Sheets 文件
 * 2. 在 Google Sheets 中，點擊「擴充功能」>「Apps Script」
 * 3. 將此程式碼貼上並儲存
 * 4. 點擊「部署」>「新增部署」
 * 5. 選擇「網頁應用程式」
 * 6. 設定執行身份為「我」，存取權限為「所有人」
 * 7. 複製部署 URL 並替換 script.js 中的 YOUR_GOOGLE_SCRIPT_URL
 */

// 處理 GET 請求（用於測試和直接訪問）
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    'status': 'success',
    'message': 'Google Apps Script 已成功部署，可以接收表單數據'
  })).setMimeType(ContentService.MimeType.JSON);
}

// 處理 POST 請求（接收表單數據）
function doPost(e) {
  try {
    let data;
    
    // Google Apps Script 會自動將 URL 編碼的 POST 數據解析到 e.parameter
    // 如果是 JSON 格式，則從 e.postData.contents 獲取
    if (e.postData && e.postData.contents) {
      try {
        // 嘗試解析為 JSON
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        // 如果不是 JSON，使用參數（URL 編碼格式）
        data = {
          name: e.parameter.name || '',
          email: e.parameter.email || '',
          hasCompanion: e.parameter.hasCompanion || '',
          guestCount: e.parameter.guestCount || '',
          stayAtVilla: e.parameter.stayAtVilla || '',
          dietary: e.parameter.dietary || '',
          specialRequests: e.parameter.specialRequests || '',
          optionalActivities: e.parameter.optionalActivities || '',
          message: e.parameter.message || '',
          submittedAt: e.parameter.submittedAt || new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
        };
      }
    } else {
      // 從 URL 參數獲取（URL 編碼格式的 POST 或 GET 請求）
      data = {
        name: e.parameter.name || '',
        email: e.parameter.email || '',
        hasCompanion: e.parameter.hasCompanion || '',
        guestCount: e.parameter.guestCount || '',
        stayAtVilla: e.parameter.stayAtVilla || '',
        dietary: e.parameter.dietary || '',
        specialRequests: e.parameter.specialRequests || '',
        optionalActivities: e.parameter.optionalActivities || '',
        message: e.parameter.message || '',
        submittedAt: e.parameter.submittedAt || new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
      };
    }
    
    // 取得 Google Sheets
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 如果是第一次執行，建立標題列
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        '提交時間',
        '姓名',
        '電子郵件',
        '是否攜伴',
        '參加人數',
        '是否同住 Villa',
        '飲食需求',
        '特殊需求或備註',
        'Day 2 自費活動',
        '祝福留言'
      ]);
    }
    
    // 將數據寫入 Google Sheets
    sheet.appendRow([
      data.submittedAt || new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
      data.name || '',
      data.email || '',
      data.hasCompanion || '',
      data.guestCount || '',
      data.stayAtVilla || '',
      data.dietary || '',
      data.specialRequests || '',
      data.optionalActivities || '',
      data.message || ''
    ]);
    
    // 返回成功回應
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': '數據已成功寫入'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // 記錄錯誤到日誌
    Logger.log('錯誤: ' + error.toString());
    Logger.log('錯誤詳情: ' + JSON.stringify(error));
    
    // 返回錯誤回應
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 測試函數（可選）
function test() {
  const testData = {
    name: '測試',
    email: 'test@example.com',
    hasCompanion: '是',
    guestCount: '2',
    stayAtVilla: '是',
    dietary: '素食',
    specialRequests: '測試備註',
    optionalActivities: 'Pasta Class',
    message: '測試祝福',
    submittedAt: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  doPost(mockEvent);
}

