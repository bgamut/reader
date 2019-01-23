
const fs = require('fs');

const {shell} = require('electron');
var path = require('path');
var {ipcRenderer,ipcMain,remote} = require('electron')
var { remote } = require ('electron')
var dialog = remote.dialog
var {BrowserWindow} = remote
var Jimp = require('jimp')
var pdfjsLib = require('./../node_modules/pdfjs-dist/build/pdf.js')
const { warn } = console;
    console.warn = (...args) => {
      /^%cElectron Security Warning/.test(args[0])
        || Reflect.apply(warn, console, args);
    };
var previousDevelopmentCheck = false;
var pagesDonePreviously = 0;
/*
var {TitleBar} =require('frameless-titlebar')
*/

function rewireLoggingToElement(eleLocator, eleOverflowLocator, autoScroll) {
    fixLoggingFunc('log');
    fixLoggingFunc('debug');
    fixLoggingFunc('warn');
    fixLoggingFunc('error');
    fixLoggingFunc('info');

    function fixLoggingFunc(name) {
        console['old' + name] = console[name];
        console[name] = function(...arguments) {
            const output = produceOutput(name, arguments);
            const eleLog = eleLocator();

            if (autoScroll) {
                const eleContainerLog = eleOverflowLocator();
                const isScrolledToBottom = eleContainerLog.scrollHeight - eleContainerLog.clientHeight <= eleContainerLog.scrollTop + 1;
                eleLog.innerHTML += output + "<br>";
                if (isScrolledToBottom) {
                    eleContainerLog.scrollTop = eleContainerLog.scrollHeight - eleContainerLog.clientHeight;
                }
            } else {
                eleLog.innerHTML += output + "<br>";
            }

            console['old' + name].apply(undefined, arguments);
        };
    }

    function produceOutput(name, arguments) {
        return arguments.reduce((output, arg) => {
            return output +
                "<span class=\"log-" + (typeof arg) + " log-" + name + "\">" +
                    (typeof arg === "object" && (JSON || {}).stringify ? JSON.stringify(arg) : arg) +
                "</span>&nbsp;"+"<hr>";
        }, '');
    }
}
rewireLoggingToElement(
    () => document.getElementById("log"),
    () => document.getElementById("log-container"), true);
    
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
var numpages = 0;
var numerator = 0;
var text = ' '

function sortNumber(a,b){
    a.split('.')[0]-b.split('.')[0]
}
var paddedNum = function(number){return "0000".substring((number+"").length,4)+number}
function stripZeros(oldString){
    var numberReached=false
    var newString = ''
    for (var  i = 0; i<oldString.length; i++){
        if((numberReached ==false && oldString[i]=='0')){
        }
        else{
            numberReached = true;
            newString+=(oldString[i])
        }
        
    }
    return (newString)
}
function readFolder(){

    document.getElementById('pdfFilePicker').addEventListener('change',readFile,false);
    function readFile(evt){
        var files = evt.target.files;
        var filepath = files[0].path;
        var parentDir = path.dirname(filepath);
        var basename = path.basename(parentDir)
        var saveimgpath = ''
        console.log('source file : ' + filepath)
        if(filepath!==undefined){
            var buttonContainer = document.getElementById('button-container')
            buttonContainer.style.display='none'
            var select = document.getElementById('select')
            select.style.display='none'
            document.body.setAttribute('style','background-color:rgb(30,30,30);display:block;-webkit-app-region:drag;margin:0px;padding:0px;overflow-x:hidden;overflow-y:scroll;')
            document.getElementById('log-container').style.display='block'
            pdfjsLib.GlobalWorkerOptions.workerSrc ='./../js/pdfjs/build/pdf.worker.js';
            var rawData = new Uint8Array(fs.readFileSync(filepath))
            var loadingTask=pdfjsLib.getDocument(rawData)
            var scroller = document.getElementById('scroller')
            var writePNG=function (saveimgpath,base64,pagenumber){
                return new Promise(
                    function(resolve, reject){
                        var saveimgname = paddedNum(pagenumber)+'.png'
                        var saveimgpath = 'temp/png/'+ saveimgname
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
                        var savedimgpath = 'temp/png/'+paddedNum(currentPageNum)+'.png'
                        var newimgname = currentPageNum+'.jpeg'
                        var newimgpath = 'temp/jpeg/'+newimgname
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
  
            var readit = function(currentPage){
                if(previousDevelopmentCheck==false){
                    var pngFiles= fs.readdirSync(path.join(__dirname,'/../','temp/png/'))
                    var txtFiles=fs.readdirSync(path.join(__dirname,'/../','temp/newtxt'))
                    /*
                    if((pngFiles.length<2)){
                        var fileName = pngFiles[files.length-1]
                        console.log(fileName)
                        currentPage = pngFiles.length-1
                        console.log('continuing from previous file generation from page number '+currentPage+'.')  
                    }
                    */
                    previousDevelopmentCheck=true
                }
                var text = ""
                
                loadingTask.promise.then((pdfDocument)=>{
                pdfDocument.getPage(currentPage).then(function(page){
                    var container = document.getElementById('canvas-container')
                    var canvas = document.createElement("canvas")
                    canvas.setAttribute('id',page)
                    var canvasctx = canvas.getContext('2d')
                    canvas.setAttribute('width',page.getViewport(1).width)
                    container.appendChild(canvas)
                    var viewport = page.getViewport(1)
                    canvas.height = viewport.height;
                    var renderContext = {
                        canvasContext: canvasctx,
                        viewport:viewport
                    };
                    saveimgpath=parentDir+'/'+paddedNum(currentPage)+'.png'
                    
                    
                    page.render(renderContext).then(function(){
                        var container = document.getElementById('canvas-container')
                        var dataUrl = container.children[container.children.length-1].toDataURL('image/png')
                        var base64=dataUrl.replace(/^data:image\/png;base64,/,"")
                        var currentPageNum = currentPage
                        writePNG(saveimgpath,base64,currentPageNum).then(
                           function(pageNum){
                            
                            

                                PNGtoJPEG(pageNum).then(function(pageNow){
                                    var readFrom = __dirname+'/./../temp/png/'+paddedNum(pageNow)+'.png'
                                    function tesseractChild (language) {
                                        var serverProc = require('child_process').fork(
                                            require.resolve('./../js/tesseract.js'),[readFrom,language,pageNow])
                                            serverProc.on('exit', (code, sig) => {
                                                var text = fs.readFileSync(path.join(__dirname,'/../','temp/txt/'+currentPage+'.txt'),'utf8')
                                                var newText = text.replace(/(\r\n\t|\n|\r\t|\t|\f|;|\|\/|<|>|'|'|:|_|]'+'|'*'|ㅠ|ㅎ|ㅋ)/gm,"").replace(/\s\s+/g," ").replace(/[\/|\\]/g,"");
                                                fs.writeFile(path.join(__dirname,'/../','temp/newtxt/'+paddedNum(currentPage)+'.txt'),newText,function(err,data){
                                                    if(err){
                                                        console.error(error)
                                                    }
                                                    else{
                                                        numerator+=1
                                                        console.log(numerator + " / " +numpages)
                                                        document.body.scrollTo(0,document.body.scrollHeight)
                                                        document.getElementById('log-container').scrollTo(0,document.getElementById('log-container').scrollHeight)
                                                        if(numerator==numpages){
                                                            var files= fs.readdirSync(path.join(__dirname,'/../','temp/newtxt/'))
                                                            console.log(files)
                                                            var text = ""
                                                            for (var i = 0; i<files.length; i++){
                                                                if(files[i].split('.')[1]=='txt'){
                                                                    text +=" "+fs.readFileSync(path.join(__dirname,'/../','temp/newtxt/'+paddedNum(i)+'.txt'),'utf8')
                                                                }
                                                            }
                                                            fs.writeFile(path.join(__dirname,'/../','temp/newtxt/alltext.txt'),text,function(err,data){
                                                                if(err){
                                                                    console.error(error)
                                                                }
                                                                else{
                                                                    console.log('alltext.txt is ready')
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                                
                                                
                                            })
                                            serverProc.on('error', (error) => {
                                                console.error(error)
                                                // error handling
                                            })
                                        }
                                        tesseractChild(select.value)
                                    
                                    
                                 
                                  
                                })
                            }
                           
                        )
                        
                      
                       page.getTextContent().then(function(textContent){
                            for(var i =0; i<textContent.items.length; i++){
                                text = text+ ' '+textContent.items[i].str
                            }
                        }).then(function(){
                            if(currentPage!=numpages){
                                readit(currentPage+1)
                            }
                            else{
                                scroller.innerHTML = text;
                                scroller.start()
                            }
                        })
                    })

                    })   
                })
                
            }
            loadingTask.promise.then((pdfDocument)=>{
                console.log(pdfDocument._pdfInfo['numPages'] +' total pages.')
                numpages = pdfDocument._pdfInfo['numPages']
            })
            .then(
                function(){
                    readit(1);
                }      
            )      
        }
        else{
            console.log('yeah we canceled')
            
            
        }
    }
}

function openFile(path) {
    
    'use strict';
    var options = {
        
        args:[path]
        }
    
 
    const app = require('electron').remote.app
    var data

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

   
    ipcRenderer.send('file_load',text)
    var win = remote.getCurrentWindow()
    
    win.setSize(800,800)
    win.setResizable(true)
   
    ipcRenderer.once('actionReply',function(event,pdfData){
        var scroller = document.getElementById('scroller')
        scroller.style.visibility = 'visible'
        scroller.innerHTML = text;
 
    })
    

}
ipcRenderer.on('open',function(event,arg){
    readFolder()
})