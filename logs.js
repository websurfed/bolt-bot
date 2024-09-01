const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'systemLogs.json');

function printLogs() {
  if (fs.existsSync(logFilePath)) {
    const rawData = fs.readFileSync(logFilePath);
    const logs = JSON.parse(rawData);

    logs.forEach((log, index) => {
      console.log(`🪵  Log — ${index + 1}`);
      console.log(`✉️  Subject — ${log.subject}`);
      console.log(`🚀 Content — ${log.content}`);
      console.log(' - ');
    });
  } else {
    console.log('No logs found.');
  }
}

printLogs();
