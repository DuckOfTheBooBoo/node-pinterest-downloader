import { Request, Response } from 'express'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import getUsernameAndPinBoard from '../utils/extractInfo'
import zipDirectory from '../utils/zipDirectory'
import crypto from 'crypto'
import fs from 'fs'

const GALLERY_DL = path.join(__dirname, '..', '..', 'bin', 'gallery-dl.bin')
const execPromise = promisify(exec)

const temporaryFiles = new Map()

const generateUniqueIdentifier = (): string => {
    return crypto.randomBytes(8).toString('hex')
}

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
            .then(({outPath, filename}) => {

                const fileId = generateUniqueIdentifier()
                temporaryFiles.set(fileId, {
                    filePath: outPath,
                    createdAt: Date.now()
                })
                res.status(200).json({
                    status: 'success',
                    message: 'successfully downloaded the pin board',
                    filename: filename,
                    downloadUrl: `/download/${fileId}`
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

const serveFile = async (req: Request, res: Response) => {
    const fileId = req.params.fileId
    const file = temporaryFiles.get(fileId)

    if (!file) {
        return res.status(404).send('<h1>File not found</h1>')
    }

    const expirationTime: number = 60 * 60 * 1000 // 1 hour
    const currentTime: number = Date.now()

    if ((currentTime - file.createdAt) > expirationTime) {
        fs.unlink(file.filePath, (err) => {
            if (err) console.error(`Error deleting file: ${err}`)
        })
        temporaryFiles.delete(fileId)
        return res.status(404).send('<h1>File expired</h1>')
    }

    res.download(file.filePath, (err) => {
        if (err) {
            console.error(`Error downloading file: ${err}`)
            return res.status(500).send('<h1>Error downloading file</h1>')
        }

        fs.unlink(file.filePath, (err) => {
            if (err) console.error(`Error deleting file: ${err}`)
        })

        temporaryFiles.delete(fileId)
    })
}

export {downloadPinBoard, serveFile}
