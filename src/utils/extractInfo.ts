type Info = {
    username: string,
    pinBoard: string,
}

const getUsernameAndPinBoard = (url: any): Info | undefined => {

    if (url) {
        const sections: string[] = url.split('/').filter((string: any) => string)
        const info: Info = {
            username: sections[2],
            pinBoard: sections[3],
        }
    
        return info
    }
    return undefined
}

export default getUsernameAndPinBoard
