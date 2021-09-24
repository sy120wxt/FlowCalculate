//本方法用来读取MDRS值，当MDRS大于25时，先计算本小时流量是多少，用23%计算通行能力应为多少，
//以此对各方向进入量进行重新计算
//本质其实就调整各小时的通行能力

//先定义MDRS用百分之多少去计算
var radio = 0.23;

//方法开始
function disMDRS(row){
    let MDRS = getM(row);
    console.log("MDRS:"+MDRS);

    //如果触发MDRS，获取小时总进入量（表中数据+上一小时总减少量）
    if(MDRS >= 0.25){
        //本小时总进扇量
        let comein = getD(row)+getR(row-1);
        console.log("小时总进扇量："+comein);
        //如果不触发MDRS，需要本小时总进扇量，即新的通行能力
        let newCap = Math.ceil(comein*(1-radio));
        console.log("新通行能力："+newCap);
        //计算使用新的通行能力，本小时减少架次，然后更新本小时的总减少架次
        let newR = comein - newCap;
        setR(row,newR);


        setC(row,newCap);
        console.log("C");
        console.log(C);
    }
}