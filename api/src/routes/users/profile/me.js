exports.me = function (req, res) {
    return res.status(200).send({
        status: 200,
        message: `${req.user.username} successfully reached`,
        user: req.user
    });
}