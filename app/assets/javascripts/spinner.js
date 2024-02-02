const state = {
    spinnerStateText: "Please wait",
    messageText: "There may be a short wait. You'll be able to continue soon.",
    spinnerState: "pending",
    buttonDisabled: true,
    done: false,
    virtualDom: [],
};

function createVirtualDom() {
    return [
        {
            nodeName: "div",
            id: "spinner",
            classes: ["spinner", "spinner__pending", "centre", state.spinnerState],
        },
        {
            nodeName: "p",
            text: state.spinnerStateText,
            classes: ["centre"]
        },
        {
            nodeName: "p",
            text: state.messageText,
            classes: ["govuk-body"]
        },
        {
            nodeName: "button",
            text: "Continue",
            buttonDisabled: state.buttonDisabled,
            classes: ["govuk-button", "govuk-!-margin-top-4"]
        },
    ];
}

function updateDom() {
    state.virtualDom = createVirtualDom();
    const elements = state.virtualDom.map(convert);
    document.getElementById("spinner-container").replaceChildren(...elements);
    if(state.done) {
        clearInterval(domUpdate);
    }
}

function convert(node) {
    const el = document.createElement(node.nodeName);
    if (node.text) el.textContent = node.text;
    if (node.id) el.id = node.id;
    if (node.classes) el.classList.add(...node.classes);
    if (node.buttonDisabled) el.setAttribute("disabled", node.buttonDisabled);
    return el;
}

setTimeout(() => {
    if (state.spinnerState !== "ready") {
        state.spinnerStateText = "We're still trying";
    }
}, 5000);

async function requestReadyState() {

    const apiRoute = document.getElementById('spinner-container').dataset.apiRoute;

    try {
        const response = await fetch(apiRoute);
        const data = await response.json();
        console.log(data);
        if (data.status === "Clear to proceed") {
            state.spinnerState = "spinner__ready";
            state.spinnerStateText = "Completed";
            state.buttonDisabled = false;
            state.done = true;
        } else {
            await requestReadyState();
        }
    } catch (e) {
        console.log(e);
    }
}

updateDom();

setTimeout(requestReadyState, 200);

const domUpdate = setInterval(updateDom, 2000);
