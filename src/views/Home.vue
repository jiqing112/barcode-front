<template>
    <my-page title="条形码生成工具">
        <div id="app" class="row">

            <div class="col-sm-12">
                <div id="generator">

                    <div id="submit">
                    </div>
                    <div id="barcodeTarget" class="barcodeTarget"></div>
                    <canvas id="canvasTarget" width="320" height="320"></canvas>

                    <div class="setting-box">
                        <ui-tabs class="tab" :value="activeTab" @change="handleTabChange">
                            <ui-tab value="tab0" title="预览"/>
                            <ui-tab value="tab1" title="类型"/>
                            <ui-tab value="tab2" title="混合"/>
                            <ui-tab value="tab3" title="格式"/>
                        </ui-tabs>
                        <div v-if="activeTab === 'tab0'">
                            <div class="config">
                                <ui-text-field v-model="code" label="编码" />
                                <div>
                                    <ui-raised-button label="生成条形码" primary @click="generateBarcode" />
                                </div>
                            </div>
                        </div>
                        <div v-if="activeTab === 'tab1'">
                            <div class="config">
                                <ul>
                                    <li v-for="t in types">
                                        <ui-radio class="radio" v-model="type" :label="t.text" name="group" :nativeValue="t.name"/>
                                    </li>
                                </ul>

                            </div>
                        </div>
                        <div v-if="activeTab === 'tab2'">
                            <div class="config">
                                 <!-- <div class="form-group">
                                        <div class="control-label col-sm-4">背景颜色：</div>
                                        <div class="col-sm-8">
                                            <input class="form-control" v-model="options.bgColor" type="text" size="7">
                                        </div>
                                    </div> -->
                                <ui-text-field v-model="options.bgColor" label="背景颜色" />
                                <ui-text-field v-model="options.color" label="条码颜色" />
                                <ui-text-field v-model.number="options.barWidth" type="number" label="线条宽度" />
                                <ui-text-field v-model.number="options.barHeight" type="number" label="条码高度" />
                                <ui-text-field v-model.number="options.moduleSize" type="number" label="Module Size" />
                                <ui-text-field v-model.number="options.quietZoneSize" type="number" label="Quiet Zone Modules" />

                                <!-- <div class="form-horizontal">
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">Quiet Zone Modules:</div>
                                        <div class="col-sm-8">
                                            <input v-model.number="options.quietZoneSize" type="text" size="3">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="control-label col-sm-4">Form:</div>
                                        <div class="col-sm-8">
                                            <input v-model="options.rectangular" type="checkbox" name="rectangular">
                                            <label for="rectangular">Rectangular</label>
                                        </div>
                                    </div>

                                    <div id="miscCanvas" v-if="renderer === 'canvas'">
                                        x : <input v-model.number="options.posX" type="text" size="3"><br />
                                        y : <input v-model.number="options.posY" type="text" size="3"><br />
                                    </div>
                                </div> -->
                            </div>
                        </div>
                        <div v-if="activeTab === 'tab3'">
                            <div class="config">
                                <ui-radio class="radio" v-model="renderer" label="CSS" name="group" nativeValue="css"/>
                                <br>
                                <ui-radio class="radio" v-model="renderer" label="BMP (not usable in IE)" name="group" nativeValue="bmp"/>
                                <br>
                                <ui-radio class="radio" v-model="renderer" label="SVG (not usable in IE)" name="group" nativeValue="svg"/>
                                <br>
                                <ui-radio class="radio" v-model="renderer" label="Canvas (not usable in IE)" name="group" nativeValue="canvas"/>
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
                options: {
                    bgColor: '#FFFFFF',
                    color: '#000000',
                    barWidth: 1,
                    barHeight: 50,
                    moduleSize: 5,
                    quietZoneSize: 1,
                    posX: 10,
                    posY: 20
                },
                code: '12345670',
                renderer: 'canvas',
                type: 'ean8',
                activeTab: 'tab2',
                types: [
                    {
                        name: 'ean8',
                        text: 'EAN 8'
                    },
                    {
                        name: 'ean13',
                        text: 'EAN 13'
                    },
                    {
                        name: 'std25',
                        text: 'standard 2 of 5 (industrial)'
                    },
                    {
                        name: 'int25',
                        text: 'interleaved 2 of 5'
                    },
                    {
                        name: 'code11',
                        text: 'code 11'
                    },
                    {
                        name: 'code39',
                        text: 'code 39'
                    },
                    {
                        name: 'code93',
                        text: 'code 93'
                    },
                    {
                        name: 'code128',
                        text: 'code 128'
                    },
                    {
                        name: 'codabar',
                        text: 'codabar'
                    },
                    {
                        name: 'msi',
                        text: 'MSI'
                    },
                    {
                        name: 'datamatrix',
                        text: 'datamatrix'
                    },
                ]
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            handleTabChange (val) {
                this.activeTab = val
            },
            init() {
                // function showConfig1D() {
                //     $('.config .barcode1D').show();
                //     $('.config .barcode2D').hide();
                // }

                // function showConfig2D() {
                //     $('.config .barcode1D').hide();
                //     $('.config .barcode2D').show();
                // }

                // $('input[name=btype]').click(function () {
                //     console.log('点击', $(this).attr('id'))
                //     if ($(this).attr('id') == 'datamatrix') showConfig2D(); else showConfig1D();
                // });
                $('input[name=renderer]').click(function () {
                    if ($(this).attr('id') == 'canvas') $('#miscCanvas').show(); else $('#miscCanvas').hide();
                });
                this.generateBarcode();
            },
            generateBarcode() {
                var value = this.code

                var quietZone = false;
                if ($("#quietzone").is(':checked') || $("#quietzone").attr('checked')) {
                    quietZone = true;
                }

                var settings = {
                    output: this.renderer,
                    bgColor: this.options.bgColor,
                    color: this.options.color,
                    barWidth: this.options.barWidth,
                    barHeight: this.options.barHeight,
                    moduleSize: this.options.moduleSize,
                    posX: this.options.posX,
                    posY: this.options.posY,
                    addQuietZone: this.options.quietZoneSize
                };
                if (this.options.rectangular) {
                    value = {code: value, rect: true};
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

                if (this.renderer == 'canvas') {
                    clearCanvas();
                    $("#barcodeTarget").hide();
                    $("#canvasTarget").show().barcode(value, this.type, settings);
                } else {
                    $("#canvasTarget").hide();
                    $("#barcodeTarget").html("").show().barcode(value, this.type, settings);
                }
            }
        },
        watch: {
            code() {
                this.generateBarcode()
            },
            type() {
                this.generateBarcode()
            },
            renderer() {
                this.generateBarcode()
            },
            options: {
                deep: true,
                handler() {
                    this.generateBarcode()
                }
            }
        }
    }
</script>

<style lang="scss">
    .tab {
        background-color: transparent;
        color: rgba(0,0,0,.87);
        margin-bottom: 16px;
        border-bottom: 1px solid rgba(0,0,0,.12);
        .mu-tab-text {
            color: rgba(0,0,0,.87);
        }
    }
</style>
<style lang="scss" scoped>
    .setting-box {
        position: absolute;
        top: 0;
        right: 0;
        width: 320px;
        bottom: 0;
        /*background-color: #f00;*/
        border-left: 1px solid rgba(0,0,0,.12);
    }
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
        position: absolute;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 16px;
        overflow: auto;
    }
    .config .title{
        font-weight: bold;
        text-align: center;
    }
    .config .barcode2D,
    #submit{
        clear: both;
    }
    #barcodeTarget,
    #canvasTarget{
        margin-top: 20px;
    }
</style>
