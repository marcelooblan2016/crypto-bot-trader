const slack = require("../dist/Records/slack");

(async function() {
    console.log( await slack.default.send({text: "Slack test again"}) );
})();