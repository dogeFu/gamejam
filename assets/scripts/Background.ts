import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Background')
export class Background extends Component {

    public x: number = 0;  
    public y: number = 0; 

    public initX: number = 0;  
    public initY: number = 0; 

    @property
    public speed: number = 1;  

    public left: number = 0;
    public top: number = 100;

    start() {
        this.x = this.initX = this.node.position.x;
        this.y = this.initY = this.node.position.y;
    }

    update(deltaTime: number) {
        if(this.initX - this.x < this.left){
            this.x -= this.speed;
        }else{
            this.x += this.speed;
        }

        if(this.initY - this.y < this.top){
            this.y -= this.speed;
        }else{
            this.y += this.speed;
        }

        this.node.setPosition(this.x, this.y);
    }

    setLeft(value: number){
        this.left = value;
    }

    setTop(value: number){
        this.top = value;
    }
}


