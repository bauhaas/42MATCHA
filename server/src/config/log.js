import log from 'npmlog';
import { fileURLToPath } from 'url';

log.enableColor();
log.headingStyle = { fg: 'cyan', bg: 'black' }
log.heading = 'APP-LOG';

// Define a higher-order function that takes the log level as an argument
// and returns a new function that uses that log level.
const fileLog = (level, url) => (...args) => {
    const filename = fileURLToPath(url).split('/').pop();
    return log[level](`[${filename}]`, ...args);
};

// Use the fileLog function to define new log methods for different log levels.
log.file = (...args) => fileLog('info', import.meta.url, ...args);
log.fileWarn = (...args) => fileLog('warn', import.meta.url, ...args);
log.fileError = (...args) => fileLog('error', import.meta.url, ...args);


export default log;