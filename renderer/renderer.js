
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
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
    return d;       
}
function circularProgressBar(id){
    this.ID=id
    this.arcID="arc"+this.ID
    this.textID="svgtext"+this.ID
    this.width=0
    this.height=0
    this.centerX=0
    this.centerY=0
    this.radius=0
    this.startAngle=0
    this.endAngle=0
    this.color='rgb(140,140,140)'
    this.pointer=null
    
    this.draw=function(){
        var textElement=document.getElementById(this.textID)
        textElement.setAttribute('x',this.centerX+this.radius*0.5)
        textElement.setAttribute('y',this.centerY+(textElement.getBBox().height/2.75))
        textElement.innerHTML=((this.endAngle-this.startAngle)*100/359).toFixed(2)+"%"
        document.getElementById(this.arcID).setAttribute("d", describeArc(this.centerX, this.centerY, this.radius, this.startAngle, this.endAngle));
    }
    this.refresh=function(){
        
        this.width=this.pointer.offsetWidth
        this.height=this.pointer.offsetHeight
        this.centerX=this.width/2
        this.centerY=this.height/2
        this.radius=this.centerX<this.centerY?this.centerX/2:this.centerY/2;
        document.getElementById(this.textID).style.fontSize=this.radius/4+'px'
        this.draw()
    }
    this.appendArc=function(parent){
        var htmlString="<div id='p"+this.ID+"'><svg id='svg"+this.ID+"'><text id=svgtext"+this.ID+">0%</text><path id=arc"+this.ID+" fill='none' stroke='"+this.color+"'stroke-width='15'/></svg></div>"
        parent.innerHTML = htmlString
        this.pointer = document.getElementById("p"+this.ID)
        this.pointer.style.width="100%"
        this.pointer.style.height="100%"
        this.pointer.children[0].style.width="100%"
        this.pointer.children[0].style.height="100%"
        document.getElementById(this.textID).style.fontFamily='Roboto Mono'
        document.getElementById(this.textID).style.fill=this.color
        document.getElementById(this.textID).style.textAnchor='end'
        document.getElementById(this.arcID).style.strokeLinecap='round'
        this.refresh()  
    }
    this.update=function(stepFraction){
        var temp = this.endAngle+=359*stepFraction
        if(temp<360){
            this.endAngle=temp;
        }
        else{
            this.endAngle=0;
        }
        this.draw()
    }
}
function readFolder(){
    var p =new circularProgressBar(1)
    p.appendArc(document.body)
    document.getElementById('pdfFilePicker').addEventListener('change',readFile,false);
    function readFile(evt){
        var files = evt.target.files;
        var filepath = files[0].path;
        var parentDir = path.dirname(filepath);
        var basename = path.basename(parentDir)
        var saveimgpath = ''
        console.log('source file : ' + filepath)
        if(filepath!==undefined){
            var win = remote.getCurrentWindow()
            win.setSize(400,400)
            
            var buttonContainer = document.getElementById('button-container')
            buttonContainer.style.display='none'
            var select = document.getElementById('select')
            select.style.display='none'
            document.body.setAttribute('style','background-color:rgb(30,30,30);display:block;-webkit-app-region:drag;margin:0px;padding:0px;overflow-x:hidden;overflow-y:scroll;')
            //document.getElementById('log-container').style.display='block'
            p.refresh()
            p.draw()
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
            var txtList;
            var readit = function(currentPage){
                if(previousDevelopmentCheck==false){
                    var txtFiles=fs.readdirSync(path.join(__dirname,'/../','temp/newtxt'))
                    txtList = txtFiles.map(function(txtFile){
                        if(txtFile.split('.')[0]!==""){
                            return stripZeros(txtFile.split('.')[0])
                        }
                    })
                    previousDevelopmentCheck=true
                }
                var checkpoint = false;
                while(checkpoint == false){
                    if(txtList.includes(String(currentPage))){
                        currentPage+=1;
                    }
                    else{
                        checkpoint=true;
                    }
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
                                                        p.update(1/numpages)
                                                        p.refresh()
                                                        p.draw()
                                                        console.log(numerator + " / " +numpages)
                                                        document.body.scrollTo(0,document.body.scrollHeight)
                                                        document.getElementById('log-container').scrollTo(0,document.getElementById('log-container').scrollHeight)
                                                        if(numerator==numpages){
                                                            p.pointer.style.display='none'
                                                            document.getElementById('container').style.display='block'
                                                            win.setSize(800,365)
                                                            win.setResizable=true;
                                                            var currentPageFixing=1;
                                                            var img=document.getElementById('place-holder1')
                                                            var imgURL 
                                                            img.style.backgroundImage='url('+imgURL+')'
                                                            img.style.filter='invert(88%)';
                                                            var textInput = document.getElementById('text-input')
                                                            var imgContainer = document.getElementById('img-container')
                                                            var typeWriterArea = document.getElementById('type-writer-area')
                                                            var left = document.getElementById('left')
                                                            var placeHolders = document.getElementsByClassName('place-holders')
                                                            function fillScreen(){
                                                                var imgURL = './temp/jpeg/'+paddedNum(currentPageFixing)+'.jpeg'
                                                                img.style.backgroundImage='url('+imgURL+')'
                                                                img.style.filter='invert(88%)';
                                                                textInput.value = fs.readFileSync(path.join(__dirname,'/../','temp/newtxt/'+paddedNum(currentPageFixing)+'.txt'),'utf8')
                                                            }
                                                            fillScreen()
                                                            function sizeElements(){
                                                                var widthPadding = placeHolders[1].offsetWidth/13
                                                                var heightPadding = placeHolders[1].offsetHeight/16
                                                                var textSize = widthPadding*3/8
                                                                var lineHeight =heightPadding*8/13
                                                                textInput.style.padding= heightPadding +'px '+widthPadding+'px '+ heightPadding +'px '+widthPadding+'px '
                                                                textInput.style.fontSize = textSize +'px'
                                                                textInput.style.lineHeight = lineHeight + 'px'
                                                                for (var k = 0; k<placeHolders.length; k++){
                                                                var placeHolder = placeHolders[k]
                                                                var mouseX, mouseY;
                                                        
                                                                }
                                                            }
                                                        
                                                            sizeElements()
                                                            function flip(next){
                                                                if(next ==true){
                                                                    if(currentPageFixing<numpages){
                                                                        currentPageFixing=currentPageFixing+1
                                                                    }
                                                                    else{
                                                                        currentPageFixing=0
                                                                    }
                                                                }
                                                                else{
                                                                    if(currentPageFixing>1){
                                                                        currentPageFixing=currentPageFixing-1
                                                                    }
                                                                    else{
                                                                        currentPageFixing=numpages
                                                                    }
                                                                }
                                                                fillScreen()
                                                                
                                                            }
                                                            window.addEventListener('resize',function(){
                                                                sizeElements();
                                                            })
                                                            
                                                            var currentWordListIndex=0
                                                            
                                                            textInput.addEventListener('keydown',function(e){
                                                                var rawTextString = textInput.value
                                                                var wordList=textInput.value.split(/\s+/)
                                                                var indexList = []
                                                                for (var i =0; i<wordList.length; i++){
                                                                    indexList.push([rawTextString.indexOf(wordList[i]),rawTextString.indexOf(wordList[i])+wordList[i].length])
                                                                }
                                                                var cursorIndex=textInput.selectionStart
                                                                function binarySearch(array, number) {
                                                                    var min= 0;
                                                                    var max = array.length - 1;
                                                                    while (min <= max) {
                                                                        var index = (max + min) >> 1;
                                                                        var cmp = number - array[index][0];
                                                                        if (cmp > 0) {
                                                                            min = index + 1;
                                                                        } else if(cmp < 0) {
                                                                            max = index - 1;
                                                                        } else {
                                                                            return [index-1, index];
                                                                        }
                                                                    }
                                                                    return [min, max];
                                                                }
                                                                var endIndex = wordList.length
                                                                
                                                                if(e.shiftKey){
                                                                    if(e.keyCode==9){
                                                                        e.preventDefault();
                                                                        var currentWordListIndex=binarySearch(indexList,cursorIndex)[0]
                                                                        
                                                                        if (currentWordListIndex==-1 ){
                                                                            currentWordListIndex=endIndex-1
                                                                        }
                                                                        textInput.setSelectionRange(indexList[currentWordListIndex][0],indexList[currentWordListIndex][1])
                                                                        currentWordListIndex-=1
                                                                    }
                                                                    else if(e.keyCode==13){
                                                                        e.preventDefault();
                                                                        flip(false)
                                                                        console.log('prev page load function goes here')
                                                                    }
                                                                    else if(e.keyCode==39){
                                                                        e.preventDefault();
                                                                        flip(true)
                                                                        console.log('next page load function goes here')
                                                                    }
                                                                    else if(e.keyCode==37){
                                                                        e.preventDefault();
                                                                        flip(false)
                                                                        console.log('previous page load function goes here')
                                                                    }
                                                                }
                                                                else if(e.metaKey){
                                                                    if(e.keyCode==9){
                                                                        e.preventDefault();
                                                                        var currentWordListIndex=binarySearch(indexList,cursorIndex)[0]
                                                                        
                                                                        if (currentWordListIndex==-1){
                                                                            currentWordListIndex=endIndex-1
                                                                        }
                                                                        textInput.setSelectionRange(indexList[currentWordListIndex][0],indexList[currentWordListIndex][1])
                                                                        currentWordListIndex-=1
                                                                    }
                                                                    else if(e.keyCode==13){
                                                                        e.preventDefault();
                                                                        flip(false)
                                                                        console.log('prev page load function goes here')
                                                                    }
                                                                    else if(e.keyCode==39){
                                                                        e.preventDefault();
                                                                        flip(true)
                                                                        console.log('next page load function goes here')
                                                                    }
                                                                    else if(e.keyCode==37){
                                                                        e.preventDefault();
                                                                        flip(false)
                                                                        console.log('previous page load function goes here')
                                                                    }
                                                                }
                                                                else if(e.altKey){
                                                                    if(e.keyCode==9){
                                                                        e.preventDefault();
                                                                        var currentWordListIndex=binarySearch(indexList,cursorIndex)[0]
                                                                        
                                                                        if (currentWordListIndex==-1){
                                                                            currentWordListIndex=endIndex-1
                                                                        }
                                                                        textInput.setSelectionRange(indexList[currentWordListIndex][0],indexList[currentWordListIndex][1])
                                                                        currentWordListIndex-=1
                                                                    }
                                                                    else if(e.keyCode==13){
                                                                        e.preventDefault();
                                                                        flip(false)
                                                                        console.log('prev page load function goes here')
                                                                    }
                                                                    else if(e.keyCode==39){
                                                                        e.preventDefault();
                                                                        flip(true)
                                                                        console.log('next page load function goes here')
                                                                    }
                                                                    else if(e.keyCode==37){
                                                                        e.preventDefault();
                                                                        flip(false)
                                                                        console.log('previous page load function goes here')
                                                                    }
                                                                }
                                                                else if(e.ctrlKey){
                                                                    if(e.keyCode==9){
                                                                        e.preventDefault();
                                                                        var currentWordListIndex=binarySearch(indexList,cursorIndex)[0]
                                                                        
                                                                        if (currentWordListIndex==-1){
                                                                            currentWordListIndex=endIndex-1
                                                                        }
                                                                        textInput.setSelectionRange(indexList[currentWordListIndex][0],indexList[currentWordListIndex][1])
                                                                        currentWordListIndex-=1
                                                                    }
                                                                    else if(e.keyCode==13){
                                                                        e.preventDefault();
                                                                        flip(false)
                                                                        console.log('prev page load function goes here')
                                                                    }
                                                                    else if(e.keyCode==39){
                                                                        e.preventDefault();
                                                                        flip(true)
                                                                        console.log('next page load function goes here')
                                                                    }
                                                                    else if(e.keyCode==37){
                                                                        e.preventDefault();
                                                                        flip(false)
                                                                        console.log('previous page load function goes here')
                                                                    }
                                                                }
                                                                else{
                                                                    if(e.keyCode==9){
                                                                        e.preventDefault();
                                                                        var currentWordListIndex=binarySearch(indexList,cursorIndex)[1]
                                                                        currentWordListIndex+=1; 
                                                                        if(!(currentWordListIndex<endIndex)){
                                                                                currentWordListIndex=0;
                                                                            }
                                                                        textInput.setSelectionRange(indexList[currentWordListIndex][0],indexList[currentWordListIndex][1])
                                                                          
                                                                    }
                                                                    else if(e.keyCode==13){
                                                                        e.preventDefault();
                                                                        flip(true)
                                                                        console.log('next page load function goes here')
                                                                    }
                                                                }
                                                            })
                                                           
                                                            /*
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
                                                            */
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