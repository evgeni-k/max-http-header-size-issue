const createApp = require(`./app`);
const logger = require(`./logger`);

const port = process.env.PORT || 4100;

const app = createApp();
app.listen(port, () => {
    logger.info(`app is up and running on port ${port}`);
})
    .on(`clientError`, (err, socket) => {
        logger.error(`error occurred: ${err.message}`);
        const {
            stack,
            rawPacket,
            ...rest
        } = err;

        logger.error(`error details`, {
            stack,
            rawPacketSize: (rawPacket && rawPacket.length) || 0,
            ...rest,
        });
        socket.end(`HTTP/1.1 431 Request Header Fields Too Large\r\n\r\n`);
    });
