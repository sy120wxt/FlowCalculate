//check用于根据流控内容计算扇区预计流量，计算占用量，通行能力下降值
//占用量计算公式
// 占用量 = 存在量+进入量
// =上一小时受限制方向受限后进入总量×平均飞行时间/60 + 本小时原本存在量 - 上小时受限制方向受限前进入量×平均飞行时间/60
// +本小时受限方向受限后进入总量 + 本小时原本总进入量 - 本小时受限方向原本总进入量
// var cS = {};

// var cC = {};

// function checkS(lastHourContrledComein,flyTime,thisHourExist,lastHourCtrledUnctrlComein,thisHourContrledComein,thisHourUnctrlTotalComein,thisHourContrlUnctrlComein){
//     let realS = lastHourContrledComein*flyTime/60 + thisHourExist - lastHourCtrledUnctrlComein * flyTime / 60 + thisHourContrledComein + thisHourUnctrlTotalComein - thisHourContrlUnctrlComein;
//     realS = Math.round(realS);
//     if(realS < 0){
//         realS = 0;
//     }
//     return realS;
// }

var M = {};

function setM(row,value){
    M[row.toString()] = value;
}
function getM(row){
    return M[row.toString()];
}

//决定流控内容后，使用check方法进行验算，主要分为两个部分，一是验算是否有触发MDRS的行为，二是如果触发MDRS应选择哪种策略可以不触发MDRS。

function check(){
    for(let i = 1; i < row ; i ++){
    
        flowAfter(i);
        MDRS(i);
        //填写应声明动态容量和下降百分比
        fillCap(i);
    }
}

//计算流控后一小时进入量:总进入量 + 上一小时总减少量 -各方向减少量
function flowAfter(row){
    let comeins = getD(row);
    let RAfter = 0;
    for(let j = 0 ; j< direction;j++){
        RAfter = RAfter + getr(row,j,direction);
    }
    comeins = comeins + getR(row-1) - RAfter;
    //如果该行各方向进入量和为0，表示没有飞机，不需要显示结束本方法
    if(comeins == 0){
        return;
    }
    console.log("check--R(row-1):"+"ROW:"+row+","+getR(row-1));
    console.log("check--RAfter:"+"ROW:"+row+","+RAfter);
    console.log("check--comein:"+"ROW:"+row+","+comeins);
    setR(row,RAfter);
    document.getElementById("R"+row+"C"+(4+direction)).innerHTML = comeins;

    //检查流控后流量与通行能力差百分比，以对比流控内容是否合理
    let a = (comeins - getC(row))/getC(row);
    if(a > 0.1){
        document.getElementById("R"+row+"C"+(4+direction)).className = "red";
    }
    else{
        document.getElementById("R"+row+"C"+(4+direction)).className = "white";
    }
}

//计算是否触发mdrs
//留个问题，如果通行能力与实际流量相差超过10%，是否需要修正通行能力___________________________________________________?????
function MDRS(row){
    let flow = getD(row) + getR(row-1);
    let mdrs = 0;
    if(flow > getC(row)){
        mdrs = Math.round((flow - getC(row))/flow*1000);
        console.log("check--flow:"+flow);
        console.log("check--getC:"+getC(row));
    }
    if(getD(row) != 0){
        document.getElementById("R"+row+"C"+(5+direction)).innerHTML = mdrs/10 + "%";
    }
    else{
        document.getElementById("R"+row+"C"+(5+direction)).innerHTML = "";
    }
    
    
    setM(row,mdrs/1000);
    //以下为染色
    if(mdrs >= 0){
        document.getElementById("R"+row+"C"+(5+direction)).className = "clear";
    }
    if(mdrs >= 250){
        document.getElementById("R"+row+"C"+(5+direction)).className = "yellow";
    }
    if(mdrs >= 500){
        document.getElementById("R"+row+"C"+(5+direction)).className = "orange";
    }
    if(mdrs >= 750){
        document.getElementById("R"+row+"C"+(5+direction)).className = "red";
    }
}

//填写应发布的动态容量和下降比
function fillCap(row){
    //如果本行总进入量为0，表示不需要分析本行数据，结束方法
    if(getD(row) == 0){
        return;
    }
    let c = getC(row);
    let dis = Math.round((1 - c/staticCap)*100);
    if(dis < 0){
        dis = 0;
    }
    document.getElementById("R"+row+"C"+(6+direction)).innerHTML = c + "</br>"+ dis +"%";
}