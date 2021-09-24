//本方法用来写出计算解析过程，用以检查及复盘
let ex = "";

function explain(){
    ex = "";
    //以下为原始计算数据说明
    for(let i = 1; i < row ; i++){
        let chaorow = chao[i.toString()];
        console.log("chaorow:"+chaorow);
        let Drow = getD(i) + getRBeforeAve(i-1);
        if(chaorow == true){
            
            let RrowActraul = getRBeforeAve(i);
            let Crow = getC(i);
            let discount = Math.round((1 - Crow/staticCap)*100) +"%";
            ex = ex + "</br></br>第" + i + "小时总进入量为："+Drow +",";
            //如果上一小时有减少量，进行说明
            if(getRBeforeAve(i-1)>0){
                ex = ex + "，其中包括上一小时延误的总架次："+getRBeforeAve(i-1)+"架次，"
            }
            ex = ex + "通行能力为："+ Crow+",";
            ex = ex +"通行能力下降"+discount+",";
            ex = ex + "该小时扇区应减少架次为："+ RrowActraul;
            
            
            //获取各方向流控后进入量、减少量
            for(let j = 0;j<direction ; j++){
                ex = ex + "</br>";

                //设置第j方向的文本
                let dt = document.getElementById("R0C"+(4+j)).value + "";
                
                if(dt == ""){
                    dt = "方向"+(j+1);
                }
                console.log("dt:"+dt);
                //为0表示不受限，不用说明
                if(getdAfter(i,j,direction) != 0){
                    ex = ex + "流控后，第"+i +"小时，"+dt+"小时进入量为："+ getdBeforeAve(i,j,direction);
                }
                
                //各小时减少量应为小时原本进入量+上一小时减少量-流控后进入量，如果小于0则取0
                let rAfter = getd(i,j,direction) + getrBeforeAve(i-1,j,direction) - getdBeforeAve(i,j,direction);
                if(rAfter < 0){
                    rAfter = 0;
                }
                if(getd(i,j,direction) != 0){
                    ex = ex + "，小时减少量为："+ rAfter;
                }

                
                
            }
        }
        else{
            ex = ex + "</br></br>第"+ i +"小时总进入量为"+Drow+"，不超量，不用发布流控";
        }
        
    }
    
    //以下为取平均值之后的数据说明
    ex += "</br>将各方向流控取平均值后，得到以下结果</br>"
    for(let i = 1; i < row ; i++){
        let chaorow = chao[i.toString()];
        console.log("chaorow:"+chaorow);
        if(chaorow == true){
            let Drow = getD(i) + getR(i-1);
            let RrowActraul = getR(i);
            let Crow = getC(i);
            let discount = Math.round((1 - Crow/staticCap)*100) +"%";
            ex = ex + "</br></br>第" + i + "小时总进入量为："+Drow +",";
            //如果上一小时有减少量，进行说明
            if(getR(i-1)>0){
                ex = ex + "，其中包括上一小时延误的总架次："+getR(i-1)+"架次，"
            }
            ex = ex + "通行能力为："+ Crow+",";
            ex = ex +"通行能力下降"+discount+",";
            ex = ex + "该小时扇区应减少架次为："+ RrowActraul;
            
            
            //获取各方向流控后进入量、减少量
            for(let j = 0;j<direction ; j++){
                ex = ex + "</br>";

                //设置第j方向的文本
                let dt = document.getElementById("R0C"+(4+j)).value + "";
                
                if(dt == ""){
                    dt = "方向"+(j+1);
                }
                console.log("dt:"+dt);
                //为0表示不受限，不用说明
                if(getdAfter(i,j,direction) != 0){
                    ex = ex + "流控后，第"+i +"小时，"+dt+"小时进入量为："+ getdAfter(i,j,direction);
                }
                
                //各小时减少量应为小时原本进入量+上一小时减少量-流控后进入量，如果小于0则取0
                let rAfter = getd(i,j,direction) + getr(i-1,j,direction) - getdAfter(i,j,direction);
                if(rAfter < 0){
                    rAfter = 0;
                }
                if(getd(i,j,direction) != 0){
                    ex = ex + "，小时减少量为："+ rAfter;
                }

                
                
            }
        }
        else{
            ex = ex + "</br></br>第"+ i +"小时不超量，不用发布流控";
        }
        
    }

    document.getElementById("explain").innerHTML = ex;
}