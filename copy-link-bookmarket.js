(async function () {
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
    }

    let url = window.location.toString();
    let title = window.document.title;
    if (!title) {
        title = url.substring(url.lastIndexOf('/') + 1);
    }
    let anchor = document.createElement("a");
    anchor.href = url;
    anchor.textContent = title;

    try {
        await copyToClipboardModern(url, anchor.outerHTML);
    } catch (e) {
        console.error(e);
        alert("Copy to clipboard failed! " + e.toString());
    }

})();
