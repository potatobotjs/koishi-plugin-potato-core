import * as fs from 'fs-extra'

export function getText(name: string) {
    return fs.readFileSync(`${__dirname}/text/${name}.txt`).toString().trim()
}