const { ipcRenderer } = require('electron');
let buffers=[];
let row;
let html="";
let i_buffer;
let offset;
let bufferRow;

/** Add IPC event listener */
ipcRenderer.on("loading", (event, data) => {
  row= document.querySelector(".row");
  row.innerHTML=`<div class=" col-md-12 text-center"><?xml version="1.0" encoding="utf-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: rgb(255, 255, 255) none repeat scroll 0% 0%; display: block; shape-rendering: auto;" width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
  <circle cx="50" cy="50" fill="none" stroke="#93dbe9" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
  </circle>
  <!-- [ldio] generated by https://loading.io/ --></svg></div>`;

  
});
/** Add IPC event listener */
ipcRenderer.on("about", (event, data) => {
  alert("Multiple Dump Hex Compare whas made in electron.js\n by Richard Barolin (RBB-soft) 2013")

});
ipcRenderer.on("refresh", (event, data) => {
  location.reload(); 

});
ipcRenderer.on("bufferSend", (event, data) => {
  buffers=[];
  row= document.querySelector(".row");
  row.innerHTML="";
  buffers=data;
 
  i_buffer=0;
  buffers.forEach(element => {
    html+=`<div class="buffer shadow-lg p-3 bg-white rounded">`;
    html+=`<p class="col-md-12 text-center alert alert-primary">`;
    html+=`${element.name}</p>`;
    ////////////////////////////
    
      ////////////////////////////////
      offset=0;
      bufferRow=0;
      html+=`<table id="buffer${i_buffer}">`;
      html+=`<thead><tr>
      <th></th>
      <th class="text-center">0</th>
      <th class="text-center">1</th>
      <th class="text-center">2</th>
      <th class="text-center">3</th>
      <th class="text-center">4</th>
      <th class="text-center">5</th>
      <th class="text-center">6</th>
      <th class="text-center">7</th>
      <th class="text-center">8</th>
      <th class="text-center">9</th>
      <th class="text-center">A</th>
      <th class="text-center">B</th>
      <th class="text-center">C</th>
      <th class="text-center">D</th>
      <th class="text-center">E</th>
      <th class="text-center">F</th>
      
      </tr><thead>`;

      let h=0;
      html+=`<tbody><tr>`;
      element.buffer.forEach( buff =>{
        
        html+= (bufferRow === 0) ? "</tr>" : "";
        html+= ( (bufferRow === 0) && (h === 0) ) ? `<th>000000</th>` : "";
        html+= ( (bufferRow === 0) && (h > 0) ) ? `<th>${fill(h.toString(16).toUpperCase(),6)}</th>` : "";
        html+=`<th title="offset 0x${fill(offset.toString(16).toUpperCase(),2)}" id="os${offset}">${fill(buff.toString(16).toUpperCase(),2)}</th> `;
        html+= (bufferRow === 16) ? "</tr>" : "";
        bufferRow++;
        if(bufferRow === 16){
          bufferRow = 0;
          h+=16;
        }   ;
        offset++;
        
      });
      html+=`</tr></tbody>`;
      html+="</table>";
      ////////////////////////////////
    
    /////////////////////////////  
    html+=`</div>`;
    
    i_buffer++;
    
    
    
  });

  row.innerHTML=html;

  let compare = groupforCompare();
  let _findMatch = findMatch(compare);
  drawBuffers(_findMatch);

});

function groupforCompare(){
  let compare=[];
  let temp=[];
  let totalSize = buffers[0].size;
  let totalBuffers = buffers.length;
  for(i=0;i < totalSize;i++){
    for(j=0;j < totalBuffers;j++){
        temp.push(buffers[j].buffer[i]);
    }
    compare[i]=temp;
    temp=[];
  }
  return compare;
}

function findMatch(compare){
  let result=[];
  i=0;
  buffers[0].buffer.forEach(
      el =>{
      result.push( compare[i].every( element => element === el) );
      i++;
      }
  );
  return result;
}

function drawBuffers(_findMatch){
  for(let i =0;i < buffers[0].size;i++){
    let offset = document.querySelectorAll("#os"+i);
    if(_findMatch[i] === true){
      offset.forEach(
        ele => {
          ele.className="alert-success"
        }
      );
    }else{
      offset.forEach(
        ele => {
          ele.className="bg-danger text-light"
        }
      );
    } 
  }
}

function fill(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}
      

      