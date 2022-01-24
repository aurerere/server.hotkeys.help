// LIBS ----------------------------------------------------------------------------------------------------------------
const   fs = require('fs'),
        sharp = require('sharp');


exports.newProfilePicture = async function (req, res) {
    fs.access('./files/profilePictures', err => {
       if (err)
           fs.mkdirSync('./files/profilePictures')
    });
    const { buffer } = req.file,
        timeLog = new Date().toISOString(),
        ref = `${timeLog}-user${req.user.id}.png`;
    console.log('here')

    try {
        console.log(ref, buffer)
        // sharp(buffer)
        //     .png({ compressionLevel: 9, adaptiveFiltering: true, force: true })
        //     .then(buffer => {
        //         fs.writeFileSync('test.png', buffer)
        //     })
        fs.writeFileSync(ref, buffer)
        // await sharp(buffer)
        //     .png({ compressionLevel: 9 })
        //     .toFile(ref);
    }
    catch (err) {
        console.log(err)
    }
}