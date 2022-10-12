import fireImage from "./assets/fire.png"
import { GameObject } from "./util.js";
export class Particle extends GameObject{
    constructor(game){
        super(),
        this.game=game;
        this.markedForDeletion=false;
        this.x=0;
        this.y=0;
        this.speedX=0;
        this.speedY=0;
        this.size=0;
    }
    update(deltaTime){
        const dt=deltaTime*0.001;
        super.update(deltaTime);
        /*this.x+=(this.speedX+this.game.speed)*dt;
        this.y+=this.speedY*dt;*/
        this.size*=0.9;
        if(this.size<0.5) this.markedForDeletion=true;
    }
}
export class Dust extends Particle{
    constructor(game, x, y){
        super(game);
        this.x=x;
        this.y=y;
        this.size=Math.random()*15+5;
        this.speedX=-Math.random()*200;
        this.speedY=Math.random()*100;
        this.color="rgba(0,0,0,0.2)"
    }
    /**
     * @param {CanvasRenderingContext2D} context
     * 
    */
     draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI*2);
        context.fillStyle=this.color;
        context.fill();
    }
}
export class Fire extends Particle{
    constructor(game, x, y, size=Math.random()*50+50){
        super(game);
        this.x=x;
        this.y=y;
        this.image=new Image()
        this.image.src=fireImage;
        this.speedX=100;
        this.speedY=100;
        this.size=size;
        this.angle=0;
        this.va=Math.random()*20-10;
    }
    update(deltaTime){
        const dt=deltaTime*0.001;
        super.update(deltaTime);
        this.angle+=this.va*dt;
    }
    /**
     * @param {CanvasRenderingContext2D} context
     * 
    */
    draw(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.size*0.5, -this.size*0.5, this.size, this.size);
        context.restore();
    }
}
export class Splash extends Particle{
    constructor(game, x, y, size=Math.random()*100+100){
        super(game);
        this.size=size;
        this.x=x;
        this.y=y;
        this.speedX=Math.random()*600-300;
        this.speedY=Math.random()*200+200;
        this.gravity=0;
        this.image=new Image()
        this.image.src=fireImage;
    }
    update(deltaTime){
        const dt=0.001*deltaTime;
        super.update(deltaTime);
        this.gravity+=10*dt;
        this.y+=this.gravity*dt;
    }
    /**
     * @param {CanvasRenderingContext2D} context 
    */
    draw(context){
        context.save();
        context.globalAlpha=0.5;
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
        context.restore();
    }
}
