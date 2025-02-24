(() => {
    'use strict';

    // Set the `js-active` class on the root element to hide the no-js content.
    document.documentElement.classList.add("js-active");

    // Helper functions to read and write JSON values from localStorage
    const getLSJson = (key) => {
        return JSON.parse(window.localStorage.getItem(key));
    }

    const setLSJson = (key, value) => {
        return window.localStorage.setItem(key, JSON.stringify(value));
    }

    // Helper function to build an item element and add it to the list.
    const todoList = document.getElementById("todo-list");
    const addListItem = (id, text, status, timestamp) => {
        const thisEntry = document.createElement("li");
        thisEntry.dataset.todoStatus = status;
        thisEntry.innerText = text;

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
            setLSJson(id, {text, status: "done", timestamp});
            thisEntry.dataset.todoStatus = "done";
        });

        thisEntry.appendChild(removeBtn);
        thisEntry.appendChild(doneBtn);
        todoList.appendChild(thisEntry);
    };

    // Build list entries for all todo items currently in localStorage.
    let todoItems = [];
    for(const id of Object.keys(window.localStorage)) {
        todoItems.push({...getLSJson(id), id});
    }
    todoItems.sort((a, b) => a.timestamp - b.timestamp);
    for(const item of todoItems) {
        addListItem(item.id, item.text, item.status);
    }

    // Bind a listener to the Add Item which creates a new item in localStorage and builds the element.
    const itemEntry = document.getElementById("todo-item-entry");
    document.getElementById("todo-item-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const id = crypto.randomUUID();
        const text = itemEntry.value;
        const timestamp = Date.now();
        setLSJson(id, {text, status: "todo", timestamp});
        addListItem(id, text, "todo", timestamp);
        itemEntry.value = "";
    });

})();
