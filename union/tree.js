function Tree(val)
{
  this.value=val;
  this.left=null;
  this.right=null;
  this.insert=function(val)
  {
    if(val.mission[0]<this.value.mission[0] && this.left!=null)
      this.left.insert(val);
    else if(val.mission[0]<this.value.mission[0] && this.left==null)
      this.left=new Tree(val);
    else if(val.mission[0]>this.value.mission[0] && this.right!=null)
      this.right.insert(val);
    else if(val.mission[0]>this.value.mission[0] && this.right==null)
      this.right=new Tree(val);
  }
}