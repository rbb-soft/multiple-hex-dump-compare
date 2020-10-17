const { app, BrowserWindow, Menu, dialog , ipcMain } = require('electron');
const fs = require("fs");
let mainWindow;
let buffers=[];

app.on('ready', () =>{
    mainWindow =    new BrowserWindow(
        {
            webPreferences: {
              nodeIntegration: true
            },
            icon: __dirname+"/icon.ico",
            show: false
          }
        
        );

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainMenu=Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
    
    mainWindow.maximize();
    mainWindow.show();

    
})

const templateMenu = [
    {
        label: "Menu",
        submenu : [
            {
                label: "Open binaries",
                accelerator: "Ctrl+A",
                click(){
                    openfile();
                }
            },{
                label: "About Multiple Dump Hex Compare",
                click(){
                    mainWindow.webContents.send("about", buffers);
                }
            },{
                label: "Exit",
                accelerator: "Ctrl+Q",
                click(){
                    app.quit();
                }
            }
        ]
    } /*
    ,
    {
        label : "Dev Tools",
        submenu: [
            {
                label: "show/hide Devtools",
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();

                }
            },
            {
                role: 'reload',
            },
            {
                label :"test",
                click(){
                    console.log(process.env.NODE_ENV);
                }
            }
        ]
    } */
];

function openfile(){
    mainWindow.webContents.send("refresh", buffers);
    buffers=[];
    const files = dialog.showOpenDialog(mainWindow, {
        properties: ['openFile','multiSelections'],
        filters: [
            { name: 'Archivos Binarios', extensions: ['bin'] },
            { name: 'Todos los archivos', extensions: ['*'] }
        ]
      }).then(result => {
        
        if(!result.canceled){
            mainWindow.webContents.send("loading", buffers);
            result.filePaths.forEach(
                file => {
                    let indexName = file.split("\\").length -1;
                    buffers.push(
                        {
                            name: file.split("\\")[indexName],
                            buffer : fs.readFileSync(file),
                            size: fs.readFileSync(file).length
                        }
                    );
                }
            );
            
            mainWindow.webContents.send("bufferSend", buffers);
            //console.log(buffers);
        }
        

      }).catch(err => {
        console.log(err)
      })

    if(!files) return;

    

}


