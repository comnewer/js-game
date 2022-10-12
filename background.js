import layer1Image from "./assets/layer-1.png";
import layer2Image from "./assets/layer-2.png";
import layer3Image from "./assets/layer-3.png";
import layer4Image from "./assets/layer-4.png";
import layer5Image from "./assets/layer-5.png";
import { GameObject } from "./util";

const SPEEDS={
    LAYER1_SPEED:0,
    LAYER2_SPEED:0,
    LAYER3_SPEED:0,
    LAYER4_SPEED:0,
    LAYER5_SPEED:0,
}
class Layer extends GameObject{
    constructor(game, width, height, speedX=0, image, ax=0){
        super(0, 0, width, height);
        this.game=game;
        //this.width=width;
        //this.height=height;
        this.speedX=speedX;
        this.ax=ax;
        this.image=image;
    }
    update(deltaTime=0){
        //const dt=deltaTime*0.001;
       // this.x+=this.speed*this.game.speed*dt;
        super.update(deltaTime);
        if(this.x<-this.width)
            this.x+=this.width;
        if(this.x>0)
            this.x-=this.width;
    }
    
    /**
     * 
     * @param {CanvasRenderingContext2D} context
     */
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x+this.width, this.y, this.width, this.height);
    }
}
export class Background{
    constructor(game, speedX, ax){
        this.game=game;
        this.width=1667;
        this.height=500;
        this.layer1image=new Image();
        this.layer1image.src=layer1Image;
        this.layer2image=new Image();
        this.layer2image.src=layer2Image;
        this.layer3image=new Image();
        this.layer3image.src=layer3Image;
        this.layer4image=new Image();
        this.layer4image.src=layer4Image;
        this.layer5image=new Image();
        this.layer5image.src=layer5Image;
        this.layer1 = new Layer(game, this.width, this.height, 0*speedX, this.layer1image, ax);
        this.layer2 = new Layer(game, this.width, this.height, 0.2*speedX, this.layer2image, ax);
        this.layer3 = new Layer(game, this.width, this.height, 0.4*speedX, this.layer3image, ax);
        this.layer4 = new Layer(game, this.width, this.height, 0.8*speedX, this.layer4image, ax);
        this.layer5 = new Layer(game, this.width, this.height, 1*speedX, this.layer5image, ax);
        this.backgroundLayers=[this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];
    }
    update(deltaTime){
        this.backgroundLayers.forEach(layer=>{
            layer.update(deltaTime);
        })
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} context
     */
    draw(context){
        this.backgroundLayers.forEach(layer=>{
            layer.draw(context);
        })
    }
}