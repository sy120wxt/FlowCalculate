//反向检查的计算方法

//各数据清零方法
function obj(){}

//动态容量集合
var C = {};
function getC(row){
    return C[row.toString()];
}
function setC(row,value){
    C[row.toString()] = value;
}
//小时总进入量集合
var D = {};
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

//获取表格数据方法
function getReverseInfo(){
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
    for(let j = 0 ; j < direction ; j++){
        setd(0,j,direction,0);
        setdAfter(0,j,direction,0);
        setr(0,j,direction,0);
    }

    //正式获取第一行开始的各项数据，计算各行流控后小时总进入量，小时MDRS触发值。
    for(let i = 1;i<row ; i++){
        //单独一行的总减少量
        let RR = 0;
        //单独一行的总进入量
        let DD = 0;
        //获取动态容量值
        setC(i,getValue("R"+i+"C2"));
        //获取预计扇区进入总架次
        let Drow = getValue("R"+i+"C3");
        setD(i,Drow);
        //获取各方向流控前架次及流控后架次
        for(let j = 0; j < direction; j++){
            let formup = getValue("R"+i+"C"+(4+j)+"U");
            let comeinture = formup + getr(i-1,j,direction);
            let down = getValue("R"+i+"C"+(4+j)+"D");
            setd(i,j,direction,formup);
            if(down == 0){
                down = comeinture;
                setr(i,j,direction,0);
            }
            if(down > comeinture){
                setdAfter(i,j,direction,comeinture);
                setr(i,j,direction,0);
                DD += comeinture;
            }
            else{
                setdAfter(i,j,direction,down);
                setr(i,j,direction,comeinture-down);
                RR = RR + comeinture - down;
                DD += down; 
            }
        }
        setR(i,RR);
        setC(i,DD);
        //填写预计扇区小时进入架次
        if(Drow != 0){
            document.getElementById("R"+ i + "C" + (4+direction)).innerHTML = DD;
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
function Button2(){
    for(let i = 1; i < row; i ++){
        disMDRS(i);
        document.getElementById("R"+i+"C"+(direction+7)).innerHTML = getC(i);
    }
    calFirst();
    check();
    explain();
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
function calculate(){
    getReverseInfo();
    explain();
}