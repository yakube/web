function Enemy(x, y)
{
  this.x=x;
  this.y=y;
  this.sprite=random(sprites);
  this.hasLooped=false;
  this.isFlying=false;
  this.display=function()
  {
    image(this.sprite, this.x, this.y);
  }
  this.check=function(other)
  {
    return (this.x-32<other.x+32 && this.x+32>other.x-32 && this.y+32>other.y-32 && this.y-32<other.y+32 && this.y-32>0 && this.y+32<height);//check here if collision doesn't work
  }
}
function Laser(x, y, player, xvf)
{
  effects.laser.play();
  //effects.laser.setVolume(0.2);
  this.x=x;
  this.y=y;
  this.xvf=xvf;
  this.player=player;
  this.pat=random(3);
  this.move=function()
  {
    this.x+=xvf;
    if (this.player==true && this.y>-50)
      this.y-=20;
    else if (this.player==false && this.y<height+50)
      this.y+=14+level;
  }
  this.display=function()
  {
    if (this.player)
    {
      fill(0, 0, 255);
      if (this.pat>2)
        fill(255, 0, 0);
      else if (this.pat>1)
        fill(255, 255, 255);
    } else
      fill(0, 255, 0);
    rect(this.x-4, this.y-7.5, 8, 15);
  }
  this.check=function(other)
  {
    return (this.x-2<other.x+32 && this.x+2>other.x-32 && this.y+7.5>other.y-32 && this.y-7.5<other.y+32 && this.y-7.5>0 && this.y+7.5<height);//and here
  }
}
function Explosion(x, y)
{
  effects.explode.play();
  score++;
  bench++;
  effects.explode.setVolume(0.2);
  if (random(1)>.9) {
    effects.scream.play();
  }
  this.x=x;
  this.y=y;
  this.timeOut=15;
  this.display=function()
  {
    image(exSprite, x, y);
    this.timeOut--;
  }
}
function enemyFire(other)
{
  if (other!=null)
    lasers.push(new Laser(other.x, other.y, false, 0));
}
function fly()
{
  for (var i=0; i<enemies.length; i++)
  {
    if (enemies[i].isFlying==true)
    {
      enemies[i].y+=10;
      enemies[i].x-=random((enemies[i].x-playerShip.x)/50);
      if (enemies[i].y>height+32)
      {
        enemies[i].y=-32;
        enemies[i].hasLooped==true;
      }
      if (enemies[i].y>62 && enemies[i].y<270)// && enemies[i].hasLooped==true)
      {
        enemies[i].isFlying=false;
        enemies[i].hasLooped=false;
      }
    } else
    {
      ebb(enemies[i]);
      if (random(.995+.005*level)>.99)//how likely it is an enemy will fly
        enemies[i].isFlying=true;
    }
  }
}
