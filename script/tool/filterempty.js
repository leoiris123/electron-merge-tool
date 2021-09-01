const characterList = ["left1", "right1", "left2", "right2"]
export const filtertool = {
    filterempty(data){
        for(let key in data){
            characterList.map(character=>{
                if( data[key][character]  &&  (data[key][character]==={}||data[key][character].char=="")){
                    delete data[key][character]
                }
            }) 
        }
    },
    filterindex(data){
        for(let key in data){
            for(let key2 in data[key].states){
                data[key].states[key2].map(item=>{
                    if(!(item.row_index==null)){
                        delete item.row_index
                    }
                })
            }

        }
        console.log(data,"after")
    }
}