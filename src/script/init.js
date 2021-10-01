//定义各扇区静态容量
var sector = "";
var AR01C = 31;
var AR02C = 47;
var AR03C = 48;
var AR04C = 40;
var AR05C = 19;
var AR06C = 46;
var AR07C = 40;
var AR08C = 35;
var AR12C = 37;
var AR13C = 33;
var AR14C = 32;
var AR02_08C = 48;
var AR03_12C = 47;
var AR07_13C = 47;
var AR04_14C = 44;
var AR04_05_14C = 35;

//高低扇开放
var AR02L08H = AR02C +AR08C;
var AR03L12H = AR03C + AR12C;
var AR07L13H = AR07C+AR13C;
var AR04L14H = AR04C+ AR14C;


//传递扇区静态容量
var staticCap = 0;

//定义表格ROW和COLUMN数量
var row = 6;
var column = 10;
var direction = 3;//初始设定流量方向数量
var inCol = 7;//插入列的位置
var textArea = 7;//设定流控内容为第7列



//定义select扇区方法
function selectSector(id_sector,id_head,value){
    //console.log("运行了");
    switch (value) {
        case "noselect":
            document.getElementById(id_sector).innerHTML ="";
            document.getElementById(id_head).innerHTML = "选择要计算的扇区";
            break;
        case "AR01":
            document.getElementById(id_sector).innerHTML ="静态容量："+ AR01C;
            document.getElementById(id_head).innerHTML = "AR01";
            staticCap = AR01C;
            break;
        case "AR02":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR02C;
            document.getElementById(id_head).innerHTML = "AR02";
            staticCap = AR02C;
            break;
        case "AR03":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR03C;
            document.getElementById(id_head).innerHTML = "AR03";
            staticCap = AR03C;
            break;
        case "AR04":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR04C;
            document.getElementById(id_head).innerHTML = "AR04";
            staticCap = AR04C;
            break;
        case "AR05":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR05C;
            document.getElementById(id_head).innerHTML = "AR05";
            staticCap = AR05C;
            break;
        case "AR06":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR06C;
            document.getElementById(id_head).innerHTML = "AR06";
            staticCap = AR06C;
            break;
        case "AR07":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR07C;
            document.getElementById(id_head).innerHTML = "AR07";
            staticCap = AR07C;
            break;
            //合扇状态
        case "AR02_08C":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR02_08C;
            document.getElementById(id_head).innerHTML = "AR02_08C";
            staticCap = AR02_08C;
            break;
        case "AR03_12C":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR03_12C;
            document.getElementById(id_head).innerHTML = "AR03_12C";
            staticCap = AR03_12C;
            break;
        case "AR07_13C":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR07_13C;
            document.getElementById(id_head).innerHTML = "AR07_13C";
            staticCap = AR07_13C;
            break;
        case "AR04_14C":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR04_14C;
            document.getElementById(id_head).innerHTML = "AR04_14C";
            staticCap = AR04_14C;
            break;
            //以下是高低扇都开放时，高低扇在一起进行计算
        case "AR02L08H":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR02L08H;
            document.getElementById(id_head).innerHTML = "AR02L08H";
            staticCap = AR02L08H;
            break;
        case "AR03L12H":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR03L12H;
            document.getElementById(id_head).innerHTML = "AR03L12H";
            staticCap = AR03L12H;
            break;
        case "AR07L13H":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR07L13H;
            document.getElementById(id_head).innerHTML = "AR07L13H";
            staticCap = AR07L13H;
            break;
        case "AR04L14H":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR04L14H;
            document.getElementById(id_head).innerHTML = "AR04L14H";
            staticCap = AR04L14H;
            break;
        //以下是单独计算高扇时
        case "AR08":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR08C;
            document.getElementById(id_head).innerHTML = "AR08";
            staticCap = AR08C;
            break;
        case "AR12":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR12C;
            document.getElementById(id_head).innerHTML = "AR12";
            staticCap = AR12C;
            break;
        case "AR13":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR13C;
            document.getElementById(id_head).innerHTML = "AR13";
            staticCap = AR13C;
            break;
        case "AR14":
            document.getElementById(id_sector).innerHTML = "静态容量："+AR14C;
            document.getElementById(id_head).innerHTML = "AR14";
            staticCap = AR14C;
            break;
    }
    sector = value;
}
//初始创建表格
function createTable(tableid){
    let table = document.getElementById(tableid);
    for(let i = 1 ; i < row ; i++){
        let x = table.insertRow(i);
        for(let j = 0 ; j < column ; j++){
            
            let y = x.insertCell(j);
            y.id = "TR"+i+"C"+j;
            let input;
            
            //当设置流控内容那一列时，预计扇区进入量，MDRS值，单元格内放置text。
            if(j==0||j == 4+direction || j == 5+direction || j== 6 +direction){
                input = document.createElement("p");
                input.size = 20;
            }
            else{
                input = document.createElement("input");
                input.size = 3;
            }
            input.id = "R"+i+"C"+j;
            //在第二列加入功能，事件，根据输入值，修改第三列的动态容量
            if(j == 1){
                input.oninput = function(){
                    //console.log("改变了"+this.value);
                    document.getElementById("R"+ i + "C2").value = Math.round(staticCap*(100-this.value)/100);
                }
            }

            //在第三列加入功能，事件，输入值，修改第二列的通行能力下降值
            if(j == 2){
                input.oninput = function(){
                    //console.log("改变了");
                    document.getElementById("R"+ i + "C1").value = Math.round((1-this.value/staticCap)*10)*10;
                }
            }
            
            //input.value = input.id;
            y.appendChild(input);
            table.rows[0].cells[j].id = "TR0C"+j;
        }
    }
}
//表格增加行
function insertRow(tableid){

    let table = document.getElementById(tableid);
    let x = table.insertRow(row);
    for(let i = 0;i<column;i++){
        let y = x.insertCell(i);
        let input;
        if(i==0||i == 4+direction || i == 5+direction ||i==6+direction){
            input = document.createElement("p");
        }
        else{
            input = document.createElement("input");
        }
        input.id = "R"+row + "C"+i;
        input.size = 3;
        //input.value = input.id;
        y.appendChild(input);
    }
    row = row+1;

    changeTime("hour","minute");
    setCapClass();
}
//表格增加列
function insertColumn(tableid){
    let table = document.getElementById(tableid);

    for(i = 0 ; i < row ; i ++){
        for(j = column; j > inCol ; j--){
            let id = "R"+i+"C"+(j-1);
            let x = document.getElementById(id);
            x.id = "R"+ i+"C"+ j;
            //x.value = x.id;
        }
        let y = table.rows[i].insertCell(inCol);
        y.size = 5;
        let z;
        if(i == 0){
            z = document.createElement("textarea");
            z.cols = 5;
        }
        else{
            z = document.createElement("input");
            z.size = 5;
        }
        z.id = "R"+ i + "C" + inCol;
        //z.value = z.id;
        
        y.appendChild(z);
    }
    column = column+1;
    let newD = document.getElementById("R0C"+inCol);
    direction++;
    newD.placeholder = "输入流控方向" +direction;
    inCol++;
}
//创建时间选择列表
function createTime(){
    let x = document.getElementById("TR0C0");
    //console.log(x.id);
    let hour = document.createElement("select");
    hour.addEventListener("click",function(){changeTime(hour.id,minute.id)});
    hour.id = "hour";
    for(let i = 0 ; i < 24 ; i++){
        let h = document.createElement("option");
        h.value = i;
        h.text = i;
        hour.options.add(h);
    }
    let y = document.createElement("em");
    y.innerHTML = "时 ";
    x.appendChild(br());
    x.appendChild(hour);
    x.appendChild(y);
    let minute = document.createElement("select");
    minute.id = "minute";
    minute.addEventListener("click",function(){changeTime(hour.id,minute.id)});
    for(let i = 0; i < 4 ; i++){
        let m = document.createElement("option");
        m.value = 15*i;
        m.text = 15*i;
        minute.options.add(m);
    }
    let z = document.createElement("em");
    z.innerHTML = "分";
    x.appendChild(minute);
    x.appendChild(z);
}

//获取时间间隔
function getStep(){
    let step = document.getElementsByName("time");
    for(let i = 0; i < step.length;i++){
        if(step[i].checked){
            return step[i].value;
        }
    }
}
//点击改变时间单元格内容
function changeTime(hourId,minuteId){
    let hour = Number(document.getElementById(hourId).value);
    let minute = Number(document.getElementById(minuteId).value);
    let step = getStep();
    //console.log(step);

    for(i=1; i<row; i++){
        let cell = document.getElementById("R"+i+"C0");
        //console.log(cell.id);
        if(step == 60){
            cell.innerHTML = (hour + i -1) + ":00-" + (hour + i)+":00" ;
            //console.log(cell.value);
        }
        if(step == 15){
            let t = 15 * (i-1) +minute;
            let h = hour + Math.floor(t/60);
            let m = t%60;

            let t2 = 15 * i +minute;
            let h2 = hour + Math.floor(t2/60);
            let m2 = t2%60;
            cell.innerHTML = h + ":" + m + "-"+h2 + ":"+m2;
            //console.log(cell.value);
        }
    }
    let extraTime = document.createElement("p");
    extraTime.id = "R"+row+"C0";
    if (step == 60) {
        extraTime.innerHTML = (hour + row -1) + ":00-" + (hour + row) + ":00";
    }
    if (step == 15) {
        let t = 15 * (row-1) +minute;
        let h = hour + Math.floor(t/60);
        let m = t%60;

        let t2 = 15 * row +minute;
        let h2 = hour + Math.floor(t2/60);
        let m2 = t2%60;
        extraTime.innerHTML = h + ":"+m+ "-"+h2 + ":"+m2;
    }
}

//设定下拉框修改全部通行能力下降值
function capDown(){
    let select = document.getElementById("capDown");
    for(let i = 0 ; i < 10;i++){
        let opt =document.createElement("option");
        if(i == 0){
            let opt =document.createElement("option");
            opt.value = 0;
            opt.text = "请选择";
            select.options.add(opt);
        }
        if(i==3){
            let opt =document.createElement("option");
            opt.value = 25;
            opt.text = 25;
            //opt.className = "yellow";
            select.options.add(opt);
        }
        if(i == 8){
            let opt =document.createElement("option");
            opt.value = 75;
            opt.text = 75;
            //opt.className = "red";
            select.options.add(opt);
        }
        opt.value = i*10;
        opt.text = i*10 + "";
        //opt.className = setClass(opt.value);
        select.options.add(opt);
    }
    select.addEventListener("change",function(){setCap(this.value)});
}

//修改全部通行能力值
function setCap(value){
    for(let i = 1; i < row;i++){
        let cell = document.getElementById("R"+i+"C1");

        cell.value =value;
        //修改动态容量内容
        let cap = document.getElementById("R"+i+"C2");
        cap.value = Math.round(staticCap*(100 - value)/100);
    }
}

//使全部通行能力值可以动态修改classname
function setCapClass(){
    for(let i = 1; i < row;i++){
        let cell = document.getElementById("R"+i+"C1");
        cell.addEventListener("change",function(){cell.className = setClass(this.value)});
    }
}
//通过value值改变classname
function setClass(value){
    let cName = "";
    if(value<50&&value>=25){
        cName = "yellow";
        return cName;
    }
    else if(value<75&&value>=50){
        cName = "orange";
        return cName;
    }
    else if(value >=75){
        cName = "red";
        return cName;
    }
}

//创建空格
function br(){
    let br = document.createElement("br");
    return br;
}

//初始创建方法集合
function init(){
    createTable("table");
    createTime();
    capDown();
    //setCapClass();
}
var t1 = {
    "1":1,
    "2":2,
    "3":3
};
var t2 = {
    "4":4,
    "5":5,
    "6":6
}
var Test = {
    "t1":t1,
    "t2":t2
};

function test(){

}