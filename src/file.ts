import * as fs from 'fs-extra'

//读取text目录下的文件文本内容
export function getText(name: string) {
    return fs.readFileSync(`${__dirname}/text/${name}.txt`).toString().trim()
}

//读取data目录下的文件文本内容
export function getData(name: string) {
    return fs.readFileSync(`${__dirname}/data/${name}.txt`).toString().trim()
}

//在data目录下的文件文本内容行末追加内容
export function writeData(name: string, text: string) {
    let o = fs.readFileSync(`${__dirname}/data/${name}.txt`).toString().trim()
    let w = o + "\n" + text
    fs.writeFileSync(`${__dirname}/data/${name}.txt`, w)
}