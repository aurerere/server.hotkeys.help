// LIBS ----------------------------------------------------------------------------------------------------------------
const   fs = require('fs')/*,
        sharp = require('sharp')*/;


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

    try {
        console.log(name, Buffer.byteLength(buffer))
        // sharp(buffer)
        //     .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
        //     .then(buffer => {
        //         fs.writeFileSync('test.png', buffer)
        //     })
        fs.writeFileSync(`./uploaded/profilePictures/${name}`, buffer)
        // await sharp(buffer)
        //     .png({ compressionLevel: 9 })
        //     .toFile(ref);
        return res.send('OK')
    }
    catch (err) {
        console.log(err)
    }
}