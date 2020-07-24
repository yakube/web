function MainShip()
{
  this.x=width/2;
  this.y=916;
  this.sprite=mainSprite;
  this.display=function()
  {
    image(this.sprite, this.x, this.y);
  }
}