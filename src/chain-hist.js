'use strict';

class ChainHist {

  constructor(){
      this.index = -1;
      this.chains = [];
  }

  push(chain){
    this.chains.push(chain);
    this.index++;
  }

  prev(){
    if(this.index == -1){
      return null;
    }
    this.index--;
    if(this.index < 0){
      this.index = this.chains.length - 1;
    }
    return this.current();
  }

  next(){
    if(this.index == -1){
      return null;
    }
    this.index++;
    if(this.index >= this.chains.length){
      this.index = 0;
    }
    return this.current();
  }

  current(){
    return this.chains[this.index];
  }


}

export { ChainHist };
