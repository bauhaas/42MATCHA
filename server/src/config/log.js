import log from 'npmlog';
import { fileURLToPath } from 'url';

log.enableColor();
log.headingStyle = { fg: 'cyan', bg: 'black' }
log.heading = 'APP-LOG';

export default log;