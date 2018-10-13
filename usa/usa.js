var backgrounds, curBack, numBacks;
var sprites, mainSprite, starSprites, numSprites, exSprite;
var songs, curSong, numSongs, effects;
var enemies, playerShip;
var lasers, tempLasers;
var explosions;
var temp, ayudame, level;
var score, lives, bench;
var death,start;
var clockwork;
var textLines, spaceMissions;
var arbor;
var un;
var shot;
var spawn;
var frameTimer,sf,cn;

numBacks=8; //change these when adding more
numSongs=6;
numSprites=10;
//((MR|MA)-\d)|(Apollo \d{1,2})|(Skylab \d) usa regex
//\w{3}\.?\s\d{1,2},\s\d{4} usa date
function preload()//Soyuz (\d+|T\S+)[\t\s]  regex for testing mission name (see file)
{
  backgrounds=[];
  songs=[];
  sprites=[];
  enemies=[];
  lasers=[];
  tempLasers=[];
  explosions=[];
  starSprites=[];
  textLines=loadStrings("data/textFiles/spaceMissions.txt");
  spaceMissions=[];

  for (var i=1; i<=numBacks; i++)//loads backgrounds
  {
    backgrounds.push(loadImage("data/backgrounds/a"+i+".jpg"));
  }
  for (var i=1; i<=numSongs; i++)//loads songs
  {
    songs.push(loadSound("data/songs/b"+i+".mp3"));
  }
  for (var i=1; i<=numSprites; i++)//loads sprite images
  {
    sprites.push(loadImage("data/sprites/n"+i+".png"));
  }
  for (var i=1; i<=5; i++)//loads founding fathers
  {
    starSprites.push(loadImage("data/sprites/star"+i+".jpg"));
  }
  mainSprite=loadImage("data/sprites/mainShip.png");//loads player image
effects={laser:
  loadSound("data/soundEffects/q1.mp3"), 
  explode:
  loadSound("data/soundEffects/q2.mp3"), 
  scream:
  loadSound("data/soundEffects/q3.mp3")
};
death={screen:
loadImage("data/backgrounds/deathScreen.jpg"), music:
loadSound("data/songs/deathMusic.mp3")};
exSprite=loadImage("data/sprites/explode.png");
start=loadImage("data/backgrounds/startScreen.jpg");
}
function setup() {
  cn=createCanvas(1920, 1080);
  sf=min(windowWidth/1920,windowHeight/1080);
  cn.size(1920*sf,1080*sf);
  cn.position((windowWidth-1920*sf)/2,(windowHeight-1080*sf)/2);
  curBack=random(backgrounds);
  curSong=random(songs);
  //curSong.play();
  enemiesPlease();
  frameTimer=0;
  un=3;
  for (var i=0; i<textLines.length; i++)
  {
    spaceMissions.push( {
     mission:/(((MR|MA)-\d)|(Apollo \d{1,2})|(Skylab \d)|(Gemini \w+(\S+)?))/.exec(textLines[i]), //copy below when autoformatting  
     date:/(\w{3}\.?\s\d{1,2},\s\d{4})/.exec(textLines[i])}); 
    /*
    spaceMissions.push( {
     mission:/(((MR|MA)-\d)|(Apollo \d{1,2})|(Skylab \d)|(Gemini \w+(\S+)?))/.exec(textLines[i]), //copy below when autoformatting  
     date:/(\w{3}\.?\s\d{1,2},\s\d{4})/.exec(textLines[i])}); 
     */
  }
  for (var i=0; i<spaceMissions.length; i++)//test if regex was successful - works
  {
    spaceMissions[i].date=spaceMissions[i].date[0];
    //print(spaceMissions[i].date);
  }
  playerShip=new MainShip();
  score=0;
  lives=3;
  isDead=false;
  clockwork=0;
  bench=0;
  level=1;
  makeMeATree();
  ayudame=true;
  noCursor();
  strokeWeight(4);
  shot=5;
  spawn=false;
}
function draw() {
  scale(sf);
  clockwork++;
  if (lives<0)//player is dead
  {
    lives=999;
    curSong.pause();
    death.music.play();
  }else if(lives>900)
  {
    imageMode(CORNER);
    image(death.screen,0,0);
    imageMode(CENTER);
    textAlign(CENTER);
    stroke(0);
    strokeWeight(12);
    fill(255);
    textSize(70);
    fill(255,100,100);
    text("Alas, you destroyed "+score+" of them", 1920/2, -100+1080/4);
    text("But it wasn't enough", 1920/2, 1080/4);
    fill(255);
    text("This was the day freedom died",1920/2, 1080/2);
    text("(Jul 4, 1776 - "+arbor.value.date+")", 1920/2, 100+1080/2);
    fill(150,150,255);
    text("[F5] Rise Again", 1920/2, 100+3*1080/4);
    text("[F11] Toggle Fullscreen", 1920/2, 200+3*1080/4);
  }
  else if(lives>2)
  {
    image(start,0,0);//start screen design
  textAlign(CENTER,CENTER);
  strokeWeight(8)
  stroke(0);
  fill(255);
  textSize(100);
  fill(255,255,0);
  text(arbor.value.date,1920/2,1080/10);
  textSize(70);
  text("Mission: "+arbor.value.mission[0],1920/2,20+1080/5);
  textSize(40);
  fill(255);
  text("When I embarked on my first spaceflight, I never imagined it'd be a warzone",1920/2,125+1080/5);
  text("But I discovered Pandora's Box",1920/2,175+1080/5);
  text("A wormhole, bridging space and time, deep into the thermosphere",1920/2,225+1080/5);
  text("Now I'm the only thing standing between America",1920/2,275+1080/5);
  text("And the enemy from a thousand realities",1920/2,325+1080/5);
  text("I will defend the homeland at all costs",1920/2,375+1080/5);
  textSize(80);
  fill(255,0,0);
  text("The Republic Will Not Fall",1920/2,475+1080/5);
  textAlign(LEFT,BASELINE);
  strokeWeight(4);
  }
  else if (lives>=0 && lives<900)//player is alive
  {
    jukeBox();//keeps songs rolling
    imageMode(CORNER);
    image(curBack,0,0);//background stuff
    imageMode(CENTER);

    if (keyIsDown(LEFT_ARROW)&&playerShip.x>32&&spawn)//basic controls
      playerShip.x-=10;
    if (keyIsDown(RIGHT_ARROW)&&playerShip.x<1888&&spawn)
      playerShip.x+=10;
    if (enemies.length>0)//enemies still exist
    {
      for (var i=lasers.length-1; i>=0; i--)//display all things
      {
        lasers[i].move();
        lasers[i].display();
        temp=true;
        for (var j=enemies.length-1; j>=0; j--)
        {
          if (lasers[i].player==true && lasers[i].check(enemies[j])==true)//checks enemy collision
          {
            explosions.push(new Explosion(enemies[j].x, enemies[j].y));//something is making enemies explode below screen
            enemies.splice(j, 1);
            //score++;
            temp=false;
          }
        }
        if (lasers[i].player==false && lasers[i].check(playerShip)==true && frameTimer<=0)
        {
          score--;
          bench--;
          explosions.push(new Explosion(playerShip.x, playerShip.y));
          //playerShip=new MainShip();
          //lives--;
          if(lives==0)
            lives--;
          spawn=false;//----respawn feature
          playerShip.y=1280;
          temp=false;
        }
        if (temp==true)
          tempLasers.push(lasers[i]);
        if (lasers[i].y>1080+5 || lasers[i].y<-5)//remove unseen lasers
          lasers.splice(i, 1);
      }
      lasers=tempLasers;
      tempLasers=[];
      for (var i=0; i<explosions.length; i++)//handle explosions
      {
        explosions[i].display();
        if (explosions[i].timeOut>0)
          tempLasers.push(explosions[i]);
      }
      explosions=tempLasers;
      tempLasers=[];
      for (var i=enemies.length-1; i>=0; i--)//enemies
      {
        enemies[i].display();
        if (enemies[i].check(playerShip)==true && frameTimer<=0)//---------------
        {
          explosions.push(new Explosion(enemies[i].x, enemies[i].y));
          explosions.push(new Explosion(playerShip.x, playerShip.y));
          enemies.splice(i, 1);
         // playerShip=new MainShip();
          //lives--;
          //score++;
          if(lives==0)
            lives--;
          score--;
          bench--;
          spawn=false;
          playerShip.y=1280;
        }
      }
      if (random(.998+.002*level)>.95&&spawn)//how likely it is any enemy will fire
        enemyFire(random(enemies));
      fly();
      if (clockwork>180)
        clockwork=0;
      else if (clockwork>135 || clockwork<=45)
        setEbb(-.5*(clockwork%45)/5);
      else if (clockwork>45)
        setEbb(.5*(clockwork%45)/5);
    }
     else//all enemies killed
    {
      if (ayudame==true)//ayudame por favor
      {
        lasers=[];
        ayudame=false;
      }
      for (var i=0; i<lasers.length; i++)//display all things
      {
        lasers[i].move();
        lasers[i].display();
        if (lasers[i].y<1080/2)
        {
          if (shot==5)
            score+=50
  else
  score+=5*shot;
shot=5;
if (lasers[i].x<1920/2)
{
  if (arbor.left!=null)
    arbor=arbor.left;
  else
    makeMeATree();
} else
{
  if (arbor.right!=null)
    arbor=arbor.right;
  else
    makeMeATree();
}
curBack=random(backgrounds);
level++;
enemiesPlease();
ayudame=true;
}
}
textAlign(CENTER);
textSize(32);
fill(0, 0, 255, 100);
rect(0, 0, 1920/2, 1080/2);      
fill(255, 0, 0, 100);
rect(1920/2, 0, 1920/2, 1080/2);
fill(255);
if (arbor.left!=null)
  text("Shoot Here for "+arbor.left.value.mission[0], 1920/4, 1080/4);
else
  text("Curtain #1", 1920/4, 1080/4); 
if (arbor.right!=null)
  text("Shoot Here for "+arbor.right.value.mission[0], 3*1920/4, 1080/4);
else
  text("Curtain #2", 3*1920/4, 1080/4);
textAlign(LEFT);
}
playerShip.display();
fill(0, 0, 255);//hud
rect(0, 980, 1420, 100);
fill(255);
rect(1420, 980, 500, 100);
fill(255, 0, 0)
  rect(1420, 980, (bench-(48*level)+48)*(500/48), 100);
for (var i=0; i<5; i++)
{
  //if (bench+(shot-5)*(((i+1)*(48/5))+((level-1)*48))>=((i+1)*(48/5))+((level-1)*48))
  tint(255,255,0,125);
  if (0>=1+i-(bench-48*(level-1))/9.6)
    image(starSprites[i], 1470+100*i, 1030);//star shadows
  noTint();
  if (shot>= 6+i-(bench-48*(level-1))/9.6)
    image(starSprites[i], 1470+100*i, 1030);//stars
}
fill(255,255,255,0);
for(var rpq=0; rpq<5; rpq++)//grid pattern
  rect(1420+100*rpq,980,100,100);
//shot>= 6-(bench-48*(level-1))/9.6
//if (bench+(shot-5)*((48/5)+((level-1)*48))>=(48/5)+((level-1)*48))//pres shot notification
if (shot>= 6-(bench-48*(level-1))/9.6)
{
  if (enemies.length>0)//notify shot avail
  {
    textSize(30);
    fill(255,255,0);
    stroke(0,0,255);
    text("[B] Presidential Scattershot", 1450, 950);
    stroke(0);
  }
   else//notify point bonus
  {
    textSize(30);
    fill(200, 200, 50);
    if (shot==5)
      text("+50 Presidential Bonus", 1450, 950);
    else
      text("+"+(5*shot)+" Presidential Bonus", 1450, 950);
  }
}
textSize(40);
fill(255, 255, 0);
strokeWeight(8);
stroke(0);
text(score, 25, 50)
  textAlign(RIGHT);
fill(0,255,0);
text("Lv."+level, 1920-25, 50);
if (lives>0)
  image(mainSprite, 1920-64, 100);
if (lives>1)
  image(mainSprite, 1920-64, 180);
textAlign(CENTER);
textSize(75);
stroke(0);
fill(255);
if(frameTimer>0)//frameTimer tester-works
  frameTimer--;
//print(frameTimer);
fill(255,0,0);
text(arbor.value.mission[0], 1920/6, 1050);
fill(255);
text(arbor.value.date, 1920/2, 1050);
if(lives==2 && frameTimer>0)
{
  fill(255,255,255,15+frameTimer*3);
  stroke(0,0,0,15+frameTimer*2);
  textSize(50);
  text("[SPACE] Fire\t\t\t\t\t\t[<][>] Move",1920/2,2*1080/3);
}
textAlign(LEFT)
strokeWeight(4);
stroke(0);
}
if (spawn==false && lives<900 && lives>=0)
  {
    fill(255,165,0);
    textAlign(CENTER,CENTER);
    rectMode(CENTER);
    rect(1920/2,3*1080/4,300,60);
    fill(255);
    textSize(40);
    text("[CTRL] Spawn", 1920/2, 3*1080/4);
    rectMode(CORNER);
    textAlign(LEFT,BASELINE);
    strokeWeight(4);
  } 
}
function jukeBox()
{
  if (!curSong.isPlaying())
  {
    curSong=random(songs);
    curSong.play();
  }
}
function keyPressed()
{
  if (spawn==true && lives<900)
  {
    //print(key);
    //(score>=((i+1)*(48/5))+((level-1)*48))
    //(score-48*(level-1))/9.6
    if ((key=="v"||key=="b"||key=="n"||key=="m"||key=="c"||key=="V"||key=="B"||key=="N"||key=="M"||key=="C")&&(enemies.length>0)&&(shot>= 6-(bench-48*(level-1))/9.6))
    {
      shot--;
      if (((bench-48*(level-1))/9.6)>5-shot)
      {
        lasers.push(new Laser(playerShip.x, playerShip.y, true, 0));
        lasers.push(new Laser(playerShip.x+15, playerShip.y, true, 1));
        lasers.push(new Laser(playerShip.x-15, playerShip.y, true, -1));
        lasers.push(new Laser(playerShip.x+30, playerShip.y+5, true, 2));
        lasers.push(new Laser(playerShip.x-30, playerShip.y+5, true, -2));
      }
      if (((bench-48*(level-1))/9.6)>6-shot)
      {
        lasers.push(new Laser(playerShip.x+30, playerShip.y+10, true, 3));
        lasers.push(new Laser(playerShip.x-30, playerShip.y+10, true, -3));
      }
      if (((bench-48*(level-1))/9.6)>7-shot)
      {
        lasers.push(new Laser(playerShip.x+45, playerShip.y+15, true, 4));
        lasers.push(new Laser(playerShip.x-45, playerShip.y+15, true, -4));
      }
      if (((bench-48*(level-1))/9.6)>8-shot)
      {
        lasers.push(new Laser(playerShip.x+60, playerShip.y+20, true, 5));
        lasers.push(new Laser(playerShip.x-60, playerShip.y+20, true, -5));
      }
    }
    if (keyCode==32)
      lasers.push(new Laser(playerShip.x, playerShip.y, true, 0));
  } else if (keyCode==CONTROL)
  {
    spawn=true;
    playerShip=new MainShip();
    lives--;
    frameTimer=120;
  }
}
function mixIt(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}
function makeMeATree()
{
  spaceMissions=mixIt(spaceMissions);
  arbor=new Tree(spaceMissions[0]);//convert randomized array to tree
  for (var i=1; i<spaceMissions.length; i++)
  {
    arbor.insert(spaceMissions[i]);
  }
}
function enemiesPlease()
{
  for (var i=0; i<16; i++)//enemy columns normally 16
  {
    for (var j=0; j<3; j++)//enemy rows normally 3
    {
      enemies.push(new Enemy(320+i*80, 80+j*80));
    }
  }
}
function windowResized()
{
  imageMode(CENTER);
  sf=min(windowWidth/1920,windowHeight/1080);
  cn.size(1920*sf,1080*sf);
  cn.position((windowWidth-1920*sf)/2,(windowHeight-1080*sf)/2);
  noCursor();
  imageMode(CORNER);
}
