import C from '../constants'
import axios from 'axios'

class Slack {
    private webhook_url: string | null; 

    constructor(options? : any) {
        this.webhook_url = C.slack.webhook_url;
    }

    public isSlackAvailable(): boolean
    {
        if (this.webhook_url == null) {return false;}

        return true;
    }

    public async send(params: RecordSlack.sendParams): Promise<boolean> {
        try {
            if(this.isSlackAvailable() === false) {
                throw "slack not available.";
            }
            const options = {
                text: params.text
            };

            await axios.post(this.webhook_url!, JSON.stringify(options))
              .then(function (response) {
                return true;
              })
              .catch(function (error) {
                return false;
              });
            
            return true;
        } catch (error) {}

        return false;
    }

}

export default new Slack;