import C from '../constants'
import nodemailer from 'nodemailer';

class Mailer {
    protected transporter: any;

    constructor(options? : any) {
        this.transporter = nodemailer.createTransport({
            host: C.mailer.host,
            port: C.mailer.port,
            secure: C.mailer.secure,
            auth: {
              user: C.mailer.auth.user,
              pass: C.mailer.auth.pass,
            },
        });
    }

    public isMailerAvailable(): boolean
    {
        if (C.mailer.auth.user == null || C.mailer.auth.pass == null) {
            return false;
        }

        return true;
    }
    
    public async send(params: RecordMailer.sendParams): Promise<boolean> {
        try {
            if (this.isMailerAvailable() === false) {
                throw "mail set up not ready.";
            }
            
            let info = await this.transporter.sendMail({
                from: C.mailer.from, // sender address
                to: C.mailer.to, // list of receivers
                subject: params.subject, // Subject line
                text: params.message, // plain text body
            });

            console.log("Message sent: %s", info.messageId);

            return true;

        } catch (error) {}

        return false;
    }
}

export default new Mailer;