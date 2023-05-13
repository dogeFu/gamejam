import { _decorator, Component, Node, Vec2, Vec3, director,CCInteger,Label } from 'cc';
import {  HitManager } from './HitManager';
import { Background } from './Background';
import { Duck } from './Duck';
import { Suction } from './Suction';
import { BossAttack } from './BossAttack';
const { ccclass, property } = _decorator;

@ccclass('PlayManager')
export class PlayManager extends Component {
    @property(Node)
    duck:Node = null;
    
    @property(Vec2)
    _startPos:Vec2 = new Vec2(0,0);

    @property(Vec2)
    get startPos () {
        return this._startPos;
    }

    set startPos (val:Vec2) {
        this._startPos = val;
        this.resetDuckPos();
    }

    @property(CCInteger)
    bossBlood:number = 2;
    
    @property({
        type:Label,
        tooltip:'boss血量'
    })
    bossBloodLabel:Label = null;

    @property(CCInteger)
    collectTarget:number = 5;

    // 羽毛ui
    @property({
        type:Label
    })
    maoLabel:Label = null;

    duckWeaponCount:number = 0;
    start() {
        this.resetDuckPos();
        // @ts-ignore
        window.PlayManager = this;
    }

    update(deltaTime: number) {
        
    }

    stop(){ 
        const backgroundComp =  director.getScene().getComponentInChildren(Background);
        if (backgroundComp) {
            backgroundComp.stop();
        }
    }

    play() {
        // 重置所有组件的状态;
        console.log('开始游戏,重置状态')
        this.duckWeaponCount = 0;
        this.resetDuckPos();
        const hitManager = this.node.getComponent(HitManager);
        if (hitManager) {
            hitManager.reset();
            hitManager.startThrow();
        }
        const backgroundComp =  director.getScene().getComponentInChildren(Background);
        if (backgroundComp) {
            backgroundComp.reset();
            backgroundComp.play();
        }

        const duckComp = this.duck?.getComponent(Duck);
        if (duckComp) {
            duckComp.reset();
        }

        const suctionComp = this.duck?.getComponent(Suction);
        if (suctionComp) {
            suctionComp.reset();
        }
        this.hideBoss();
    }

    resetDuckPos() {
        if(this.duck) {
            this.duck.setPosition(new Vec3(this._startPos.x,this._startPos.y,0));
        }
    }

    showBoss() {
        const hitManager = this.node.getComponent(HitManager);
        if (hitManager) {
            hitManager.stopThrow();
            setTimeout(()=>{
                const boss = this.node.getChildByName('boss')
                if (boss) {
                    boss.active = true;
                }
                const UI = this.node.getChildByName('UI');
                if(UI) {
                    const bossBlood = UI.getChildByName('bossBlood')
                    if (bossBlood) {
                        bossBlood.active = true;
                    }
                }
            })
        }
        // 调用background jump到boss那里
    }

    hideBoss() {
        setTimeout(()=>{
            const boss = this.node.getChildByName('boss')
            if (boss) {
                boss.active = false;
                const bossAttack = boss.getComponent(BossAttack);
                if (bossAttack) {
                    bossAttack.reset();
                }
            }
            const UI = this.node.getChildByName('UI');
            if(UI) {
                const bossBlood = UI.getChildByName('bossBlood')
                if (bossBlood) {
                    bossBlood.active = false;
                }
            }
        })
    }

    onBossHit() {
        this.bossBlood--;
        if (this.bossBloodLabel) {
            this.bossBloodLabel.string = `${this.bossBlood}`;
        }
        if (this.bossBlood === 0) {
            // @ts-ignore
            window.GameManager.stopGame(true);
        }
    }

    updateCollected(count :number) {
        console.log('收集物数量：',count);
        if (count >= this.collectTarget) {
            this.duckWeaponCount = count;
            this.showBoss();
        }
        if (this.maoLabel) {
            const str = `X ${count}`
            this.maoLabel.string = str;
        }
    }

    duckAttack() {
        if(this.duckWeaponCount > 1) {
            this.duckWeaponCount--;
            if (this.maoLabel) {
                const str = `X ${this.duckWeaponCount}`
                this.maoLabel.string = str;
            }
        }else {
            // @ts-ignore
            window.GameManager.stopGame(false);
        }
    }
}


