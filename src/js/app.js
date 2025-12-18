import { readFile, writeFile } from './files'

// Set the `js-active` class on the root element to hide the no-js content.
document.documentElement.classList.add("js-active");

// If the user prefers light themes, pre-check the checkbox
matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
    if (e.matches) {
        document.getElementById("light-theme").checked = true;
        document.getElementById("light-theme-label").textContent = "light_mode";
    } else {
        document.getElementById("light-theme").checked = false;
        document.getElementById("light-theme-label").textContent = "dark_mode";
    }
});

document.getElementById("light-theme").addEventListener("change", (e) => {
    if (e.target.checked) {
        document.getElementById("light-theme-label").textContent = "light_mode";
    } else {
        document.getElementById("light-theme-label").textContent = "dark_mode";
    }
})

const todoList = document.getElementById("todo-list");

// Helper function to build an item element and add it to the list.
const addListItem = (id, text, status, timestamp) => {
    const thisEntry = document.createElement("li");
    const entryText = document.createElement("span");
    thisEntry.dataset.todoStatus = status;
    entryText.classList.add("todo-item-text");
    entryText.innerText = text;
    thisEntry.appendChild(entryText);

    const doneBtn = document.createElement("input");
    doneBtn.classList.add("done-btn");
    doneBtn.classList.add("material-icons");
    doneBtn.type = "button";
    doneBtn.value = "check";

    doneBtn.addEventListener("click", () => {
        window.localStorage.setItem(id, JSON.stringify({text, status: "done", timestamp}));
        thisEntry.dataset.todoStatus = "done";
    });

    const removeBtn = document.createElement("input");
    removeBtn.classList.add("remove-btn");
    removeBtn.classList.add("material-icons");
    removeBtn.type = "button";
    removeBtn.value = "delete";

    removeBtn.addEventListener("click", () => {
        window.localStorage.removeItem(id);
        todoList.removeChild(thisEntry);
    });

    thisEntry.appendChild(removeBtn);
    thisEntry.appendChild(doneBtn);
    todoList.appendChild(thisEntry);
};

const buildList = () => {
    // Clear currently present items
    todoList.replaceChildren();

    // Build list entries for all todo items currently in localStorage.
    const todoItems = [];
    for(const id of Object.keys(window.localStorage)) {
        todoItems.push({...JSON.parse(window.localStorage.getItem(id)), id});
    }
    todoItems.sort((a, b) => a.timestamp - b.timestamp);
    for(const item of todoItems) {
        addListItem(item.id, item.text, item.status, item.timestamp);
    }
}

const exportItems = () => {
    const todoItems = {};
    for(const id of Object.keys(window.localStorage)) {
        todoItems[id] = JSON.parse(window.localStorage[id]);
    }

    const exported = JSON.stringify(todoItems);

    writeFile("todo-export.json", "application/octet-stream", exported);
};

const importItems = () => {
    readFile(["json"]).then((importedFile) => {
        importedFile.text().then((importedText) => {
            try {
                const todoItems = JSON.parse(importedText);

                // TODO: We have valid JSON, but we don't validate that it's actually a Todo List export.
                //       Update the export/import format to include some form of versioning, and possibly
                //       schema validation?

                // If we didn't throw an error already, we loaded a valid export, so clear
                // localStorage, store the imported items to it, and then rebuild the displayed list
                window.localStorage.clear()

                for(const [id, entry] of Object.entries(todoItems)) {
                    window.localStorage.setItem(id, JSON.stringify(entry));
                }

                buildList();

            } catch {
                alert("Imported file did not contain a valid todo items export.")
            }
        });
    }).catch((err) => {
        alert(err.message);
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