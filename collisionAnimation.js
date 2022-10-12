import boom_image from "./assets/boom.png";
import { Sprite, GameObject } from "./util.js";
export class CollisionAnimation extends GameObject{
    constructor(game, x, y){
        super();
        this.game=game;
        this.sizeModifier=Math.random()+0.5;
        this.markedForDeletion=false;

        const image=new Image();
        image.src=boom_image;
        this.sprite=new Sprite(image,100,90);
        this.sprite.width=this.sprite.spriteWidth*this.sizeModifier;
        this.sprite.height=this.sprite.spriteHeight*this.sizeModifier;
        this.sprite.x=x-this.sprite.width*0.5;
        this.sprite.y=y-this.sprite.height*0.5;
        this.sprite.maxFrame=4;
        this.sprite.fps=15;

        this.x=this.sprite.x;
        this.y=this.sprite.y;
    }
    /**
     * @param {CanvasRenderingContext2D} context 
    */
    draw(context){
        this.sprite.draw(context);
    }
    update(deltaTime=0){
        const dt=deltaTime*0.001;
        //this.x+=this.game.speed*dt;
        super.update(deltaTime);
        if(this.sprite.frameX>=this.sprite.maxFrame){
            this.markedForDeletion=true
        }
        this.sprite.x=this.x;
        this.sprite.update(deltaTime);
    }
}