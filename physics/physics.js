var balls;
var tvec;
var tmomx,tmomy;
var tposx,tposy;
var tr,tg,tb;
var netmass;
function setup() {
  createCanvas(windowWidth, windowHeight);
  balls=[];
  tvec=createVector(0,0);
  for(var x=0; x<15; x++)
  {
    for(var y=0; y<15; y++)
    {
      balls.push(new Ball((x+1)*width/16,(y+1)*height/16,0,0,random(5)+3));
    }
  }
  smooth();
}

function draw() {
  netmass=0;
  background(0);
  for(var i=balls.length-1; i>=0; i--)
  {
    balls[i].a=createVector(0,0);
    netmass+=balls[i].m;
  }
  if(netmass<width*height/1728)
    balls.push(new Ball(random(width),random(height),0,0,5));
  for(var i=0; i<balls.length-1; i++)
  {
    for(var j=i+1; j<balls.length; j++)
    {
       balls[i].gravity(balls[j]);
    }
  }
  for(var i=0; i<balls.length; i++)
     balls[i].move();
  print(netmass);
}
function mouseClicked()
{
  balls.push(new Ball(mouseX,mouseY,mouseX-pmouseX,mouseY-pmouseY,5));
}
function windowResized()
{
  createCanvas(windowWidth, windowHeight);
}