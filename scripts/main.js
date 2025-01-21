let firstBrickNumber = 1;
let lastBrickNumber = 9;
let elements = [];
let currentKey;

/**
 * TODO добавить ctrl + z, ctrl + shift + z через массив из разных состояний elements
 */


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
    document.getElementById('container').style.width = 52.6 * parseInt(newColumns) + 'px';
    document.getElementById('container').style.height = 52.6 * parseInt(newRows) + 'px';
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
    container.style.gridTemplateRows = "repeat(" + elements.length + ", 52.6px)";
    if (elements.length > 0) {
        container.style.gridTemplateColumns = "repeat(" + elements[0].length + ", 52.6px)";
    }

    let temp = ''
    for (let i = 0; i < elements.length; i++) {
        for (let j = 0; j < elements[i].length; j++) {
            let element = elements[i][j];
            temp += '<img src="' + element + '" ' +
                'alt="' + element + '" ' +
                'onclick="elementPick(this)" ' +
                'onmouseenter="elementHover(this)" ' +
                'data-row="' + i + '" ' +
                'data-column="' + j + '" ' +
                'class="' + '' + '" ' +
                'id="' + i + '-' + j + '">';
        }
    }

    container.innerHTML = temp;
    saveData();
    elementHover(document.getElementById(hoveredElements[hoveredElements.length - 1]));
}

let minRow;
let maxRow;
let minCol;
let maxCol;

let hoveredElements = [];

// наведение на элемент
function elementHover(element) {
    if (firstElementPosition.length === 2 && lastElementPosition.length === 0) {
        let id = element.id.split('-');
        let row = parseInt(id[0]);
        let column = parseInt(id[1]);
        minRow = Math.min(firstElementPosition[0], row);
        maxRow = Math.max(firstElementPosition[0], row);
        minCol = Math.min(firstElementPosition[1], column);
        maxCol = Math.max(firstElementPosition[1], column);

        for (let id of hoveredElements) {
            document.getElementById(id).className = '';
        }
        hoveredElements = [];
        for (let i = minRow; i <= maxRow; i++) {
            for (let j = minCol; j <= maxCol; j++) {
                document.getElementById(i + '-' + j).className = 'hovered';
                hoveredElements.push(i + '-' + j);
            }
        }
        document.getElementById(firstElementPosition[0] + '-' + firstElementPosition[1]).className = 'primarySelected';
    } else if (firstElementPosition.length === 2 && lastElementPosition.length === 2 && selectedActionName === 'copyPaste') {
        for (let hoveredElem of hoveredElements) {
            document.getElementById(hoveredElem).className = 'hovered';
        }
        // for (let i = minRow; i <= maxRow; i++) {
        //     for (let j = minCol; j <= maxCol; j++) {
        //         document.getElementById(i + '-' + j).className = 'hovered';
        //     }
        // }
    } else if (firstElementPosition.length === 0 && lastElementPosition.length === 0 || selectedActionName === 'delete') {
        for (let hoveredElem of hoveredElements) {
            document.getElementById(hoveredElem).className = '';
        }
        hoveredElements = [];
    }
}

let copyActionElements = [];

// выбор ячейки в #container
function elementPick(element) {
    let id = element.id.split('-');
    let row = parseInt(id[0]);
    let column = parseInt(id[1]);

    if (copyActionElements.length > 0 && selectedActionName === 'copyPaste') {
        for (let i = row; i < row + copyActionElements.length; i++) {
            for (let j = column; j < column + copyActionElements[i - row].length; j++) {
                elements[i][j] = copyActionElements[i - row][j - column];
            }
        }
        containerCreate(parseInt(document.getElementById("rowInput").value),
            parseInt(document.getElementById("columnInput").value));
        saveData();
        return;
    }

    if (selectedActionName === undefined) {
        element.src = selectedIconSRC;
        element.alt = selectedIconSRC;
        elements[row][column] = selectedIconSRC;
        saveData();
    } else {
        // в случае выбора области
        if (firstElementPosition.length === 2) {
            // let temp = [];
            switch (selectedActionName) {
                case 'copyPaste':
                    for (let i = 0; i < elements.length; i++) {
                        for (let j = 0; j < elements[i].length; j++) {
                            if (i >= minRow && i <= maxRow &&
                                j >= minCol && j <= maxCol) {
                                let tempRow = i - minRow;
                                let tempCol = j - minCol;
                                if (copyActionElements[tempRow] === undefined) {
                                    copyActionElements[tempRow] = [];
                                }
                                copyActionElements[tempRow][tempCol] = elements[i][j];
                                //TODO добавлять недостающие строки/столбцы
                            }
                        }
                    }
                    lastElementPosition[0] = row;
                    lastElementPosition[1] = column;
                    break;
                case 'delete':
                    for (let i = 0; i < elements.length; i++) {
                        for (let j = 0; j < elements[i].length; j++) {
                            if (i >= minRow && i <= maxRow &&
                                j >= minCol && j <= maxCol) {
                                elements[i][j] = '';
                            }
                        }
                    }
                    lastElementPosition.length = 0;
                    firstElementPosition.length = 0;
                    break;
            }
            if (selectedActionName === "delete") {
                // selectedActionName = areaPickReset();
                selectedActionName = undefined;
                actionButtonsReset();
                // actionButtonsReset();
            }


            containerCreate(parseInt(document.getElementById("rowInput").value),
                parseInt(document.getElementById("columnInput").value));
            saveData();
        } else if (firstElementPosition.length === 0) {
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