let tempDelState = false;

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
    brickPickReset()
    actionButtonsReset()
    areaPickReset();
    if (tempDelState) {
        tempDelState = false;
        return;
    }
    console.log(element);
    document.getElementById('current_file_name').value = element.children[0].innerHTML;
    currentKey = undefined;
    elements = JSON.parse(localStorage.getItem(element.children[0].innerHTML));
    saveData();
    document.getElementById('rowInput').value = elements.length;
    document.getElementById('columnInput').value = elements[0].length;
    containerCreate(elements.length, elements[0].length);
    console.log(elements)
}
