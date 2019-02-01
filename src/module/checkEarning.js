var xlsx = require('node-xlsx');
var fs = require('fs');
 
const FILDNAME="税金收入核对表.xlsx";

var checkEarning={

/**
 * 税金收入核对功能
 */
getAllDifference:(data)=>{
    
    var earnData=data[0].data;  //取得Sheet1当中的所有数据
    //console.log(earnData);
    var sum=0.0;


    //获取 该凭证下总金额  和  税单中的 收入金额
    earnData.forEach(element => {
        sum=0.0;
        earnData.forEach(item=>{
            if(element[0] instanceof String){

            }else{
                if(element[0]==item[0]){
                    sum+=item[1];
                }
            }
        });
        element[2]=sum;
        if(element[4]!=null&&element[5]!=null){
            element[6]=element[4]/element[5];
        }
    });

    //将税单凭证和 收入金额计算出的和(该税单下总收入金额)  存入 一个二维数组 itemArray
    var length=earnData.length;
    var itemArray=[[],[]];//核对数组 0、税单凭证号，1、该税单应交金额
    for(var i=0;i<length;i++){
       var earnId = earnData[i][3]; //凭证号
       var earnMoney=earnData[i][6]; //凭证单笔价格
       var index1 = itemArray[0].indexOf(earnId);
       if(earnId!=""&&index1<0){
           itemArray[0].push(earnId);
           itemArray[1].push(earnMoney);
       }else if(earnId!=""){
           itemArray[0][index1] = "re" + itemArray[0][index1];
           itemArray[0].push(earnId);
           itemArray[1].push(itemArray[1][index1]+earnMoney);
       }
    }

    //获取每一项凭证的差值
    var index=-1;
    earnData.forEach(item=>{
        index=itemArray[0].indexOf(item[0]);
        console.log("index:"+index);
        console.log("id:"+item[0]);
        if(item[0]!=""&&index>=0){
            item[8]=item[2] - itemArray[1][index];
            earnData[index][7] = "此税单凭证号已被核对";
        }else if(item[0]!=""){
            item[8]=item[2];
        }
        
    })
    //console.log(earnData);
    earnData[0]=['收入凭证','收入金额','该凭证下总金额','税单凭证号','应交税费','税率','收入金额','','差额'];
    data[0].data=earnData;
    return data;
},

/**
 * 将数据回写到Excel表格当中
 * @param {输入的表格数据} jsonData 
 * @param {文件生成的路径} path 
 */
writeExcel:function(jsonData,path){
    console.log("weiteExcel():"+jsonData[0].data[0]+"-"+path);
    var file = xlsx.build(jsonData);
    fs.writeFileSync(path,file);
},

/**
 * 增值税核对主功能
 * @param {需要核对的数据} data 
 */
taxCheck:function(data){

    var earnData=data[0].data;
    // console.log(earnData);

    let firstDataArray=[[],[]];//发票项数组
    let lastDataArry=[[],[],[]];//税金项数组  1、发票号 2、税的金额 3、是否被核对过

    //循环获取 发票项数组  和  税金项数组
    for (let index = 1; index < earnData.length; index++) {
        const element = earnData[index];

        //循环中获取 发票号-金额  项目数组
        if(this.numberType(element[0])==3){
            let kk=this.isInArray(element[0],firstDataArray[0]);
            if(kk<0){
                firstDataArray[0].push(element[0]+"");
                firstDataArray[1].push(Number(element[1]));
            }else{
                // console.log(kk+'-'+firstDataArray[0][kk]);
                firstDataArray[1][kk]+=Number(element[1]);           
            }     

        }

        //循环中获取 增值税发票号-出项金额 项目数组
        if(element[2]!=''&&element[2]!=undefined){
            lastDataArry[0].push(element[2]+"");
            lastDataArry[1].push(Number(element[3]));
            lastDataArry[2].push(false);
        }
    }

    // console.log(firstDataArray);
    console.log("lastDataArry[0]:"+lastDataArry[0]);
    //从第二行起 对每一个第一项 与税金组作对比
    for (let index = 1; index < earnData.length; index++) {
        const element = earnData[index];

        switch(this.numberType(element[0])){
            case 1:// 斜杠分割的
                var a=element[0].toString().split("/");
                a=this.getSplitArray(a);
                var firstPrice=Number(element[1]);   //第一项金额
                var lastPrice = 0;
                for(var i in a){
                    var aim=Number(a[i])+"";
                    var mi=lastDataArry[0].indexOf(aim)  //获取每一个发票号 在税金中对应的价格的索引
                    if(mi>=0){
                        lastPrice+=lastDataArry[1][mi];
                        lastDataArry[2][mi]=true;
                    }
                }
                if(Math.abs(firstPrice-lastPrice)<0.00001){
                    earnData[index][4]="核对成功！";
                }else{
                    earnData[index][4]=firstPrice+"--"+lastPrice;
                }

            break;

            case 2:// - 分割
            var a=element[0].toString().split("-");
                a=this.getListArray(a);
                var firstPrice=Number(element[1]);   //第一项金额
                var lastPrice = 0;
                for(var i in a){
                    var aim=Number(a[i])+"";
                    var mi=lastDataArry[0].indexOf(aim)  //获取每一个发票号 在税金中对应的价格的索引
                    if(mi>=0){
                        lastPrice+=lastDataArry[1][mi];
                        lastDataArry[2][mi]=true;
                    }
                }
                if(Math.abs(firstPrice-lastPrice)<0.00001){
                    earnData[index][4]="核对成功！";
                }else{
                    earnData[index][4]=firstPrice+"--"+lastPrice;
                }

            break;

            case 3://单独的
                var firstPrice=Number(element[1]);   //第一项金额
                var lastPrice = 0;
                var aim=Number(element[0])+"";
                var mi=lastDataArry[0].indexOf(aim)  //获取每一个发票号 在税金中对应的价格的索引
                if(mi>=0){
                    lastPrice+=lastDataArry[1][mi];
                    lastDataArry[2][mi]=true;
                }
                if(Math.abs(firstPrice-lastPrice)<0.00001){
                    earnData[index][4]="核对成功！";
                }else{
                    earnData[index][4]=firstPrice+"--"+lastPrice;
                }
            break;

        }
        
    }

    //循环判断每一项 增值税发票号 是否都被核对过了 确定 有增值税 但是没有发票号码的
    for(var i = 0;i<lastDataArry[0].length;i++){
        if(!lastDataArry[2][i]){
            earnData[i][5]="此项增值税发票号没有对应的发票号码！";
        }
    }


    //返回
    data[0].data=earnData;
    return data;


},

isInArray:function(num1,array1){
    // console.log(num1+'::::'+array1);
    return array1.indexOf(num1);
},

numberType:function(num){
    var res=0;
    

    if(num==""||num==undefined||num==null){ return res}
    num=num+'';
    if(num.indexOf('/')>=0){
        res=1;
    }else if(num.indexOf('-')>=0){
        res=2;
    }else{
        res=3;
    }

    return res;

},

getSplitArray:function(oldArray){
    var newArray = [];
    if(oldArray.length<2){
        return oldArray;
    }
    var baseString=oldArray[0];
    newArray.push(baseString);
    for (var index = 1; index < oldArray.length; index++) {
        var element = oldArray[index];
        if(element.length<4){
            var dd=baseString.substr(0,baseString.length-element.length);
            element=dd+element;
        }
        newArray.push(element);
        
    }

    return newArray;
},

getListArray:function(oldArray){
    if(oldArray.length!=2||oldArray[1].length>3){ return oldArray;}
    var newArray=[];
    // newArray.push(oldArray[0]);
    var baseString=oldArray[0].substr(0,oldArray[0].length-oldArray[1].length);
    var firstNumber=new Number(oldArray[0].substr(oldArray[0].length-oldArray[1].length,oldArray[1].length));
    var endNumber=new Number(oldArray[1]);
    if(firstNumber>endNumber){
        var ss=firstNumber;
        firstNumber=endNumber;
        endNumber=ss;
    }
    var leng=endNumber-firstNumber+1;
    for(var i=0;i<leng;i++){
        var newString=baseString+firstNumber;
        firstNumber++;
        newArray.push(newString);
    }

    return newArray;
    

}






}

exports.checkEarning=checkEarning;