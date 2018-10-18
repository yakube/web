function Ball(x,y,vx,vy,m)
{
  this.p=createVector(x,y);
  this.v=createVector(vx,vy);
  this.a=createVector(0,0);
  this.m=m;
  this.move=function()
  {
    this.v.add(this.a);
    if(this.p.y>height)
      this.v.y=-abs(this.v.y);
    else if(this.p.y<0)
      this.v.y=abs(this.v.y);
    if(this.p.x>width)
      this.v.x=-abs(this.v.x);
    else if(this.p.x<0)
      this.v.x=abs(this.v.x);
    this.p.add(this.v);
    fill(map(this.p.x,0,width,0,255),this.m+55,map(this.p.y,0,height,0,255));
    ellipse(this.p.x,this.p.y,this.m,this.m);
  }
  this.gravity=function(other)
  {
    tvec=createVector(this.p.x-other.p.x,this.p.y-other.p.y);
    if(this.p.dist(other.p)>(this.m+other.m)/2)
    {
      tvec.setMag(this.m*other.m*20/pow(this.p.dist(other.p),2));
      this.a.add(tvec.x/this.m,tvec.y/this.m);
      other.a.add(tvec.x/other.m,tvec.y/other.m);
    }
    else
      this.conglom(other);
  }
  this.conglom=function(other)
  {
    tmomx=((this.m*this.v.x)+(other.m*other.v.x))/(this.m+other.m);
    tmomy=((this.m*this.v.y)+(other.m*other.v.y))/(this.m+other.m);
    tposx=((this.m*this.p.x)+(other.m*other.p.x))/(this.m+other.m);
    tposy=((this.m*this.p.y)+(other.m*other.p.y))/(this.m+other.m);
    balls.push(new Ball(tposx,tposy,tmomx,tmomy,this.m+other.m));
    if(this.m+other.m>200)
      balls[balls.length-1].nova(1);
    for(var i=balls.length-1; i>=0; i--)
    {
      if(balls[i]==this || balls[i]==other)
        balls.splice(i,1);
    }
  }
  this.nova=function(honk)
  {
    balls.push(new Ball(this.p.x+this.m/8,this.p.y+this.m/8,this.v.x+m/(random(10)+25),this.v.y+m/(random(10)+25),this.m/(random(5)+7)));
    balls.push(new Ball(this.p.x-this.m/8,this.p.y+this.m/8,this.v.x-m/(random(10)+25),this.v.y+m/(random(10)+25),this.m/(random(5)+7)));
    balls.push(new Ball(this.p.x+this.m/8,this.p.y-this.m/8,this.v.x+m/(random(10)+25),this.v.y-m/(random(10)+25),this.m/(random(5)+7)));
    balls.push(new Ball(this.p.x-this.m/8,this.p.y-this.m/8,this.v.x-m/(random(10)+25),this.v.y-m/(random(10)+25),this.m/(random(5)+7)));
    
    balls.push(new Ball(this.p.x+this.m/6,this.p.y,this.v.x+m/(random(10)+15),this.v.y,this.m/(random(5)+7)));
    balls.push(new Ball(this.p.x,this.p.y+this.m/6,this.v.x,this.v.y+m/(random(10)+15),this.m/(random(5)+7)));
    balls.push(new Ball(this.p.x-this.m/6,this.p.y,this.v.x-m/(random(10)+15),this.v.y,this.m/(random(5)+7)));
    balls.push(new Ball(this.p.x,this.p.y-this.m/6,this.v.x,this.v.y-m/(random(10)+15),this.m/(random(5)+7)));
    for(var i=balls.length-1; i>=0; i--)
    {
      if(balls[i]==this)
        balls.splice(i,1);
    }
  }
}