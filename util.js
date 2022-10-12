export class Sprite{
    constructor(image=new Image(), spriteWidth=0, spriteHeight=0){
        this.image=image;
        this.spriteWidth=spriteWidth;
        this.spriteHeight=spriteHeight;
        this.width=spriteWidth;
        this.height=spriteHeight;
        this.frameX=0;
        this.frameY=0;
        this.maxFrame=0;
        this.x=0;
        this.y=0;
        this.fps=20;
        this.frameTimer=0;
    }
    #getFrameInterval(){
        return 1000/this.fps;
    }
    /**
     *@param {CanvasRenderingContext2D} context
     */
    draw(context){
        context.drawImage(this.image, this.frameX*this.spriteWidth, this.frameY*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    };
    update(deltaTime){
        if(this.frameTimer>=this.#getFrameInterval()){
            if(this.frameX<this.maxFrame) this.frameX++;
            else this.frameX=0;
            this.frameTimer=0;
        }else{
            this.frameTimer+=deltaTime;
        }
    }
}

export class GameObject{
    constructor(x=0, y=0, width=0, height=0){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.speedX=0;
        this.speedY=0;
        this.ax=0;
        this.ay=0;
        this.dx=0;
        this.dy=0;
        this.maredForDeletion=false;
    }
    update(deltaTime=0){
        const dt=deltaTime*0.001;
        this.speedX+=this.ax*dt;
        this.speedY+=this.ay*dt;
        this.x+=this.speedX*dt;
        this.y+=this.speedY*dt;
    }
    /**
     *@param {CanvasRenderingContext2D} context
     */
     draw(context){
        context.strokeRect(this.x+this.dx, this.y+this.dy, this.width, this.height);
    };
}