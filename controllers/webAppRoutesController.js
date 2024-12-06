const { webRoutes } = require("../services/webAppRoutesSevice");

exports.webAppRoutesController = async (req, res, next) => {
    try {
        const routes = await webRoutes();
        res.status(200).json(routes);
    } catch (error) {
        next(error);
    }
};