//import { states as stateIndexs, State, Sitting, Running, Jumping, Falling ,Rolling, Diving, Hit} from "./playerState.js";
import { stateIndexs, states, FLAGS} from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { GameObject, Sprite } from "./util.js";
import playerImage from "./assets/player.png";

const GRAVITY=5;
const FRICTION_HORIZON=5;


export class Player extends GameObject{
    constructor(game){
        super(game.width*0.25, game.height-91.3-game.groundMargin, 100, 91.3);
        this.game=game;
        this.dx=this.width*0.25;
        this.dy=this.height*0.3;

        const image=new Image();
        image.src=playerImage;
        this.sprite=new Sprite(image, 100, 91.3);
        
        this.stateIndexs=stateIndexs;
        this.states=states;
        this.currentState=states[stateIndexs.RUNNING];
        this.currentState.enter(this);

        this.width=this.width*0.6;
        this.height=this.height*0.55;

        this.flags=FLAGS.FIRE;
        this.fireInterval=2000;
        this.fireTimer=0;
    } 
    /**
     * @param {CanvasRenderingContext2D} ctx
     * 
    */
    draw(ctx){
        if(this.game.debug) super.draw(ctx);

        this.sprite.draw(ctx);
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    update(inputKeys, deltaTime, collided=false){
        //change state, speedX, speedY, flags
        if(collided&&this.currentState!==states[stateIndexs.FIREROLLING]&&this.currentState!==states[stateIndexs.FIREDIVING]){            
            this.setState(stateIndexs.HIT);
            //this.justCollided=true;
        }
        let nextStateIndex=this.currentState.inputHandle(inputKeys, deltaTime, this);
        this.setState(nextStateIndex,-1);
        
        //calculate x,y 
        super.update(deltaTime);
        if(this.x<0){
            this.x=0;
        }else if(this.x>this.game.width-this.sprite.width){
            this.x=this.game.width-this.sprite.width;
        }

        //cal flags
        if(this.y>=this.game.height-this.sprite.height-this.game.groundMargin){
            this.y=this.game.height-this.sprite.height-this.game.groundMargin;
            this.onGround=true;
        }else{
            this.onGround=false;
        }  
        
        if(this.onGround&&this.currentState===this.states[stateIndexs.FIREDIVING])
            this.justLanded=true;

        //cal position of sprite
        this.sprite.x=this.x;
        this.sprite.y=this.y;
        this.sprite.update(deltaTime);
        
        //cal timer
        if(!this.fireReady){
            this.fireTimer+=deltaTime;
            if(this.fireTimer>=this.fireInterval){
                this.fireReady=true;
                this.fireTimer=0;
            }
        }
    }
    setState(stateIndex,speed=0){
        if(stateIndex!==undefined&&stateIndex!==stateIndexs.SITTING){
            this.currentState=this.states[stateIndex];
            //this.game.speed=speed*this.game.maxSpeed;
            this.currentState.enter(this);
        }
    }
    get fireReady(){
        return this.flags&FLAGS.FIRE?true:false;
    };
    get justLanded(){
        return this.flags&FLAGS.HAS_A_LANDING?true:false;
    };
    get onGround(){
        return this.flags&FLAGS.ON_GROUND?true:false;
    };
    get justCollided(){
        return this.flags&FLAGS.JUST_COLLIDED?true:false;
    }
    set fireReady(is=true){
        is?this.flags|=FLAGS.FIRE:this.flags&=~FLAGS.FIRE;
    }
    set justLanded(is=true){
        is?this.flags|=FLAGS.HAS_A_LANDING:this.flags&=~FLAGS.HAS_A_LANDING;
    };
    set onGround(is=true){
        is?this.flags|=FLAGS.ON_GROUND:this.flags&=~FLAGS.ON_GROUND;
    };
    set justCollided(is=true){
        is?this.flags|=FLAGS.JUST_COLLIDED:this.flags&=~FLAGS.justCollided;
    };

}