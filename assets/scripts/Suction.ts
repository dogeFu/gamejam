import { _decorator, Component, Enum, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum Direction {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}

@ccclass('Suction')
export class Suction extends Component {

    @property({type: Enum(Direction)})
    public direction: Direction= Direction.RIGHT;  

    @property
    public speed: number = 1;  
    public pause: boolean = false;

    start() {

    }

    update(deltaTime: number) {
        if(this.pause){
            return;
        }

        let x = this.node.position.x;
        let y = this.node.position.y;

        if(this.direction === Direction.RIGHT){
            x += this.speed;
        }

        if(this.direction === Direction.LEFT){
            x -= this.speed;
        }

        if(this.direction === Direction.TOP){
            y += this.speed;
        }

        if(this.direction === Direction.BOTTOM){
            y -= this.speed;
        }

        this.node.setPosition(x, y);

        window.aaa = this;
    }
}


