let gallery = document.querySelector(".gallery");
gallery.addEventListener("click", () => {
    location.assign("./gallery.html");
});
var uid = new ShortUniqueId();

let video=document.querySelector("video");
let capturebtnCont=document.querySelector(".capture-btn-cont");
let cpatureBTN=document.querySelector(".capture-btn");
let recorderBtnCont=document.querySelector(".recorder-btn-cont");
let recorederBtn=document.querySelector(".recorder-btn")
let transaprenColor="transparent";
let recoreder;
let chunks=[];

let constraints ={
    video:true,
    audio:false
}
let shouldrecorder = false;

navigator.mediaDevices.getUserMedia(constraints)
    .then((stream)=>{
        video.srcObject=stream;
        recoreder = new MediaRecorder(stream);

        recoreder.addEventListener("start", () => {
            chunks =[];
            console.log("recorder start");
        })
        recoreder.addEventListener("datataavilabal",(e)=>{
            chunks.push(e.data);
            console.log("recording push in chunk");
        })
        recoreder.addEventListener("stop",()=>{
            let blob= new Blob(chunks,{type:'video/mp4'});
            console.log("rec stopped");
            let videoURl=URL.createObjectURL(blob);
            console.log(videoURl);
           // let a = document.createElement('a');
            //a.href = videoURl;
            //a.download = "myVideo.mp4";
            //a.click();
            // store in data base
            if(db){
                let videoId = uid();
                let dbTransaction = db.transaction("video", "readwrite");
                let videoStore = dbTransaction.objectStore("video");
                let videoEntry = {
                    id: `vid-${videoId}`,
                    blobData: blob,
                };
                let addRequest = videoStore.add(videoEntry);
                addRequest.onsuccess = () => {
                    console.log("video added to db successfully");
        };
      }
            
        })
    });
capturebtnCont.addEventListener("click",() => {
    cpatureBTN.classList.add("scale-capture");
    let canvas=document.createElement("canvas");
    let tool=canvas.getContext("2d");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    tool.fillStyle=transaprenColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);
    let imageURL = canvas.toDataURL();
    //let img = document.createElement("img");
    //img.src = imageURL;
    //((document.body.append(img);
    if (db) {
        let imageId = uid();
        let dbTransaction = db.transaction("image", "readwrite");
          let imageStore = dbTransaction.objectStore("image");
          let imageEntry = {
            id: `img-${imageId}`,
            url: imageURL,
          };
          let addRequest=imageStore.add(imageEntry);
          addRequest.onsuccess=() => {
           console.log("image added to db successfully");   
          }
      }
      setTimeout(() => {
        cpatureBTN.classList.remove("scale-capture");
      }, 510);
})
recorderBtnCont.addEventListener("click",() => {
     shouldrecorder = !shouldrecorder;
    if (shouldrecorder) {
        recorederBtn.classList.add("scale-record")
        //recording start
        recoreder.start();
        // start timer
        startTimer();
    }else{
        recorederBtn.classList.remove("scale-record")
        recoreder.stop();
        stopTimer();
    }
});
let timer = document.querySelector(".time");
let counter=0;
let timerID;
function startTimer(){
    timer.style.display = "block";
    function displayTimer() {
      let totalSeconds = counter;
  
      let hours = Number.parseInt(totalSeconds / 3600);
      totalSeconds = totalSeconds % 3600;
  
      let minutes = Number.parseInt(totalSeconds / 60);
      totalSeconds = totalSeconds % 60;
  
      let seconds = totalSeconds;
  
      hours = hours < 10 ? `0 ${hours}` : hours;
      minutes = minutes < 10 ? `0 ${minutes}` : minutes;
      seconds = seconds < 10 ? `0 ${seconds}` : seconds;
      timer.innerText = `${hours}:${minutes}:${seconds}`;
  
      counter++;
    }
  
    timerID = setInterval(displayTimer, 1000);
    counter = 0;
}

function stopTimer(){
    clearInterval(timerID);
  timer.innerText = "00:00:00";
  timer.style.display = "none";
    // timerEle.classList.remove("timing-active");
    // timerEle.innerText="00:00:00";
    // clearInterval(clearObj);

}
//filter add
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {
  filterElem.addEventListener("click", () => {
    transaprenColor =
      getComputedStyle(filterElem).getPropertyValue("background-color");
    filterLayer.style.backgroundColor = transaprenColor;
  });
});
