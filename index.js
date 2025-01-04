let firstIconNumber = 1;
let lastIconNumber = 9;

window.onload = function () {
    let iconsContainer = document.getElementById("iconBricks");
    for (let i = firstIconNumber; i <= lastIconNumber; i++) {
        iconsContainer.innerHTML += "<img src=\"res/" + i + ".svg" + "\" alt=\"" + i + ".png" + "\" onclick='brickPick(this)' class='noSelected'>"
    }

    inputChange();
}

let selectedIconSRC = ''
let lastSelectedIcon;

function brickPick(icon) {
    selectedIconSRC = icon.src;
    icon.className = 'selected';
    if (lastSelectedIcon !== undefined) {
        lastSelectedIcon.className = 'noSelected'
    }
    lastSelectedIcon = icon;
}


let elements = [];

function inputChange() {
    let newRows = parseInt(document.getElementById("rowInput").value);
    let newColumns = parseInt(document.getElementById("columnInput").value);

    if (newRows !== elements.length || (elements.length > 0 && newColumns !== elements[0].length)) {
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

    }
}


function elementPick(element) {

    element.src = selectedIconSRC;
    let data = element.dataset;
    let row = data.row;
    let column = data.column;
    elements[row][column] = selectedIconSRC;
}