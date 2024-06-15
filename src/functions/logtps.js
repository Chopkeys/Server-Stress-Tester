const {sleep} = require('../functions/sleep')
const fs = require('fs')

async function logtps(bot) {
    let total_statistics = "sample, tps\n"
    for (let i = 0; i < 72; i++) {
        let tps = await bot.getTps()
        let stat = `${i},${tps}\n` 
        total_statistics = total_statistics + stat
        console.log(total_statistics)
        await sleep(2500)
    }
    console.log(total_statistics)
    fs.writeFile('./results/vanilla.txt', total_statistics, (err) => {
        if (err) throw err;
    })
}

module.exports = {logtps} 