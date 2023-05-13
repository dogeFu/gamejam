import { _decorator, Component, Input, input, EventKeyboard, KeyCode, Vec2, Animation, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { Suction } from './Suction';

@ccclass('Duck')
export class Duck extends Component {
    private SuctionComponent: Suction;

    private AnimationComponent: Animation;

    @property
    public duration: number = 0.5;

    @property
    public speed: number = 1;

    @property
    public step: number = 100;

    public destinationPosition = new Vec3();
    
    start() {
        this.SuctionComponent = this.getComponent(Suction);
        this.SuctionComponent.destinationPosition = this.destinationPosition;
        this.resetDestinationPosition();

        this.AnimationComponent = this.getComponent(Animation);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                this.flyUp();
                break;
            case KeyCode.KEY_S:
                this.flyDown();
                break;
            case KeyCode.KEY_A:
                this.flyLeft();
                break;
            case KeyCode.KEY_D:
                this.flyRight();
                break;
        }
    }

    resetDestinationPosition() {
        this.destinationPosition.x = this.node.position.x;
        this.destinationPosition.y = this.node.position.y;
        this.SuctionComponent.pause = false;
    }

    flyUp() {
        this.destinationPosition.y += this.step;
        this.fly();
    }
    flyDown() {
        this.destinationPosition.y -= this.step;
        this.fly();
    }
    flyLeft() {
        this.destinationPosition.x -= this.step;
        this.fly();
    }
    flyRight() {
        this.destinationPosition.x += this.step;
        this.fly();
    }
    fly() {
        this.AnimationComponent.stop();

        const DUCK = this;
        this.SuctionComponent.pause = true;

        tween(this.node.position).to(this.duration, new Vec3(this.destinationPosition.x, this.destinationPosition.y, 0), {
            easing: "smooth",
            onUpdate: (target:Vec3, ratio:number) => {
                this.node.position = target;
            },
            onComplete() {
                DUCK.resetDestinationPosition();
            },
        }).start();

      this.AnimationComponent.play();
    }

    reset() {
        this.resetDestinationPosition()
    }
}


