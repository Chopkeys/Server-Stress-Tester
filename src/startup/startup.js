const mineflayer = require("mineflayer");
const tpsPlugin = require('mineflayer-tps')(mineflayer)
const config = require("../../config.json");
const {sleep} = require('../functions/sleep')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
const {logtps} = require('../functions/logtps')

let l = 0

async function startUpFunc() {
  let botArgs = {
    host: config.host,
    port: config.port,
    version: false,
  };

  class MCBot {
    // Constructor
    constructor(username, i) {
      this.username = username;
      this.host = botArgs["host"];
      this.port = botArgs["port"];
      this.version = botArgs["version"];
      this.level = i

      this.initBot();
    }

    // Init bot instance
    initBot() {
      this.bot = mineflayer.createBot({
        host: this.host,
        port: this.port,
        username: this.username,
        version: this.version,
        keepAlive: true,
        skipValidation       : true,
      });
      this.bot.loadPlugin(tpsPlugin)
      this.initEvents();
    }

    // Init bot events
    initEvents() {
      this.bot.once('spawn', async () => {
        let mineflayerViewerPort = 3007 + this.level
        mineflayerViewer(this.bot, { port: mineflayerViewerPort, firstPerson: false })
        // if(this.level == 0) {
        //  (this.bot)
        // }
        await console.log('spawned, starting to fly')
        await this.bot.creative.startFlying()
        if(this.bot.entity.position.y < 150) {
          await this.bot.creative.flyTo(this.bot.entity.position.offset(0, 150, 0))
        }
        
        // await sleep(2500)
        // let x = await Math.floor((Math.random()  * 100000) + 1)
        // let z = await Math.floor((Math.random()  * 100000) + 1)
        // const xflip = await Math.random()
        // const zflip = await Math.random()
        // if(xflip > 0.5) {
        //   x = await  x * -1
        // }
        // if(zflip > 0.5) {
        //   z = await z * -1
        // }
        let angleoncirc = (360/config.botAmount) * (this.level + 1)
        let x
        let z

        console.log(angleoncirc)

        switch ((Math.floor(angleoncirc/90))) {
          case 0:
            x = (config.distanceToFly * Math.sin(90-angleoncirc) / Math.sin(90))
            z = ((config.distanceToFly * Math.sin(angleoncirc) / Math.sin(90)) * -1)
          case 1:
            angle = angleoncirc - 89
            x = (config.distanceToFly * Math.sin(90-angle) / Math.sin(90))
            z = (config.distanceToFly * Math.sin(angle) / Math.sin(90))
          case 3:
            angle = angleoncirc - 179
            console.log(angle)
            x = ((config.distanceToFly * Math.sin(90-angle) / Math.sin(90)) * -1)
            z = (config.distanceToFly * Math.sin(angle) / Math.sin(90))
          case 4:
            let angle = angleoncirc - 269
            console.log(angle)
            x = ((config.distanceToFly * Math.sin(90-angle) / Math.sin(90)) * -1)
            z = ((config.distanceToFly * Math.sin(angle) / Math.sin(90)) * -1)
        }
        console.log(x)
        console.log(z)


        this.bot.look(angleoncirc, -90)

        console.log("flying")
        await this.bot.creative.flyTo(this.bot.entity.position.offset(x, this.bot.entity.position.y, z))
      })
      this.bot.on("login", async () => {
        console.log("Login event")
        let botSocket = this.bot._client.socket;
        console.log(
          `[${this.username}] Logged in to ${
            botSocket.server ? botSocket.server : botSocket._host
          }`
        );
      });
      this.bot.on("connected", () => {
        console.log("connected")
      })

      this.bot.on("end", async (reason) => {
        console.log(`[${this.username}] Disconnected: ${reason}`);

        if (reason == "disconnect.quitting") {
          return;
        }
      });
      this.bot.on("kicked", async (reason) => {
        console.log(`[${this.username}] Kicked: ${reason}`);
      });

      this.bot.on("error", async (err) => {
        if (err.code == "ECONNREFUSED") {
          console.log(
            `[${this.username}] Failed to connect to ${err.address}:${err.port}`
          );
        } else {
          console.log(`[${this.username}] Unhandled error: ${err}`);
        }
      });
    }
  }
  let bots = [];
  let p = 0
  for (let i = 0; i < config.botAmount; i++) {
    bots.push(new MCBot(`${config.accountNames}_${i}`, i));
    await sleep(300)
  }
}

module.exports = { startUpFunc };