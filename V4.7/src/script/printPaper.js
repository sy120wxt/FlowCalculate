
//创建表格方法，收到参数原表格有多少行（代表时间），原表格有个方向
function printTable(){
    fillPrint();
    console.log("printTable执行了");

    let flowAndCap = document.getElementById("flowAndCap");
    //如果存在子类，先移除子类
    if(flowAndCap.childNodes[0]){
        flowAndCap.removeChild(flowAndCap.childNodes[0]);
    }
    

    let table = document.createElement("table");
    table.id = "printTable";
    table.style.width = "100%";
    table.style.borderTopStyle = "none";
    flowAndCap.appendChild(table);
    
    console.log(D);
    console.log(d);
    
    
    //确定表格有几行几列，跟参数中应该是正好调转过来的
    //横表示时间轴，纵表示方向轴
    //6表示额外填写：说明(占2行)、措施豁免架次、扇区小时总架次、扇区动态通行能力值、流量较容量的差、扇区实际飞行架次
    let inrow = 7+direction;
    let incol = row;

    for(let i = 0;i < inrow ; i++){
        //新增行
        let x = table.insertRow(i);
        //新增列
        for(let j = 0 ; j < incol;j++){
            let y = x.insertCell(j);
            
            let p = document.createElement("p");
            p.id = "InR"+i+"C"+j;
            p.style.fontSize = "16px";
            p.style.height = "20px";
            //第一行内容
            if(i==0){
                if(j==0){
                    p.innerHTML = "方向";
                    y.rowSpan = "2";
                }
                if(j==1){
                    p.innerHTML = "流量";
                    y.colSpan = row -1;
                    p.style.textAlign = "center";
                    y.appendChild(p);
                    break;
                }
            }
            

            //时间
            if(i == 1){
                if(j ==0){
                    p.innerHTML = "";
                }
                else{
                    console.log("i=2ID："+"R"+j+"C0");
                    p.innerHTML = document.getElementById("R"+j+"C0").innerHTML;
                }
            }
            //各流控方向架次

            if(i >1 && i <= 1+direction){
                //首列
                if(j == 0){
                    console.log("i=3ID："+"R0C"+(i+2));
                    addDeleteBt(y);
                    
                    p.innerHTML = document.getElementById("R0C"+(i+2)).value;
                    p.style.display = "inline";
                }
                else{
                    console.log("d:"+j+","+(i+2))
                    p.innerHTML = getd(j,i-2,direction);
                    if(p.innerHTML == 0){
                        p.innerHTML = "";
                    }
                }
               
            }
            //措施豁免架次
            if(i == 2+direction){
                if(j == 0){
                    p.innerHTML = "措施豁免架次";
                }
                else{
                    p.innerHTML = getunRes(j);
                    if(p.innerHTML == 0){
                        p.innerHTML = "";
                    }
                }
            }
            //扇区小时总架次
            if(i == 3+direction){
                if(j == 0){
                    p.innerHTML = "扇区小时总架次";
                }
                else{
                    p.innerHTML = getD(j);
                    if(p.innerHTML == 0){
                        p.innerHTML = "";
                    }
                }
            }
            //扇区动态通行能力值
            if(i == 4+direction){
                p.style.height = "40px";
                //首列
                if(j == 0){
                    p.innerHTML = "动态通行能力";
                    p.style.verticalAlign = "center";
                }
                else{
                    p.innerHTML = document.getElementById("R"+j+"C9").innerHTML;
                    p.style.verticalAlign = "top";
                }
                
            }
            //流量较容量差
            if(i == 5 + direction){
                //首列
                if(j == 0){
                    p.innerHTML = "流量较容量差";
                }
                else{
                    p.innerHTML = document.getElementById("R"+j+"C8").innerHTML;
                }
                
            }
            //扇区实际飞行架次
            if(i == 6 +direction && j ==0){
                p.innerHTML = "扇区实际飞行架次";
            }

            y.appendChild(p);
        }
    }
    document.getElementById("InR1C0").parentNode.style.display = "none";
}

//设置一些内容的方法
function fillPrint(){
    let day = new Date();
    document.getElementById("time").innerHTML = day.getFullYear()+"年"+(day.getMonth()+1)+"月"+day.getDate()+"日";
    document.getElementById("a4-sector").innerHTML = document.getElementById("sector").value;
    document.getElementById("content").innerHTML = document.getElementById("text").innerHTML;
}

//打印方法
function startPrint(){
    document.getElementById("startPrint").style.display = "none";
    document.getElementById("cancelPrint").style.display = "none";
    document.getElementById("mainDiv").style.marginLeft = 0;
    let dbt = document.getElementsByClassName("deleteBt");
    for(let i = 0; i < dbt.length; i++){
        dbt[i].style.display = "none";
    }
    window.print();
    document.getElementById("startPrint").style.display = "inline";
    document.getElementById("cancelPrint").style.display = "inline";
    document.getElementById("a4-printArea").style.display = "none";
    document.getElementById("analys").style.display = "block";
    document.getElementById("mainDiv").style.marginLeft = "20%";
    for(let i = 0; i < dbt.length; i++){
        dbt[i].style.display = "inline";
    }
}
//取消方法
function cancelPrint(){
    document.getElementById("a4-printArea").style.display = "none";
    document.getElementById("analys").style.display = "block";
}

//点击组件修改内容方法
var changeid;
function clickToChange(nodeid){
    console.log("点击了");
    changeid = nodeid;
    openNode("fillInfo");
}

//打开文本输入窗口
function openNode(id){
    document.getElementById(id).style.display = "block";
    document.getElementById("fill-textArea").value = document.getElementById(changeid).innerHTML;
    document.getElementById("fill-textArea").focus();
}

//设定文本输入框为已拥有文本

//隐藏组件
function hideNode(id){
    document.getElementById(id).style.display = "none";
}


//修改内容确认按钮
function affirm_bt(textid,changeid,windowid){
    document.getElementById(changeid).innerHTML = document.getElementById(textid).value;
    document.getElementById(textid).value = "";
    hideNode(windowid);
}

//修改内容取消按钮
function cancel_bt(textid,windowid){
    document.getElementById(textid).value = "";
    hideNode(windowid);
}
let dRow;
//增加删除按钮
function addDeleteBt(node){
    let bt = document.createElement("button");
    // bt.style.width = "16px";
    // bt.style.maxWidth = "16px";
    bt.className = "deleteBt";
    bt.onclick = function(){showDelete(this)}; 
    node.appendChild(bt);
}

function showDelete(node){

    dRow = node.parentNode.parentNode.rowIndex;
    document.getElementById("deleteWindow").style.display = "block";

}

function hideDelete(){
    document.getElementById("deleteWindow").style.display = "none";
    dRow = undefined;
}

//删除警告
function delete_affirm(){
    document.getElementById("printTable").rows[dRow].style.display="none";
    hideDelete();
}

function delete_cancel(){
    hideDelete();
}