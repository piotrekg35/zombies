var pointer = document.querySelector(".pointer");
var body = document.querySelector("body");
var licznik=document.getElementById("licznik");
var nickdisplay=document.getElementById("nick-display");
var pozostale_zycie=3;
var modal = document.getElementById("modal");
var modal2 = document.getElementById("modal2");
var span = document.getElementsByClassName("close")[0];
var modalok = document.getElementById("modalok");
var nickinput = document.getElementById("nickinput");
var nick="";
var gameinfo=document.getElementById("gameinfo");
var jsondata=""
var ranking=document.getElementsByTagName("ol")[0];

window.addEventListener("mousemove",function(event) {
  let x = event.screenX;
  let y = event.screenY;
  pointer.style.left=(x-15)+"px";
  pointer.style.top=(y-85)+"px";
});

body.addEventListener("click",function(event){
  event.stopPropagation();
  licznik.innerHTML=Number(licznik.innerHTML)-6;
})
modal.addEventListener("click",function(event){
  event.stopPropagation();
})
modal2.addEventListener("click",function(event){
  event.stopPropagation();
})
modalok.addEventListener("click",function(event){
  nick=nickinput.value;
  if(nick!=""){
  modal.style.display = "none";
  nickdisplay.innerHTML=nick;
  nickdisplay.style.left=Number(body.offsetWidth/2-nickdisplay.offsetWidth/2)+"px";
  pozostale_zycie=3;
  licznik.innerHTML=0;
  gameinfo.innerHTML="Score: ";
  game();
  }
})
span.addEventListener("click",function(event){
  modal2.style.display = "none";
  nickdisplay.innerHTML="";
  let lilist=document.getElementsByTagName("li");
  for (var i = lilist.length - 1; i >= 0; i--) {
    lilist[0].parentNode.removeChild(lilist[0]);
  }
  modal.style.display = "block";
})
function getDate(){
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = today.getFullYear();
  return dd + '.' + mm + '.' + yyyy;
}
function removeAllZombies(){
  let zombies=document.getElementsByClassName("zombie");
  for (var i = zombies.length - 1; i >= 0; i--) {
    zombies[0].parentNode.removeChild(zombies[0]);
  }
}
function game(){
  let newzombie=document.createElement("img");
  newzombie.setAttribute("src","img/walkingdead.png");
  newzombie.setAttribute("class","zombie");
  newzombie.setAttribute('draggable', false);
  newzombie.style.userSelect="none";
  newzombie.style.position="absolute";
  newzombie.style.right="0px";
  newzombie.style.bottom=Math.ceil(Math.random()*100)+"px";
  newzombie.style.height=(Math.ceil(Math.random()*200)+100)+"px";
  newzombie.addEventListener("load",function(){
    let animation_time=Math.ceil(Math.random()*3)+3;
    newzombie.style.transition="transform "+animation_time+"s linear";
    newzombie.style.transform="translateX(-"+body.offsetWidth+"px)";
  })
  newzombie.addEventListener("click",function(event){
    event.stopPropagation();
    licznik.innerHTML=Number(licznik.innerHTML)+12;
    newzombie.remove();
  })
  newzombie.addEventListener("transitionend",function(){
    pozostale_zycie--;
    newzombie.remove();
  })
  if(pozostale_zycie<=0){
    removeAllZombies();
    let link="https://jsonblob.com/api/1049629625894060032";
    fetch(link)
    .then((response) => response.json())
    .then((data)=>{
      jsondata=data.top
      if(jsondata.length<7 || jsondata[jsondata.length-1].score<Number(licznik.innerHTML))
      {
        jsondata.push({"nick": nick, "score": Number(licznik.innerHTML), "date":getDate()})
        jsondata.sort((a,b)=>b.score-a.score);
        if(jsondata.length==8)jsondata.splice(jsondata.length-1,1);
        fetch(link, {  
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({"top": jsondata})
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
      }
      jsondata.forEach(function(v,idx,arr){
        let li =document.createElement("li");
        li.innerHTML=v.nick+", "+v.score+", "+v.date;
        ranking.appendChild(li);
      });
    });
    gameinfo.innerHTML+=licznik.innerHTML;
    modal2.style.display = "block";
    return;
  }
  body.appendChild(newzombie);
  let timeOut=Math.ceil(Math.random()*800)+300;
  setTimeout(game,timeOut);
}

modal.style.display = "block";
