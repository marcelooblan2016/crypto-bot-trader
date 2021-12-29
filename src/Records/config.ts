import fs from 'fs';

interface updateParameters {
    key: any,
    value: string | number | null,
}

class config {
    protected envFile = './.env';
    constructor(options? : any) {}
    
    private isEnvExist(): boolean {
        if (fs.existsSync(this.envFile)){
            return true;
        }

        return false;
    }
    
    private envValues(): any {
        let envValues: any = {};
        let envContent = fs.readFileSync(this.envFile, 'utf8');
        let data = envContent.split("\n")
        .filter( function (rowStr) {

            return rowStr.includes('=') && !rowStr.includes('#');
        })
        .map( function (rawValue) {
            let row: any = rawValue.split("=");
            let value = row[1].split('"').join('');
            envValues[row[0]] = value;
        });

        return envValues
    }

    public update(params: updateParameters): boolean {
        if (this.isEnvExist() === false) { return false; }
        let envValues = this.envValues();

        envValues[params.key] = params.value;
        let envContent: string = "";
        for(let key in envValues) {
            envContent+=[key, '=', envValues[key], "\n"].join("");
        }

        fs.writeFileSync( this.envFile, envContent, {})

        return true;
    }
}

export default new config