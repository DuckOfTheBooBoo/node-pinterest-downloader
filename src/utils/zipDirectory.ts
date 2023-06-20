import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execPromise = promisify(exec)

const zipDirectory = async (pathParam: string, username: string, pinBoard: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const newPath: string = path.join(pathParam)
        const filename: string = `${username}-${pinBoard}.zip`
        const outPath: string = path.join(__dirname, '..', '..', 'archive', filename)

        console.log(`Zipping ${newPath} to ${outPath}`)
        execPromise(`zip -j ${outPath} ${path.join(newPath, '*')}`)
            .then(({stdout, stderr}) => {
                console.log(`Deleting ${newPath}`)
                fs.rm(newPath, {recursive: true}, (err) => {
                    if (err) {
                        reject (err)
                    } else {
                        resolve(outPath)
                    }
                })
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export default zipDirectory
