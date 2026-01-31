import { ApiResponse, LogEntry } from '../types';

const LOCAL_STORAGE_KEY = 'asim_db_logs';

// ------------------------------------------------------------------
// 🚨 GLOBAL MONITORING CONFIGURATION (TELEGRAM)
// ------------------------------------------------------------------
// 1. Create a bot via @BotFather on Telegram to get the Token.
// 2. Get your Chat ID via @userinfobot on Telegram.
// 3. Paste them inside the quotes below.
// ------------------------------------------------------------------
const TELEGRAM_BOT_TOKEN = '8223807138:AAGvqLeWyqLF5plPsCzlVbsO09I-5JmQ7UA';
const TELEGRAM_CHAT_ID = '6913364818';
// ------------------------------------------------------------------

export const logSearchQuery = async (query: string, data: ApiResponse) => {
  const entry: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    query,
    success: data.success,
    resultsCount: data.results_count || 0,
    details: JSON.stringify(data.results || []),
  };

  // 1. Save to Local Storage (Local Device History)
  try {
    const existingLogsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existingLogs: LogEntry[] = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
    // Keep last 100 logs
    const updatedLogs = [entry, ...existingLogs].slice(0, 100);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLogs));
  } catch (e) {
    console.error('Failed to save log locally', e);
  }

  // 2. Send to Telegram (Global Monitoring)
  // We check if tokens are provided and fire the request without blocking the UI
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    sendTelegramLog(query, data, entry).catch(err => console.error("Telegram Log Failed:", err));
  }
};

export const getLogs = (): LogEntry[] => {
  try {
    const logs = localStorage.getItem(LOCAL_STORAGE_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
};

export const clearLogs = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

const sendTelegramLog = async (query: string, data: ApiResponse, entry: LogEntry) => {
    // Generate the results list string
    let resultsText = '';
    
    if (data.results && data.results.length > 0) {
        // Limit to first 15 results to ensure message stays within Telegram limits (4096 chars)
        const displayResults = data.results.slice(0, 15); 
        
        resultsText = displayResults.map((res, index) => `
📝 *Record #${index + 1}*
👤 *Name:* ${res.name}
📱 *Mobile:* \`${res.mobile}\`
💳 *CNIC:* \`${res.cnic}\`
📍 *Address:* ${res.address || 'N/A'}
`).join('\n');

        if (data.results.length > 15) {
            resultsText += `\n⚠️ *...and ${data.results.length - 15} more records truncated (limit reached).*`;
        }
    }

    // Construct a beautifully formatted message
    const message = `
🚨 *ASIM DB ALERT* 🚨

🎯 *Query:* \`${query}\`
📡 *Status:* ${data.success ? '✅ SUCCESS' : '❌ FAILED'}
📂 *Count:* ${data.results_count || 0}

🌍 *Platform:* ${navigator.platform}
📱 *Agent:* \`${navigator.userAgent.substring(0, 50)}...\`
🕒 *Time:* ${new Date(entry.timestamp).toLocaleString()}

${resultsText}
    `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: true
        })
    });
};