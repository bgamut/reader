var path = require('path')
/*
require('electron-reload')(__dirname,{
    electron: path.join(__dirname, 'node_modules', '','electron'),
    hardResetMethod:'exit'
  });
*/
//const ElectronTitlebarwindows = require('electron-titlebar-windows')

const {app, BrowserWindow, Menu, MenuItem,ipcMain,ipcRenderer,remote, webContents} = require('electron');
PDFParser = require('pdf2json')
/*
require('electron-reload')(__dirname);
*/

app.on('ready', () => {
    'use strict';
    //const window = new BrowserWindow({frame:true,width: 375, height: 208,resizeable:false});
    const window = new BrowserWindow({
        width: 250,
        height: 150,
        frame: false,
        resizable:true,
        titleBarStyle: 'hidden'
      });
    window.webPreference = {
        webSecurity: false
    }
    window.loadURL(`file://${__dirname}/html/index.html`);
    var arg = null;
    /*
    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu:[
                {label:'Open',
                    click(){
                        window.webContents.send('open','ping')
                    }
                },
                {label:'Exit',
                    click(){
                        app.quit()
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu)
    */
    ipcMain.on('file_load',function(event,text){
        /*
        var window = remote.getCurrentWindow().focus();
        
        
        win.loadURL('file://${__dirname}/html/scroller.html')
        
        window.loadURL('file://${__dirname}/html/scroller.html')
        */
        
        /*
        let username = process.env.username
        console.log(username)
        */
       /*
       var pdfreader = require("pdfreader");
       var text = ''
       var rows = {}; // indexed by y-position
       
       function printRows() {
         Object.keys(rows) // => array of y-positions (type: float)
           .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
           .forEach(y => 
            console.log((rows[y] || []).join("")));
       }
       
       new pdfreader.PdfReader().parseFileItems(path, function(
         err,
         item
       ) {
         if (!item || item.page) {
           // end of file, or page
           printRows();
           console.log("PAGE:", item.page);
           rows = {}; // clear rows for next page
         } else if (item.text) {
           // accumulate text items into rows object, per line
           (rows[item.y] = rows[item.y] || []).push(item.text);
         }
       });
       */
      /*
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
*/
        

        
    })
});




