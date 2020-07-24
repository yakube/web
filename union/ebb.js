var hop;
function setEbb(set)
{
  hop=set;
}
function ebb(other)
{
  if((other.x>32 && hop<0)||(other.x<width-32 && hop>0))
    other.x+=hop+random(4)-2;
}