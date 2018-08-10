function createTurnplate(options) {
    let domQuery = options.domQuery || 'canvas';
    // 获取 canvas 元素
    let canvas = document.querySelector(domQuery);
    // 获取canvas 2d 渲染上下文
    let ctx = canvas.getContext('2d');
    // 加载转盘奖品图片资源
    let plateImgs = options.plateImgs || [];
    // 背景图（转盘）
    let plateBg = options.plateBg;
    // 转盘奖项数
    let num = options.num || 6;
    // canvas 宽、高
    let width = canvas.width || 400;
    let height = canvas.height || 400;

    if ((plateImgs.length !== num) && (num % plateImgs.length === 0)) {
        plateImgs = repeat(plateImgs, num / plateImgs.length);
    }

    ctx.strokeStyle = options.color || 'red'
    ctx.font = '30px Arial'
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    //
    let img_bg = document.createElement('img');
    img_bg.src = plateBg;
    // ctx.beginPath();
    img_bg.onload = function (e) {
        ctx.beginPath();
        // console.log(e, this);
        ctx.drawImage(img_bg, 0, 0, width, height);
        let item_imgs = [];
        if (!!plateImgs) {
            let item_img;
            let promise_task = [];
            for (let i = 0; i < num; i++) {
                item_img = document.createElement('img')
                item_img.src = plateImgs[i];
                item_imgs.push(item_img);
                promise_task.push(new Promise((resolve, reject) => {
                    item_img.onload = function () {
                        resolve();
                    }
                }))
            }
            console.log(promise_task);
            Promise.all(promise_task).then(() => {
                // 开始绘制
                console.log('kaishi .... ');
                for (let i = 0; i < num; i++) {
                    ctx.save();
                    // 移动绘制中心点
                    ctx.translate(width / 2, height / 2);
                    ctx.moveTo(0, 0);

                    ctx.rotate(360 / num * i * Math.PI / 180);
                    // 画线
                    ctx.arc(0, 0, width / 2, 0, 2 * Math.PI / num, false);

                    // yi
                    ctx.translate(width / 2, 0);
                    ctx.moveTo(0, 0);
                    // 调整角度；
                    ctx.rotate(Math.PI / num + 1 / 2 * Math.PI)
                    ctx.drawImage(item_imgs[i], width / 8, 0, width / 4, width / 4 * 0.8);
                    ctx.restore();
                }
                ctx.closePath();
            })
        }
    }
}

function repeat(arr, times) {
    let newArr = [];
    if (typeof arr === 'string') {
        for (let i = 0; i < times; i++) {
            newArr.push(arr);
        }
        return newArr;
    } else if (arr instanceof Array) {
        for (let i = 0; i < times; i++) {
            newArr = newArr.concat(arr);
        }
        return newArr;
    } else {
        return null;
    }
}