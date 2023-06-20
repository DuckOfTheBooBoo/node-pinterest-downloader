type Info = {
    username: string,
    pinBoard: string,
}

const getUsernameAndPinBoard = (url: any) => {

    const sections: string[] = url.split('/').filter((string: any) => string)
    const info: Info = {
        username: sections[2],
        pinBoard: sections[3],
    }
    
    return info
}

export default getUsernameAndPinBoard



