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

    //小时不受限架次，用来填表用
    var unRes = {};

    //流控后每小时真实的进入量，用来判断二次MDRS
    var realComein = {};


    var M = {};
    //各数据清零方法
    function obj(){}

    //数据检查是否存在错误项
    let correct = true;

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

function setD(row,value){
    D[row.toString()] = value;
}

//获取unR的值
function getunRes(row){
    return unRes[row.toString()];
}

function setunRes(row,value){
    unRes[row.toString()] = value;
}

//获取realComein的值
function getrealComein(row){
    return realComein[row.toString()];
}

function setrealComein(row,value){
    realComein[row.toString()] = value;
}

//获取表格中各小时各方向流控前的进入量
function getDirections(row,direction){
    let sum = 0;
    for(let j =0; j < direction;j++){
        let value = getValue("R"+row + "C" + (4+j));
        //key为row*direction 到 row * direction-1 时，表示第row行的direction个数
        let key = direction*row + j;
        //console.log(key);
        d[key.toString()] = value;
        //各方向进入量的和
        sum = sum + value;
    }

    //与本小时，小时进入量做对比
    if(sum > getD(row)){
        alert("第"+row+"行数据填写错误:\n各方向小时流量的和大于了本小时预计扇区的总量");
        correct = false;
        return;
    }
    //否则记录小时不受限架次
    else{
        setunRes(row,getD(row)-sum);
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

//获取各小时各方向的减少量
// function getdOffset(row,j,direction){
//     let key = row*direction + j;
//     return dOffset[key.toString()];
// }
// //设置各小时各方向的减少量
// function setdOffset(row,j,direction,value){
//     let key = row*direction + j;
//     dOffset[key] = value;
// }


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
    correct = true;
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
        //console.log(direction);
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
        //console.log("Drow:"+Drow);
        //console.log("Crow:"+Crow);
        if(Drow < Crow){
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
                //console.log("getd:"+getd(i,j,direction));
                //console.log("getr:"+getr(i-1,j,direction));
                directionAdd = directionAdd + getd(i,j,direction) + getr(i-1,j,direction);
            }
            
            //设置一个变量表示流控之后小时实际的减少量，以更新Rrow
            let RrowActraul = 0;
            //计算各方向应减少多少架，并进行四舍五入，然后得到各方向1小时应进入多少架
            
            for(let j = 0; j < direction ; j++){
                //第row行第j列应减少架次
                let rrow = 0;
                //先判断分母是否为0
                //console.log("directionAdd:"+directionAdd);
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
                //console.log("i="+i+"drow"+drow);
                setdAfter(i,j,direction,drow);
                setdBeforeAve(i,j,direction,drow);
                //console.log("i="+i+"rrow"+rrow);
                RrowActraul = RrowActraul + rrow;
            }
            //console.log("i="+i+"RrowActraul:"+RrowActraul);
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

//设置各方向各小时进入量，用于calOffset中，以前后浮动值为依据
//sum是和，length是个数，positionA是起始的行，i是目前的行，j是当前的列
function setdValue(sum,length,positionA,i,j){
    //x表示本小时平均后各方向小时进入量
    let x = Math.round(sum/length);
    //再次对x进行修正，如果x不为偶数，则让x变为偶数，以此来规范流控内容
    if(x%2 != 0){
        x= x+1;
    }
    //y表示按x进入后，本小时减少量
    for(let k = positionA; k < i; k++){
        setdAfter(k,j,direction,x);
        let y = getd(k,j,direction)+getr(k-1,j,direction)-x;
        if(y>0){
            setr(k,j,direction,y);
        }
        else{
            setr(k,j,direction,0);
        }
    }
}



function calOffset(){
    //进入量取偶放在calOffset方法中
    console.log("calOffset执行");
    let positionA = 1;
    let sum = 0;
    let len = 1;

    for(let j = 0; j< direction;j++){
        for(let i = 1; i < row;i++){
            //先判断该行是否发流控，以chao的值为依据
            //没发流控
            if(getChao(i) == false){
                //判断上一小时有没有发流控，用sum判断
                //之前也没发流控
                if(sum == 0){
                    positionA = i;
                }
                //之前发流控了
                else{
                    setdValue(sum,len,positionA,i,j);
                    positionA = i;
                    sum = 0;
                    len = 1;
                }
            }
            //如果发流控了
            else{
                //判断上一小时有没有发流控，用sum判断
                //没发
                if(sum == 0){
                    positionA = i;
                    sum = sum + getdAfter(i,j,direction);
                    len = 1;
                }
                //上一小时发了
                else{
                    //判断这小时流控与上小时流控的差是否大于offset值，如果大于表示不近，计算之前的平均值
                    console.log("dAfter(i):"+getdAfter(i,j,direction));
                    console.log("dAfter(i-1):"+getdAfter(i-1,j,direction));
                    console.log("ABS:"+Math.abs(getdAfter(i,j,direction) - getdAfter(i-1,j,direction)));
                    if(Math.abs(getdAfter(i,j,direction) - getdAfter(i-1,j,direction)) >= offSet){
                        setdValue(sum,len,positionA,i,j);
                        len = 1;
                        positionA = i;
                        sum = getdAfter(i,j,direction);
                    }
                    //如果不大于，则表示可以取平均值
                    else{
                        sum = sum + getdAfter(i,j,direction);
                        len = len + 1;
                        //如果已经到最后一行了，应取整个sum的平均值，然后赋值到PositionA到i
                        if( i == row -1){
                            setdValue(sum,len,positionA,i+1,j);
                            len = 1;
                        }
                    }
                }

                //只要最后一行发流控了，就执行本行代码
                if(i == row -1){
                    positionA = 1;
                    sum = 0;
                    len = 1;
                }
            }
        }
        

    }
    
    // //近似值开始的位置
    // let positionA = 1;

    // //近似值的长度
    // let len = 1;
    // //近似值
    // let num = 0;
    // let a = 0;
    // let b = 0;
    // //遍历数组，先遍历列，后遍历行，看某方向，每个时间段与上一个时间段比较，相差值有多少
    // for(let j = 0; j < direction;j++){
    //     num = getdAfter(1,j,direction);
    //     //得先判断该小时是否发流控，
    //     for(let i = 2; i < row ; i++){
    //         //设定第一行上一时段的进入量为第一段进入量，设置上一小时a和这一小时b的值
            
    //         a = getdAfter(i - 1,j,direction);
    //         b = getdAfter(i,j,direction);

    //         console.log("b:"+b);
    //         //如果这一小时进入量b与上一小时进入量a相差小于等于offset的值，平均值长度+1，num += b;
    //         //并且b不能等于0，b如果等于0就强制计算平均值
    //         if(Math.abs(b - a) <= offSet && b !=0 && a!=0){
    //             len += 1;
    //             num = num + b;
    //         }
    //         //如果b与a相差大于offset的值，计算平均值，长度清零，总值清零，平均值清零，a的位置更新
    //         else{
    //             let ave = Math.round(num/len);
    //             console.log("num:"+num);
    //             console.log("len:"+len);
                
    //             for(let k = 0; k < len ; k++){
    //                 setdAfter((positionA+k),j,direction,ave);
    //                 //重写实际减少量=本小时流控前进入量+上小时延误量-本小时实际进入量
    //                 let rrr = getd((positionA+k),j,direction)+getr((positionA+k-1),j,direction)-ave;
    //                 if(rrr<0){
    //                     rrr = 0;
    //                 }
    //                 setr((positionA+k),j,direction,rrr);
    //                 console.log("position:"+(positionA+k));
    //             }
    //             num = b;
    //             ave = 0;
    //             len = 1;
    //             positionA = i;
    //         }
    //         //如果i为最后一行,长度先自加1，num加最后一行的值，计算平均值，之后长度清零，总值平均值清零，a位置更新
    //         if( i == row -1){
    //             len += 1;
    //             num = num+b;
    //             let ave = Math.round(num/len);
    //             console.log("num:"+num);
    //             console.log("len:"+len);
    //             for(let k = 0; k < len ; k++){
    //                 setdAfter((positionA+k),j,direction,ave);
    //                 //重写实际减少量=本小时流控前进入量+上小时延误量-本小时实际进入量
    //                 let rrr = getd((positionA+k),j,direction)+getr((positionA+k-1),j,direction)-ave;
    //                 if(rrr<0){
    //                     rrr = 0;
    //                 }
    //                 setr((positionA+k),j,direction,rrr);
    //                 console.log("position:"+(positionA+k));
    //             }
    //             num = 0;
    //             ave = 0;
    //             len = 1;
    //             positionA = 1;
    //         }
    //     }
    // }
}

//取消平均值算法，该方法用于在offset时，依然触发MDRS的情形使用
function cancelOffset(){
    console.log("调用了cancelOffset");
    //因为在offset方法中，只改变了2项，一个是dAfter,一个是r，所以只要把这两个改回来即可
    for(let i = 1;i<row;i++){
        for(let j = 0; j < direction ; j++){
            let x = getdBeforeAve(i,j,direction);
            //进入量取偶
            if(x%2 != 0){
                x= x+1;
            }
            setdAfter(i,j,direction,x);
            //x取偶后小时减少量
            let r = getd(i,j,direction) + getr(i-1,j,direction) - x;
            if(r > 0){
                setr(i,j,direction,r);
            }
            else{
                setr(i,j,direction,0);
            }
        }
    }
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
    //如果没选择扇区，告警，并结束本方法
    if(staticCap == 0){
        alert("数据错误：\n未选择想分析的扇区，无法确定通行能力值");
        return;
    }
    
    //获取数据
    getInfo();
    if(correct == false){
        return;
    }
    //精确正向计算
    calFirst();
    //取平均值计算
    //calSecond();
    calOffset();
    //检验流控后进入量及MDRS触发
    check();
    //对计算过程进行说明
    explain();
    setText();

}

//消除MDRS
function Button2(){
    //如果没选择扇区，告警，并结束本方法
    if(staticCap == 0){
        alert("数据错误：\n未选择想分析的扇区，无法确定通行能力值");
        return;
    }
    if(correct == false){
        return;
    }
    disMDRS();
    calFirst();
    calOffset();

    //calSecond();
    //检验流控后进入量及MDRS触发
    check();
    //对计算过程进行说明
    secondMd();
    explain();
    setText();
}


