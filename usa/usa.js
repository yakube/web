var backgrounds, curBack, numBacks;
var sprites, mainSprite, starSprites, numSprites, exSprite;
var songs, curSong, numSongs, effects;
var enemies, playerShip;
var lasers, tempLasers;
var explosions;
var temp, ayudame, level;//main problem--presidential appearance based on score NOT enemies destroyed. Fix ambiguity in next update ;0
var score, lives;
var death;
var clockwork;
var textLines, spaceMissions;
var arbor;
var un;
var shot;

numBacks=4; //change these when adding more
numSongs=3;
numSprites=9;
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
}
function setup() {
  createCanvas(1920, 1080);
  curBack=random(backgrounds);
  curSong=random(songs);
  curSong.play();
  enemiesPlease();
  un=3;
  for (var i=0; i<textLines.length; i++)
  {
    spaceMissions.push( {
    mission:/(((MR|MA)-\d)|(Apollo \d{1,2})|(Skylab \d))/.exec(textLines[i]), //usually messed up by auto format    
    date:/(\w{3}\.?\s\d{1,2},\s\d{4})/.exec(textLines[i])});
  }
  for (var i=0; i<spaceMissions.length; i++)//test if regex was successful
  {
    spaceMissions[i].date=spaceMissions[i].date[0];
    print(spaceMissions[i].date);
  }
  playerShip=new MainShip();
  exSprite=loadImage("data/sprites/explode.png");
  score=0;
  lives=2;
  isDead=false;
  clockwork=0;
  level=1;
  makeMeATree();
  ayudame=true;
  noCursor();
  strokeWeight(4);
  shot=5;
}
function draw() {
  clockwork++;
  if (lives<0)//player is dead
  {
    lives=999;
    imageMode(CORNER);
    background(death.screen);
    imageMode(CENTER);
    textAlign(CENTER);
    stroke(0);
    strokeWeight(8);
    fill(255);
    textSize(48);
    text("You scored "+score+" freedom points",width/2,(height/2)-100);
    text("But the War on Terror is never over",width/2,(height/2)-30);
    text("(Jul 4, 1776 - "+arbor.value.date+")",width/2,(height/2)+40);
    text("Press F5 to Retaliate",width/2,(height/2)+390);
    text("Press F11 to Exit Fullscreen",width/2,(height/2)+460);
    curSong.pause();
    death.music.play();
  } else if (lives>=0 && lives<100)//player is alive
  {
    jukeBox();//keeps songs rolling
    imageMode(CORNER);
    background(curBack);//background stuff
    imageMode(CENTER);

    if (keyIsDown(LEFT_ARROW)&&playerShip.x>32)//basic controls
      playerShip.x-=10;
    if (keyIsDown(RIGHT_ARROW)&&playerShip.x<1888)
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
        if (lasers[i].player==false && lasers[i].check(playerShip)==true)
        {
          score--;
          explosions.push(new Explosion(playerShip.x, playerShip.y));
          playerShip=new MainShip();
          lives--;
          temp=false;
        }
        if (temp==true)
          tempLasers.push(lasers[i]);
        if (lasers[i].y>height+5 || lasers[i].y<-5)//remove unseen lasers
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
        if (enemies[i].check(playerShip)==true)//---------------
        {
          explosions.push(new Explosion(enemies[i].x, enemies[i].y));
          explosions.push(new Explosion(playerShip.x, playerShip.y));
          enemies.splice(i, 1);
          playerShip=new MainShip();
          lives--;
          //score++;
          score--;
        }
      }
      if (random(1)>.95)//how likely it is any enemy will fire
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
      if(ayudame==true)//ayudame por favor
      {
        lasers=[];
        ayudame=false;
      }
      for (var i=0; i<lasers.length; i++)//display all things
      {
        lasers[i].move();
        lasers[i].display();
        if(lasers[i].y<height/2)
        {
          if(shot==5)
            score+=50
          else
            score+=5*shot;
          shot=5;
          if(lasers[i].x<width/2)
          {
            if(arbor.left!=null)
              arbor=arbor.left;
            else
              makeMeATree();
          }
          else
          {
            if(arbor.right!=null)
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
        fill(0,0,255,100);
        rect(0,0,width/2,height/2);      
        fill(255,0,0,100);
        rect(width/2,0,width/2,height/2);
        fill(255);
        if(arbor.left!=null)
          text("Shoot Here for "+arbor.left.value.mission[0],width/4,height/4);
        else
          text("Curtain #1",width/4,height/4); 
        if(arbor.right!=null)
          text("Shoot Here for "+arbor.right.value.mission[0],3*width/4,height/4);
        else
          text("Curtain #2",3*width/4,height/4);
      textAlign(LEFT);
    }
    playerShip.display();
    fill(0,0, 255);//hud
    rect(0, 980, 1420, 100);
    fill(255);
    rect(1420, 980, 500, 100);
    fill(255,0,0)
    rect(1420,980,(score-(48*level)+48)*(500/48),100);
    for (var i=0; i<5; i++)
    {
      if (score+(shot-5)*(((i+1)*(48/5))+((level-1)*48))>=((i+1)*(48/5))+((level-1)*48))
        image(starSprites[i], 1470+100*i, 1030);//stars
    }
    if (score+(shot-5)*((48/5)+((level-1)*48))>=(48/5)+((level-1)*48))//pres shot notification
    {
      if(enemies.length>0)//notify shot avail
      {
        textSize(30);
        fill(255);
        text("Press B for Presidential Shot",1450,950); 
      }
      else//notify point bonus
      {
      }
    }
    textSize(40);
    fill(255,255,0);
    strokeWeight(8);
    stroke(0);
    text(score,25,50)
    textAlign(RIGHT);
    text("Lv."+level,width-25,50);
    if(lives>0)
      image(mainSprite,width-64,100);
    if(lives>1)
      image(mainSprite,width-64,180);
    textAlign(CENTER);
    textSize(75);
    stroke(0);
    fill(255);
    text(arbor.value.mission[0]+"\t\t\t\t\t\t\t"+arbor.value.date, width/3, 1050);
    textAlign(LEFT)
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
  //print(key);
  //(score>=((i+1)*(48/5))+((level-1)*48))
  //(score-48*(level-1))/9.6
  if ((key=="v"||key=="b"||key=="n"||key=="m"||key=="c"||key=="V"||key=="B"||key=="N"||key=="M"||key=="C")&&(enemies.length>0)&&(shot>= 6-(score-48*(level-1))/9.6))
  {
    shot--;
    lasers.push(new Laser(playerShip.x,playerShip.y,true));
    lasers.push(new Laser(playerShip.x+15,playerShip.y,true));
    lasers.push(new Laser(playerShip.x+30,playerShip.y,true));
    lasers.push(new Laser(playerShip.x-15,playerShip.y,true));
    lasers.push(new Laser(playerShip.x-30,playerShip.y,true));
  }
  if (keyCode==32)
    lasers.push(new Laser(playerShip.x, playerShip.y, true));
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
