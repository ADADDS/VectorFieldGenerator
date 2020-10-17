
import {handleGenerate} from "./grid";

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
//resizing iframe in which the UI lies
figma.ui.resize(520,350);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    if (msg.type === 'generate-grid') {
        handleGenerate(msg);
    }

    if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};

