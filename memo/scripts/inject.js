const dataManager = (() => {
    let dataList = [];

    function appendElement () {
        let listParentDom = document.getElementById("noteList");
        listParentDom.innerHTML = "";

        if(dataList) {
            for(let i = 0; i < dataList.length; i++) {
                const dom = '<li id="content" data-index = "'+i+'"> <div style="display: flex"><p id="text">'+dataList[i]+'</p><button id="modify">수정</button><button id="delete">삭제</button></div></li>';
                let liDom = document.createElement("li");

                liDom.innerHTML = dom.trim();
                listParentDom.append(liDom)

            }
        }
        else {
            const dom = document.createElement("<h2>");
            dom.text = "저장된 데이터가 없습니다.";

            listParentDom.append(dom)

        };
    }

    function _init() {
        dataList = [];
    }

    function _load() {
        this.init();

        chrome.storage.local.get(["memo"], (data) => {

            if(data.memo.length) {
                dataList = data.memo.filter(v => v);
            };

            appendElement();
        })
    }

    function _getData () {
        return dataList;
    }

    function _deleteData(_index) {
        console.log("delete Data = ", dataList[_index]);

        dataList.splice(_index, 1)

        chrome.storage.local.set({memo:dataList}, () => {
            this.load();
        })
    }

    function _saveData(_text) {
        if(_text.trim().length === 0) {
            alert("내용을 작성해 주세요");
            document.getElementById("note").value = "";
            return;
        };

        dataList.push(_text);

        chrome.storage.local.set({memo:dataList}, () => {
            console.log("save memo data = " , dataList);

            document.getElementById("note").value = "";
            this.load();
        })
    }

    function _modifyData(_index, _text) {
        const modifyData =  window.prompt(`수정 내용을 작성해 주세요 (${dataList[_index]})`);

        if(modifyData === null) {
            alert("취소 되었습니다.")
        };

        if(modifyData.trim().length === 0) {
            alert("수정 된 내용이 없습니다. (스페이스바만 있어요)")
        };

        if(modifyData.trim().length > 0) {
            dataList[_index] = modifyData;

            chrome.storage.local.set({memo:dataList}, () => {
                this.load();
            })
        };
    }

    return {
        init: _init,
        load: _load,
        getData: _getData,

        deleteData: _deleteData,
        saveData: _saveData,
        modifyData: _modifyData,
    }
})();


document.getElementById("noteList").addEventListener("click", (event) => {
    const target = event?.target;
    const targetId = target?.id;

    const contentDom = target?.closest("#content");
    const index = contentDom.getAttribute("data-index") && +contentDom.getAttribute("data-index");

    event.stopPropagation();

    switch (targetId) {
        case "modify":
            const text = target?.closest("#text")?.value;
            dataManager.modifyData(index, text);
            break
        case "delete":
            dataManager.deleteData(index);
            break;
        default:
            console.log("정의되지 않음");
            break
    }
}, true);

document.getElementById("addNote").addEventListener("click", (event) => {
    const target = event?.target?.id;

    switch (target) {
        case "save":
            const noteValue = document.getElementById("note");

            if(noteValue) {
                if(!noteValue.value) {
                    alert("저장할 내용이 없습니다.")
                };

                dataManager.saveData(noteValue.value);
            };

            break;
        default:
            console.log("정의되지 않음");
            break
    };
});



dataManager.load();




console.log("script end");
