//check用于根据流控内容计算扇区预计流量，计算占用量，通行能力下降值
//占用量计算公式
// 占用量 = 存在量+进入量
// =上一小时受限制方向受限后进入总量×平均飞行时间/60 + 本小时原本存在量 - 上小时受限制方向受限前进入量×平均飞行时间/60
// +本小时受限方向受限后进入总量 + 本小时原本总进入量 - 本小时受限方向原本总进入量
var cS = {};

var cC = {};

function checkS(lastHourContrledComein,flyTime,thisHourExist,lastHourCtrledUnctrlComein,thisHourContrledComein,thisHourUnctrlTotalComein,thisHourContrlUnctrlComein){
    let realS = lastHourContrledComein*flyTime/60 + thisHourExist - lastHourCtrledUnctrlComein * flyTime / 60 + thisHourContrledComein + thisHourUnctrlTotalComein - thisHourContrlUnctrlComein;
    realS = Math.round(realS);
    if(realS < 0){
        realS = 0;
    }
    return realS;
}