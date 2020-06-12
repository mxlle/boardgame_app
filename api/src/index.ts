import './LoadEnv'; // Must be the first import
import { httpServer } from '@server';
import logger from '@shared/Logger';

// Start the server
const host = process.env.HOST || 'localhost';
const port = Number(process.env.PORT || 3000);
httpServer.listen(port, host, () => {
    logger.info('Express server started on port: ' + port);
});
