class Character {

    constructor(options) {

        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.image = new Image();
        this.image.src = options.image;

        this.fps = options.fps || 10;

        this.currentAnimation = "idle";
        this.frameIndex = 0;
        this.lastFrameTime = 0;
        this.playing = true;

        /*
        ==================================================
        30 FRAME

        01-04  IDLE
        05-08  RUN
        09-12  JUMP
        13-16  FLY
        17-20  NORMAL ATTACK
        21-24  SKILL 1
        25-28  SKILL 2
        29-30  SKILL 3
        ==================================================
        */

        this.animations = {

            idle: {
                frames: [0,1,2,3],
                loop: true
            },

            run: {
                frames: [4,5,6,7],
                loop: true
            },

            normalAttack: {
                frames: [16,17,18,19],
                loop: false
            },

            skill1: {
                frames: [20,21,22,23],
                loop: false
            },

            skill2: {
                frames: [24,25,26,27],
                loop: false
            },

            skill3: {
                frames: [28,29],
                loop: false
            }

        };


        /*
        ==================================================
        VỊ TRÍ 30 FRAME TRONG ẢNH GỐC

        Ảnh của bạn hiện tại có:
        hàng 1 = 8 frame
        hàng 2 = 8 frame
        hàng 3 = 8 frame
        hàng 4 = 6 frame

        Các rect có dạng:

        x, y, width, height
        ==================================================
        */

        this.frames = [

            /* 01 */
            {x:20,  y:90,  w:120, h:160},

            /* 02 */
            {x:145, y:90,  w:125, h:160},

            /* 03 */
            {x:280, y:90,  w:125, h:160},

            /* 04 */
            {x:410, y:90,  w:125, h:160},

            /* 05 */
            {x:515, y:75,  w:165, h:180},

            /* 06 */
            {x:660, y:75,  w:165, h:180},

            /* 07 */
            {x:800, y:75,  w:165, h:180},

            /* 08 */
            {x:940, y:75,  w:190, h:190},


            /* 09 */
            {x:10,  y:340, w:145, h:190},

            /* 10 */
            {x:135, y:335, w:145, h:190},

            /* 11 */
            {x:260, y:330, w:155, h:190},

            /* 12 */
            {x:385, y:335, w:150, h:195},

            /* 13 */
            {x:495, y:330, w:175, h:195},

            /* 14 */
            {x:640, y:325, w:180, h:200},

            /* 15 */
            {x:790, y:325, w:180, h:205},

            /* 16 */
            {x:940, y:320, w:200, h:210},


            /* 17 */
            {x:5,   y:610, w:155, h:205},

            /* 18 */
            {x:140, y:605, w:155, h:205},

            /* 19 */
            {x:255, y:605, w:180, h:210},

            /* 20 */
            {x:390, y:600, w:160, h:220},

            /* 21 */
            {x:510, y:600, w:170, h:210},

            /* 22 */
            {x:650, y:590, w:190, h:220},

            /* 23 */
            {x:805, y:590, w:190, h:230},

            /* 24 */
            {x:945, y:585, w:190, h:240},


            /* 25 */
            {x:0,   y:875, w:180, h:235},

            /* 26 */
            {x:120, y:865, w:220, h:245},

            /* 27 */
            {x:245, y:865, w:200, h:245},

            /* 28 */
            {x:360, y:855, w:210, h:260},

            /* 29 */
            {x:530, y:850, w:270, h:270},

            /* 30 */
            {x:740, y:845, w:390, h:290}

        ];


        this.image.onload = () => {

            this.resizeCanvas();

            this.draw();

            requestAnimationFrame(
                this.loop.bind(this)
            );

        };

    }


    /* ==================================================
       ĐỔI ANIMATION
    ================================================== */

    play(name) {

        if (!this.animations[name]) {
            return;
        }

        this.currentAnimation = name;

        this.frameIndex = 0;

        this.playing = true;

        this.lastFrameTime =
            performance.now();

        this.draw();

    }


    /* ==================================================
       FRAME HIỆN TẠI
    ================================================== */

    getCurrentFrameNumber() {

        const animation =
            this.animations[
                this.currentAnimation
            ];

        return animation.frames[
            this.frameIndex
        ];

    }


    /* ==================================================
       CANVAS
    ================================================== */

    resizeCanvas() {

        this.canvas.width = 420;
        this.canvas.height = 420;

    }


    /* ==================================================
       VẼ NHÂN VẬT
    ================================================== */

    draw() {

        if (!this.image.complete) {
            return;
        }


        const frameNumber =
            this.getCurrentFrameNumber();


        const frame =
            this.frames[
                frameNumber
            ];


        if (!frame) {
            return;
        }


        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );


        /*
        ================================================
        Đọc vùng frame
        ================================================
        */

        this.ctx.drawImage(

            this.image,

            frame.x,
            frame.y,
            frame.w,
            frame.h,

            0,
            0,
            this.canvas.width,
            this.canvas.height

        );

    }


    /* ==================================================
       UPDATE
    ================================================== */

    update(time) {

        if (!this.playing) {
            return;
        }


        const animation =
            this.animations[
                this.currentAnimation
            ];


        const frameDelay =
            1000 / this.fps;


        if (
            time - this.lastFrameTime
            >= frameDelay
        ) {

            this.frameIndex++;

            this.lastFrameTime = time;


            /*
            ============================================
            KẾT THÚC ĐÁNH / SKILL
            ============================================
            */

            if (
                this.frameIndex >=
                animation.frames.length
            ) {

                if (animation.loop) {

                    this.frameIndex = 0;

                }
                else {

                    this.frameIndex =
                        animation.frames.length - 1;

                    this.playing = false;

                    /*
                       Skill xong → trở về Idle
                    */

                    setTimeout(() => {

                        this.play("idle");

                    }, 80);

                }

            }


            this.draw();

        }

    }


    /* ==================================================
       GAME LOOP
    ================================================== */

    loop(time) {

        this.update(time);

        requestAnimationFrame(
            this.loop.bind(this)
        );

    }

}
