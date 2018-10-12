function MainShip()
{
  this.x=random(width/2)+32+width/4;
  this.y=916;
  this.sprite=mainSprite;
  this.display=function()
  {
    tint(255,255,255,255-2*frameTimer);//check later
    image(this.sprite, this.x, this.y);
    noTint();
  }
}
