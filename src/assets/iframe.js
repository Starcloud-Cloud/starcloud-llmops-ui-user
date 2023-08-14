window.onload = function () {
    function init() {
        var e = document.createElement('div'),
            t = document.createElement('div'),
            o = document.createElement('iframe'),
            i = document.body,
            n =
                '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M273.536 736H800a64 64 0 0 0 64-64V256a64 64 0 0 0-64-64H224a64 64 0 0 0-64 64v570.88L273.536 736zM296 800 147.968 918.4A32 32 0 0 1 96 893.44V256a128 128 0 0 1 128-128h576a128 128 0 0 1 128 128v416a128 128 0 0 1-128 128H296z"></path><path fill="currentColor" d="M512 499.2a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm192 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm-384 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4z"></path></svg>',
            r =
                '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>';
        (e.id = 'tip_mofaai_www'),
            e.setAttribute(
                'style',
                `
			box-sizing: border-box;
			position: fixed;
			right: 44px;
			bottom: 44px;
			z-index: 99999;
			width: 44px;
			height: 44px;
			padding: 10px;
			border-radius: 100%;
			background-color: ${window.tip_mofaai_bg || '4C83F3'};
			color: ${window.tip_mofaai_color};
		`
            ),
            (e.innerHTML = n),
            (t.id = 'inframe_container'),
            (o.id = 'iframe_mofaai'),
            (o.src = window.mofaai_iframe_src),
            t.setAttribute(
                'style',
                `
			display: none;
			position: fixed;
			right: 44px;
			bottom: 44px;
			z-index: 999999;
			width: 408px;
			height: 594px;
			border: 1px solid #DCDFE6;
		`
            ),
            o.setAttribute(
                'style',
                `
			width: 100%;
			height: 100%;
			border: none;
		`
            ),
            (t.innerHTML = `<div id="close_mofaai" style="position: absolute;right: 0;top: 0;height: 30px;width: 30px;text-align:right;color:#888;cursor:pointer;">${r}</div>`),
            t.appendChild(o),
            i.appendChild(e),
            i.appendChild(t),
            (document.getElementById('tip_mofaai_www').onclick = function (d) {
                document.getElementById('inframe_container').style.display = 'block';
            }),
            (document.getElementById('close_mofaai').onclick = function (d) {
                document.getElementById('inframe_container').style.display = 'none';
            });
    }
    init();
};
