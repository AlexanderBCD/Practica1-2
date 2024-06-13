document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let taskName = document.getElementById('task-name').value;
    let startDate = document.getElementById('start-date').value;
    let endDate = document.getElementById('end-date').value;
    let responsible = document.getElementById('responsible').value;
    let taskId = Date.now();

    if (new Date(endDate) < new Date(startDate)) {
        alert('Error con las fechas');
        return;
    }

    let task = {
        id: taskId,
        name: taskName,
        startDate: startDate,
        endDate: endDate,
        responsible: responsible,
        resolved: false
    };

    addTaskToLocalStorage(task);
    displayTasks();
    document.getElementById('task-form').reset();
});

function addTaskToLocalStorage(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        let li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${getTaskClass(task)}`;
        li.innerHTML = `
            <span>
                <strong>${task.name}</strong> (Start: ${task.startDate}, End: ${task.endDate}, Responsible: ${task.responsible})
            </span>
            <div>
                ${getTaskActions(task)}
            </div>
        `;
        taskList.appendChild(li);
    });
}

function getTaskClass(task) {
    if (task.resolved) {
        return 'list-group-item-success';
    }
    if (new Date(task.endDate) < new Date()) {
        return 'list-group-item-danger';
    }
    return '';
}

function getTaskActions(task) {
    let actions = `
        <button class="btn btn-sm btn-success" onclick="resolveTask(${task.id})">Resolve</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
    `;

    if (task.resolved) {
        actions = `
            <button class="btn btn-sm btn-warning" onclick="unresolveTask(${task.id})">Unresolve</button>
            ${actions}
        `;
    }

    return actions;
}

function resolveTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id === taskId && new Date(task.endDate) >= new Date()) {
            task.resolved = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function unresolveTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.resolved = false;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function deleteTask(taskId) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

document.addEventListener('DOMContentLoaded', displayTasks);

document.getElementById('search-task').addEventListener('input', function(event) {
    let searchTerm = event.target.value.toLowerCase();
    filterTasks('all', searchTerm);
});

function filterTasks(filter, searchTerm = '') {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filteredTasks = tasks.filter(task => {
        if (filter === 'resolved' && !task.resolved) return false;
        if (filter === 'overdue' && new Date(task.endDate) >= new Date()) return false;
        if (!task.name.toLowerCase().includes(searchTerm)) return false;
        return true;
    });
    displayFilteredTasks(filteredTasks);
}

function displayFilteredTasks(tasks) {
    let taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        let li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${getTaskClass(task)}`;
        li.innerHTML = `
            <span>
                <strong>${task.name}</strong> (Start: ${task.startDate}, End: ${task.endDate}, Responsible: ${task.responsible})
            </span>
            <div>
                ${getTaskActions(task)}
            </div>
        `;
        taskList.appendChild(li);
    });
}
