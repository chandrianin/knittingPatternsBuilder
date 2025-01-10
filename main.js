let firstIconNumber = 1;
let lastIconNumber = 9;
let currentKey;
window.onload = function () {
    let iconsContainer = document.getElementById("iconBricks");
    for (let i = firstIconNumber; i <= lastIconNumber; i++) {
        iconsContainer.innerHTML += "<img src=\"res/" + i + ".svg" + "\" alt=\"" + i + ".png" + "\" onclick='brickPick(this)' class='noSelected'>"
    }

    checkFileName();
    inputChange();
    // currentKey = document.getElementById("current_file_name").value.trim();
    savesShow();
}

// показ всех сохранений
function savesShow() {
    let result = [];
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === '') {
            continue;
        }
        result.push('<div onclick="keyPick(this)" ><p>' + localStorage.key(i) + '</p><img onclick="keyDelete(this)" src="./res/delete.svg" alt="Удалить"></div>');
    }
    result.sort();
    document.getElementById('saveBar').innerHTML = '';
    for (let element of result) {
        document.getElementById('saveBar').innerHTML += element;
    }

    if (currentKey !== undefined) {
        let savesList = document.getElementById('saveBar').children;

        for (let child of savesList) {
            if (child.children[0].innerHTML === currentKey) {
                child.className = 'selected';
            } else {
                child.className = '';
            }
        }
    }
}

let tempDelState = false;
//удаление сохранения
function keyDelete(element) {
    let key = (element.parentElement).children[0].innerText;
    if (confirm('Удалить сохранение "' + key + '"?')) {
        localStorage.removeItem(key);
        if (localStorage.length === 0) {
            location.reload();
        } else {
            savesShow();
            if (key === currentKey) {
                keyPick(document.getElementById('saveBar').children[0]);
            } else {

            }
        }
        tempDelState = true;
    }
}


// выбор сохранения
function keyPick(element) {
    if (tempDelState) {
        tempDelState = false;
        return;
    }
    console.log(element);
    // saveData();
    document.getElementById('current_file_name').value = element.children[0].innerHTML;
    currentKey = undefined;
    elements = JSON.parse(localStorage.getItem(element.children[0].innerHTML));
    saveData();
    document.getElementById('rowInput').value = elements.length;
    document.getElementById('columnInput').value = elements[0].length;
    containerCreate(elements.length, elements[0].length);
    console.log(elements)
}

// проверка имени сохранения на уникальность
function checkFileName() {
    let currentName = document.getElementById("current_file_name").value.trim();
    for (let index = 0; index < localStorage.length; index++) {
        if (currentName === localStorage.key(index)) {
            let startIndex;
            let endIndex;
            if (currentName.at(-1) === ')') {
                endIndex = currentName.length - 1;
                for (let j = currentName.length - 2; j >= 0; j--) {
                    if (parseInt(currentName[j]) !== parseInt('q') && currentName[j] !== '(') {
                    } else if (currentName[j] === '(') {
                        startIndex = j;
                        break;
                    } else {
                        break;
                    }
                }
            }
            if (startIndex === undefined) {
                currentName += ' (1)';
                index = -1;
            } else {
                let temp = currentName;
                let copyNumber = parseInt(temp.substring(startIndex + 1, temp.length - 1));
                let nextCopyNumber = copyNumber + 1;
                temp = temp.replace(copyNumber.toString(), nextCopyNumber.toString())
                currentName = temp;
                index = -1;
            }
        }
    }
    document.getElementById("current_file_name").value = currentName;
}

let selectedIconSRC = ''
let lastSelectedIcon;

// выбор используемой картинки-элемента
function brickPick(icon) {
    selectedIconSRC = icon.src;
    icon.className = 'selected';
    if (lastSelectedIcon !== undefined) {
        lastSelectedIcon.className = 'noSelected'
    }
    lastSelectedIcon = icon;
}

let elements = [];

// изменение количества строк или столбцов
function inputChange() {
    let newRows = parseInt(document.getElementById("rowInput").value);
    let newColumns = parseInt(document.getElementById("columnInput").value);

    if (newRows !== elements.length || (elements.length > 0 && newColumns !== elements[0].length)) {
        containerCreate(newRows, newColumns);
    }
}

// отрисовка всех элементов схемы
function containerCreate(newRows, newColumns) {
    let newElements = []
    for (let i = 0; i < newRows; i++) {
        newElements.push([]);
        for (let j = 0; j < newColumns; j++) {
            if (elements.length > i && elements[i].length > j) {
                newElements[i].push(elements[i][j]);
            } else {
                newElements[i].push('');
            }
        }
    }

    elements = newElements;

    let container = document.getElementById("container")
    container.style.gridTemplateRows = "repeat(" + elements.length + ", 50px)";
    if (elements.length > 0) {
        container.style.gridTemplateColumns = "repeat(" + elements[0].length + ", 50px)";
    }

    let temp = ''
    for (let i = 0; i < elements.length; i++) {
        for (let j = 0; j < elements[i].length; j++) {
            let element = elements[i][j];
            temp += '<img src="' + element + '" ' +
                'alt="' + element + '" ' +
                'onclick="elementPick(this)" ' +
                'data-row="' + i + '" ' +
                'data-column="' + j + '">';
        }
    }

    container.innerHTML = temp;
    saveData();
}

// выбор ячейки в #container
function elementPick(element) {

    element.src = selectedIconSRC;
    let data = element.dataset;
    let row = data.row;
    let column = data.column;
    elements[row][column] = selectedIconSRC;
    saveData();
}

// сохранение данных в localStorage
function saveData() {
    for (let array of elements) {
        for (let element of array) {
            if (element !== '') {
                localStorage.setItem(document.getElementById('current_file_name').value.trim(), JSON.stringify(elements));
                currentKey = document.getElementById("current_file_name").value.trim();
                savesShow();
                return;
            }
        }
    }
}


// показ/скрытие панели с сохранениями
function saveList() {
    let saveBar = document.getElementById('saveBar');
    if (saveBar.className === '') {
        saveBar.className = 'open';
    } else {
        saveBar.className = '';
    }
}