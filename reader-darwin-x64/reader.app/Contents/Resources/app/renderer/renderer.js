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
    document.getElementById('pdfFilePicker').addEventListener('change',readFile,false);
    function readFile(evt){
        var files = evt.target.files;
        var filepath = files[0].path
        console.log(filepath)
        if(filepath!==undefined){
            //pdfjsLib.GlobalWorkerOptions.workerSrc ='http://mozilla.github.io/pdf.js/build/pdf.worker.js';
            pdfjsLib.GlobalWorkerOptions.workerSrc ='./../js/pdfjs/build/pdf.worker.js';
            var rawData = new Uint8Array(fs.readFileSync(filepath))
            console.log(rawData)
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
            document.getElementById('readFile').click()
        }
    }
}
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