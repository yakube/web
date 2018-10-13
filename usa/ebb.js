var hop;
function setEbb(set)
{
  hop=set;
}
function ebb(other)
{
  if ((other.x>32 && hop<0)||(other.x<1920-32 && hop>0))
    other.x+=hop+random(4)-2;
}
