window.onload = function () {
    if (window.location.href.includes('/cb_js') || window.location.href.includes('/cb_i')) {
        return;
    }

    function init() {
        var e = document.createElement('div'),
            t = document.createElement('div'),
            o = document.createElement('iframe'),
            i = document.body,
            n =
                '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M273.536 736H800a64 64 0 0 0 64-64V256a64 64 0 0 0-64-64H224a64 64 0 0 0-64 64v570.88L273.536 736zM296 800 147.968 918.4A32 32 0 0 1 96 893.44V256a128 128 0 0 1 128-128h576a128 128 0 0 1 128 128v416a128 128 0 0 1-128 128H296z"></path><path fill="currentColor" d="M512 499.2a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm192 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm-384 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4z"></path></svg>',
            r =
                '<svg t="1692261002893" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3123" width="22" height="44"><path d="M877.216 491.808M575.328 510.496 946.784 140.672c17.568-17.504 17.664-45.824 0.192-63.424-17.504-17.632-45.792-17.664-63.36-0.192L512.032 446.944 143.712 77.216C126.304 59.712 97.92 59.648 80.384 77.12 62.848 94.624 62.816 123.008 80.288 140.576l368.224 369.632L77.216 879.808c-17.568 17.504-17.664 45.824-0.192 63.424 8.736 8.8 20.256 13.216 31.776 13.216 11.424 0 22.848-4.352 31.584-13.056l371.36-369.696 371.68 373.088C892.192 955.616 903.68 960 915.168 960c11.456 0 22.912-4.384 31.648-13.088 17.504-17.504 17.568-45.824 0.096-63.392L575.328 510.496 575.328 510.496zM575.328 510.496" fill="#2c2c2c" p-id="3124"></path></svg>';
        min =
            '<svg t="1692263310960" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4854" width="22" height="44"><path d="M923.378813 305.414945l-141.483338-0.514723L940.653245 147.093103c17.34504-17.545608 17.34504-45.962821 0-63.456241-17.450441-17.493419-45.684482-17.493419-63.045895 0L717.313597 243.092527 718.395232 98.782817c0.418532-18.11252-13.872962-33.870412-31.898501-33.44267l-22.806425 0c-18.008142 0.470721-32.927947 11.236925-33.29429 29.350468l-0.942465 250.378467c0 0.322341 1.169639 0.558725 1.169639 0.889253l-1.744737 16.420995c-0.140193 9.029654 1.989307 17.161868 7.818059 22.946618 5.740748 5.879917 13.837146 9.405207 22.806425 9.179057l16.280802-0.331551c0.366344 0 0.610914-0.140193 0.942465-0.192382l250.700809 1.413186c18.025539-0.418532 32.875758-15.381315 33.346479-33.529651l0-23.006993C958.050474 317.507354 941.35114 304.996412 923.378813 305.414945L923.378813 305.414945zM959.07992 687.11225l-0.052189-22.998807c-0.418532-18.148335-15.233959-33.102932-33.154098-33.538861l-249.393024 1.360997c-0.36532 0-0.610914-0.140193-0.942465-0.140193l-16.210193-0.36532c-8.951883-0.279363-16.996093 3.298116-22.720468 9.125845-5.792936 5.827729-7.90504 13.960966-7.730055 23.034623l1.744737 16.419971c0 0.331551-1.169639 0.576121-1.169639 0.890276l0.942465 248.449535c0.366344 18.11252 15.181771 28.879748 33.154098 29.315676l24.185842 0.034792c17.921161 0.435928 32.125675-15.373129 31.688723-33.486672l-1.029446-141.396357 159.64907 158.479431c17.257036 17.48421 45.3867 17.48421 62.696947 0 17.310248-17.502629 17.310248-45.910633 0-63.448054L781.284561 719.621665l140.540873-0.523933C939.711803 719.568453 956.357925 708.470697 959.07992 687.11225L959.07992 687.11225zM385.61094 640.590704c-5.740748-5.827729-13.837146-9.405207-22.807449-9.108448l-16.33299 0.366344c-0.278339 0-0.557702 0.140193-0.87288 0.140193l-247.367901-1.414209c-17.97335 0.436952-32.893154 15.390525-33.311687 33.538861l-0.052189 22.998807c2.721994 21.358447 19.438725 32.422434 37.412075 32.089859l139.494031 0.505513L81.722768 878.884948c-17.415648 17.554818-17.415648 45.962821 0 63.448054 17.379832 17.502629 45.560662 17.502629 62.958914 0l160.311149-159.403476-1.082658 140.540873c-0.435928 18.11252 13.872962 33.869389 31.846312 33.450856l22.859637 0c18.008142-0.471744 32.910551-11.203156 33.29429-29.351492l0.942465-246.670006c0-0.315178-1.169639-0.558725-1.169639-0.890276l1.780553-16.419971C393.549749 654.568043 391.456065 646.436852 385.61094 640.590704L385.61094 640.590704zM392.817062 345.070106l-0.941442-250.378467c-0.348947-18.113543-15.199167-28.92375-33.120328-29.394471l-24.184819 0c-17.903765-0.38374-32.107255 15.373129-31.688723 33.44267l1.081635 143.315056L144.367527 83.636862c-17.362436-17.493419-45.438888-17.493419-62.749136 0-17.310248 17.493419-17.310248 45.909609 0 63.456241l158.042479 157.807119-139.232065 0.514723c-17.86795-0.418532-34.480302 12.092409-37.202297 33.443693l0.034792 23.006993c0.435928 18.147312 15.251356 33.110095 33.172517 33.529651l249.374604-1.413186c0.348947 0.052189 0.576121 0.192382 0.907673 0.192382l16.228613 0.37453c8.933463 0.23536 17.030885-3.288906 22.719444-9.169847 5.792936-5.836939 7.887644-13.96813 7.712659-23.050995l-1.779529-16.410762C391.596258 345.584829 392.817062 345.392448 392.817062 345.070106L392.817062 345.070106zM392.817062 345.070106" fill="#272636" p-id="4855"></path></svg>';
        max =
            '<svg t="1692260908522" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6569" width="22" height="44"><path d="M167.8 903.1c-11.5 0-22.9-4.4-31.7-13.1-17.5-17.5-17.5-45.8 0-63.3l221.1-221.1c17.5-17.5 45.9-17.5 63.3 0 17.5 17.5 17.5 45.8 0 63.3L199.4 890c-8.7 8.7-20.2 13.1-31.6 13.1zM638.5 432.4c-11.5 0-22.9-4.4-31.7-13.1-17.5-17.5-17.5-45.8 0-63.3l221.7-221.7c17.5-17.5 45.8-17.5 63.3 0s17.5 45.8 0 63.3L670.1 419.3c-8.7 8.7-20.2 13.1-31.6 13.1zM859.7 903.8c-11.5 0-23-4.4-31.7-13.1L606.7 668.8c-17.5-17.5-17.4-45.9 0.1-63.4s45.9-17.4 63.3 0.1l221.4 221.9c17.5 17.5 17.4 45.9-0.1 63.4-8.8 8.7-20.2 13-31.7 13zM389 432.1c-11.5 0-23-4.4-31.7-13.1L136.1 197.2c-17.5-17.5-17.4-45.9 0.1-63.4s45.9-17.4 63.3 0.1l221.2 221.7c17.5 17.5 17.4 45.9-0.1 63.4-8.7 8.7-20.2 13.1-31.6 13.1z" fill="#333333" p-id="6570"></path><path d="M145 370c-24.7 0-44.8-20.1-44.8-44.8V221.8C100.2 153.5 155.7 98 224 98h103.4c24.7 0 44.8 20.1 44.8 44.8s-20.1 44.8-44.8 44.8H224c-18.9 0-34.2 15.3-34.2 34.2v103.4c0 24.7-20.1 44.8-44.8 44.8zM883.3 370c-24.7 0-44.8-20.1-44.8-44.8V221.8c0-18.9-15.3-34.2-34.2-34.2H700.8c-24.7 0-44.8-20.1-44.8-44.8S676.1 98 700.8 98h103.5c68.2 0 123.8 55.5 123.8 123.8v103.5c0 24.7-20.1 44.7-44.8 44.7zM327.5 926.6H224c-68.2 0-123.8-55.5-123.8-123.8V699.4c0-24.7 20.1-44.8 44.8-44.8s44.8 20.1 44.8 44.8v103.5c0 18.9 15.3 34.2 34.2 34.2h103.5c24.7 0 44.8 20.1 44.8 44.8s-20.1 44.7-44.8 44.7zM804.3 926.6H700.8c-24.7 0-44.8-20.1-44.8-44.8s20.1-44.8 44.8-44.8h103.5c18.9 0 34.2-15.4 34.2-34.2V699.4c0-24.7 20.1-44.8 44.8-44.8 24.7 0 44.8 20.1 44.8 44.8v103.5c0 68.2-55.6 123.7-123.8 123.7z" fill="#333333" p-id="6571"></path></svg>';
        (e.id = 'tip_mofaai_www'),
            e.setAttribute(
                'style',
                `
			box-sizing: border-box;
			position: fixed;
			right: 22px;
			bottom: 22px;
			z-index: 99999;
			width: 44px;
			height: 44px;
			padding: 10px;
			border-radius: 100%;
            cursor: pointer;
			background-color: ${window.tip_mofaai_bg || '4C83F3'};
			color: ${window.tip_mofaai_color};
		`
            ),
            (e.innerHTML = n),
            (t.id = 'iframe_container'),
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
			height: 600px;
			border: 1px solid #DCDFE6;
            border-radius: 8px; 
            overflow: hidden;
            box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
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
            (t.innerHTML = `
            <div>
            <div id="min_mofaai" style="position: absolute;right: 40px;top: 0;text-align:right;color:#888;cursor:pointer;">${min}</div>
            <div id="max_mofaai" style="position: absolute;right: 40px;top: 0;text-align:right;color:#888;cursor:pointer;">${max}</div>
            <div id="close_mofaai" style="position: absolute;right: 5px;top: 0;text-align:right;color:#888;cursor:pointer;">${r}</div>
            </div>
            `),
            t.appendChild(o),
            i.appendChild(e),
            i.appendChild(t),
            (document.getElementById('tip_mofaai_www').onclick = function (d) {
                document.getElementById('iframe_container').style.display = 'block';
                document.getElementById('min_mofaai').style.display = 'none';
            }),
            (document.getElementById('close_mofaai').onclick = function (d) {
                document.getElementById('iframe_container').setAttribute(
                    'style',
                    `
                	position: fixed;
			right: 44px;
			bottom: 44px;
			z-index: 999999;
			width: 408px;
			height: 600px;
			border: 1px solid #DCDFE6;
            border-radius: 8px; 
            overflow: hidden;
            box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
                `
                );
                document.getElementById('iframe_container').style.display = 'none';
                document.getElementById('min_mofaai').style.display = 'none';
                document.getElementById('max_mofaai').style.display = 'block';
            }),
            (document.getElementById('max_mofaai').onclick = function () {
                var iframeContainer = document.getElementById('iframe_container');
                iframeContainer.setAttribute(
                    'style',
                    `
			position: fixed;
			left: 0;
            top: 0;
			z-index: 999999;
			width: 100vw;
			height: 100vh;
			border: 1px solid #DCDFE6;
		`
                );
                document.getElementById('min_mofaai').style.display = 'block';
                document.getElementById('max_mofaai').style.display = 'none';
            }),
            (document.getElementById('min_mofaai').onclick = function () {
                var iframeContainer = document.getElementById('iframe_container');
                iframeContainer.setAttribute(
                    'style',
                    `
                    position: fixed;
                    right: 44px;
                    bottom: 44px;
                    z-index: 999999;
                    width: 408px;
                    height: 600px;
                    border: 1px solid #DCDFE6;
                    border-radius: 8px; 
                    overflow: hidden;
                    box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
		`
                );
                document.getElementById('min_mofaai').style.display = 'none';
                document.getElementById('max_mofaai').style.display = 'block';
            });
    }
    init();
};
