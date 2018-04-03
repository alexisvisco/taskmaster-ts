#!/usr/bin/env node

import {defaultConfigProcess} from "./server/types/ProcessConfig";
import * as fs from "fs";
import {SocketHandler} from "./server/Sockethandler";
import sprintf from "sprintf-js";

type Options = { port?: number, config: string, generate?: string, help?: string }

const options: Options = require('minimist')(process.argv, {
    default: { port: 9898, config: "./config.json" },
    alias: { "port": ["p"], "config": ["cfg"] }
});

class Application {

    options: Options;

    constructor(options: Options) {
        this.options = options;
    }

    public main() {
        if (this.options.generate)
            this.generateConfigAt();
        else if (this.options.help)
            this.showHelp();
        else
            this.launchServer();
    }

    private generateConfigAt() {
        fs.writeFile(this.options.generate, JSON.stringify(defaultConfigProcess(), null, 2), (err) => {
            if (err) console.log("Something wrong when creating file !");
            else console.log("A config file was generated.");
        })
    }

    private launchServer() {
        new SocketHandler(this.options.port);
    }

    private showHelp() {
        console.log("Help: ...")
    }
}

console.log(sprintf.sprintf("%15s", "Hello wol"));
new Application(options).main();