"use strict";

export const EAudioStateType = {Stopped: 1, Playing: 2, Paused: 3};


/*----------------------------------------------------------------
------ Class TSound -----------------------------------------------
----------------------------------------------------------------*/
export function TSound(aSoundFile){
  const audio = new Audio(aSoundFile);
  let audioState = EAudioStateType.Stopped;
  let soundMuted = false;

  this.play = function(){
    if(!soundMuted){
      audio.currentTime = 0;
      audio.play();
      audioState = EAudioStateType.Playing;
    }
  }

  this.stop = function(){
    audio.pause();
    audio.currentTime = 0;
    audioState = EAudioStateType.Stopped;
  }

  this.pause = function(){
    audio.pause();
    audioState = EAudioStateType.Paused;
  }

  this.resume = function(){
    if(!soundMuted){
      audio.play();
      audioState = EAudioStateType.Playing;
    }
  }

  this.getAudioState = function(){
    return audioState;
  }
}