import { _decorator, Component, Enum, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export enum Direction {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}

@ccclass('Suction')
export class Suction extends Component {

    public pause: boolean = true;
    public destinationPosition = new Vec3();

    @property({type: Enum(Direction)})
    public direction: Direction= Direction.LEFT;  

    @property
    public speed: number = 1;  

    start() {

    }

    update(deltaTime: number) {
        if(this.pause) {
            return;
        }

        if(this.direction === Direction.RIGHT){
            this.destinationPosition.x += this.speed;
        }

        if(this.direction === Direction.LEFT){
            this.destinationPosition.x -= this.speed;
        }

        if(this.direction === Direction.TOP){
            this.destinationPosition.y += this.speed;
        }

        if(this.direction === Direction.BOTTOM){
            this.destinationPosition.y -= this.speed;
        }

        this.node.setPosition(this.destinationPosition.x, this.destinationPosition.y);
    }
}


