const mineflayer = require("mineflayer");
const config = require("../../config.json");
const {sleep} = require('../functions/sleep')

let l = 0

async function startUpFunc() {
  let botArgs = {
    host: config.host,
    port: config.port,
    version: false,
  };

  class MCBot {
    // Constructor
    constructor(username) {
      this.username = username;
      this.host = botArgs["host"];
      this.port = botArgs["port"];
      this.version = botArgs["version"];

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

      this.initEvents();
    }

    // Init bot events
    initEvents() {
      this.bot.once('spawn', async () => {
        await console.log('spawned, starting to fly')
        await this.bot.creative.startFlying()
        if(this.bot.entity.position.y < 150) {
          await this.bot.creative.flyTo(this.bot.entity.position.offset(0, 150, 0))
        }
        
        await sleep(2500)
        let x = await Math.floor((Math.random()  * 100000) + 1)
        let z = await Math.floor((Math.random()  * 100000) + 1)
        const xflip = await Math.random()
        const zflip = await Math.random()
        if(xflip > 0.5) {
          x = await  x * -1
        }
        if(zflip > 0.5) {
          z = await z * -1
        }
        console.log("jetting off to " + this.bot.entity.position.offset(x, 0, z))
        await this.bot.creative.flyTo(this.bot.entity.position.offset(x, 0, z))
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
    bots.push(new MCBot(`${config.accountNames}_${i}`));
    await sleep(300)
  }
}

module.exports = { startUpFunc };