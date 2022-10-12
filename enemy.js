import enemy_fly_image from"./assets/enemy_fly.png";
import enemy_plant_image from "./assets/enemy_plant.png";
import enemy_spider_image from "./assets/enemy_spider_big.png";
import { Sprite, GameObject } from "./util.js";
const SPEEDS_ENEMY={

};
export class Enemy extends GameObject{
    constructor(game, x=0, y=0, width=0, height=0, sprite=new Sprite()){
        super(x, y, width, height);
        this.sprite=sprite;
        this.game=game;
    }
    /**
     * @param {CanvasRenderingContext2D} context
     * 
    */
    draw(context){
        if(this.game.debug) super.draw(context);
        this.sprite.draw(context);
    };
    update(deltaTime){
        const dt_second=deltaTime*0.001;
        //update position
        super.update(deltaTime);
        //update sprite animation
        this.sprite.x=this.x;
        this.sprite.y=this.y;
        this.sprite.update(deltaTime);
        //update markedForDeletion
        if(this.x<-this.width) this.markedForDeletion=true;
    }
}
export class FlyingEnemy extends Enemy{
    constructor(game){
        let width=60;
        let height=44;
        let x=game.width;
        let y=0.5*(game.height-height)*Math.random();
        const image=new Image();
        image.src=enemy_fly_image;
        const sprite=new Sprite(image, width, height);

        super(game,x,y,width,height,sprite);
        this.game=game;

        this.dx=0.15*width;
        this.dy=0.15*height;
        this.width=0.6*width;
        this.height=0.70*height;

        this.speedX=-(Math.random()*100+400);
        this.sprite.maxFrame=5;

        this.angle=0;
        this.va=Math.random()*100+100;
    }
    
    update(deltaTime){
        const dt_second=deltaTime*0.001;
        this.angle+=this.va*dt_second;
        this.y+=Math.sin(this.angle);
        super.update(deltaTime);
    }
}
export class GroundEnemy extends Enemy{
    constructor(game){
        let width=60;
        let height=87;
        let x=game.width;
        let y=game.height-height-game.groundMargin;
        const image=new Image();
        image.src=enemy_plant_image;
        const sprite=new Sprite(image, width, height);

        super(game,x, y, width, height, sprite);
        this.game=game;

        this.dx=width*0.05;
        this.width=width*0.9;
        this.dy=height*0.1;
        this.height=height*0.9;

        this.sprite.maxFrame=1;
    }
    update(deltaTime){
        //this.x+=this.game.speed*deltaTime*0.001;
        super.update(deltaTime);
    }
}
export class ClimbingEnemy extends Enemy{
    constructor(game){
        let width=120;
        let height=144;
        let x=game.width;
        let y=game.height*0.5*Math.random();
        const image=new Image();
        image.src=enemy_spider_image;
        const sprite=new Sprite(image, width, height);

        super(game, x, y, width, height, sprite);
        this.dy=height*0.3;
        this.dx=width*0.2;
        this.height=height*0.55;
        this.width=width*0.6;

        this.speedY=Math.random()>0.4?100:-100;
        this.sprite.maxFrame=5;
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context){
        super.draw(context);
        context.beginPath();
        context.moveTo(this.x+this.sprite.width*0.5, 0);
        context.lineTo(this.x+this.sprite.width*0.5, this.y+this.sprite.height*0.3);
        context.stroke();
    }
    update(deltaTime){
        //this.x+=this.game.speed*deltaTime*0.001;
        super.update(deltaTime);
        if(this.y>this.game.height-this.height-this.game.groundMargin) this.speedY=-Math.abs(this.speedY);
        if(this.y<-this.height) this.markedForDeletion=true;
    }
}