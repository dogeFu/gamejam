import { _decorator, Component, Node, Vec3, tween,CCInteger, CCFloat } from 'cc';
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

    @property({
        type:CCInteger,
        tooltip:'背景移动速度'
    })
    public speed: number = 1;

    @property({
        type:CCInteger,
        tooltip:'没见 boss 前的最高位置'
    })
    public flyTop: number = 1440;

    @property({
        type:CCFloat,
        tooltip:'剩余距离飞到 boss 前的时间'
    })
    public flyToBossDuration: number = 1.3;

    @property({
        type:CCInteger,
        tooltip:'到 boss 最高位置'
    })
    public bossTop: number = 2160;

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
        this.x = this.initX;
        this.y = this.initY
        this.node.setPosition(this.x, this.y);

        this.top = this.flyTop;
        this.pause = true;
    }

    play() {
        this.pause = false;
    }

    stop() {
        this.playBackGroundAudio(4);
        this.reset();
    }

    toBoss() {
        this.stop();

        this.playBackGroundAudio(1);
        this.top = this.bossTop;
        this.y = this.initY - this.flyTop;
        tween(this.node.position).to(this.flyToBossDuration, new Vec3(this.initX, this.y, 0), {
            easing: "sineOut",
            onUpdate: (target: Vec3, ratio: number) => {
                this.node.position = target;
            },
            onComplete: () => {
                setTimeout(()=>{
                    this.y = this.initY - this.bossTop;
                    tween(this.node.position).to(0.6, new Vec3(this.initX, this.y, 0), {
                        easing: "smooth",
                        onUpdate: (target: Vec3, ratio: number) => {
                            this.node.position = target;
                        },
                        onComplete: () => {
                            this.play();
                        }
                    }).start();
                }, 1200)
            }
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


