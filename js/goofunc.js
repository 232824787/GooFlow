//��ȡһ��DIV�ľ�������(�������Ѷ�λ�ĸ�Ԫ�ر�����ֱ����Ԫ�أ�
function getElCoordinate(dom) {
    var t = dom.offsetTop;
    var l = dom.offsetLeft;
    dom = dom.offsetParent;
    while (dom) {
        t += dom.offsetTop;
        l += dom.offsetLeft;
        dom = dom.offsetParent;
    }
    ;
    return {
        top: t,
        left: l
    };
}
//���ݸ����������,��ȡ�����ʵλ��
function mousePosition(ev) {
    if (!ev) ev = window.event;
    if (ev.pageX || ev.pageY) {
        return {x: ev.pageX, y: ev.pageY};
    }
    return {
        x: ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.documentElement.scrollTop - document.body.clientTop
    };
}
//��DATE�����һ����ʽ������ִ��ķ���
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second  ��
        //quarter
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}
//JS]���ݸ�ʽ�ַ����������ڣ�MM���Զ�ƥ����λ��09��һλ��9��
//alert(getDateFromFormat(sDate,sFormat));
function getDateFromFormat(dateString, formatString) {
    var regDate = /\d+/g;
    var regFormat = /[YyMmdHhSs]+/g;
    var dateMatches = dateString.match(regDate);
    var formatmatches = formatString.match(regFormat);
    var date = new Date();
    for (var i = 0; i < dateMatches.length; i++) {
        switch (formatmatches[i].substring(0, 1)) {
            case 'Y':
            case 'y':
                date.setFullYear(parseInt(dateMatches[i]));
                break;
            case 'M':
                date.setMonth(parseInt(dateMatches[i]) - 1);
                break;
            case 'd':
                date.setDate(parseInt(dateMatches[i]));
                break;
            case 'H':
            case 'h':
                date.setHours(parseInt(dateMatches[i]));
                break;
            case 'm':
                date.setMinutes(parseInt(dateMatches[i]));
                break;
            case 's':
                date.setSeconds(parseInt(dateMatches[i]));
                break;
        }
    }
    return date;
}
//���ҷ����ɸ�����
//alert(parseCurrency("��1,900,000.12"));
function parseCurrency(currentString) {
    var regParser = /[\d\.]+/g;
    var matches = currentString.match(regParser);
    var result = '';
    var dot = false;
    for (var i = 0; i < matches.length; i++) {
        var temp = matches[i];
        if (temp == '.') {
            if (dot) continue;
        }
        result += temp;
    }
    return parseFloat(result);
}

//��#XXXXXX��ɫ��ʽת��ΪRGB��ʽ����������͸����
function brgba(hex, opacity) {
    if (!/#?\d+/g.test(hex)) return hex; //����ǡ�red����ʽ����ɫֵ����ת����//������󣬲ο������PS����
    var h = hex.charAt(0) == "#" ? hex.substring(1) : hex,
        r = parseInt(h.substring(0, 2), 16),
        g = parseInt(h.substring(2, 4), 16),
        b = parseInt(h.substring(4, 6), 16),
        a = opacity;
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

//������ת��Ϊutf-8
function ch(s1) {
    var s = escape(s1);

    return unescape(s);
}
function Str2Hex(s) {
    var c = "";
    var n;
    var ss = "0123456789ABCDEF";
    var digS = "";
    for (var i = 0; i < s.length; i++) {
        c = s.charAt(i);
        n = ss.indexOf(c);
        digS += Dec2Dig(eval(n));

    }
    //return value;
    return digS;
}
function Dec2Dig(n1) {
    var s = "";
    var n2 = 0;
    for (var i = 0; i < 4; i++) {
        n2 = Math.pow(2, 3 - i);
        if (n1 >= n2) {
            s += '1';
            n1 = n1 - n2;
        }
        else
            s += '0';

    }
    return s;

}
function Dig2Dec(s) {
    var retV = 0;
    if (s.length == 4) {
        for (var i = 0; i < 4; i++) {
            retV += eval(s.charAt(i)) * Math.pow(2, 3 - i);
        }
        return retV;
    }
    return -1;
}
function Hex2Utf8(s) {
    var retS = "";
    var tempS = "";
    var ss = "";
    if (s.length == 16) {
        tempS = "1110" + s.substring(0, 4);
        tempS += "10" + s.substring(4, 10);
        tempS += "10" + s.substring(10, 16);
        var sss = "0123456789ABCDEF";
        for (var i = 0; i < 3; i++) {
            retS += "%";
            ss = tempS.substring(i * 8, (eval(i) + 1) * 8);


            retS += sss.charAt(Dig2Dec(ss.substring(0, 4)));
            retS += sss.charAt(Dig2Dec(ss.substring(4, 8)));
        }
        return retS;
    }
    return "";
}