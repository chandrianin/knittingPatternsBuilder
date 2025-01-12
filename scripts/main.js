let firstBrickNumber = 1;
let lastBrickNumber = 9;
let elements = [];
let currentKey;

window.onload = function () {
    let iconsContainer = document.getElementById("iconBricks");
    for (let i = firstBrickNumber; i <= lastBrickNumber; i++) {
        iconsContainer.innerHTML += "<img src=\"res/" + i + ".svg" + "\" alt=\"" + i + ".png" + "\" onclick='brickPick(this)' class='noSelected'>"
    }

    checkFileName(); // изменение при необходимости названия сохранения по умолчанию
    inputChange(); // первая отрисовка элементов контейнера
    savesShow(); // отображение списка сохранений
}

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
    let data = element.dataset;
    let row = data.row;
    let column = data.column;

    if (selectedActionName === undefined) {
        element.src = selectedIconSRC;
        elements[row][column] = selectedIconSRC;
        saveData();
    } else {
        // в случае выбора области
        if (firstElementPosition.length === 2) {
            lastElementPosition[0] = row;
            lastElementPosition[1] = column;

            switch (selectedActionName) {
                case 'copyPaste':

                    break;
                case 'delete':
                    let minRow = Math.min(firstElementPosition[0], lastElementPosition[0]);
                    let maxRow = Math.max(firstElementPosition[0], lastElementPosition[0]);
                    let minCol = Math.min(firstElementPosition[1], lastElementPosition[1]);
                    let maxCol = Math.max(firstElementPosition[1], lastElementPosition[1]);
                    for (let i = 0; i < elements.length; i++) {
                        for (let j = 0; j < elements[i].length; j++) {
                            if (i >= minRow && i <= maxRow &&
                                j >= minCol && j <= maxCol) {
                                elements[i][j] = '';
                            }
                        }
                    }
                    containerCreate(parseInt(document.getElementById("rowInput").value),
                        parseInt(document.getElementById("columnInput").value))
                    break;
            }
            selectedActionName = areaPickingReset();
            saveData();
        } else if (firstElementPosition.length === 0 && lastElementPosition.length === 0) {
            firstElementPosition[0] = row;
            firstElementPosition[1] = column;
            element.className = 'primarySelected';
            firstElement = element;
        }
    }
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