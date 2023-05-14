import { _decorator, Component, Enum, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export enum Direction {
    TOP,
    RIGHT,
    BOTTOM,
    LEFT
}
let pos = new Vec3();
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
        pos.set(this.node.position);
        if(this.direction === Direction.RIGHT){
            pos.x += this.speed;
        }

        if(this.direction === Direction.LEFT){
            pos.x -= this.speed;
        }

        if(this.direction === Direction.TOP){
            pos.y += this.speed;
        }

        if(this.direction === Direction.BOTTOM){
            pos.y -= this.speed;
        }

        this.node.setPosition(pos.x, pos.y);
    }

    reset() {
        // this.destinationPosition = new Vec3();
    }

    setDirectionTop(){
        this.direction = Direction.TOP;
    }

    setDirectionBottom(){
        this.direction = Direction.BOTTOM;
    }
}


