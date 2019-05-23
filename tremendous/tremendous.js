var cn,sf;//canvas stuff
var bg,head,left,right;
var sayings;
var dista;
var letters;
function preload(){
  bg=loadImage("data/bg0.jpg");
  head=loadImage("data/trumphead.png");
  left=loadImage("data/left.png");
  right=loadImage("data/right.png");
  sayings=loadStrings("data/tremendous.txt");
} 
function setup() {
  cn=createCanvas(1920,1080);//--------------------canvas stuff
  sf=min(windowWidth/1920,windowHeight/1080);
  cn.size(1920*sf,1080*sf);
  cn.position((windowWidth-1920*sf)/2,(windowHeight-1080*sf)/2);//-------------end here
  rectMode(CENTER);
  letters=[];
}

function draw() {
  scale(sf);
  image(bg,0,0);
  imageMode(CENTER);
  for(var i=letters.length-1; i>=0; i--)
  {
    letters[i].move();
    letters[i].display();
    if(letters[i].y<-100)
      letters.splice(i,1);
  }
  dista=map(mouseY, height, 0, 150, 700);
  if(dista>700)
    dista=700;
  if(dista<150)
    dista=150;
  fill(0,0,150);
  rect(1920/2,990,1920-dista*2-250,50);
  image(left,dista,1000);
  image(right,1920-dista,1000);
  rect(1920/2,900,250,375);
  image(head,1920/2,800);
  textAlign(CENTER);
  fill(0,255,0,500-frameCount);
  textSize(50);
  strokeWeight(7);
  stroke(0,0,0,500-frameCount);
  text("Move the mouse\nand click the screen\nto do tremendous things\nwith this economy",1920/2,200);
  stroke(0);
  strokeWeight(1);
  imageMode(CORNER);
}
function windowResized()
{
  imageMode(CENTER);//-----------canvas stuff
  sf=min(windowWidth/1920,windowHeight/1080);
  cn.size(1920*sf,1080*sf);
  cn.position((windowWidth-1920*sf)/2,(windowHeight-1080*sf)/2);
  imageMode(CORNER);//------------end here
}
function mouseClicked()
{
  var str=random(sayings);
  letters.push(new Letter(dista,1000,str));
  letters.push(new Letter(1920-dista,1000,str));
}
