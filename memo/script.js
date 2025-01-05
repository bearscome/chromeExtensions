const dataManager = (() => {
  let domain = '';
  let dataList = [];

  function setDomain(_callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = new URL(tabs[0].url);
      const currentDomain = currentUrl.hostname; // 도메인 추출

      if (!domain || domain != currentDomain) {
        domain = currentDomain;
      }

      _callback();
    });
  }

  function appendElement() {
    let listParentDom = document.getElementById('noteList');
    listParentDom.innerHTML = '';

    if (dataList) {
      for (let i = 0; i < dataList.length; i++) {
        const dom =
          '<div style="display: flex"><p id="text">' +
          dataList[i] +
          '</p><button id="modify">수정</button><button id="delete">삭제</button></div>';
        let liDom = document.createElement('li');

        liDom.innerHTML = dom.trim();
        liDom.setAttribute('data-index', '' + i);
        liDom.setAttribute('id', 'content');
        listParentDom.append(liDom);
      }
    } else {
      const dom = document.createElement('<h2>');
      dom.text = '저장된 데이터가 없습니다.';

      listParentDom.append(dom);
    }
  }

  function _init(_callback) {
    dataList = [];
    setDomain(_callback);
  }

  function _load() {
    this.init(function () {
      chrome.storage.local.get([domain], (data) => {
        if (data[domain]?.memo?.length) {
          dataList = data[domain].memo.filter((v) => v);
        }

        appendElement();
      });
    });
  }

  function _deleteData(_index) {
    console.log('delete Data = ', dataList[_index]);

    dataList.splice(_index, 1);

    chrome.storage.local.set({ [domain]: { memo: dataList } }, () => {
      this.load();
    });
  }

  function _saveData(_text) {
    if (_text.trim().length === 0) {
      alert('내용을 작성해 주세요');
      document.getElementById('note').value = '';
      return;
    }

    dataList.push(_text);

    chrome.storage.local.set({ [domain]: { memo: dataList } }, () => {
      console.log('save memo data = ', dataList);

      document.getElementById('note').value = '';
      this.load();
    });
  }

  function _modifyData(_index, _text) {
    const modifyData = window.prompt(`수정 내용을 작성해 주세요 \n${dataList[_index]}`);

    if (modifyData === null) {
      alert('취소 되었습니다.');
    }

    if (modifyData.trim().length === 0) {
      alert('수정 된 내용이 없습니다. (스페이스바만 있어요)');
    }

    dataList[_index] = modifyData;

    chrome.storage.local.set({ [domain]: { memo: dataList } }, () => {
      this.load();
    });
  }

  return {
    init: _init,
    load: _load,

    deleteData: _deleteData,
    saveData: _saveData,
    modifyData: _modifyData,
  };
})();

document.getElementById('noteList').addEventListener(
  'click',
  (event) => {
    const target = event?.target;
    const targetId = target?.id;

    const contentDom = target?.closest('#content');
    const index = contentDom.getAttribute('data-index') && +contentDom.getAttribute('data-index');

    event.stopPropagation();

    switch (targetId) {
      case 'modify':
        const text = target?.closest('#text')?.value;
        dataManager.modifyData(index, text);
        break;
      case 'delete':
        dataManager.deleteData(index);
        break;
      default:
        console.log('정의되지 않음');
        break;
    }
  },
  true,
);

document.getElementById('addNote').addEventListener('click', (event) => {
  const target = event?.target?.id;

  switch (target) {
    case 'save':
      const noteValue = document.getElementById('note');

      if (noteValue) {
        if (!noteValue.value) {
          alert('저장할 내용이 없습니다.');

          return;
        }

        dataManager.saveData(noteValue.value);
      }

      break;
    default:
      console.log('정의되지 않음');
      break;
  }
});

dataManager.load();
