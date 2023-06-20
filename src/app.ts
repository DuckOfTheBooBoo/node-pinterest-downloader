import express, { Application, Request, Response, NextFunction, request } from 'express';
import router from './routes/index.route';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { promisify } from 'util';

const app: Application = express();
const PORT: number = 8080;
const GALLERY_DL_URL: string = 'https://github.com/mikf/gallery-dl/releases/download/v1.25.6/gallery-dl.bin'
const FILE_PATH = path.join(__dirname, '..', 'bin', 'gallery-dl.bin');

const fsAccessAsync = promisify(fs.access);

app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(router);

// Download gallery-dl bin
async function checkGalleryDlExist(): Promise<boolean> {
    try {
        await fsAccessAsync(path.join(__dirname, FILE_PATH));
        console.log('gallery-dl.bin exists');
        return true
    } catch (err) {
        console.error('gallery-dl.bin does not exist, downloading...');

        try {
            await downloadFile()
            return true
        } catch (err) {
            return false
        }
    }
}

async function downloadFile(): Promise<void> {
    const file = fs.createWriteStream(FILE_PATH);
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: GALLERY_DL_URL,
            responseType: 'stream',
        })
        .then(response => {
            response.data.pipe(file);
            file.on('finish', (): void => {
                console.log('gallery-dl downloaded successfully')
                resolve()
            })
        })
        .catch((err: Error): void => {
            console.error('Error downloading the file: ', err)
            fs.unlink(FILE_PATH, function (err) {
                if (err) {
                    reject(err)
                } else {
                    reject()
                }
            })
        })

    }) 
}

checkGalleryDlExist()
    .then((exists: boolean): void => {
        app.listen(PORT, () => {
            console.log(`Server is listening at port ${PORT}`);
        });
    })
    .catch((err: Error):void => {
        console.error('Error checking file exsistance: ', err)
    })

