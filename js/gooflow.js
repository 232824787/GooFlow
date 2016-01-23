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
    this.ns = 'http://www.w3.org/2000/svg';
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
                    case "ico_new":
                        if (This.onBtnNewClick != null)    This.onBtnNewClick();
                        break;
                    case "ico_open":
                        if (This.onBtnOpenClick != null)    This.onBtnOpenClick();
                        break;
                    case "ico_save":
                        if (This.onBtnSaveClick != null)    This.onBtnSaveClick();
                        break;
                    case "ico_undo":
                        This.undo();
                        break;
                    case "ico_redo":
                        This.redo();
                        break;
                    case "ico_reload"    :
                        if (This.onFreshClick != null)    This.onFreshClick();
                        break;
                }
            });
        }
        var toolWidth = 0;
        if (property.haveTool) {
            this.$bgDiv.append("<div class='GooFlow_tool'" + (property.haveHead ? "" : " style='margin-top:3px'") + "><div style='height:" + (height - headHeight - (property.haveHead ? 7 : 10)) + "px' class='GooFlow_tool_div'></div></div>");
            this.$tool = this.$bgDiv.find('.GooFlow_tool div');
            if (property.toolBtns && property.toolBtns.length > 0) {
                tmp = '<span/>'
                for (var i = 0; i < property.toolBtns.length; ++i) {
                    tmp += "<a href='javascript:void(0)' type='" + property.toolBtns[i] + "' id='" + this.$id + "_btn_" + property.toolBtns[i].split(" ")[0] + "' class='GooFlow_tool_btn'><b class='ico_" + property.toolBtns[i] + "'/></a>";//加入自定义按钮
                }
                this.$tool.append(tmp);
            }
            if (property.haveGroup) {
                this.$tool.append("<span/><a href='javascript:void(0)' type='group' class='GooFlow_tool_btn' id='" + this.$id + "_btn_group'><b class='ico_group'/></a>");
            }
            toolWidth = 31;
            this.$nowType = "cursor";
            this.$tool.on("click", {inthis: this}, function (e) {
                var e = e || window.event;
                var tar;
                switch (e.target.tagName) {
                    case "SPAN":
                        return false;
                    case "DIV":
                        return false;
                    case "B":
                        tar = e.target.parentNode;
                        break;
                    case "A":
                        tar = e.target;
                }
                ;
                var type = $(tar).attr(type);
                e.data.inthis.switchToolBtn(type);
                return false;
            });
            this.$editable = true;
        }
        width = width - toolWidth - 8;
        height = height - headHeight - (property.haveHead ? 5 : 8);
        this.$bgDiv.append("<div class='GooFlow_work' style='width:" + (width) + "px;height:" + (height) + "px;" + (property.haveHead ? "" : "margin-top:3px") + "'></div>");
        this.$workArea = $("<div class='GooFlow_work_inner' style='width:" + width * 3 + "px;height:" + height * 3 + "px'></div>")
            .attr({"unselectable": "on", "onselectstart": 'return false', "onselect": 'document.selection.empty()'});
        this.$bgDiv.children(".GooFlow_work").append(this.$workArea);
        this.$draw = null;//画矢量线条的容器
        this.initDraw("draw_" + this.$id, width, height);
        this.$group = null;
        if (property.haveGroup) {
            this.initGroup = '';
        }


    }
}
GooFlow.prototype = {
    useSvg: "",
    getSvgMarker: function (id, color) {
        var m = document.createElementNS(this.ns, 'marker');
        m.setAttribute("id", id);
        m.setAttribute("viewBox", "0 0 6 6");
        m.setAttribute("refX", 5);
        m.setAttribute("refY", 3);
        m.setAttribute("markerUnits", "strokeWidth");
        m.setAttribute("markerWidth", 6);
        m.setAttribute("markerHeight", 6);
        m.setAttribute("orient", "auto");
        var path = document.createElementNS(this.ns, 'path');
        path.setAttribute("d", "M 0 0 L 6 3 L 0 6 z");
        path.setAttribute("fill", color);
        path.setAttribute("stroke-width", 0);
        m.appendChild(path);
        return m;
    },
    initDraw: function (id, width, height) {
        var elem;
        if (GooFlow.prototype.useSVG != "") {
            this.$draw = document.createElementNS(this.ns, 'svg');
            this.$workArea.prepend(this.$draw);
            var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            this.$draw.appendChild(defs);
            defs.appendChild(GooFlow.prototype.getSvgMarker("arrow1", "#15428B"));
            defs.appendChild(GooFlow.prototype.getSvgMarker("arrow2", "#ff3300"));
            defs.appendChild(GooFlow.prototype.getSvgMarker("arrow3", "#ff3300"));
        } else {
            this.$draw = document.createElement('v:group');
            this.$draw.coordsize = width * 3 + "," + height * 3;
            this.$workArea.prepend("<div class='GooFlow_work_vml' style='position:relative;width:" + width * 3 + "px;height:" + height * 3 + "px'></div>");
            this.$workArea.children("div")[0].insertBefore(this.$draw, null);
        }
        this.$draw.id = id;
        this.$draw.style.width = width * 3 + "px";
        this.$draw.style.height = +height * 3 + "px";
        var tmpClk = null;
        if (GooFlow.prototype.useSVG != "") {
            tmpClk = 'g';
        } else {
            tmpClk = 'PolyLine';
        }
    }
}