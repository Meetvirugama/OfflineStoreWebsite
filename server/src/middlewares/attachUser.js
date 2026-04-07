export const attachUser = (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({
            message: "User not attached"
        });
    }

    // 🔥 CRITICAL FIX
    if (!req.body) {
        req.body = {};
    }

    req.body.created_by = req.user.id;

    next();
};