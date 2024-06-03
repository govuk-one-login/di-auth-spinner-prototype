const WaitInteractions = (() => {

    const state = {
        heading: "Returning you to [service]",
        spinnerStateText: "Wait to be returned to the service",
        spinnerState: "pending",
        buttonDisabled: true,
        done: false,
        virtualDom: [],
    };

    const timers = {}

    const createVirtualDom = () => {

        const initialState = [
            {
                nodeName: "h1",
                text: state.heading,
                classes: ["govuk-heading-l"]
            },
            {
                nodeName: "div",
                id: "spinner",
                classes: ["spinner", "spinner__pending", "centre", state.spinnerState],
            },
            {
                nodeName: "p",
                text: state.spinnerStateText,
                classes: ["centre", "spinner-state-text"]
            },
            {
                nodeName: "button",
                text: "Continue",
                buttonDisabled: state.buttonDisabled,
                classes: ["govuk-button", "govuk-!-margin-top-4"]
            },
        ];

        const errorState = [
            {
                nodeName: "h1",
                text: state.heading,
                classes: ["govuk-heading-l"]
            },
            {
                nodeName: "p",
                text: state.messageText,
                classes: ["govuk-body"]
            },
            {
                nodeName: "h2",
                text: "What you can do",
                classes: ["govuk-heading-m"]
            },
            {
                nodeName: "p",
                innerHTML: `Go back to the service you were trying to use. You can look for the service using your search engine or find it from the <a href="https://www.gov.uk">GOV.UK homepage</a>.`,
                classes: ["govuk-body"]
            },
        ]

        return state.error ? errorState : initialState;
    }

    const updateDom = () => {
        document.title = state.heading;
        state.virtualDom = createVirtualDom();
        const elements = state.virtualDom.map(convert);
        const container = document.getElementById("spinner-container")
        container.replaceChildren(...elements);

        if (state.error) {
            container.classList.add('spinner-container__error');
        }

        if (state.done) {
            clearInterval(timers.updateDomTimer);
        }
    }

    const reflectCompletion = () => {
        state.spinnerState = "spinner__ready";
        state.spinnerStateText = "You can now continue to the service";
        state.buttonDisabled = false;
        state.done = true;
    }

    const reflectError = () => {
        state.heading = "Sorry, there is a problem"
        state.messageText = "We cannot return you to the service at the moment."
        state.spinnerState = "spinner__failed"
        state.done = true;
        state.error = true;
    };


    const convert = node => {
        const el = document.createElement(node.nodeName);
        if (node.text) el.textContent = node.text;
        if (node.innerHTML) el.innerHTML = node.innerHTML;
        if (node.id) el.id = node.id;
        if (node.classes) el.classList.add(...node.classes);
        if (node.buttonDisabled) el.setAttribute("disabled", node.buttonDisabled);
        return el;
    }

    const requestIDProcessingStatus = async () => {

        const apiRoute = document.getElementById('spinner-container').dataset.apiRoute;

        try {
            const response = await fetch(apiRoute);

            if (response.status !== 200) {
                throw new Error(`Status code ${response.status} received`)
            }

            const data = await response.json();

            if (data.status === "Clear to proceed") {
                reflectCompletion();
            } else {
                setTimeout(async () => {
                    await requestIDProcessingStatus();
                }, 1000)
            }
        } catch (e) {
            console.log(e);
            reflectError();
        }
    };

    return {
        init: () => {

            timers.informUserWhereWaitIsLong = setTimeout(() => {
                if (state.spinnerState !== "ready") {
                    state.spinnerStateText = "We're still trying to return you to the service";
                }
            }, 5000);

            timers.updateDomTimer = setInterval(updateDom, 2000);

            timers.abortUnresponsiveRequest = setTimeout(() => {
                reflectError();
            }, 15000)

            updateDom();

            requestIDProcessingStatus().then(() => {
                updateDom();
            })

        }
    };

})();

WaitInteractions.init();



