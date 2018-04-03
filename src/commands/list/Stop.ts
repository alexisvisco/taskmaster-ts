import {Command} from "../Command";
import {CommandLabel} from "../../../dist/commands/Commands";
import {CommandAction} from "../CommandAction";
import {CommandRouter} from "../Commands";
import {ProgramHandler} from "../../server/ProgramHandler";

@CommandLabel("stop", ["kill"])
export class Stop extends Command implements CommandAction{

    @CommandRouter(/^all$/g, {}, 2)
    processAll() {
        this.socket.write('Stopping all process !');
        ProgramHandler.programs.forEach((program) => program.killAllProcesses());
    }

    @CommandRouter(/^(\w+)$/g, {}, 1)
    processName(name) {
        const prog = ProgramHandler.getByname(name);
        if (prog && prog.aliveProcesses != 0) {
            this.socket.write(`Stopping process all processes for program ${prog.config.name}`);
            prog.killAllProcesses();
        }
        else this.socket.write('No program for this name.');
    }

    @CommandRouter(/^(\d+)$/g)
    processPid(pid) {
        const pe = ProgramHandler.getByPid(pid);
        if (pe) {
            if (pe.isAlive) {
                this.socket.write(`Stopping process ${pe.currentName}`);
                pe.stop();
            }
            else this.socket.write('Process is already stopped.');
        }
        else this.socket.write('No process for this pid.');
    }

    @CommandRouter(/^(\w+) (\d+)$/g)
    processNameNum(name, num) {
        const pe = ProgramHandler.getByNum(name, num);
        this.processPid(pe ? pe.pid : undefined);
    }

    help() {
        super.helpLine()
            .helpCommand("stop <name>", "Stop all processes in program $name.")
            .helpCommand("stop all", "Stop all processes actives.")
            .helpCommand("stop <pid>", "Stop the process with the pid $pid.")
            .helpCommand("stop <name> <id>", "Stop the process $id in the program $name.")
    }
}