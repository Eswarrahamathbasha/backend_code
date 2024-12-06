const WebAppRoutes = require("./../models/webRoutesModel")
exports.webRoutes = async () => {
    const routes = await WebAppRoutes.find({});
    return {
        success: true,
        data: routes
    };
};