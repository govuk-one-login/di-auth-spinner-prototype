//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

let counter = 0;
router.get("/api", (req, res) => {
    setTimeout(() => {
        counter++;
        console.log(`Counter is ${counter}`);
        const delay = req.query.delay || 1;
        if (counter >= delay) {
            res.json({ status: "Clear to proceed", counter: counter });
            counter = 0;
        } else {
            res.json({ status: "Still processing", counter: counter });
        }
    }, 1000);
})

router.get("/api-cannot-proceed", (req, res) => {
    setTimeout(() => {
        res.json({ status: "Still processing" })
    }, 1000)
})

router.get("/api-no-response", (req, res) => {
    return;
})
