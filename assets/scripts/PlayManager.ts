import { _decorator, Component, Node, Vec2, Vec3, director,CCInteger,Label,Animation } from 'cc';
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

    @property({
        type:Vec2,
        tooltip:'玩家初始位置'
    })
    get startPos () {
        return this._startPos;
    }

    set startPos (val:Vec2) {
        this._startPos = val;
        this.resetDuckPos();
    }

    @property({
        type:CCInteger,
        tooltip:'boss血量上限'
    })
    bossBlood:number = 2;
    
    _bossBlood:number = 2;

    @property({
        type:Label,
        tooltip:'boss血量label'
    })
    bossBloodLabel:Label = null;

    @property({
        type:CCInteger,
        tooltip:'需要收集的羽毛数量'
    })
    collectTarget:number = 5;

    // 羽毛ui
    @property({
        type:Label
    })
    maoLabel:Label = null;

    duckWeaponCount:number = 0;
    start() {
        this._bossBlood = this.bossBlood;
        this.resetDuckPos();
        // @ts-ignore
        window.PlayManager = this;
    }

    update(deltaTime: number) {
        
    }

    stop(win:boolean) {
        if(!win) {
            // 播放死亡动画
            this.playDuckAnim('die')
        }
        const hitManager = this.node.getComponent(HitManager);
        if (hitManager) {
            hitManager.stopThrow();
        }

        const backgroundComp =  director.getScene().getComponentInChildren(Background);
        if (backgroundComp) {
            backgroundComp.playBackGroundAudio(4);
        }

        setTimeout(()=>{
            const backgroundComp =  director.getScene().getComponentInChildren(Background);
            if (backgroundComp) {
                backgroundComp.stop();
            }
            
            this.hideBoss()
        },800)
    }

    play() {
        // 重置所有组件的状态;
        console.log('开始游戏,重置状态')
        this.duckWeaponCount = 0;
        this._bossBlood = this.bossBlood;
        this.resetDuckPos();
        this.playDuckAnim('fly');
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
        }
        // 调用background jump到boss那里
        const backgroundComp =  director.getScene().getComponentInChildren(Background);
        if (backgroundComp) {
            // 跳转到boss之后
            backgroundComp.toBoss(()=>{
                const duckComp = this.duck?.getComponent(Duck);
                if (duckComp && backgroundComp) {
                    duckComp.toBoss();
                    const boss = this.node.getChildByName('boss')
                    if (boss) {
                        boss.active = true;
                        const bossAttack = boss.getComponent(BossAttack);
                        if (bossAttack) {
                            bossAttack.startAttack = true;
                        }
                    }
                    const UI = this.node.getChildByName('UI');
                    if(UI) {
                        const bossLevel = UI.getChildByName('bossLevel')
                        if (bossLevel) {
                            bossLevel.active = true;
                        }
                    }
                }
            });
        }

        
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
                const bossLevel = UI.getChildByName('bossLevel')
                if (bossLevel) {
                    bossLevel.active = false;
                }
            }
            if (this.bossBloodLabel) {
                this.bossBloodLabel.string = `${this._bossBlood}`;
            }
        })
    }

    onBossHit() {
        this._bossBlood--;
        if (this.bossBloodLabel) {
            this.bossBloodLabel.string = `${this._bossBlood}`;
        }
        if (this._bossBlood === 0) {
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
        if(count <0) {
            // @ts-ignore
            window.GameManager.stopGame(false,'被打死了鸭'); 
        }
    }

    // 
    duckAttack() {
        if(this.duckWeaponCount >= 1) {
            this.duckWeaponCount--;
            if (this.maoLabel) {
                const str = `X ${this.duckWeaponCount}`
                this.maoLabel.string = str;
            }
            this.playDuckAnim('attack');
            // todo 如果小于0且没击中则stopGame;
    
        }else {
            // @ts-ignore
            window.GameManager.stopGame(false,'羽毛用光了鸭');
        }
    }

    duckWasHit() {
        this.duckWeaponCount--
        if (this.maoLabel) {
            const str = `X ${this.duckWeaponCount}`
            this.maoLabel.string = str;
        }
        if (this.duckWeaponCount <= 0) {
            // @ts-ignore
            window.GameManager.stopGame(false,'被boss打死了鸭');
        }
    }

    playDuckAnim(name:string) {
        if (this.duck) {
            const animation = this.duck.getComponentInChildren(Animation);
            if (animation) {
                animation.play(name)
            }
        }
    }
}


