import { _decorator, Component, Node, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass("Audios")
export class Audios extends Component {
  @property({
    type: [AudioClip],
  })
  public clips: AudioClip[] = [];

  public audioSource: AudioSource = null!;

  start() {
    this.audioSource = this.getComponent(AudioSource);
  }

  playBackGround(index: number) {
    if(!this.audioSource) {
      return;
    }

    const clip: AudioClip = this.clips[index];
    if(!clip) {
      return;
    }

    this.audioSource.stop();
    this.audioSource.clip =  clip;
    this.audioSource.play();

    return Math.ceil(clip.getDuration());
  }

  playEffect(index: number) {
    if(!this.audioSource) {
      return;
    }
    
    const clip: AudioClip = this.clips[index];
    if(!clip) {
      return;
    }

    this.audioSource.playOneShot(clip);

    return Math.ceil(clip.getDuration());
  }
}
