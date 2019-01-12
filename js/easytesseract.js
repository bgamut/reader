var eto = require('easy-tesseract-ocr')

var t
var scan = function(){
    return new Promise(
        function(resolve, reject){
            eto.scan({imagePath:'/Users/bernardahn/Desktop/3.jpeg',trainedData:'kor'}).then(function(data,error){
                if (error) {
                    reject(error)
                }
                else{
                    resolve(data)
                } 
            })    
        }
    )
}
var updated = function(){
    scan().then(function(data){
        t=data
        console.log(t)        
    })
}


updated()


