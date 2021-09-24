//正向计算总则
// 1.占用量S = 受限存在+不受限存在+总进入量
//         = 上一小时，受限方向流控后的总进入量Dn*平均飞行时间/60  + （流控前占用量-流控前进入量）-上一小时流控前受限方向进入量*平均飞行时间/60 + 流控前进入量+上一小时总减少量R
// 2.本小时总减少量R = 占用量S - 动态容量
// 3.各方向进入量dn = 本小时进入量 + 上小时减少量rn
// 4.各方向减少量rn=R*dn/(d1+d2+...+dn)
// 5.各方向流控后小时进入量in = dn - rn
//以上取消，留着作为一种纪念了
//今后只用进入量作为计算依据，通行能力也按照进入量计算
//本方法包含两大部分，一个是获取表格中各相关单元格的数值，一个是通过计算将各相关单元格赋值。

//各扇区平均飞行时间
var AR01T = 22;
var AR02T = 10;
var AR03T = 10;
var AR04T = 13;
var AR05T = 30;
var AR06T = 12;
var AR07T = 25;

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

//获取各小时流控前总进入量
function getIn(row){
    let value = getValue("R"+row+"C3");
    D[row] = value;
}
//获取D的值
function getD(row){
    return D[row.toString()];
}


//获取表格中各小时各方向流控前的进入量
function getDirections(row,direction){
    for(let j =0; j < direction;j++){
        let value = getValue("R"+row + "C" + (4+j));
        //key为row*direction 到 row * direction-1 时，表示第row行的direction个数
        let key = direction*row + j;
        console.log(key);
        d[key.toString()] = value;
    }
}
//获取d中各小时各方向进入量
function getd(row,j,direction){
    let key = row*direction + j;
    return d[key.toString()];
}


//获取各小时各方向的减少量
function getr(row,j,direction){
    let key = row*direction + j;
    return r[key.toString()];
}
//设置各小时各方向的减少量
function setr(row,j,direction,value){
    let key = row*direction + j;
    r[key] = value;
}


//设置各小时总减少量
function setR(row,value){
    R[row] = value;
}
//获取各小时总减少量
function getR(row){
    return R[row.toString()];
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

//获取必要信息
function getInfo(){
    chao = new obj();
    C = new obj();
    d = new obj();
    D = new obj();
    R = new obj();
    r = new obj();
    M = new obj();
    rbeforeAve = new obj();
    RbeforeAve = new obj();
    dbeforeAve = new obj();
    
    for(let i = 1; i < row; i++){
        //获取第i行动容
        getCap(i);
        //获取总进入量
        getIn(i);
        //获取各方向进入量
        console.log(direction);
        getDirections(i,direction);
        //设置第一小时，上一小时减少量为0
        R[0] = 0;
        setRBeforeAve(0,0);
    }
    //设置各方向第一小时，上一小时减少量为0
    for(let j = 0; j < direction ; j++){
        setr(0,j,direction,0);
        setrBeforeAve(0,j,direction,0);
    }
    console.log("动态容量");
        console.log(C);
        console.log("总进入量");
        console.log(D);
        console.log("各方向进入量");
        console.log(d);
        console.log("总减少量");
        console.log(R);
        console.log("各方向减少量");
        console.log(r);
}

//第一次计算，检测是否超量，计算各方向应该减少多少，对应流控为每小时多少，实际流控作用后，每小时实际减少量

//记录是否超量
var chao = {};
function getChao(row){
    return chao[row.toString()];
}
//记录各方向减少后每小时应进入的架次
var dAfter = {};
//设置dAfter的值
function setdAfter(row,j,direction,value){
    let key = row*direction + j;
    dAfter[key] = value;
}
//读取dAfter的值
function getdAfter(row,j,direction){
    let key = row*direction + j;
    return dAfter[key.toString()];
}




//首次计算，计算出各小时的数值
function calFirst(){
    for(let i = 1; i<row ; i++){
        //不超量，总进入量小于等于动态容量
        //Drow第row行的总进入量=表中数据+上一小时总减少量
        let Drow = getD(i) + getR(i-1);
        //Crow第row行的动态容量
        let Crow = getC(i);
        console.log("Drow:"+Drow);
        console.log("Crow:"+Crow);
        if(Drow <= Crow){
            chao[i] = false;
            setR(i,0);
            setRBeforeAve(i,0);
            for(let j = 0; j < direction ; j++){
                setr(i,j,direction,0);
                setrBeforeAve(i,j,direction,0);
                //如果判断没超量，设置该小时各方向进入量为0，表示没发流控
                setdAfter(i,j,direction,0);
                setdBeforeAve(i,j,direction,0);
            }
            
        }
        //超量
        else{
            chao[i] = true;
            //计算1小时应减少多少
            let Rrow = Drow - Crow;
            //计算第row行direction进入量总数 = direction内各列数据+上一小时各自减少量
            let directionAdd = 0;
            for(let j = 0; j <direction ; j++){
                console.log("getd:"+getd(i,j,direction));
                console.log("getr:"+getr(i-1,j,direction));
                directionAdd = directionAdd + getd(i,j,direction) + getr(i-1,j,direction);
            }
            
            //设置一个变量表示流控之后小时实际的减少量，以更新Rrow
            let RrowActraul = 0;
            //计算各方向应减少多少架，并进行四舍五入，然后得到各方向1小时应进入多少架
            
            for(let j = 0; j < direction ; j++){
                //第row行第j列应减少架次
                let rrow = 0;
                //先判断分母是否为0
                console.log("directionAdd:"+directionAdd);
                if(directionAdd == 0){
                    setr(i,j,direction,0);
                    setrBeforeAve(i,j,direction,0);
                }
                else{
                    rrow = Math.round(Rrow * (getd(i,j,direction)+getr(i-1,j,direction))/directionAdd);
                    setr(i,j,direction,rrow);
                    setrBeforeAve(i,j,direction,rrow);
                }
                //第row行第j列流控后进入架次
                let drow = getd(i,j,direction)+getr(i-1,j,direction) - rrow;
                console.log("i="+i+"drow"+drow);
                setdAfter(i,j,direction,drow);
                setdBeforeAve(i,j,direction,drow);
                console.log("i="+i+"rrow"+rrow);
                RrowActraul = RrowActraul + rrow;
            }
            console.log("i="+i+"RrowActraul:"+RrowActraul);
            setR(i,RrowActraul);
            setRBeforeAve(i,RrowActraul);
        }
    }
    
}

//二次计算，根据首次计算的数值，计算某一方向平均值，如果在某一位置为0，则计算0之前的平均值，然后接着计算0之后的平均值，0位置表示不发流控
function calSecond(){
    //a表示有多少个不为0的数
    let a = 0;
    //b表示各方向进入量的和
    let b = 0;
    //记录平均数
    let ave = 0;
    //先遍历列，后遍历行
    for(let j = 0; j < direction ; j++){
        for(let i = 1; i <row; i++){
            //c表示dAfter中的值
            let c = getdAfter(i,j,direction);
            console.log("c:"+c);
            //如果c为0，则a = 0, b = 0
            if(c == 0){
                if(a != 0){
                    ave = Math.round(b/a);
                    console.log("ave:"+ave);
                    //根据ave重写dAfter中的数据，为了重写各方向减少量，必须正向计算
                    for(let q = a; q > 0 ; q--){
                        setdAfter(i-q,j,direction,ave);
                        //重写实际减少量
                        let rrr = getd(i-q,j,direction) + getr(i-1-q,j,direction) - ave;
                        if(rrr < 0){
                            setr(i-q,j,direction,0);
                        }
                        else{
                            setr(i-q,j,direction,rrr);
                        }
                    }
                }
                //数据归零
                a = 0;
                b = 0;
                ave = 0;
            }
            //如果c不为0，则a+1，b = b+c
            else{
                a = a+1;
                b = b+c;
                //如果为最后一行了，即i = row-1，计算平均值
                if( i== row -1){
                    ave = Math.round(b/a);
                    console.log("ave:"+ave);
                    //根据ave重写dAfter中的数据
                    for(let q = a; q > 0 ; q--){
                        setdAfter(i+1-q,j,direction,ave);
                        //重写实际减少量
                        let rrr = getd(i+1-q,j,direction) + getr(i-q,j,direction) - ave;
                        if(rrr < 0){
                            setr(i+1-q,j,direction,0);
                        }
                        else{
                            setr(i+1-q,j,direction,rrr);
                        }
                    }

                    //数据归零
                    a = 0;
                    b = 0;
                    ave = 0;
                }
                
            }


        }
    }
    console.log("dAfter:");
    console.log(dAfter);
}



//计算过程解读
//先算小时修正进入量D：小时总进入量 + 上一小时总减少量
//计算小时总减少量R：小时修正进入量 - 各方向小时进入量的和
//修正各方向进入量d+r：各方向小时进入量+各方向上一小时减少量
//根据比例计算各方向分别减少量r：小时总减少量*方向修正进入量d+r/（各方向修正进入量的和d+r），并进行四舍五入，记录到各方向减少量r中
//根据计算的各方向减少量的和，修正小时总减少量R
//以上废除

//各时间各方向进入量不同的解决方式：采取差值比较法：
//当进入量与上一小时相差bound小时以上，则计算该时间内的平均值
//如果相差bound以下，则继续向下一小时取值


//获取扇区平均飞行时间
function getSectorTime(sector){
    switch (sector) {
        case "AR01":
            return AR01T;
            break;
        case "AR02":
            return AR02T;
            break;
        case "AR03":
            return AR03T;
            break;
        case "AR04":
            return AR04T;
            break;
        case "AR05":
            return AR05T;
            break;
        case "AR06":
            return AR06T;
            break;
        case "AR07":
            return AR07T;
            break;
        case "AR02_08C":
            return AR02T;
            break;
        case "AR03_12C":
            return AR03T;
            break;
        case "AR07_13C":
            return AR07T;
            break;
        case "AR04_14C":
            return AR04T;
            break;
    }
}



//获取单一单元格数据
function getValue(id){
    let x = document.getElementById(id);
    return Number(x.value);
}
//获取单一单元格数据
function getVV(v,i,j){
    let k = eval(v + ".R"+ i + "D"+j);
    if(k == undefined){
        return 0;
    }
    else{return k;}
}
// //获取单一单元格数据
function getV(v,i){
    let k = eval(v+".R"+i);
    if (k == undefined) {
        return 0;
    }
    else{return k;}
}

//在VARS中取值
// function getVars(i,j){
//     let k = eval("vars.R"+i+"C"+j);
//     return k;
// }

//正向精确计算法
function calculate(){
    //获取数据
    getInfo();
    //精确正向计算
    calFirst();
    //取平均值计算
    calSecond();
    //检验流控后进入量及MDRS触发
    check();
    //对计算过程进行说明
    explain();
    setText();

}

//消除MDRS
function Button2(){
    for(let i = 1; i < row; i++){
        disMDRS(i);
    }
    calFirst();
    //calSecond();
    //检验流控后进入量及MDRS触发
    check();
    //对计算过程进行说明
    explain();
    setText();
}




