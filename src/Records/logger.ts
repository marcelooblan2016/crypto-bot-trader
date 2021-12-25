import {Page} from 'puppeteer';
const fs = require('fs');

interface writeParams {
    content: string
}

class Logger {
    protected directory = '../logs';
    constructor(options? : any) {
        if (!fs.existsSync(this.directory)){
            fs.mkdirSync(this.directory);
        }
    }

    private getName(type: number): string {
        const d = new Date();
        let month = d.getMonth() + 1;

        return type == 1 ? `${d.getFullYear()}-${month}-${d.getDate()}` : 
        `${d.getFullYear()}-${month}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
    }

    public write(params: writeParams):boolean {
        const d = new Date();
        let month = d.getMonth() + 1;

        let dateString = this.getName(1);
        let dateTimeString = `${d.getFullYear()}-${month}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        let fileName = `${this.directory}/${dateString}.log`;
        let content = `${dateTimeString}: ${params.content}` + "\n";
        
        this.console(content);

        fs.appendFileSync(fileName, content);
        
        return true;
    }

    public async screenshot(page: Page): Promise<boolean> {

        let pathFileName: string = `${this.directory}/${this.getName(2)}.png`;
        await page.screenshot({path: pathFileName});

        return true;
    }

    public console(content: string) {
        console.log(content);
    }
    
}

export default new Logger;