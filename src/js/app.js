(() => {
    'use strict';

    // Set the `js-active` class on the root element to hide the no-js content.
    document.documentElement.classList.add("js-active");

    const todoList = document.getElementById("todo-list");

    // Helper function to build an item element and add it to the list.
    const addListItem = (id, text, status, timestamp) => {
        const thisEntry = document.createElement("li");
        const entryText = document.createElement("span");
        thisEntry.dataset.todoStatus = status;
        entryText.classList.add("todo-item-text");
        entryText.innerText = text;
        thisEntry.appendChild(entryText);

        const removeBtn = document.createElement("input");
        removeBtn.classList.add("remove-btn");
        removeBtn.type = "button";
        removeBtn.value = "Remove";

        removeBtn.addEventListener("click", () => {
            window.localStorage.removeItem(id);
            todoList.removeChild(thisEntry);
        });

        const doneBtn = document.createElement("input");
        doneBtn.classList.add("done-btn");
        doneBtn.type = "button";
        doneBtn.value = "Done";

        doneBtn.addEventListener("click", () => {
            window.localStorage.setItem(id, JSON.stringify({text, status: "done", timestamp}));
            thisEntry.dataset.todoStatus = "done";
        });

        thisEntry.appendChild(removeBtn);
        thisEntry.appendChild(doneBtn);
        todoList.appendChild(thisEntry);
    };

    const buildList = () => {
        // Clear currently present items
        todoList.replaceChildren();

        // Build list entries for all todo items currently in localStorage.
        let todoItems = [];
        for(const id of Object.keys(window.localStorage)) {
            todoItems.push({...JSON.parse(window.localStorage.getItem(id)), id});
        }
        todoItems.sort((a, b) => a.timestamp - b.timestamp);
        for(const item of todoItems) {
            addListItem(item.id, item.text, item.status, item.timestamp);
        }
    }

    const exportItems = () => {
        let todoItems = {};
        for(const id of Object.keys(window.localStorage)) {
            todoItems[id] = JSON.parse(window.localStorage[id]);
        }

        const exported = window.btoa(JSON.stringify(todoItems));

        navigator.clipboard.writeText(exported).then(() => {
            alert("Exported todo items to clipboard.");
        }).catch(() => {
            alert("Could not write to clipboard. Copy the following export string manually:\n" + exported);
        });
    };

    const importItems = () => {
        const tryImport = (importString) => {
            try {
                const todoItems = JSON.parse(window.atob(importString));

                // If we didn't throw an error already, we loaded a valid export, so clear
                // localStorage, store the imported items to it, and then rebuild the displayed list
                window.localStorage.clear()
                for(const [id, entry] of Object.entries(todoItems)) {
                    window.localStorage.setItem(id, JSON.stringify(entry));
                }
                buildList();

                alert("Imported todo items from clipboard.");
            } catch {
                alert("Clipboard contents were not a valid todo items export.")
            }
        };

        navigator.clipboard.readText().then(tryImport).catch(() => {
            tryImport(prompt("Could not read from clipboard. Paste the export string manually:"));
        });
    };

    // Bind the export/import buttons' listeners
    document.getElementById("import-btn").addEventListener("click", importItems);
    document.getElementById("export-btn").addEventListener("click", exportItems);

    // Bind a listener to the Add Item which creates a new item in localStorage and builds the element.
    const itemEntry = document.getElementById("todo-item-entry");
    document.getElementById("todo-item-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const id = crypto.randomUUID();

        const text = itemEntry.value.trim();
        if(text === "") {
            return;
        }

        const timestamp = Date.now();

        window.localStorage.setItem(id, JSON.stringify({text, status: "todo", timestamp}))

        addListItem(id, text, "todo", timestamp);

        itemEntry.value = "";
    });

    // On page load, build the list.
    buildList();
})();
