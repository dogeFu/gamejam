import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

import { Audios } from './Audios';

@ccclass('Background')
export class Background extends Component {

    private x: number = 0;  
    private y: number = 0; 

    private initX: number = 0;  
    private initY: number = 0; 

    private timeId; 

    public pause: boolean = true;

    @property
    public speed: number = 1;

    private maxTop = 2160;
    public top: number = 0;

    public AudioComponent: Audios;

    start() {
        this.AudioComponent = this.getComponent(Audios);

        this.initX = this.node.position.x;
        this.initY = this.node.position.y;
        this.reset();
    }

    update(deltaTime: number) {
        if(this.pause) {
            return;
        }

        if(this.initY - this.y < this.top) {
            this.y -= this.speed;
        } else {
            this.y += this.speed;
        }

        this.node.setPosition(this.x, this.y);
    }

    setTop(value: number) {
        this.top = value;
    }

    reset() {
        setTimeout(()=>{
            this.toBoss();
        }, 5000)

        this.x = this.initX;
        this.y = this.initY
        this.top = this.maxTop;

        this.stop();
    }

    play() {
        this.pause = false;
    }

    stop() {
        this.pause = true;
    }

    toBoss() {
        this.stop();

        this.playBackGroundAudio(1);

        tween(this.node.position).to(2, new Vec3(this.initX, this.initY - this.maxTop, 0), {
            easing: "sineOut",
            onUpdate: (target: Vec3, ratio: number) => {
                this.node.position = target;
            },
        }).start();
    }

    playBackGroundAudio(index: number) { 
        const duration =  this.AudioComponent.playBackGround(index);

        if(!duration) {
            return;
        }

        if(index !== 0) {
            const nextAudio = {
                1: 2, // to boss
                3: 0, // win
                4: 0, // lost
            }

            if(nextAudio[index] === undefined) {
                return;
            }

            clearTimeout(this.timeId);
            this.timeId = setTimeout(()=>{
                this.playBackGroundAudio(nextAudio[index]);
            }, duration * 1000);
        }
    }
}


