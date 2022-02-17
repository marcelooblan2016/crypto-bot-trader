const mailer = require("../dist/Records/mailer");

(async function() {
    await mailer.default.send({subject: "This is email from bot", message: "test Email"});
})();