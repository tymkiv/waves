import * as PIXI from 'pixi.js'
import gsap from "gsap";
import {cover, contain} from 'intrinsic-scale';


export default class ImageLoad {
    constructor($wrapper) {
        this.$wrapper = $wrapper;
        this.width = $wrapper.width();
        this.height = $wrapper.height();
        this.src = $wrapper.data('src');
        this.mouseOn = false;
        this.animated = false;


        this.app = new PIXI.Application({
            width: this.width,
            height: this.height,
            transparent: true
        });

        this.$wrapper.append(this.app.view);

        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);

        this.load(this.startAnimation.bind(this));
        
    }

    load(afterLoad) {
        this.tmpImg = new Image();
        this.tmpImg.src = this.src;
        this.tmpImg.onload = () => {
            afterLoad();
            
        }
    }

    startAnimation() {
        const { width, height, x, y } = cover(this.width, this.height, this.tmpImg.width, this.tmpImg.height);

        this.bg = PIXI.Sprite.from(this.src);
        this.bg.width = width;
        this.bg.height = height;
        this.bg.position.x = x;
        this.bg.position.y = y;
        this.container.addChild(this.bg);

        this.displacementSprite = PIXI.Sprite.from('img/displacement.jpg');
        this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

        this.displacementFilter.scale.set(1e3 + Math.random() * 1000);
        this.app.stage.addChild(this.displacementSprite);
        this.container.filters = [this.displacementFilter];

        // this.click();
        const tl = gsap.timeline({onComplete: () => { this.animated = true; }});
        tl.to(this.displacementFilter.scale, {x:1, y:1, duration: 1});
        this.hover();
    }

    // click() {
    //     this.document.on('load', () => {
    //         const tl = gsap.timeline({onComplete: () => { this.animated = true; }});
    //         tl.to(this.displacementFilter.scale, {x:1, y:1, duration: 1});
    //     })
    // }

    hover() {
        this.$wrapper.on('mouseenter', () => {
            if(!this.mouseOn && this.animated) {
                this.mouseOn = true;
                this.doWavesBind = this.doWaves.bind(this);
                gsap.ticker.add(this.doWavesBind);
                gsap.timeline().to(this.displacementFilter.scale, {x: 10, y: 10, duration: 0.5})
            }
        })
        this.$wrapper.on('mouseleave', () => {
            if(this.mouseOn && this.animated) {
                this.mouseOn = false;
                gsap.ticker.remove(this.doWavesBind);
                gsap.timeline().to(this.displacementFilter.scale, {x: 1, y: 1, duration: 0.5})
            }
        })
    }

    doWaves() {
        this.displacementSprite.position.x += 1;
    }
}