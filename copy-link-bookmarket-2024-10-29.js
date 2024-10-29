(async function () {
    async function copyToClipboard(text, html) {
        try {
            return await copyToClipboardModern(text, html);
        } catch (e) {
            console.log("Copy to clipboard using modern clipboard API failed with the following exception, falling back to legacy...");
            console.log(e);
            try {
                return copyToClipboardLegacy(text, html);
            } catch (e) {
                console.error(e);
                console.error("Copy to clipboard using legacy clipboard API failed, giving up");
                alert("Copy to clipboard failed!");
            }
        }
    }

    async function copyToClipboardModern(text, html) {
        if (typeof navigator === "undefined" || typeof navigator.clipboard === "undefined" || navigator.permissions === "undefined") {
            throw new Error("Modern clipboard API not supported");
        }
        const typeTextPlain = "text/plain";
        const typeTextHtml = "text/html";
        const textBlob = new Blob([text], { type: typeTextPlain });
        const htmlBlob = new Blob([html], { type: typeTextHtml });
        const data = [new ClipboardItem({ [typeTextPlain]: textBlob, [typeTextHtml]: htmlBlob })];
        let permission = await navigator.permissions.query({ name: "clipboard-write" });
        if (permission.state !== "granted" && permission.state !== "prompt") {
            throw new Error("Permission not granted!");
        }
        await navigator.clipboard.write(data);
        console.log("Copied to clipboard (using modern API) successfully.");
    }

    function copyToClipboardLegacy(text, html) {
        if (!document.queryCommandSupported || !document.queryCommandSupported("copy")) {
            throw new Error("Legacy clipboard API not supported");
        }
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        textarea.style.width = '2em';
        textarea.style.height = '2em';
        textarea.style.padding = 0;
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';
        textarea.style.background = 'transparent';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        function listener(e) {
            // modify the clipboard data to have both text and html upon receiving the copy event
            e.clipboardData.setData("text/html", html);
            e.clipboardData.setData("text/plain", text);
            e.preventDefault();
        }

        try {
            document.addEventListener("copy", listener);
            document.execCommand("copy");
            document.removeEventListener("copy", listener);
            console.log("Copied to clipboard (using legacy API) successfully.");
            // remove this once I've seen it work once or twice
            alert("Copied to clipboard using legacy API.");
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // main code
    let url = window.location.toString();
    let title = window.document.title;
    if (!title) {
        title = url.substring(url.lastIndexOf('/') + 1);
    }
    let anchor = document.createElement("a");
    anchor.href = url;
    anchor.textContent = title;
    await copyToClipboard(url, anchor.outerHTML);
})();
