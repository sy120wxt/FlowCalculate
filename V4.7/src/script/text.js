//定义网页id为text的内容，根据流控后进入架次填写
//定义流控开始时间的位置
var a = 0;
//定义有多少个需要发流控的时间段
var b = 0;
//计算思路：根据chao数据，和各方向的流控后小时进入量，来判断该方向该小时流控内容，然后判断下一小时是否与上一小时相同，如果相同继续记录下一格
//直至不同或读取到最后一格
let text = "";

//以数字规范流控内容
function formFlow(num){
    let t = "";

    //如果能被4整除
    if(num%4 == 0){
        t = "15分钟"+num/4+"架" + MIT(15,num/4);
        
    }
    //其他情况，即能被2整除
    else if(num%2 == 0){
        t = "30分钟"+num/2+"架" + MIT(30,num/2);
    }

    return t;
}

//以数字规范MIT内容
function MIT(sepration,num){
    //如果时间间隔是以15分钟为单位
    if(sepration == 15){
        switch(num){
            case 1:
                return "";
            break;

            case 2:
                return "，MIT50km";
            break;

            case 3:
                return "，MIT30km";
            break;

            case 4:
                return "，MIT20km";
                break;

            case 5:
                return "，MIT20km";
                break;
            default:
                return "";
                break;
        }
    }
    //如果时间间隔是以30分钟为单位
    if(sepration == 30){
        switch(num){
            case 1:
                return "";
                break;
            case 2:
                return "，MIT100km";
                break;
            case 3:
                return "，MIT60km";
                break;
            case 4:
                return "，MIT40km";
                break;
            case 5:
                return "，MIT40km";
                break;
            case 6:
                return "，MIT30km";
                break;
            case 7:
                return "，MIT20km";
                break;
            case 8:
                return "，MIT20km";
                break;
            case 9:
                return "，MIT20km";
                break;
            case 10:
                return "，MIT15km";
                break;
            default:
                return "";
                break;                                                                                                                                                        
        }
    }
}

function setText(){
    //a表示开始时间点，b表示结束时间点
    a = getValue("hour");
    b = 0;
    text = "";
    for(let j = 0 ; j < direction ; j++){
        console.log("j:"+j);
        //设置第j方向的文本
        let dt = document.getElementById("R0C"+(4+j)).value + "";
        
        if(dt == ""){
            dt = "方向"+(j+1);
        }
        let dtext = dt+"：";
        //获取该方向第一小时进入量，以防触发第一小时与之前的值不同
        let comein = getdAfter(1,j,direction);
        for(let i = 1 ; i < row ; i++){
            console.log("i:"+i);
            console.log("进扇量："+getdAfter(i,j,direction));
            console.log("comein:"+ comein);

            //如果小时进入量与上一小时相同，b+1，a不变
            if(getdAfter(i,j,direction) == comein){
                // if(comein != 0){
                //     b++;
                // }
                b++;
            }
                //如果小时进入量与上一小时不同，且b不为0，表示从a到a+b,小时进入量为comein。a=i，b清零，comein等于最新的值
            else{
                b = getValue("hour") + i - 1;
                if(comein != 0){
                    dtext += "从"+a +":00到" + b+":00，"+formFlow(comein) ;
                }
                
                // if( b != 0){
                //     dtext += "从"+(getValue("hour")+a) +":00到" + (getValue("hour")+a+b)+":00，1小时"+comein +"架 ";
                        
                //     b=0;
                        
                // }
                //如果与上一小时不同，且b为0，表示之前进入量都是0，没有流控，需要把a=i，b=1，comein更新
                
                comein = getdAfter(i,j,direction);
                a = b;
                b = 0;
            }
            //如果是最后一行，则判断B是不是等于0，如果不为0，从a 到 a+b发流控，并数据复原。
            if(i == row-1){
                b = getValue("hour") + i;
                if(comein != 0){
                    dtext += "从"+a +":00到" + b+":00，"+formFlow(comein);
                }

                // if( b != 0){
                //     dtext += "从"+(getValue("hour")+a) +":00到" + (getValue("hour")+a+b)+":00，1小时"+comein +"架 ";
                    
                    
                // }
                // //如果一个方向到最后一行时a=0，b=0，表示该方向一直都没有流控
                // if( a == 0 && b ==0){
                //     dtext = "";
                // }
                a =getValue("hour");
                b=0;
            }
            
        }
        text += dtext;
        text += "</br>";
    }
    document.getElementById("text").innerHTML = text;
}