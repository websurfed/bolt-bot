const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'systemLogs.json');

// Function to add a log entry
function addLog(subject, content) {
  // Read existing logs
  let logs = [];
  if (fs.existsSync(logFilePath)) {
    const rawData = fs.readFileSync(logFilePath);
    logs = JSON.parse(rawData);
  }

  // Add new log entry
  logs.push({ subject, content });

  // Write updated logs back to file
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
}

// Export the function
module.exports = { addLog };
