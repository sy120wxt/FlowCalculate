//正向计算总则
// 1.占用量S = 受限存在+不受限存在+总进入量
//         = 上一小时，受限方向流控后的总进入量Dn*平均飞行时间/60  + （流控前占用量-流控前进入量）-上一小时流控前受限方向进入量*平均飞行时间/60 + 流控前进入量+上一小时总减少量R
// 2.本小时总减少量R = 占用量S - 动态容量
// 3.各方向进入量dn = 本小时进入量 + 上小时减少量rn
// 4.各方向减少量rn=R*dn/(d1+d2+...+dn)
// 5.各方向流控后小时进入量in = dn - rn

//各扇区平均飞行时间
var AR01T = 22;
var AR02T = 10;
var AR03T = 10;
var AR04T = 13;
var AR05T = 30;
var AR06T = 12;
var AR07T = 25;


//全部填写数据
var vars = {};

//占用量S
var S ={};
//动态容量
var C = {};
//各受限方向总进入量D，本小时受流控之前
var D = {};
//总减少量R
var R = {};
//各方向预测进入量，本小时受流控之前
var d = {};
//各方向减少量r
var r = {};
//各方向为满足不超量，应该进入量i
var IN = {};
//按照各方向进入量平均值后发布流控，流控后各方向真实进入量
var comein = {};

//每个方向的平均进入量
var average = {};

//每个小时是否流控,1为控，0为不控
var ctrl = {};

//设置一个变量，默认为0，表示不用均匀，一旦为1，表示需要均匀一下
var homo = 0;


//开始计算各方向的第i小时流控后的进入量
function getI(hour,sector){
    //上一小时的受限方向流控后总进入量
    let comeinn_1 = 0;
    for(let i = 0;i< direction;i++){
        comeinn_1 = comeinn_1 + getVV("IN",hour-1,i);
    }
    console.log(comeinn_1);
    //上一小时流控前 受限方向的总进入量
    let c = 0;
    for(let i =0;i<direction;i++){
        c = c + getVars(hour-1,i+4);
    }
    console.log(c);
    //占用量
    let unResS = getVars(hour,2)-getVars(hour,3)-c*getSectorTime(sector)/60;
    if (unResS < 0) {
        unResS = 0;
    }
    let Sn = comeinn_1*getSectorTime(sector)/60 + unResS + getVars(hour,3)+getV("R",(hour-1));
    //如果上一小时没有流控，占用量应等于表格所填占用量
    if (getV("ctrl",hour-1) == 0) {
        Sn = getVars(hour,2);
    }
    console.log(comeinn_1*getSectorTime(sector)/60);
    console.log(getVars(hour,2)-getVars(hour,3));
    console.log(getVars(hour,3));
    console.log(getV("R",(hour-1)));
    console.log(Sn);
    //储存占用量
    S["R"+hour] = Sn;
    console.log(S);

    //获取动态容量 Cn = 静态容量*（1-通行能力下降值）
    let Cn = staticCap*(100-getVars(hour,1))/100;
    //储存动态容量
    C["R"+hour] = Cn;
    console.log(C);
    
    //各方向进入量 = 本小时进入量+上一小时延误量
    let Dn = 0;
    for(let i = 0; i < direction;i++){
        let dn = getVars(hour,i+4)+getVV("r",hour-1,i);
        d["R"+hour+"D"+i] = dn;
        Dn = Dn +dn;
    }
    D["R"+hour] = Dn;
    console.log(D);
    console.log(d);

    //占用量和动态容量对比，计算小时总减少量
    let Rn = 0;
    ctrl["R"+hour] = 0;
    if(Sn > Cn){
        Rn = Sn - Cn;
        ctrl["R"+hour] = 1;
    }
    if(Rn > Dn){
        Rn = Dn;
    }
    //储存总减少量
    R["R"+hour] = Rn;
    console.log(R);
    //各方向减少量 = 总减少量R*各方向比例
    for(let i = 0;i<direction ; i++){
        let rn = 0;
        if(Dn !=0){
            rn = Rn * getVV("d",hour,i)/Dn;
        }
        r["R"+hour+"D"+i] = rn;
    }
    console.log(r);
    //各方向每小时应该进入量i

    //text为每小时流控内容
    let txt = "";
    for(let i = 0;i<direction;i++){
        let i_n = 0;
        i_n = getVV("d",hour,i) - getVV("r",hour,i);
        if(i_n < 0){
            i_n = 0;
        }
        
        IN["R"+hour+"D"+i] = i_n;

        let dText = document.getElementById("R0C"+(4+i)).value;
        if(dText == ""){
            dText = "方向"+(i+1);
        }

        //设置每小时进入量文本
        if(Sn > Cn){
            txt = txt + text(dText,i_n,"","",hour,i)+"\r";
        }
        else{
            txt = "";
            text(dText,i_n,"","",hour,i);
        }
        
    }
    console.log(S);
    console.log(IN);
    document.getElementById("R"+hour+"C"+(direction+4)).innerHTML = txt;
    console.log(realComein);
    //如果该小时不发流控，则将各方向内容清零
}

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
    }
}

//获取表格数值
function getAllValue(){
    for(let j = 0;j<column;j++){
        let name = "R0C"+j;
        vars[name] = 0;
    }
    for(let i = 1; i < row ; i++){
        for(let j = 0 ; j <column ; j++){
            let name = "R"+i+"C"+j;
            vars[name] = getValue(name);
            
        }
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
function getVars(i,j){
    let k = eval("vars.R"+i+"C"+j);
    return k;
}

//正向精确计算法
function calculate(){
    getAllValue();
    for(let hour = 1; hour < row ; hour++){
        getI(hour,sector);
    }
    for(let hour = 1; hour< row; hour++){
        //上小时各受限方向受限后进入量的和
        let a = 0;
        //本小时受限方向受限后进入量的和
        let b = 0;
        //本小时受限方向受限前进入量的和
        let c = 0;
        for(let d = 0; d < direction; d++){
            a = a + getVV("realComein",hour-1,d);
            b = b + getVV("realComein",hour,d);
            c = c + getVars(hour,4+d);
            console.log("a:"+a);
            console.log("b:"+b);
            console.log("c:"+c);
        }
        console.log(getSectorTime(sector));
        console.log(getVars(hour,2)-getVars(hour,3));
        console.log(getV("D",hour-1));
        console.log(getVars(hour,3)-c);
        let d = checkS(a,getSectorTime(sector),getVars(hour,2)-getVars(hour,3),getV("D",hour-1),b,getVars(hour,3),c);
        cS["R"+hour]=d;
        //计算通行能力下降比
        let e = Math.round((1 - d/staticCap)*100) + "%";
        //如果该小时流控了就把计算后的占用量打出来，否则不打
        if(getV("ctrl",hour) == 1){
            document.getElementById("R"+hour+"C"+(5+direction)).value = d;
            document.getElementById("R"+hour+"C"+(6+direction)).value = e;
        }
        
        console.log(cS);
    }
}



//平均计算法
//遇到0,记录0的位置、不含0之前的平均数
function aver(){
    let aver = 0;
    let a = 0;
    let t = "";

    console.log(row);
    for(let j = 0;j<direction;j++){
        for(let i = 1;i<row;i++){
            console.log("i:"+i);
            console.log("a:"+a);
            let b = i;
            //如果该小时有流控
            if (getV("ctrl",i) == 1) {
                aver = aver + getVV("IN",i,j);
                console.log(aver);
                if (i == row -1) {
                    b = b+1;
                    
                    aver = aver/(b-a-1);
                    console.log(aver);
                    for(let ii = a+1; ii< b ; ii++){
                        average["R"+ii+"D"+j] = aver;
                    }
                    average["R"+i +"D"+j] = 0;
                    t = t + text(document.getElementById("R0C"+(j+4)).value,aver,document.getElementById("R"+(a+1)+"C0").value,document.getElementById("R"+b+"C0").value);
                    a = 0;
                    aver = 0;
                }
                }
            if(getV("ctrl",i) == 0){
                if (b-a-1 == 0) {
                    aver = 0;
                }
                else{aver = aver/(b-a-1);}
                for(let ii = a+1; ii< b ; ii++){
                    average["R"+ii+"D"+j] = aver;
                }
                average["R"+i +"D"+j] = 0;
                console.log(a+1);
                let aID = "R"+(a+1)+"C0";
                let bID = "R"+b+"C0";
                console.log(aID);
                let timeA = document.getElementById(aID).value;
                let timeB = document.getElementById(bID).value;

                t = t + text(document.getElementById("R0C"+(j+4)).value,aver,timeA,timeB);
                if (i == row-1) {
                    a = 0;
                }
                else{a = i}

                aver = 0;
            }
            
        }
    }
    document.getElementById("text").innerHTML = t;
    console.log(average);
}
