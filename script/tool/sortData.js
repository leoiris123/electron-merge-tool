
export const sorttool = {
    sortData(data,headerNameList,headertypeList){
        //处理成烈的额形式
        console.log(data,"list数据处理前")
        let out = {}
        data.map((item,index)=>{
            Object.keys(item).map((name,i)=>{
                if(!Object.prototype.hasOwnProperty.call(out, name)){
                    out[name]=[] 
                }
            })
        })
        Object.keys(out).map((property)=>{
            data.map((item,index)=>{
                if(Object.prototype.hasOwnProperty.call(item, property)){
                    out[property].push(item[property]) 
                }else{
                   if(headerNameList.indexOf(property)>=0){
                       let type = headertypeList[headerNameList.indexOf(property)]
                       if(type == "string"){
                        out[property].push("")
                       }else if(type == "number"){
                        out[property].push(0)
                       }
                   }
                   else {
                    out[property].push(0)
                   }
                }
            })
        })

        console.log(out,"list处理后")
        return out 
    },
    createClassifier(namelist,valuelist){
        console.log(namelist,valuelist,"name,value")
        let out = {}
        namelist.map((name,index)=>{
            out[name] = valuelist[index]
        })


        //变成字符串
        let strout = "" 

        Object.keys(out).map((name,index)=>{
            strout =  strout + name +":"+out[name]+";"

        })
        return "{"+strout+"}"
    }
  
}