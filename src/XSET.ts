export enum XSET_DPMS_POWER{
    standby = "standby",
    suspend = "suspend",
    off = "off",
    on = "on"
}

import * as child_process from 'child_process'

export class XSET{
    
    public static readonly COMMAND_DPMS = "xset -display :0.0 dpms force {0}";
    public static readonly COMMAND_QUERY = "xset q";
    
    public static getMonitorStatus() {
        console.log(`running command: ${this.COMMAND_QUERY}`)
        const proc = child_process.execSync(this.COMMAND_QUERY);
        const regexp = /  Monitor is (?<status>.*)/;
        const parsed = regexp.exec(proc.toString()).groups.status.toLocaleLowerCase();

        if(!parsed) {
            return { 'monitor': 'unknown' };
        }
        
        const resultObject = { 'monitor': parsed.toLocaleLowerCase() };
        return resultObject;
    }

    public static setMonitorStatus(status: XSET_DPMS_POWER) {

        if(!Object.values(XSET_DPMS_POWER).includes(status)) {
            return false;
        }

        const regexp = /{.}/;

        const cmd = this.COMMAND_DPMS.replace(regexp, status.toString())
        console.log(`running command: ${cmd}`)
        child_process.execSync(cmd);
        return XSET.getMonitorStatus();
    }
}