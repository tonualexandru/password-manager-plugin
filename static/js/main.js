window.addEventListener('DOMContentLoaded', () => {
    let password = null;
    const findBtn = document.getElementById('findBtn');
    const copyBtn = document.getElementById('copyBtn');
    const messageBox = document.getElementById('messageBox');
    const statusBox = document.getElementById('statusBox');
    const input = document.getElementById('url');
    const actions = document.querySelector('.actions');
    const visibility = document.querySelector('.visibility');

    visibility.onclick = () => {
        visibility.classList.toggle('active');

        if (visibility.className.indexOf('active') !== -1) {
            messageBox.innerText = '';
        } else {
            messageBox.innerText = password;
        }
    }

    findBtn.onclick = () => {
        getPassword();
    }

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(password);
        updateStatus('Password copied')
    }

    input.onkeyup = (e) => {
        if (e.key === "Enter") {
            getPassword();
        }
    }

    messageBox.onclick = () => {
        navigator.clipboard.writeText(password);
        updateStatus('Password copied')
    }

    function updateStatus(status, timeout = 1500) {
        statusBox.innerText = status;

        setTimeout(() => {
            statusBox.innerText = '';
        }, timeout);
    }

    function getPassword() {
        fetch('http://tonualexandru.com/password-finder/index.php?url=' + input.value).then(response => {
            response.json().then(data => {
                password = data;

                if (data.indexOf('no results for') === -1) {
                    actions.classList.remove('disabled');
                    updateStatus('Response received');
                } else {
                    updateStatus('No results for ' + input.value, 3000);
                }
            }).catch(e => {
                messageBox.innerText = e;
                console.error(e);
            });
        }).catch(e => {
            messageBox.innerText = e;
            console.error(e);
        });
    }

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        input.value = tabs[0].url.split('://')[1].split('/')[0];

        getPassword();
    });
});
