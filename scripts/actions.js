let selectedIconSRC = '';
let lastSelectedIcon;

let selectedActionName;
let firstElementPosition = [];
let firstElement;
let lastElementPosition = [];

// проверка имени текущего сохранения на уникальность
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

// выбор используемой картинки-элемента
function brickPick(icon) {

    selectedIconSRC = icon.src;
    for (let brick of document.getElementById('iconBricks').children) {
        brick.className = 'noSelected';
    }
    if (lastSelectedIcon !== icon) {
        icon.className = 'selected';
        lastSelectedIcon = icon;
    } else {
        lastSelectedIcon = undefined;

    }
    // if (lastSelectedIcon !== undefined) {
    //     lastSelectedIcon.className = 'noSelected'
    // }
    // lastSelectedIcon = icon;

    //убираем везде возможный выбор
    for (let button of document.getElementById('buttons').children) {
        if (button.id.split('-')[0]) {
            button.className = '';
        }
    }
    // selectedIconSRC = undefined;
    areaPickingReset();

}

// показ/скрытие панели с сохранениями
function saveListVisible() {
    let saveBar = document.getElementById('saveBar');
    if (saveBar.className === '') {
        saveBar.className = 'open';
    } else {
        saveBar.className = '';
    }
}

// выбор области и действие с этим
function areaPick(selectedActionButton) {
    let lastActionName;

    //убираем везде возможный выбор
    for (let button of document.getElementById('buttons').children) {
        if (button.id.split('-')[0]) {
            if (button.className !== '') {
                lastActionName = button.id.split('-')[1];
            }
            button.className = '';
        }
    }
    selectedIconSRC = '';
    lastSelectedIcon = undefined;


    let actionName = selectedActionButton.id.split('-')[1];
    switch (actionName) {
        case 'clockwise':

            return;
        case 'counterclockwise':

            return;
        case 'save':

            return;
        case 'print':

            return;
    }
    if (actionName === 'copyPaste' || actionName === 'delete') {
        if (actionName === lastActionName) {
            areaPickingReset();
        } else {
            selectedActionButton.className = 'selected';
            for (let brick of document.getElementById('iconBricks').children) {
                brick.className = 'noSelected';
            }
            selectedActionName = actionName;
        }
    }
}

function areaPickingReset() {
    firstElementPosition = [];
    firstElement = undefined;
    lastElementPosition = [];
    for (let icon of document.getElementById('container').children) {
        if (icon.className === 'selected') {
            icon.className = '';
        }
    }
    let temp = selectedActionName;
    selectedActionName = undefined;
    return temp;
}