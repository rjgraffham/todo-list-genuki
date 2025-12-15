export function readFile(validExtensions) {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";

        input.accept = validExtensions.map(ext => "." + ext).join(",");
        input.multiple = false;
        input.style.display = "none";
        document.body.appendChild(input);

        input.addEventListener("change", () => {
            document.body.removeChild(input);

            if (!input.files || input.files.length === 0) {
                reject(new Error("No file selected"));
                return;
            } else if (input.files.length > 1) {
                reject(new Error("Multiple files provided, expected only one"));
            }

            resolve(input.files[0]);
        });

        input.click();
    });
}

export function writeFile(filename, mimeType, contents) {
    const url = URL.createObjectURL(new Blob(
        [contents],
        {
            type: mimeType,
        }
    ));

    try {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;

        // Firefox requires that the element exist in the document to be clicked
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } finally {
        URL.revokeObjectURL(url);
    }
}