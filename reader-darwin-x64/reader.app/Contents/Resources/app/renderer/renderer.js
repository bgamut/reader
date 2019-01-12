/* eslint-disable no-console */

const fs = require('fs');

const {shell} = require('electron');
//var python = require('python-shell');
var path = require('path');
//var nodeConsole = require('console');
//var myConsole = new nodeConsole.Console(process.stdout, process.stderr);
//var log=require('electron-log')
var {ipcRenderer,ipcMain,remote} = require('electron')
var { remote } = require ('electron')
var dialog = remote.dialog
var {BrowserWindow} = remote
var Jimp = require('jimp')
//var filePath = undefined;
//var pdfText=require('pdf-text')
//var pdfjsLib = require('./../js/pdf.js/build/pdf.js')
//below is required for version compatibility for the worker 2.0.943 later
var pdfjsLib = require('./../node_modules/pdfjs-dist/build/pdf.js')
/*
var pdf = require('Pdf');
var PDFParser = require('pdf2json');
var PdfReader = require('PdfReader').PdfReader
*/

/*
function readFolder(pth, backBtn) {
    if (backBtn) {
        let path = `${backBtn}../`;
        document.getElementById('backBtn').innerHTML = `<button class="btn btn-small btn-default" onclick="readFolder(this.id);" id="${path}">Back</button><br>`;
    }
    document.getElementById('')
    
    fs.readdir(pth, (err, files) => {
        'use strict';
        if (err) throw err;
        if (files[0] !== undefined) {
            document.getElementById('listed-files').innerHTML = '<ul class="list-unstyled" id="files"></ul>';
            for (let file of files) {
                let theID = `${pth}${file}/`;
                
                    fs.stat(pth + file, (err, stats) => {
                        if (err) throw err;
    
                        if (stats.isDirectory()) {
                            document.getElementById('files').innerHTML += `<li id=${theID} onclick="readFolder(this.id,this.id);"><span class="displayed-files"  ><i class="fa fa-folder-open" aria-hidden="true"></i> ${file}</span></li><hr>`;
                        }
                        else {
                            if(file.endsWith(".pdf")){
                                document.getElementById('files').innerHTML += `<li id=${theID} ondblclick="openFile(this.id);"><span class="displayed-files"   ><i class="fa fa-file" aria-hidden="true" ></i> ${file}</span></li><hr>`;
                            }
                        }
    
                    });
                

            }
        }
        else {
            document.getElementById('listed-files').innerHTML = 'Empty Folder';
        }
    });
}
*/
/*
function openFile(path) {
    'use strict';
    alert(path)
    var options = {
        mode : 'text',
        pythonPath:path.join(__dirname, '/../python/bin'),
        scriptPath :path.join(__dirname, '/../python/scripts'),
        args:[path]
        }
    */
    /*
    alert(path)
    console.log(path);
    fs.readFile('/Users/bernardahn/Downloads/5932041_Technics_1200_DVS.pdf/',(err,pdfBuffer)=>{  
        new pdfreader.PdfReader().parseBuffer(pdfBuffer, function(err,item){
            if(err){
                console.log(err)
            }
            else if (!item){
                console.log('something is wrong')
            }
            else if (item.text){
            console.log(item)
            }
        })
    })
    */
    //shell.openItem(path);
    /*
    var pdf = new python('pdfreader.py',options)
    python.on('message', function(message){
        myConsole.log(message)
        alert(message)
    })
}
*/
var getPath = function(pathString){
    fs.readdir(pathString,(err,items)=>{
        for (var j in items){
            var extendedPath =path.join(pathString,items[j])
            if(fs.lstatSync(extendedPath).isDirectory()){
                getPath(extendedPath);
            }
            else{
                if(extendedPath.endsWith('.wav')){
                    console.log(extendedPath)
                    fileList.push(extendedPath)
                } 
            }
        }
    })         
}
var text = '                          '
/*
function readFolder(){
    dialog.showOpenDialog({message:'Choose Your PDF File',filters:[{name:'PDFs',extensions:['pdf']}],properties:['openFile','createDirectory','promptToCreate']},(pathlist)=>{


    }
        console.log(pathlist)
        if(pathlist!==undefined){
            for (var i in pathlist){
                getPath(pathlist[i]);
            }
            filepath=pathlist[0]
            pdfjsLib.GlobalWorkerOptions.workerSrc ='http://mozilla.github.io/pdf.js/build/pdf.worker.js';
            var rawData = new Uint8Array(fs.readFileSync(filepath))
            var loadingTask=pdfjsLib.getDocument(rawData)
            var numpages=0;
            var scroller = document.getElementById('scroller')                 
            var yay = function(currentPage){
                loadingTask.promise.then((pdfDocument)=>{
                pdfDocument.getPage(currentPage).then(function(page){
                    page.getTextContent().then(function(textContent){
                        //console.log('number '+currentPage)
                            for(var i =0; i<textContent.items.length; i++){
                                text = text+ ' '+textContent.items[i].str
                            }
                        }).then(function(){
                            if(currentPage!=numpages){
                                yay(currentPage+1)
                            }
                            else{

                                console.log(text)
                                scroller.innerHTML = text;
                                scroller.start()
                            }
                        })
                    })   
                })   
            }
            loadingTask.promise.then((pdfDocument)=>{
                console.log(pdfDocument._pdfInfo['numPages'])
                numpages = pdfDocument._pdfInfo['numPages']
            }).then(yay(1))
            
            
            
            
            
                
                
            }

            
        else{
            readFolder()
        }
    })
}
*/

function readFolder(){
    
    //var canvas = document.getElementById("pdf-canvas")
    //var canvasctx = canvas.getContext('2d')
    document.getElementById('pdfFilePicker').addEventListener('change',readFile,false);
    function readFile(evt){
        var files = evt.target.files;
        var filepath = files[0].path;
        var parentDir = path.dirname(filepath);
        var basename = path.basename(parentDir)
        var saveimgpath = ''
        //console.log(filepath)
        if(filepath!==undefined){
            //pdfjsLib.GlobalWorkerOptions.workerSrc ='http://mozilla.github.io/pdf.js/build/pdf.worker.js';
            pdfjsLib.GlobalWorkerOptions.workerSrc ='./../js/pdfjs/build/pdf.worker.js';
            var rawData = new Uint8Array(fs.readFileSync(filepath))
            //console.log(rawData)
            var loadingTask=pdfjsLib.getDocument(rawData)
            var numpages=0;
            var scroller = document.getElementById('scroller')
            
            function dataURItoBlob(dataURI) {
                // convert base64/URLEncoded data component to raw binary data held in a string
                var byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(dataURI.split(',')[1]);
                else
                    byteString = unescape(dataURI.split(',')[1]);
            
                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            
                // write the bytes of the string to a typed array
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
            
                return new Blob([ia], {type:mimeString});
            }
            function writeImage(blob,filePath){
                fileReader.onload = function(){
                    fs.writeFile(filePath,Buffer(new Uint8Array(this.result)))
                }
                fileReader.readAsArrayBuffer(blob)
            }

            function writeImageFromDataURI(dataURI,filePath){
                var byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(dataURI.split(',')[1]);
                else
                    byteString = unescape(dataURI.split(',')[1]);
            
                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            
                // write the bytes of the string to a typed array
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
            
                var blob =  new Blob([ia], {type:mimeString});
                var fileReader = new FileReader();
                /*
                fileReader.onload = function(){
                    fs.writeFileSync(filePath,Buffer(new Uint8Array(this.result)))
                }
                fileReader.readAsArrayBuffer(blob)
                */
               
               var getblob =(blob)=>{
                   return new Promise(
                       (resolve, reject) => {
                            fileReader.readAsArrayBuffer(blob,(error,result)=>{
                                if (error) {
                                    reject(error)
                                }
                                var returnValue=result
                                resolve(returnValue)
                            })
                        }
                    )
                }
                getblob(blob).then(function(result){
                    fs.writeFile(filePath,Buffer(new Uint8Array(result)),function(err){
                        if(err){
                            throw err
                        }
                        console.log('reached the end of the line')
                    })
                })


            }
            /*
            function blobToFile(theBlob, fileName){
                //A Blob() is almost a File() - it's just missing the two properties below which we will add
                theBlob.lastModifiedDate = new Date();
                theBlob.name = fileName;
                return theBlob;
            }    
            */     
           var writePNG=function (saveimgpath,base64,pagenumber){
                return new Promise(
                    function(resolve, reject){
                        var saveimgname = pagenumber+'.png'
                        
                        var saveimgpath = '/Users/bernardahn/Desktop/temp/png/' +saveimgname
                        //var saveimgpath = 'temp/png/'+ saveimgname

                        var newimgname = pagenumber+'.jpeg'
                        var newimgpath = 'temp/jpeg/'+newimgname
                        fs.writeFile(saveimgpath,base64,'base64',function (err){
                            if (err) {
                                reject(err)
                            }
                            else{
                                resolve(pagenumber)
                            } 
                        })
                    }
                )
            }
            var PNGtoJPEG = function(currentPageNum){
                return new Promise(
                    function(resolve,reject){
                        //var savedimgpath = 'temp/png/'+currentPageNum+'.png'
                        var savedimgpath = '/Users/bernardahn/Desktop/temp/png/'+currentPageNum+'.png'
                        //console.log(savedimgpath)
                        var newimgname = currentPageNum+'.jpeg'

                        var newimgpath = '/Users/bernardahn/Desktop/temp/jpeg/'+newimgname
                        //var newimgpath = 'temp/jpeg/'+newimgname
                        Jimp.read(savedimgpath,(err,data)=>{
                            if(err){
                                reject(err)
                            }
                            else{
                                data.write(newimgpath)
                                resolve(currentPageNum)
                            }
                        })
                    }
                )
            }
            var writeCustomBash=function(currentPageNum){
                return new Promise(
                    function(resolve,reject){
                        var jpegpath = '/Users/bernardahn/Desktop/temp/jpeg/'+currentPageNum+'.jpeg'
                        var parttextpath = '/Users/bernardahn/Desktop/temp/txt/'+currentPageNum
                        var fullbashpath = '/Users/bernardahn/Desktop/temp/bash/'+currentPageNum+'.bash'
                        var language = 'ENG'
                        var string = 'tesseract '+jpegpath+' '+parttextpath+ ' -l '+language
                        fs.writeFile(fullbashpath,string,function (err){
                            if (err) {
                                reject(err)
                            }
                            else{
                                resolve(fulltextpath)
                            } 
                        })
                    }
                )
            }
            var readit = function(currentPage){
                
                loadingTask.promise.then((pdfDocument)=>{
                pdfDocument.getPage(currentPage).then(function(page){
                    //var canvas = document.getElementById("pdf-canvas")
                    var container = document.getElementById('canvas-container')
                    var canvas = document.createElement("canvas")
                    canvas.setAttribute('id',page)
                    
                    //var canvas = document.createElement('canvas')
                    var canvasctx = canvas.getContext('2d')
                    //canvas.setAttribute('width',100)
                    //var scale_required=canvas.width/page.getViewport(1).width;
                    
                    //var viewport = page.getViewport(scale_required);
                    canvas.setAttribute('width',page.getViewport(1).width)
                    container.appendChild(canvas)
                    var viewport = page.getViewport(1)
                    canvas.height = viewport.height;
                    var renderContext = {
                        canvasContext: canvasctx,
                        viewport:viewport
                    };
                    saveimgpath=parentDir+'/'+currentPage+'.png'
                    
                    
                    page.render(renderContext).then(function(){
                        var container = document.getElementById('canvas-container')
                        var dataUrl = container.children[currentPage-1].toDataURL('image/png')
                        var base64=dataUrl.replace(/^data:image\/png;base64,/,"")
                        var currentPageNum = currentPage
                        //console.log(currentPageNum)
                        //console.log(base64)
                        writePNG(saveimgpath,base64,currentPageNum).then(
                            
                            /*
                            function(){
                                var savedimgpath = 'temp/png/'+currentPageNum+'.png'
                                //console.log(savedimgpath)
                                var newimgname = currentPageNum+'.jpeg'
                                var newimgpath = 'temp/jpeg/'+newimgname
                                Jimp.read(savedimgpath,(err,data)=>{
                                    data.write(newimgpath)
                                })
                            }
                            */
                            function(pageNum){
                                PNGtoJPEG(pageNum).then(function(pageNow){
                                    //var readFrom = __dirname+'/./../temp/jpeg/'+pageNow+'.jpeg'
                                    var readFrom = '/Users/bernardahn/Desktop/temp/jpeg/'+pageNow+'.jpeg'
                                    /*
                                    var serverProc = require('child_process').fork(
                                    //require.resolve('./../testTesseract.js'),[readFrom,'KOR',pageNow])
                                    //require.resolve('./../js/tesseract.js'),[readFrom,'KOR',pageNow])
                                    require.resolve('./../js/tesseract.js'),[readFrom,'ENG',pageNow])
                                    //require.resolve('/Users/bernardahn/Desktop/development/software/webapp/reader/js/tesseract.js'),[readFrom,'ENG',pageNow])
                                   serverProc.on('exit', (code, sig) => {
                                        // finishing
                                        console.log('exiting '+pageNow)
                                        var text = fs.readFileSync(path.join(__dirname,'/../','temp/txt/'+currentPage+'.txt'),'utf8')
                                        console.log(text)
                                    })
                                      serverProc.on('error', (error) => {
                                        console.error(error)
                                        // error handling
                                    })
                                    */
                                    var spawn =require('child_process').spawn
                                    var inputPath =readFrom
                                    var outputPath = '/Users/bernardahn/Desktop/temp/txt/'+currentPage
                                    //var language = 'KOR'
                                    var language = 'ENG'
                                    var args = [
                                        inputPath,
                                        outputPath,
                                        '-l',language
                                    ]
                                    //spawn doesn't work when file is consolidated
                                    //spawn('tesseract',args,{stdio:'ignore'})
                                    //var runningman = spawn('tesseract',args,{stdio:'ignore'})
                                    //oshell.openExternal('tesseract',args)
                                    writeCustomBash(pageNow).then(function(bashpath){
                                        shell.openItem(bashpath)
                                    })
                                    

                                })
                            }
                           
                        )
                        
                        //
                        //console.log(canvas.toDataURL())
                        //console.log(saveimgpath)
                        //writeImageFromDataURI(canvas.toDataURL(),saveimgpath)
                        //canvas.toDataURL(saveimgpath)
                        /*
                        var png = ReImg.fromCanvas(canvas).toPng();
                        fetch(png.src)
                        .then(res => res.blob())
                        .then(blob =>{
                            var file = new File([blob],saveimgname,blob)
                            fs.writeFile(saveimgpath,file,function(err){
                                if(err){
                                    throw err
                                }
                                console.log(saveimgpath)
                            })
                        })
                        */
                        
                        //var dataUrl=canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                        /*
                        //https://stackoverflow.com/questions/6926016/nodejs-saving-a-base64-encoded-image-to-disk
                        var dataUrl = canvas.toDataURL('image/png')
                        var base64=dataUrl.replace(/^data:image\/png;base64,/,"")
                        console.log(base64)
                        fs.writeFile(saveimgpath,base64,'base64',function(err){
                            if(err){
                                throw err
                            }
                        })
                        */
                        //window.location.href=dataUrl;
                        //var base64=dataUrl.split(',')[1]
                        //var mime = dataUrl[0].match(/:(.*?);/)[1]
                        //var bin = atob(base64)
                        //var length = bin.length;
                        //var buf = new ArrayBuffer(length)
                        //var arr = new Uint8Array(buf)
                        //var arr = new Uint8Array(base64)
                        /*
                        bin 
                            .split('')
                            .forEach((e,i)=>arr[i]=e.charCodeAr(0))
                        */
                        //var f = new File([buf],'saveimgname',{type:mime})
                        /*
                        function base64_decode(base64str, filepath) {
                            // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
                            //var bitmap = new Buffer(base64str, 'base64');
                            // write buffer to file
                            //fs.writeFileSync(file, bitmap);
                            fs.writeFile(filepath,base64str,function(err){
                                if(err){
                                    throw err
                                }
                            })
                            console.log('******** File created from base64 encoded string ********');
                        }
                        base64_decode(base64,saveimgpath)
                        */
                        //var blobUrl=URL.createObjectURL(f)

                        //console.log(png)
                        /*
                        fs.writeFile(saveimgpath,png,function(err){
                            if(err){
                                throw err
                            }
                            console.log(saveimgpath)
                        })
                        */
                       page.getTextContent().then(function(textContent){
                        
                        //console.log('number '+currentPage)
                            for(var i =0; i<textContent.items.length; i++){
                                text = text+ ' '+textContent.items[i].str
                            }
                        }).then(function(){
                            if(currentPage!=numpages){
                                readit(currentPage+1)
                            }
                            else{

                                console.log(text)
                                scroller.innerHTML = text;
                                scroller.start()
                            }
                        })
                    })
                    
                        /*
                        .then(function(){
                            //https://stackoverflow.com/questions/6926016/nodejs-saving-a-base64-encoded-image-to-disk
                            var container = document.getElementById('canvas-container')
                            var canvases = container.children
                            for (var i=0; i<canvases.length; i++){
                                var saveimgname = i+'.png'
                                var saveimgpath = 'temp/png/'+ saveimgname
                                var canvas = canvases[i]
                                var dataUrl = canvas.toDataURL('image/png')
                                var base64=dataUrl.replace(/^data:image\/png;base64,/,"")
                                //console.log(base64)
                                /*
                                fs.writeFile(saveimgpath,base64,'base64',function(err){
                                    if(err){
                                        throw err
                                    }
                                    var newimgname = i+'.jpeg'
                                    var newimgpath = 'temp/jpeg/'+newimgname
                                    Jimp.read(saveimgpath,(err,data)=>{
                                        data.write(newimgpath)
                                    })
                                })
                                */
                                
                        /*
                                 writePNG(saveimgpath,base64,i)
                                 .then(function(i){
                                     console.log(i)
                                    var savedimgname = i+'.png'
                                    var savedimgpath = 'temp/png/'+ savedimgname
                                    var newimgname = i+'.jpeg'
                                    var newimgpath = 'temp/jpeg/'+newimgname
                                    Jimp.read(savedimgpath,(err,data)=>{
                                        data.write(newimgpath)
                                    })
                                })
                            }
                            
                        })
                        */
                        /*
                        .then(function(){
                            var container = document.getElementById('canvas-container')
                            var canvases = container.children
                            for (var i=0; i<canvases.length; i++){
                                var savedimgname = i+'.png'
                                var savedimgpath = 'temp/png/'+ savedimgname
                                var newimgname = i+'.jpeg'
                                var newimgpath = 'temp/jpeg/'+newimgname
                                Jimp.read(savedimgpath,(err,data)=>{
                                    data.write(newimgpath)
                                })
                                
                            }
                        })
                        */
                    })   
                })
                
            }
            loadingTask.promise.then((pdfDocument)=>{
                console.log(pdfDocument._pdfInfo['numPages'])
                numpages = pdfDocument._pdfInfo['numPages']
            })
            .then(
                function(){
                    readit(1);
                }      
            )      
        }
        else{
            document.getElementById('readFile').click()
        }
    }
}

/*
function readFolder(){
    document.getElementById('pdfFilePicker').addEventListener('change',readFile,false);
    function readFile(evt){
        var files = evt.target.files;
        var filepath = files[0].path
        console.log(filepath)
        if(filepath!==undefined){
        var PDFImage = require('pdf-image').PDFImage;
        var pdfImage = new PDFImage(filepath,{combinedImage:true})
        pdfImage.convertFile().then(function(imagePaths){
            'tmp/slide.png'
            console.log(imagePaths)
        })
    }
}
}
*/
function openFile(path) {
    
    'use strict';
    var options = {
        
        args:[path]
        }
    
    /*
    var pythonPath=path.join(__dirname, '/../python/bin')
    var scriptPath = path.join(__dirname, '/../python/scripts')
    
   var pythonPath=__dirname+'/../python/bin'
    var scriptPath = __dirname+'/../python/scripts'
    var options = {
        mode : 'text',
        pythonPath: pythonPath,
        scriptPath : scriptPath,
        pythonOptions:['-u'],
        args:[path]
        }

    PythonShell.run('pdfreader.py',options,function (err,results){
        console.log(results)
    })

    PythonShell.on('message', function(message){
        console.log(message)
    })
*/
/*
    var pyshell = new PythonShell('pdfreader.py',options);
    pyshell.send(path);
    pyshell.on('message',function(message){
        console.log(message)
        alert(message)
    })
    
    pyshell.end(function(err,code,signal){
        if(err){
            console.log()
        }
        
    })
*/
    const app = require('electron').remote.app
    var data
/*
    import fs from 'electron-fs-extra'
    var async = require('async')
    function readFile(filePath){
        return await fs.readFile(filePath)
    }
    var data=readFile(filePath)


var patchFs=require('electron-patch-fs')

patchFs.patch()
    fs.open(path,'r',function(err,buffer){
        if (err){
            console.log(err)
        }
        console.log(buffer)
        data = buffer
        
    })
console.log(data)
*/
console.log(typeof(path))
var PDFParser = require('pdf2json')
var pdfParser = new PDFParser()
var text = '' 
pdfParser.loadPDF(path);
pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdf => {
    console.log(pdf);
    for(var i = 0; i++; i<pdf.data.Pages.length){
        for(var j = 0; j++; j<pdf.data.Pages[i].Texts.length){
            for(var k = 0; k++; k<pdf.data.Pages[i].Texts[j].R.length){
                for(var k = 0; k++; k<pdf.data.Pages[i].Texts[j].R[k].length){
                    text= text+pdf.data.Pages[0].Texts[0].R[0].T+' '
                    }
                }
            }
        }
        
    });
/*
    var text = ''
    var pdfParser = require('pdf-parser')
    pdfParser.pdf2json(path,function(error, pdf){
        console.log(error)
        console.log(JSON.stringify(pdf.text))
        text = pdf.text
    })
    console.log(text)
    */
   /*
   var pdfreader = require('pdfreader');
 
   var rows = {}; // indexed by y-position
   var text = ''
   function printRows() {
     Object.keys(rows) // => array of y-positions (type: float)
       .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
       //.forEach((y) => console.log((rows[y] || []).join('')));
       .forEach((y) => text= text + rows[y]+' ')
   }
    
   new pdfreader.PdfReader().parseFileItems(path, function(err, item){
    console.log(item.text) 
    if (item.text) {
        // accumulate text items into rows object, per line
        (rows[item.y] = rows[item.y] || []).push(item.text);
        printRows();
        console.log(item.text)
      }
     
   });
    */
   /*
   console.log(__dirname)
   var pdf = require('pdf-parse')
   pdf(data).then(function(result){
       var text = result.text
       console.log(text)
       ipcRenderer.send('file_load',text)
   })
    */
   
    ipcRenderer.send('file_load',text)
    var win = remote.getCurrentWindow()
    
    win.setSize(800,800)
    win.setResizable(true)
   
    ipcRenderer.once('actionReply',function(event,pdfData){
        var scroller = document.getElementById('scroller')
        scroller.style.visibility = 'visible'
        scroller.innerHTML = text;
 
    })
    
    /*
    window.close()
    */
    

}
ipcRenderer.on('open',function(event,arg){
    readFolder()
})