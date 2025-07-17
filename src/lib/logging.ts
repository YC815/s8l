// Simple in-memory log store (in production, use proper logging service)
let logs: string[] = []

// Add a function to log from server components
export function serverLog(message: string) {
  const timestamp = new Date().toISOString()
  const logEntry = `[${timestamp}] ${message}`
  logs.push(logEntry)
  console.log('📝 Server log:', logEntry)
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs = logs.slice(-100)
  }
}

export function getLogs() {
  return logs.slice(-50) // Return last 50 logs
}

export function addLog(message: string) {
  const timestamp = new Date().toISOString()
  const logEntry = `[${timestamp}] ${message}`
  
  logs.push(logEntry)
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs = logs.slice(-100)
  }
  
  console.log('📝 Log entry:', logEntry)
}