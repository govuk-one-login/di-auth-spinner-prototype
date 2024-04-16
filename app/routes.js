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
        console.log(`Elapsed processing seconds: ${counter}`);
        const processingTime = req.query.processingTime || 1;
        if (counter >= processingTime) {
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

router.post("/proceed-to-relying-party", (req, res) => {
    res.render("spinner-page-javascript-does-not-run.njk")
})
