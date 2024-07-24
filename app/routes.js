//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

let counter = 0;
router.get("/api", (req, res) => {
    counter++;
    const processingTime = req.query.processingTime || 1;
    console.log(`Elapsed processing seconds: ${counter}. Processing time limit is: ${processingTime}`);
    if (counter >= processingTime) {
        res.json({status: "Clear to proceed", counter: counter});
        counter = 0;
    } else {
        res.json({status: "Still processing", counter: counter});
    }
})

router.get("/prove-identity-status", (req, res) => {
    counter++;
    const processingTime = 3;
    console.log(`Elapsed processing seconds: ${counter}. Processing time limit is: ${processingTime}`);
    if (counter >= processingTime) {
        res.json({status: "COMPLETED", counter: counter});
        counter = 0;
    } else {
        res.json({status: "PROCESSING", counter: counter});
    }
})

router.get("/prove-identity-status-intervention", (req, res) => {
    counter++;
    const processingTime = 3;
    console.log(`Elapsed processing seconds: ${counter}. Processing time limit is: ${processingTime}`);
    if (counter >= processingTime) {
        res.json({status: "INTERVENTION", counter: counter});
        counter = 0;
    } else {
        res.json({status: "PROCESSING", counter: counter});
    }
})


router.get("/prove-identity-status-error", (req, res) => {
    counter++;
    const processingTime = 3;
    console.log(`Elapsed processing seconds: ${counter}. Processing time limit is: ${processingTime}`);
    if (counter >= processingTime) {
        res.json({status: "ERROR", counter: counter});
        counter = 0;
    } else {
        res.json({status: "PROCESSING", counter: counter});
    }
})

router.get("/api-cannot-proceed", (req, res) => {
    setTimeout(() => {
        res.json({status: "Still processing"})
    }, 1000)
})

router.get('/api-unresponsive', (req, res) => {
// Server doesn't respond
})

router.get("/api-error-response", (req, res) => {
    throw new Error('There has been an error');
})

router.post("/proceed-to-relying-party", (req, res) => {
    res.render("spinner-page-javascript-does-not-run.njk")
})
