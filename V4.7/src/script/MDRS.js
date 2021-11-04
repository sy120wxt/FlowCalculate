//本方法用来读取MDRS值，当MDRS大于25时，先计算本小时流量是多少，用23%计算通行能力应为多少，
//以此对各方向进入量进行重新计算
//本质其实就调整各小时的通行能力

// MDRS计算
// 常量：
// MDRS边缘值：23%
// 延误架次边缘值：4
// 1. 判断该小时是否触发MDRS：
// 使用数据计算是否触发，每一行都要计算，以便更新
// （流量-通行能力）/流量
// 2. 如果触发了MDRS：
// 即M的值大于等于0.25
// - 如果触发了，先读取上一小时的总延误量看是否大于等于4，判断上一小时总延误量如果减少4个，本小时是否还触发MDRS，并将上一小时的通行能力值提高4
// - 如果本小时总架次减少4依然触发MDRS，则计算本小时总架次减少4个后，总架次×（1-23%）即为该小时的通行能力值，更新通行能力值、总减少量、各方向减少量、各方向进入量
// - 依次计算，直至把所有小时都计算完成
// 3. 如果没触发MDRS：
// 则不需要做更新
//以上作废

//1.判断是否触发MDRS
//2.求本小时和上小时应该增加的架次
//x = (0.77f - c)/1.77向上取整
//3.x与r（i-1）作比较，算出上小时和c和r，本小时的c和r

//先定义MDRS用百分之多少去计算
var radio = 0.23;

let aggF = {};
function setaggF(i,value){
    aggF[i.toString()] = value;
}
function getaggF(i){
    return aggF[i.toString()];
}


function disMDRS(){
    aggF = new Object();
    setaggF(0,0);
    for(let i = 1; i < row; i++){
        //上一小时延误量
        let Rlast = getR(i-1);
        console.log("MDRS--Rlast:"+Rlast);
        //本小时总进入量
        let F = getD(i) + Rlast;
        console.log("MDRS--F"+F);
        
        setaggF(i,F);

        //判断本小时是否超量，没超量就结束本行
        if(F < getC(i)){
            continue;
        }
        //本小时MDRS值
        let MD = Math.round((F - getC(i))/F*1000)/1000;
        console.log("MDRS--MD:"+MD);
        if(MD < 0.25){
            setR(i,F-getC(i));
            continue;
        }
        //如果MDRS值大于25%
        if(MD >= 0.25){
            //以下为平衡流量算法
            //算出本小时与上一小时应发布的通行能力值
            let capBalan = Math.ceil((getD(i)+getaggF(i-1))*(1-radio)/(2-radio));
            console.log("capBalan:"+capBalan);
            //检查上一小时流量是否小于新算的通行能力,小于的话设置
            //上一小时通行能力等于流量，减少量等于0，流量不变
            //本小时通行能力等于原始进入量*（1-radio）取整，流量等于原始进入量，减少量等于流量-容量，
            if(getaggF(i-1) < capBalan){
                setC(i-1,getaggF(i-1));
                setR(i-1,0);
                setaggF(i,getD(i));
                setC(i,Math.ceil(getD(i)*(1-radio)));
                setR(i,getD(i) - getC(i));
            }
            //如果上一小时流量大于等于新算的通行能力，
            //上一小时通行能力变为最新的，上一小时减少量等于上一小时流量-最新容量
            //本小时通行能力变为最新的，本小时流量变为本小时原始进入量+上一小时减少量，本小时减少量变为最新的流量-最新的容量
            if(getaggF(i-1) >= capBalan){
                //如果上一小时通行能力比新算的通行能力大，则上一小时通行能力应保持不变
                //否则，上一小时通行能力等于新的通行能力
                if(getC(i-1) < capBalan){
                    setC(i-1,capBalan);
                    setR(i-1,getaggF(i-1)-capBalan);
                }   
                setC(i,capBalan);
                setaggF(i,getD(i)+getR(i-1));
                setR(i,getaggF(i)-getC(i));
            }


            //以下为调整应减少值算法
            // let adjust = Math.ceil(((1-radio)*F - getC(i))/(2-radio));
            // if(adjust >= Rlast){
            //     setC(i-1,getC(i-1) + Rlast);
            //     setR(i-1,0);
            //     F = getD(i);
            //     let C = Math.ceil(F*0.77);
            //     setC(i,C);
            //     setR(i,F - C);
            // }
            // if(adjust < Rlast){
            //     setC(i-1,getC(i-1) + adjust);
            //     setR(i-1,Rlast - adjust);
            //     F = getD(i) + Rlast - adjust;
            //     let C = Math.ceil(F*0.77);
            //     setC(i,C);
            //     setR(i,F - C);
            // }
        }
    }
    

    //按阶段，取各时间阶段的最大容量值

    //设定原本容量BC
    let BC = getValue("R1C2");
    //设定容量最大值，为扇区动态容量
    let maxC = BC;
    
    //设定初始位置
    let start = 1;
    //设定变更长度
    let len = 0;
    console.log("C值：");
    console.log(C);
    for(let i = 1 ; i < row; i++){
        
        if(getC(i) > BC && getC(i-1)< BC){
            for(let j = 0 ; j < len ; j++){
                setC(j+start,maxC);
            }
            start = i;
            len = 1;
            maxC = BC;
        }
        else{
            len ++;

        }

        //计算容量，大于最大容量，更新最大容量
        if(getC(i) > maxC){
            maxC = getC(i);
        }
        if(i==row-1 && len != 0){
            for(let j = 0 ; j < len ; j++){
                setC(j+start,maxC);
            }
            start = 1;
            len = 0;
            maxC = BC;
        }
    }
}

//方法开始
// function disMDRS(row){
//     let MDRS = getM(row);
//     console.log("MDRS:"+MDRS);

//     //如果触发MDRS，获取小时总进入量（表中数据+上一小时总减少量）
//     if(MDRS >= 0.25){
//         //本小时总进扇量
//         let comein = getD(row)+getR(row-1);
//         console.log("小时总进扇量："+comein);
//         //如果不触发MDRS，需要本小时总进扇量，即新的通行能力
//         let newCap = Math.ceil(comein*(1-radio));
//         console.log("新通行能力："+newCap);
//         //计算使用新的通行能力，本小时减少架次，然后更新本小时的总减少架次
//         let newR = comein - newCap;
//         setR(row,newR);


//         setC(row,newCap);
//         console.log("C");
//         console.log(C);
//     }
// }