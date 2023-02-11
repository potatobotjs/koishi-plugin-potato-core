import { number } from 'schemastery'
import * as pbrFile from './file'
import { genRandom } from './utils/other'

export async function what2eat(_) {
    let array = pbrFile.getData('meal_list').split('\n')
    let meal = array[genRandom(array.length - 1, 0)].split(':')[0].trim()
    _.session.send(`吃${meal}怎么样？`)
}

export async function what2eat_10x(_) {
    // let array = pbrFile.getData('meal_list').split('\n')
    // let meal = array[genRandom(array.length - 1, 0)].split(':')[0].trim()
    // _.session.send(`吃${meal}怎么样？`)
}

export async function add(_, m) {
    let code = 0
    let array = pbrFile.getData('meal_list').split('\n')


    if (typeof (m) === "number") { code = 2 }
    m = m.toString()

    for (let i = 0; i < array.length; i++) {
        if (array[i].split(':')[0] == m) { code = 1 }
    }

    if (m.indexOf("CQ:") != -1) { code = 2 }

    if (code == 0) {
        pbrFile.writeData('meal_list', `${m}:${_.session.userId}`)
        _.session.send("添加完成。")
        return
    }
    switch (code) {
        case 1:
            _.session.send("条目已存在。")
            break
        case 2:
            _.session.send("请不要试图添加一些奇怪的东西。")
            break
    }


}