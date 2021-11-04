
//创建表格方法，收到参数原表格有多少行（代表时间），原表格有个方向
function printTable(row,direction){
    console.log("printTable执行了");
    let table = document.getElementById("flowAndCap");

    console.log(D);
    console.log(d);
    console.log(pArr[0]);
    
    //确定表格有几行几列，跟参数中应该是正好调转过来的
    //横表示时间轴，纵表示方向轴
    //6表示额外填写：说明(占2行)、措施豁免架次、扇区小时总架次、扇区动态通行能力值、流量较容量的差、扇区实际飞行架次
    let inrow = 7+direction;
    let incol = 1+row;

    for(let i = 0;i < inrow ; i++){
        //新增行
        let x = table.insertRow(i);
        //新增列
        for(let j = 0 ; j < incol;j++){
            let y = x.insertCell(j);
            let p = document.createElement("p");
            p.id = "InR"+i+"C"+j;

            //第一行内容
            if(i==0){
                if(j==0){
                    p.innerHTML = "方向";
                }
                if(j==1){
                    p.innerHTML = "流量";
                }
            }
            if(i == 1&&j==0){
                p.innerHTML = "";
            }
            //时间
            if(i == 2 && j > 0){
                p.innerHTML = "";
            }
            //各流控方向架次
            if(i >2 && i <= 2+direction&&j>0){
                //p.innerHTML = getd(j,i+1,direction);
                p.innerHTML = ppp;
            }
            //措施豁免架次
            if(i == 3+direction){
                p.innerHTML = "";
            }
            //扇区小时总架次
            if(i == 4+direction && j >0){
                //p.innerHTML = getD(j);
            }
            //扇区动态通行能力值
            if(i == 5+direction && j > 0){
                p.innerHTML = "";
            }
            //流量较容量差
            if(i == 6 + direction && j > 0){
                p.innerHTML = "";
            }
            //扇区实际飞行架次
            if(i == 7 +direction && j ==0){
                p.innerHTML = "扇区实际飞行架次";
            }

            y.appendChild(p);
        }
    }
}

