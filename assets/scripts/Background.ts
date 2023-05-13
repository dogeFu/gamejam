import { _decorator, Component, Node, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {

    private x: number = 0;  
    private y: number = 0; 

    private initX: number = 0;  
    private initY: number = 0; 

    public pause: boolean = true;

    @property
    public speed: number = 1;

    private maxTop = 2160;
    public top: number = 0;

    start() {
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
        this.top = this.maxTop;

        this.stop();
    }

    play() {
        this.pause = false;

        setTimeout(()=>{
            this.toBoss();
        },1000)
    }

    stop() {
        this.pause = true;
    }

    toBoss() {
        this.stop();

        tween(this.node.position).to(1, new Vec3(this.initX, this.initY - this.maxTop, 0), {
            easing: "sineOut",
            onUpdate: (target: Vec3, ratio: number) => {
                this.node.position = target;
            },
        }).start();
    }
}


