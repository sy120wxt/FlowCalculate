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

//先定义MDRS用百分之多少去计算
var radio = 0.23;
var adjust = 4;
var compare = 4;

function disMDRS(row){
    //上一小时延误量
    let Rlast = getR(row-1);
    console.log("MDRS--Rlast:"+Rlast);
    //本小时总进入量
    let F = getD(row) + Rlast;
    console.log("MDRS--F"+F);

    //判断本小时是否超量，没超量就结束本行
    if(F <= getC(row)){
        return;
    }
    //本小时MDRS值
    let MD = Math.round((F - getC(row))/F*1000)/1000;
    console.log("MDRS--MD:"+MD);
    if(MD < 0.25){
        setR(row,F-getC(row));
        return;
    }
    //如果MDRS值大于25%
    if(MD >= 0.25){
        //先判断流量的77%-通行能力 除以2，是否小于等于compare，目的是与上一小时平分应增加的架次数，但如果大于compare，上一小时最多只能多进4个
        //设置4个的门槛是为了防止上一小时进入量过多，但可以考虑浮动该数值

        //先判断上一小时总减少量是多少，然后这一小时如果不触发MDRS的值，减少量应为多少
        //如果本小时减少量多，则让上一小时多进adjust个
        let minus = F - getC(row) - Rlast;
        if(minus >= compare){
            //判断上一小时延误量是否大于等于adjust值，如果大于，判断本小时减去adjust值后是否还触发
            if(Rlast >= adjust){
                //总进入量减少adjust架
                F = F - adjust;
                //mdrs值根据新的F进行重新计算
                MD = Math.round((F - getC(row))/F*1000)/1000;
                //上一小时通行能力值更新
                setC(row-1,getC(row-1)+adjust);
                //本小时MDRS值更新
                //setM(row,MD);
                //如果MD小于25%，则不需要继续计算，本次函数结束
                if(MD < 0.25){               
                    return;
                }
            }
        }
        
        //如果MD依然大于等于25%或上一小时减少量没达到adjust值，则计算本小时通行能力应为多少，更新本小时总减少量
        let cap = Math.ceil(F*(1-radio));
        console.log("MDRS--CAP:"+cap);
        setC(row,cap);
        setR(row,F-cap);
        
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