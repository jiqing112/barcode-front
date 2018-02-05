<template>
    <my-page title="条形码生成工具">
        <div id="app" class="row">

            <div class="col-sm-12">
                <div id="generator">
                    <ui-text-field v-model="code" label="编码" />
                    <div>
                        <ui-raised-button label="生成条形码" primary @click="generateBarcode" />
                    </div>
                    <div id="submit">
                    </div>
                    <div id="barcodeTarget" class="barcodeTarget"></div>
                    <canvas id="canvasTarget" width="150" height="150"></canvas>

                    <div id="config row">
                        <div class="col-sm-4">
                            <div class="config">
                                <div class="title">类型</div>
                                <input type="radio" name="btype" id="ean8" value="ean8" checked="checked"><label for="ean8">EAN 8</label><br />
                                <input type="radio" name="btype" id="ean13" value="ean13"><label for="ean13">EAN 13</label><br />
                                <input type="radio" name="btype" id="std25" value="std25"><label for="std25">standard 2 of 5 (industrial)</label><br />
                                <input type="radio" name="btype" id="int25" value="int25"><label for="int25">interleaved 2 of 5</label><br />
                                <input type="radio" name="btype" id="code11" value="code11"><label for="code11">code 11</label><br />
                                <input type="radio" name="btype" id="code39" value="code39"><label for="code39">code 39</label><br />
                                <input type="radio" name="btype" id="code93" value="code93"><label for="code93">code 93</label><br />
                                <input type="radio" name="btype" id="code128" value="code128"><label for="code128">code 128</label><br />
                                <input type="radio" name="btype" id="codabar" value="codabar"><label for="codabar">codabar</label><br />
                                <input type="radio" name="btype" id="msi" value="msi"><label for="msi">MSI</label><br />
                                <input type="radio" name="btype" id="datamatrix" value="datamatrix"><label for="datamatrix">Data Matrix</label><br /><br />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="config">
                                <div class="title">混合</div>
                                <div class="form-horizontal">
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">背景颜色：</div>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" id="bgColor" value="#FFFFFF" size="7">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">条码颜色：</div>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" id="color" value="#000000" size="7">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">线条颜色：</div>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" id="color" value="#000000" size="7">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">线条宽度：</div>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" id="barWidth" value="1" size="3">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">条码高度：</div>
                                        <div class="col-sm-8">
                                            <input class="form-control" type="text" id="barHeight" value="50" size="3">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">Module Size:</div>
                                        <div class="col-sm-8">
                                            <input type="text" id="moduleSize" value="5" size="3">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">Quiet Zone Modules:</div>
                                        <div class="col-sm-8">
                                            <input type="text" id="quietZoneSize" value="1" size="3">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">Form:</div>
                                        <div class="col-sm-8">
                                            <input type="checkbox" name="rectangular" id="rectangular"><label for="rectangular">Rectangular</label>
                                        </div>
                                    </div>

                                    <div id="miscCanvas">
                                        x : <input type="text" id="posX" value="10" size="3"><br />
                                        y : <input type="text" id="posY" value="20" size="3"><br />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="config">
                                <div class="title">格式</div>
                                <input type="radio" id="css" name="renderer" value="css" checked="checked"><label for="css">CSS</label><br />
                                <input type="radio" id="bmp" name="renderer" value="bmp"><label for="bmp">BMP (not usable in IE)</label><br />
                                <input type="radio" id="svg" name="renderer" value="svg"><label for="svg">SVG (not usable in IE)</label><br />
                                <input type="radio" id="canvas" name="renderer" value="canvas"><label for="canvas">Canvas (not usable in IE)</label><br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </my-page>
</template>

<script>
    /* eslint-disable */
    export default {
        data () {
            return {
                code: '12345670'
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                function showConfig1D() {
                    $('.config .barcode1D').show();
                    $('.config .barcode2D').hide();
                }

                function showConfig2D() {
                    $('.config .barcode1D').hide();
                    $('.config .barcode2D').show();
                }

                function clearCanvas() {
                    var canvas = $('#canvasTarget').get(0);
                    var ctx = canvas.getContext('2d');
                    ctx.lineWidth = 1;
                    ctx.lineCap = 'butt';
                    ctx.fillStyle = '#FFFFFF';
                    ctx.strokeStyle = '#000000';
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.strokeRect(0, 0, canvas.width, canvas.height);
                }

                $('input[name=btype]').click(function () {
                    if ($(this).attr('id') == 'datamatrix') showConfig2D(); else showConfig1D();
                });
                $('input[name=renderer]').click(function () {
                    if ($(this).attr('id') == 'canvas') $('#miscCanvas').show(); else $('#miscCanvas').hide();
                });
                this.generateBarcode();
            },
            generateBarcode() {
                var value = this.code
                var btype = $("input[name=btype]:checked").val();
                var renderer = $("input[name=renderer]:checked").val();

                var quietZone = false;
                if ($("#quietzone").is(':checked') || $("#quietzone").attr('checked')) {
                    quietZone = true;
                }

                var settings = {
                    output: renderer,
                    bgColor: $("#bgColor").val(),
                    color: $("#color").val(),
                    barWidth: $("#barWidth").val(),
                    barHeight: $("#barHeight").val(),
                    moduleSize: $("#moduleSize").val(),
                    posX: $("#posX").val(),
                    posY: $("#posY").val(),
                    addQuietZone: $("#quietZoneSize").val()
                };
                if ($("#rectangular").is(':checked') || $("#rectangular").attr('checked')) {
                    value = {code: value, rect: true};
                }
                if (renderer == 'canvas') {
                    clearCanvas();
                    $("#barcodeTarget").hide();
                    $("#canvasTarget").show().barcode(value, btype, settings);
                } else {
                    $("#canvasTarget").hide();
                    $("#barcodeTarget").html("").show().barcode(value, btype, settings);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .col-sm-4 {
        float: left;
    }
    .code {
        margin-bottom: 16px;
    }
    #config{
        margin-bottom: 10px;
    }
    .config{
        height: 400px;
        padding: 16px;
        margin-right: 16px;
        border: 1px solid #000;
        overflow: auto;
    }
    .config .title{
        font-weight: bold;
        text-align: center;
    }
    .config .barcode2D,
    #miscCanvas{
        display: none;
    }
    #submit{
        clear: both;
    }
    #barcodeTarget,
    #canvasTarget{
        margin-top: 20px;
    }
</style>
