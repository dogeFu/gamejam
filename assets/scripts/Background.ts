import { _decorator, Component, Node } from 'cc';
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
    public left: number = 0;
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

        if(this.initX - this.x < this.left) {
            this.x -= this.speed;
        } else {
            this.x += this.speed;
        }

        if(this.initY - this.y < this.top) {
            this.y -= this.speed;
        } else {
            this.y += this.speed;
        }

        this.node.setPosition(this.x, this.y);
    }

    setLeft(value: number) {
        this.left = value;
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
    }

    stop() {
        this.pause = true;
    }
}


