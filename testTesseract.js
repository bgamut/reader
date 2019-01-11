
var spawn =require('child_process').spawn
var inputPath = '/Users/bernardahn/Desktop/development/software/webapp/reader/temp/jpeg/3.jpeg'
//below is a txt file path minus the file extension
var outputPath = '/Users/bernardahn/Desktop/development/software/webapp/reader/temp/tesseractTest'
var language = 'KOR'
//var language = 'ENG'
var args = [
    inputPath,
    outputPath,
    '-l',language
]
var runningman = spawn('tesseract',args,{stdio:'ignore'})
var koreantext = fs.readFileSync('/Users/bernardahn/Desktop/development/software/webapp/reader/temp/tesseractTest.txt','utf8')