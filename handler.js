import jimp from 'jimp'

const ajax = async function(req, res){

    if(req.file) {
        const fileName = req.file.originalname
        const buffer = req.file.buffer
        const image = await jimp.read(buffer)
        const vRatio = 0.75
        const hRatio = 1.33333333
        const {width, height} = image.bitmap
        const ratio = width / height

        if(ratio < 1 && (width > 240 || height > 320)) {
            if(ratio < vRatio) image.resize(jimp.AUTO, 320 )
            else if(ratio >= vRatio) image.resize(240, jimp.AUTO)
        }
        else if(ratio > 1 && (width > 320 || height > 240)) {
            if(ratio <= hRatio) image.resize(jimp.AUTO, 240)
            else if(ratio > hRatio) image.resize(320, jimp.AUTO)
        }
        else if(ratio === 1) image.resize(240, jimp.AUTO)

        image.write(`./uploads/${fileName}`)
    }

    res.status(200).json()
}

export default ajax
