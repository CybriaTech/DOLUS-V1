javascript:(function () {
    var DOHTML = `
        <div class="window" id="window">
            <div class="title-bar" id="draggable">
                <div class="title">DOLUS V1</div>
                <div class="btns">
                    <div class="minimize-btn" onclick="minimize()"><i class="fas fa-minus"></i></div>
                    <div class="maximize-btn" onclick="maximize()"><i class="fas fa-expand"></i></div>
                    <div class="close-btn" onclick="close()"><i class="fas fa-times"></i></div>
                </div>
            </div>
            <div class="search-content" id="search-content">
                <p class="search-title" id="search-title">DOLUS V1</p>
                <form onsubmit="search(); return false;" id="searchForm">
                    <input type="text" placeholder="Search with DOLUS V1" id="searchInput">
                </form>
                <p class="aware" id="aware" style="color: #fff; text-align: center; font-size: 15px;"><b>CONTROLS: ALT+R to Refresh - ALT+P Is Forward - ALT+M is Backward - ALT+S to return to home - ALT+W To exit minimize</b></p>
                <div id="searchResults">
                    <iframe id="searchEngine"></iframe>
                </div>
            </div>
        </div>
    `;

    var dolusDiv = document.createElement('div');
    dolusDiv.innerHTML = DOHTML;

    document.body.appendChild(dolusDiv);

    var docStyle = document.createElement('style');
    docStyle.innerHTML = `
        .window {
            width: 600px;
            height: 400px;
            background-color: #292929;
            border: 1px solid #000;
            border-radius: 10px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            overflow: hidden;
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
        }

        .title-bar {
            background-color: #1e1e1e;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: default;
            overflow: hidden;
            z-index: 1;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            color: #fff;
        }

        .btns {
            display: flex;
        }

        .close-btn,
        .minimize-btn,
        .maximize-btn {
            font-size: 18px;
            margin-left: 10px;
            cursor: pointer;
            color: #fff;
        }

        .search-content {
            padding: 20px;
            text-align: center;
            align-items: center;
            position: relative;
            height: calc(100% - 60px);
        }

        .search-title {
            font-size: 2.5em;
            font-weight: bold;
            color: #fff;
        }

        form {
            position: relative;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
        }

        input {
            color: #ffffff;
            font-size: 25px;
            width: 450px;
            height: 45px;
            border-radius: 6px;
            background-color: rgba(56, 56, 56, 0.8);
            border: none;
            padding-right: 45px;
            font-family: 'Source Sans Pro', sans-serif;
        }

        input:focus {
            outline: none;
            border-color: transparent;
        }

        #searchEngine {
            width: 100%;
            height: 100%;
            border: none;
            position: absolute;
            top: 0;
            left: 0;
            display: none;
        }
    `;

    document.head.appendChild(docStyle);

          let isMaximized = false;
        let isMinimized = false;
        let previousState = {
            width: '',
            height: '',
            top: '',
            left: '',
            transform: ''
        };

        function maximize() {
            const windowElement = document.getElementById('window');
            const searchContent = document.getElementById('search-content');
            if (isMaximized) {
                windowElement.style.width = previousState.width;
                windowElement.style.height = previousState.height;
                windowElement.style.top = previousState.top;
                windowElement.style.left = previousState.left;
                windowElement.style.transform = previousState.transform;
                searchContent.style.transform = 'scale(1)';
                isMaximized = false;
                interact(windowElement).draggable(true).resizable(true);
            } else {
                previousState.width = windowElement.style.width;
                previousState.height = windowElement.style.height;
                previousState.top = windowElement.style.top;
                previousState.left = windowElement.style.left;
                previousState.transform = windowElement.style.transform;

                windowElement.style.width = '100vw';
                windowElement.style.height = '100vh';
                windowElement.style.top = '0';
                windowElement.style.left = '0';
                windowElement.style.transform = 'none';
                isMaximized = true;
                interact(windowElement).draggable(false).resizable(false);
            }
        }

        function minimize() {
            const windowElement = document.getElementById('window');
            previousState.display = windowElement.style.display;
            windowElement.style.display = 'none';
            isMinimized = true;
        }

        function unmin() {
            const windowElement = document.getElementById('window');
            windowElement.style.display = previousState.display || 'block';
            isMinimized = false;
        }

        document.addEventListener('keydown', function(event) {
            if (event.altKey) {
                switch (event.code) {
                    case 'KeyR':
                        reloadIframe();
                        break;
                    case 'KeyP':
                        iframeHistory('forward');
                        break;
                    case 'KeyM':
                        iframeHistory('backward');
                        break;
                    case 'KeyS':
                        showSearchForm();
                        break;
                    case 'KeyW':
                        if (isMinimized) {
                            unmin();
                        }
                        break;
                }
            }
        });

        function close() {
            var windowDiv = document.querySelector('.window');
            windowDiv.parentNode.removeChild(windowDiv);
        }

        function search() {
            var input = document.getElementById('searchInput').value.trim();
            var iframe = document.getElementById('searchEngine');
            var url = '';
            if (input.startsWith('http://') || input.startsWith('https://')) {
                url = input;
            } else {
                url = 'https://www.bing.com/search?q=' + encodeURIComponent(input);
            }
            iframe.src = url;
            iframe.style.display = 'block';
            document.getElementById('searchForm').style.display = 'none';
            document.getElementById('search-title').style.display = 'none';
            document.getElementById('aware').style.display = 'none';
        }

        function reloadIframe() {
            var iframe = document.getElementById('searchEngine');
            iframe.src = iframe.src;
        }

        function showSearchForm() {
            var iframe = document.getElementById('searchEngine');
            var searchForm = document.getElementById('searchForm');
            var searchTitle = document.getElementById('search-title');
            var aware = document.getElementById('aware');

            iframe.style.display = 'none';
            searchForm.style.display = 'block';
            searchTitle.style.display = 'block';
            aware.style.display = 'block';
        }

          interact('.window')
            .draggable({
                inertia: true,
                restrict: {
                    restriction: 'parent',
                    endOnly: true,
                    elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
                }
            });

        interact('#draggable')
            .draggable({
                listeners: {
                    start(event) {
                        event.interactable.classList.add('dragging');
                    },
                    move(event) {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    },
                    end(event) {
                        event.interactable.classList.remove('dragging');
                    }
                }
            })
            .resizable({
                edges: { bottomRight: true },
                listeners: {
                    move(event) {
                        const target = event.target;
                        let x = parseFloat(target.getAttribute('data-x')) || 0;
                        let y = parseFloat(target.getAttribute('data-y')) || 0;

                        target.style.width = event.rect.width + 'px';
                        target.style.height = event.rect.height + 'px';

                        x += event.deltaRect.left;
                        y += event.deltaRect.top;

                        target.style.transform = `translate(${x}px, ${y}px)`;

                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                }
            })
            .on('doubletap', function (event) {
                maximize();
            });

    alert('DOLUS V1 Does Not Provide An Unblocked Browser!');
})();
