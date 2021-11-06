//反向检查的计算方法

//偏移值，用以整合内容相近的流控
var offSet = 5;

    //动态容量
    var C = {};
    //各受限方向总进入量D，本小时受流控之前
    var D = {};
    //总减少量R
    var R = {};
    //各方向减少量r
    var r = {};
    //各方向预测进入量，本小时受流控之前
    var d = {};
    //各方向进入量，用以判断calOffset是否发流控了
    var dOffset = {};
    //各数据清零方法
    function obj(){}


//获取各小时动态容量方法
function getCap(row){
    let value = getValue("R"+row + "C2");
    C[row] = value;
}
//获取C的值
function getC(row){
    return C[row.toString()];
}

//设置C的值
function setC(row,value){
    C[row.toString()] = value;
}
//小时总进入量集合
var D = {};

//获取各小时流控前总进入量
function getIn(row){
    let value = getValue("R"+row+"C3");
    D[row] = value;
}
function getD(row){
    return D[row.toString()];
}
function setD(row,value){
    D[row.toString()] = value;
}
//流控前各方向架次集合
var d = {};
function getd(row,j,direction){
    let key = row*direction + j;
    return d[key.toString()];
}
function setd(row,j,direction,value){
    let key = row*direction + j;
    d[key] = value;
}

//流控后各方向架次集合
var dAfter = {};
function getdAfter(row,j,direction){
    let key = row*direction + j;
    return dAfter[key.toString()];
}
function setdAfter(row,j,direction,value){
    let key = row*direction + j;
    dAfter[key] = value;
}

//各小时总减少量集合
var R = {};
function getR(row){
    return R[row.toString()];
}
function setR(row,value){
    R[row.toString()] = value;
}

//各方向减少量集合
var r = {};
function getr(row,j,direction){
    let key = row*direction + j;
    return r[key.toString()];
}
function setr(row,j,direction,value){
    let key = row*direction + j;
    r[key.toString()] = value;
}

//MDRS值的集合
var M = {};
function getM(row){
    return M[row.toString()];
}
function setM(row,value){
    M[row.toString()] = value;
}

var rbeforeAve = {};
function setrBeforeAve(row,j,direction,value){
    let key = row*direction +j;
    rbeforeAve[key] = value;
}
function getrBeforeAve(row,j,direction){
    let key = row*direction + j;
    return rbeforeAve[key.toString()];
}

var RbeforeAve = {};
function setRBeforeAve(row,value){
    RbeforeAve[row] =value;
}
function getRBeforeAve(row){
    return RbeforeAve[row.toString()];
}

//记录各方向取平均值之前的数据，用以在解释窗口中显示计算的数据
var dbeforeAve = {};
function setdBeforeAve(row,j,direction,value){
    let key = row*direction +j;
    dbeforeAve[key] = value;
}
function getdBeforeAve(row,j,direction){
    let key = row*direction + j;
    return dbeforeAve[key.toString()];
}

//获取表格数据方法
function getReverseInfo(){
    if(staticCap == 0){
        alert("数据错误：\n未选择想分析的扇区，无法确定通行能力值");
        return;
    }
    //初始化各项集合
    chao = new obj();
    C = new obj();
    d = new obj();
    D = new obj();
    R = new obj();
    r = new obj();
    M = new obj();
    dAfter = new obj();
    //初始化第0行各项数据
    setC(0,0);
    setD(0,0);
    setR(0,0);
    setRBeforeAve(0,0);
    for(let j = 0 ; j < direction ; j++){
        setd(0,j,direction,0);
        setdAfter(0,j,direction,0);
        setr(0,j,direction,0);
        setrBeforeAve(0,j,direction,0);
        setdBeforeAve(0,j,direction,0);
    }

    //正式获取第一行开始的各项数据，计算各行流控后小时总进入量，小时MDRS触发值。
    for(let i = 1;i<row ; i++){
        //单独一行的总减少量
        let RR = 0;
        //单独一行的总进入量
        let DD = 0;
        //获取动态容量值
        //setC(i,getValue("R"+i+"C2"));
        //获取预计扇区进入总架次
        let Drow = getValue("R"+i+"C3");
        setD(i,Drow);
        let upSum = 0;
        //获取各方向流控前架次及流控后架次
        for(let j = 0; j < direction; j++){
            let formup = getValue("R"+i+"C"+(4+j)+"U");
            let comeinture = formup + getr(i-1,j,direction);
            let down = getValue("R"+i+"C"+(4+j)+"D");
            setd(i,j,direction,formup);
            upSum += formup;
            //如果受限方向设置为0，表示该方向不受限
            if(down == 0){
                down = comeinture;
                setr(i,j,direction,0);
            }
            //如果限制允许架次大于实际流量，表示没有减少量
            if(down > comeinture){
                setdAfter(i,j,direction,comeinture);
                setr(i,j,direction,0);
                DD += comeinture;
            }
            //如果限制允许架次小于实际流量，表示有减少量
            else{
                setdAfter(i,j,direction,down);
                setr(i,j,direction,comeinture-down);
                RR = RR + comeinture - down;
                DD += down; 
            }
        }
        //总进入量再加上本小时不受限架次，如果各方向进入量大于本小时总进入量，则告警、并结束运算
        if(upSum > Drow){
            alert("第"+i+"行数据填写错误：\n各方向架次总和大于本小时总架次");
            return;
        }

        DD += (Drow - upSum);
        //upsum用来判断该行是否有有录入信息，没有录入信息可以认为该行不做计算

        setR(i,RR);
        setC(i,DD);
        //填写预计扇区小时进入架次
        if(Drow != 0){
            document.getElementById("R"+ i + "C" + (4+direction)).innerHTML = DD;
            document.getElementById("R"+ i + "C" + (6+direction)).innerHTML = DD;
        }
        
        //计算通行能力与流量的差比
        // let MM = 0;
        // //小时预计流量为本小时原本总进入量+上小时减少总量
        // Drow = Drow + getR(i-1);
        // if(Drow > DD){
        //     MM = Math.round((Drow - DD)/Drow*1000);
        // }

        // setM(i,MM);
        // if(Drow != 0){
        //     document.getElementById("R"+i+"C"+(6+direction)).innerHTML = MM/10 + "%";
        // }
        // setM(i,MM);
        MDRS(i);
    }

    //测试用，显示结果
    //test();
}

//如果要消除MDRS，在确定了各时段的总进入量后，需要按照各方向进入量比例进行分配，然后重新写到各数据表中

//消除MDRS方法
function reverseButton2(){
    
    disMDRS();
        //document.getElementById("R"+i+"C"+(direction+6)).innerHTML = getC(i);
    
    calFirst();
    //explain();
    calOffset();
    //calSecond();
    //检验流控后进入量及MDRS触发
    check();
    secondMd();
    //对计算过程进行说明
    explain();
    setText();
}



//测试函数
function test(){
    var text = "";
    for(let i = 0; i < row ; i++){
        if(getD(i) !=0 ){
            text = text + "</br>第"+ i + "行数据：" + "通行能力："+getC(i);
            text += "总进入量：" + getD(i);
            for(let j = 0; j < direction ; j++){
                text += "</br>第"+ j + "列进入量：" + getd(i,j,direction);
                text += "流控后进入量：" + getdAfter(i,j,direction);
                text += "</br>";
                text += "减少架次："+getr(i,j,direction);
            }
        }
    }
    text += "</br>";

    document.getElementById("test").innerHTML = text;
}

//获取单一单元格数据
function getValue(id){
    let x = document.getElementById(id);
    return Number(x.value);
}

//计算按钮
function reverseCalculate(){
    getReverseInfo();
    //explain();
}