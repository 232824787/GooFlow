/**
 * Created by Alex on 2016/1/22.
 */
function GooFlow(bgDiv, property) {
    if (navigator.userAgent.indexOf("MSIE 8.0") > 0 || navigator.userAgent.indexOf("MSIE 7.0") > 0 || navigator.userAgent.indexOf("MSIE 6.0") > 0) {
        GooFlow.prototype.useSVG = "";
    }
    else {
        GooFlow.prototype.useSVG = "1";
    }
    this.$id = bgDiv.attr('id');
    this.$bgDiv = bgDiv;
    this.$tool = null;
    this.$head = null;
    this.$title = 'newFlow_1';
    this.$nodeRemark = {};
    this.$nowType = 'cursor';
    this.$lineData = {};
    this.$lineCount = 0;
    this.$nodeData = {};
    this.nodeCount = 0;
    this.$areaData = {};
    this.$areaCount = 0;
    this.$lineDom = {};
    this.$nodeDom = {};
    this.$areaDom = {};
    this.$max = property.initNum || 1;
    this.$focus = '';
    this.$editable = false;
    this.$deletedItem = {};
    var headHeight = 0;
    var tmp = "";
    if (property.haveHead) {
        tmp = "<div class='GooFlow_head'><label title='" + (property.initLabelText || "newFlow_1") + "'>" + (property.initLabelText || "newFlow_1") + "</label>";
        for (var x = 0; x < property.headBtns.length; ++x) {
            tmp += "<a href='javascript:void(0)' class='GooFlow_head_btn'><b class='ico_" + property.headBtns[x] + "'></b></a>";
        }
        tmp += "</div>";
        this.$head = $(tmp);
        this.$bgDiv.append(this.$head);
        headHeight = 24;
        this.onBtnNewClick = null;//新建流程图按钮被点中
        this.onBtnOpenClick = null;//打开流程图按钮定义
        this.onBtnSaveClick = null;//保存流程图按钮定义
        this.onFreshClick = null;//重载流程图按钮定义
        if (property.headBtns) {
            this.$head.on("click", {inthis: this}, function (e) {
                e = e || window.event;
                var tar = e.target;
                if (tar.tagName == "div" || tar.tagName == "span") {
                    return;
                } else if (tar.tagName == "a") {
                    tar = tar.childNode[0];
                }
                var This = e.data.inthis;
                switch ($(tar).attr('class')) {
                    case "icon_new":
                        if (This.onBtnNewClick != null) This.onBtnNewClick();
                        break;
                    case
                }
            });
        }
    }
}