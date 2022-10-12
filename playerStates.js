export const stateIndexs={
    SITTING:0,
    RUNNING:1,
    JUMPING:2,
    FALLING:3,
    ROLLING:4,
    DIVING:5,
    HIT:6,
    FIREROLLING:7,
    FIREDIVING:8,
};
export const FLAGS={
    FIRE:         0b0001,
    HAS_A_LANDING:0b0010,
    ON_GROUND:    0b0100,
    JUST_COLLIDED:0b1000,
};
const maxFrames=[
    4,
    8,
    6,
    6,
    6,
    6,
    10,
    6,
    6,
];
const frameYs=[
    5,
    3,
    1,
    2,
    6,
    6,
    4,
    6,
    6,
];

const SPEEDS={
    RUNNING_SPEED:500,
    JUMPING_SPEED_INIT:1000,
    JUMPING_ACCELERATED_SPEED:2000,
    ROLLING_SPEED:1500,
    RESISTANCE_ACCELERATED_SPEED:6000,
    GRAIVTY_ACCELERATED_SPEED:4000,
}

export class State{
    constructor(state){
        this.state=state;
    }
    /**
     * @abstract
     */
    enter(player){
        
    }
    /**
     * @abstract
     */
    inputHandle(inputKeys,deltaTime,player){

    }
}
export class Sitting extends State{
    constructor(){
        super("SITTING");
    }
    enter(player){
        player.sprite.maxFrame=maxFrames[stateIndexs.SITTING];
        player.sprite.frameX=0;
        player.sprite.frameY=frameYs[stateIndexs.SITTING];
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    inputHandle(inputKeys,deltaTime,player){
        if(inputKeys.includes("ArrowRight")||inputKeys.includes("ArrowLeft")){
            return stateIndexs.RUNNING
        }else if(inputKeys.includes("Enter")&&player.fireReady){
            return stateIndexs.FIREROLLING;
        }else if(inputKeys.includes("Enter")){
            return stateIndexs.ROLLING;
        }else if(inputKeys.includes("ArrowUp")){
            return stateIndexs.JUMPING;
        }
    }
}
export class Running extends State{
    constructor(){
        super("RUNNING");
    }
    enter(player){
        player.sprite.maxFrame=maxFrames[stateIndexs.RUNNING];
        player.sprite.frameX=0;
        player.sprite.frameY=frameYs[stateIndexs.RUNNING];
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    inputHandle(inputKeys,deltaTime,player){

        //handle horizontal speed
        if(inputKeys.includes("ArrowLeft")){
            player.speedX=-SPEEDS.RUNNING_SPEED;
        }else if(inputKeys.includes("ArrowRight")){
            player.speedX=SPEEDS.RUNNING_SPEED;
        }else{
            player.speedX=0;
        };

        if(inputKeys.includes("ArrowUp")){
            return stateIndexs.JUMPING;
        }else if(inputKeys.includes("Enter")&&player.fireReady){
            return stateIndexs.FIREROLLING;
        }else if(inputKeys.includes("Enter")){
            return stateIndexs.ROLLING;
        }else if(inputKeys.includes("ArrowDown")){
            return stateIndexs.SITTING;
        }
    }
}
export class Jumping extends State{
    constructor(){
        super("JUMPING");
    }
    enter(player){
        player.sprite.maxFrame=maxFrames[stateIndexs.JUMPING];
        player.speedY=-SPEEDS.JUMPING_SPEED_INIT; 
        player.sprite.frameX=0;
        player.sprite.frameY=frameYs[stateIndexs.JUMPING];
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    inputHandle(inputKeys, deltaTime, player){
        const dt=deltaTime*0.001;

        player.speedY+=SPEEDS.GRAIVTY_ACCELERATED_SPEED*dt;

        if(inputKeys.includes("ArrowLeft")){
            player.speedX=-SPEEDS.RUNNING_SPEED;
        }else if(inputKeys.includes("ArrowRight")){
            player.speedX=SPEEDS.RUNNING_SPEED;
        }else{
            player.speedX=0;
        };

        if(inputKeys.includes("ArrowUp")){
            player.speedY+=-SPEEDS.JUMPING_ACCELERATED_SPEED*dt;
        };

        if(player.speedY>=0){
            return stateIndexs.FALLING;
        }else if(inputKeys.includes("Enter")&&player.fireReady){
            return stateIndexs.FIREROLLING;
        }else if(inputKeys.includes("Enter")){
            return stateIndexs.ROLLING;
        }else if(inputKeys.includes("ArrowDown")&&player.fireReady){
            return stateIndexs.FIREDIVING
        }if(inputKeys.includes("ArrowDown")){
            return stateIndexs.DIVING
        }
    }
}
export class Falling extends State{
    constructor(){
        super("FALLING");
    }
    enter(player){
        player.sprite.maxFrame=maxFrames[stateIndexs.FALLING];
        player.sprite.frameX=0;
        player.sprite.frameY=frameYs[stateIndexs.FALLING];
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    inputHandle(inputKeys,deltaTime,player){
        const dt=deltaTime*0.001;
        player.speedY+=SPEEDS.GRAIVTY_ACCELERATED_SPEED*dt;

        //handle horizontal speed
        if(inputKeys.includes("ArrowLeft")){
            player.speedX=-SPEEDS.RUNNING_SPEED;
        }else if(inputKeys.includes("ArrowRight")){
            player.speedX=SPEEDS.RUNNING_SPEED;
        }else{
            player.speedX=0;
        };

        if(player.onGround){
            return stateIndexs.RUNNING;
        }else if(inputKeys.includes("Enter")&&player.fireReady){
            return stateIndexs.FIREROLLING;
        }else if(inputKeys.includes("Enter")){
            return stateIndexs.ROLLING;
        }else if(inputKeys.includes("ArrowDown")&&player.fireReady){
            return stateIndexs.FIREDIVING;
        }else if(inputKeys.includes("ArrowDown")){
            return stateIndexs.DIVING;
        }
    }
}
export class Rolling extends State{
    constructor(){
        super("ROLLING");
    }
    enter(player){
        player.sprite.maxFrame=maxFrames[stateIndexs.ROLLING];
        player.sprite.frameX=0;
        player.sprite.frameY=frameYs[stateIndexs.ROLLING];
        player.speedX=SPEEDS.ROLLING_SPEED;
        player.speedY=0;
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    inputHandle(inputKeys, deltaTime,player){       
        const dt=deltaTime*0.001;
        player.speedX+=-SPEEDS.RESISTANCE_ACCELERATED_SPEED*dt;
        if(player.speedX<=SPEEDS.RUNNING_SPEED&&player.onGround){
            return stateIndexs.RUNNING;
        }else if(player.speedX<=SPEEDS.RUNNING_SPEED&&!player.onGround){
            return stateIndexs.FALLING;
        }
    }
}

export class Diving extends State{
    constructor(){
        super("DIVING");
    }
    enter(player){
        player.sprite.maxFrame=maxFrames[stateIndexs.DIVING];
        player.sprite.frameX=0;
        player.sprite.frameY=frameYs[stateIndexs.DIVING];
        player.speedY=SPEEDS.ROLLING_SPEED;
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    inputHandle(inputKeys,deltaTime,player){

        if(player.onGround){
            return stateIndexs.RUNNING;
        }
    }
}

export class Hit extends State{
    constructor(){
        super("HIT");
    }
    enter(player){ 
        player.sprite.maxFrame=maxFrames[stateIndexs.HIT];
        player.sprite.frameX=0;
        player.sprite.frameY=frameYs[stateIndexs.HIT];
        player.speedX=0;
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    inputHandle(inputKeys,deltaTime,player){
        const dt=deltaTime*0.001;
        if(!player.onGround)
        player.speedY+=SPEEDS.GRAIVTY_ACCELERATED_SPEED*dt;

        if(player.sprite.frameX>=maxFrames[stateIndexs.HIT] && player.onGround){
            return stateIndexs.RUNNING;
        }else if(player.sprite.frameX>=maxFrames[stateIndexs.HIT] && !player.onGround){
            return stateIndexs.FALLING;
        } 
    }
}

export class FireRolling extends State{
    constructor(){
        super("FIREROLLING");
    }
    enter(player){
        player.sprite.maxFrame=maxFrames[stateIndexs.FIREROLLING];
        player.sprite.frameX=0;
        player.sprite.frameY=frameYs[stateIndexs.FIREROLLING];
        player.speedX=SPEEDS.ROLLING_SPEED;
        player.speedY=0;
        player.fireReady=false;
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    inputHandle(inputKeys, deltaTime,player){       
        const dt=deltaTime*0.001;
        player.speedX+=-SPEEDS.RESISTANCE_ACCELERATED_SPEED*dt;
        if(player.speedX<=SPEEDS.RUNNING_SPEED&&player.onGround){
            return stateIndexs.RUNNING;
        }else if(player.speedX<=SPEEDS.RUNNING_SPEED&&!player.onGround){
            return stateIndexs.FALLING;
        }
    }
}
export class FireDiving extends State{
    constructor(){
        super("FIREDIVING");
    }
    enter(player){
        player.sprite.maxFrame=maxFrames[stateIndexs.FIREDIVING];
        player.sprite.frameX=0;
        player.sprite.frameY=frameYs[stateIndexs.FIREDIVING];
        player.speedY=SPEEDS.ROLLING_SPEED;
        player.fireReady=false;
    }
    /**
     * 
     * @param {string[]} inputKeys 
     */
    inputHandle(inputKeys,deltaTime,player){

        if(player.onGround){
            return stateIndexs.RUNNING;
        }
    }
}
export const states=[new Sitting(), new Running(), new Jumping(), new Falling(), new Rolling(), new Diving(), new Hit(), new FireRolling(), new FireDiving()];
