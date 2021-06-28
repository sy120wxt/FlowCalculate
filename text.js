//真实的各方向进入量
var realComein = {};

function text(directionName,averageNum,timeA,timeB,hour,direction){
    if (averageNum == 0) {
        realComein["R"+hour+"D"+direction] = 0;
        return "";
    }
    let a = "";
    a = timeA + "-" + timeB + directionName +"，" +sep(averageNum,hour,direction);
    return a;
}
//根据时间和架次给出多少分钟1架
function sep(averageNum,hour,direction){
    let a = getStep();
    if (averageNum != 0) {
        b = Math.round(a/averageNum);
        let text = b + "分钟1架";
        let rC = Math.round(60/b);
        realComein["R"+hour+"D"+direction] = rC;
        return text;
    }
    //以下代码不会被执行
    if (averageNum == 0) {
        realComein["R"+hour+"D"+direction] = 0;
        return "禁航";
    }
}