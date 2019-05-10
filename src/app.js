const Koa = require(`koa`);
const Router = require(`koa-router`);
const views = require(`koa-views`);
const path = require(`path`);

const logger = require(`./logger`);
const {registerRequestLoggingMiddleware} = require(`./request-logging`);

function createApp() {
    const app = new Koa();

    app.use(views(path.join(__dirname, `/views`)));
    registerRequestLoggingMiddleware(app);
    app.on(`error`, (err) => {
        logger.error(`server error`, err);
    });

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.response.status = 500;
            ctx.app.emit(`error`, err, ctx);
        }
    });

    const router = new Router();

    router.get(`/`, async (ctx) => {
        await ctx.render(`index.html`)
    });

    router.get(`/headers-test`, (ctx) => {
        ctx.body = {ok: true};
    });

    app
        .use(router.routes())
        .use(router.allowedMethods());

    return app;
}

module.exports = createApp;
