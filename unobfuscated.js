javascript:(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = `
            .window {
                font-family: Arial, sans-serif;
                width: 600px;
                height: 400px;
                background-color: #292929;
                border: 1px solid #000;
                border-radius: 10px;
                position: absolute;
                top: 50%;
                left: 50%;
                margin: 0;
                padding: 0;
                transform: translate(-50%, -50%);
                overflow: hidden;
                transition: all 0.3s ease;
            }
            .title-bar {
                background-color: #1e1e1e;
                font-family: Arial, sans-serif;
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
                z-index: 1;
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
                z-index: 1;
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
        document.head.appendChild(style);

        const windopw = document.createElement('div');
        windopw.className = 'window';
        windopw.id = 'window';

        const topbar = document.createElement('div');
        topbar.className = 'title-bar';
        topbar.id = 'draggable';

        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = 'DOLUS V1';

        const btns = document.createElement('div');
        btns.className = 'btns';

        const minimizeBtn = document.createElement('div');
        minimizeBtn.className = 'minimize-btn';
        minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
        minimizeBtn.onclick = minimize;

        const maximizeBtn = document.createElement('div');
        maximizeBtn.className = 'maximize-btn';
        maximizeBtn.innerHTML = '<i class="fas fa-expand"></i>';
        maximizeBtn.onclick = maximize;

        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.onclick = close;

        btns.appendChild(minimizeBtn);
        btns.appendChild(maximizeBtn);
        btns.appendChild(closeBtn);

        topbar.appendChild(title);
        topbar.appendChild(btns);

        windopw.appendChild(topbar);

        const content = document.createElement('div');
        content.className = 'search-content';
        content.id = 'search-content';

        const searchbartitle = document.createElement('p');
        searchbartitle.className = 'search-title';
        searchbartitle.id = 'search-title';
        searchbartitle.textContent = 'DOLUS V1';

        const form = document.createElement('form');
        form.onsubmit = () => { search(); return false; };
        form.id = 'searchForm';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Search with DOLUS V1';
        input.id = 'searchInput';

        form.appendChild(input);

        const aware = document.createElement('p');
        aware.className = 'aware';
        aware.id = 'aware';
        aware.style.color = '#fff';
        aware.style.textAlign = 'center';
        aware.style.fontSize = '15px';
        aware.innerHTML = '<b>CONTROLS: ALT+R to Refresh - ALT+P Is Forward - ALT+M is Backward - ALT+S to return to home - ALT+W To exit minimize</b>';

        const output = document.createElement('div');
        output.id = 'output';

        const searchEngine = document.createElement('iframe');
        searchEngine.id = 'searchEngine';

        output.appendChild(searchEngine);

        content.appendChild(searchbartitle);
        content.appendChild(form);
        content.appendChild(aware);
        content.appendChild(output);

        windopw.appendChild(content);

        document.body.appendChild(windopw);

        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
        document.head.appendChild(fontAwesome);

        const interactJS = document.createElement('script');
        interactJS.src = 'https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js';
        interactJS.onload = initializeInteract;
        document.body.appendChild(interactJS);

        function initializeInteract() {
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
                if (isMaximized) {
                    windopw.style.width = previousState.width;
                    windopw.style.height = previousState.height;
                    windopw.style.top = previousState.top;
                    windopw.style.left = previousState.left;
                    windopw.style.transform = previousState.transform;
                    content.style.transform = 'scale(1)';
                    isMaximized = false;
                    interact(windopw).draggable(true).resizable(true);
                } else {
                    previousState.width = windopw.style.width;
                    previousState.height = windopw.style.height;
                    previousState.top = windopw.style.top;
                    previousState.left = windopw.style.left;
                    previousState.transform = windopw.style.transform;

                    windopw.style.width = '100vw';
                    windopw.style.height = '100vh';
                    windopw.style.top = '0';
                    windopw.style.left = '0';
                    windopw.style.transform = 'none';
                    isMaximized = true;
                    interact(windopw).draggable(false).resizable(false);
                }
            }

            function minimize() {
                previousState.display = windopw.style.display;
                windopw.style.display = 'none';
                isMinimized = true;
            }

            function unmin() {
                windopw.style.display = previousState.display || 'block';
                isMinimized = false;
            }

            document.addEventListener('keydown', function(event) {
                if (event.altKey) {
                    switch (event.code) {
                        case 'KeyR':
                            refresh();
                            break;
                        case 'KeyP':
                            iframeHistory('forward');
                            break;
                        case 'KeyM':
                            iframeHistory('backward');
                            break;
                        case 'KeyS':
                            showSearch();
                            break;
                        case 'KeyW':
                            if (isMinimized) {
                                unmin();
                            }
                            break;
                    }
                }
            });

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

            function close() {
                windopw.parentNode.removeChild(windopw);
            }

            function search() {
                const input = document.getElementById('searchInput').value.trim();
                const iframe = document.getElementById('searchEngine');
                let url = '';
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

            function refresh() {
                const iframe = document.getElementById('searchEngine');
                iframe.src = iframe.src;
            }

            function showSearch() {
                const iframe = document.getElementById('searchEngine');
                const searchForm = document.getElementById('searchForm');
                const searchbartitle = document.getElementById('search-title');
                const aware = document.getElementById('aware');

                iframe.style.display = 'none';
                searchForm.style.display = 'block';
                searchbartitle.style.display = 'block';
                aware.style.display = 'block';
            }

            alert('DOLUS V1 Does Not Provide An Unblocked Browser!');
        }
    });
})();
