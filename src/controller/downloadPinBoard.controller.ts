import { Request, Response } from 'express'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import getUsernameAndPinBoard from '../utils/extractInfo'
import zipDirectory from '../utils/zipDirectory'

const GALLERY_DL = path.join(__dirname, '..', '..', 'bin', 'gallery-dl.bin')
const execPromise = promisify(exec)

const downloadPinBoard = async (req: Request, res: Response) => {
    const { url } = req.query
    
    if (!url) {
        return res.status(400).json({
            status: 'fail',
            message: 'No url provided'
        })
    }
    const info = getUsernameAndPinBoard(url)
    const directoryPath = path.join(__dirname, '..', '..', 'raw', info.username, info.pinBoard)

    try {
        console.log(`Downloading ${url}`)
        const { stdout, stderr } = await execPromise(`${GALLERY_DL} ${url} -D ${directoryPath}`)

        zipDirectory(directoryPath, info.username, info.pinBoard)
            .then((outPath) => {
                res.status(200).json({
                    status: 'success',
                    message: 'successfully downloaded the pin board',
                    path: outPath
                })
            })
            .catch(err => {
                console.error('Error while zipping directory: ', err)
            }) 
        
    } catch (err) {
        console.error(err)
        return res.status(500)
    }
}

export default downloadPinBoard
