(async function () {
    async function writeToClipboard(text, html) {
        const typeTextPlain = "text/plain";
        const typeTextHtml = "text/html";
        const textBlob = new Blob([text], { type: typeTextPlain });
        const htmlBlob = new Blob([html], { type: typeTextHtml });
        const data = [new ClipboardItem({ [typeTextPlain]: textBlob, [typeTextHtml]: htmlBlob, }),];
        try {
            await navigator.clipboard.write(data);
        } catch (error) {
            console.error('Failed to write to clipboard:', error);
            alert('Failed to write to clipboard:', error);
        }
    }
    let url = window.location.toString();
    let title = window.document.title;
    let anchor = document.createElement("a");
    anchor.href = url;
    anchor.textContent = title;
    await writeToClipboard(url, anchor.outerHTML);
})();
