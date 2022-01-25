// LIBS ----------------------------------------------------------------------------------------------------------------
const fs = require('fs');

// LOCAL ---------------------------------------------------------------------------------------------------------------
const   db = require('../../../utils/db/database').promise(),
        { red, timeLog, hl } = require('../../../utils/server/coolTerminal');


exports.newProfilePicture = async function (req, res) {

    if (!req.file)
        return res.status(400).send({
            error: {
                status: 400,
                message: "No image provided"
            }
        });

    const { buffer, originalname } = req.file;

    if (!originalname.toLowerCase().endsWith('.png') &&
        !originalname.toLowerCase().endsWith('.jpg') &&
        !originalname.toLowerCase().endsWith('.jpeg')
    )
        return res.status(400).send({
            error: {
                status: 400,
                message: "Invalid image format"
            }
        });

    if (Buffer.byteLength(buffer) >= 3000000)
        return res.status(400).send({
            error: {
                status: 400,
                message: "Too big image (limit: 3MB)"
            }
        });

    try {
        const name = `user${req.user.id}.png`;

        if (fs.existsSync(`./uploaded/profilePictures/${name}`))
            fs.unlink(`./uploaded/profilePictures/${name}`, (e) => {
                if (e)
                    return res.status(500).send({
                        error: {
                            status: 500,
                            message: "Internal server error"
                        }
                    });
                else {
                    fs.writeFileSync(`./uploaded/profilePictures/${name}`, buffer);
                }
            });

        fs.writeFileSync(`./uploaded/profilePictures/${name}`, buffer);

        const [change] = await
            db.query('UPDATE users SET profilePicture = ? WHERE id = ?', [name, req.user.id]);

        if (change.affectedRows === 1) {
            console.log(
                `${timeLog()} ${red('Server')}: ${hl(req.user.username)}'s profile picture successfully updated as ${hl(name)}.`
            );

            return res.status(200).send({
                status: 200,
                message: "Profile picture successfully uploaded"
            });
        }

        else {
            return res.status(404).send({
                error: {
                    status: 404,
                    message: "User not found"
                }
            });
        }
    }
    catch (err) {
        console.log(err);

        return res.status(500).send({
            error: {
                status: 500,
                message: "Internal server error"
            }
        });
    }
};