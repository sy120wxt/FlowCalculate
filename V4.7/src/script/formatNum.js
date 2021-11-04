//本方法用来规范小时进入量的规范处理
//目前只采用取偶的方式，即如果不能被2整除，则加1。
function format(num){
    if(num%2 != 0){
        num = num+1;   
    }
    return num;
}