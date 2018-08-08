// 可以方便调整屏幕大小·自适应大小。
var WINDOW_WIDTH      = 1024,
    WINDOW_HEIGHT     = 768,
    RADIUS            = 8,
    MARGIN_TOP        = 60,
    MARGIN_LEFT       = 30,
    curShowTimeSecond = 0;

const endTime = new Date(2018,7,9,0,30,22);

var balls = [];



window.onload = function(){
    var canvas  = document.getElementById('canvas'),
        context = canvas.getContext('2d');
    
    canvas.width  = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    // setInterval(function(){
    //     context.clearRect(0,0,canvas.width,canvas.height);
    //     curShowTimeSecond = getCurrentShowTimeSeconds();
    //     render(context);
    // },1000)

    curShowTimeSecond = getCurrentShowTimeSeconds();
    setInterval(function(){
        render(context);
        update();
    },50)

};

// 时间变化和产生彩色小球都放在update里
function update(){
    var nextShowTimeSecond = getCurrentShowTimeSeconds();

    var nextHour   = parseInt(nextShowTimeSecond/3600),
        nextMinute = parseInt((nextShowTimeSecond-nextHour*3600)/60),
        nextSecond = nextShowTimeSecond%60;
    
    var curHour   = parseInt(curShowTimeSecond/3600),
        curMinute = parseInt((curShowTimeSecond-curHour*3600)/60),
        curSecond = curShowTimeSecond%60;
    
    // 一旦时间发生改变，改变时间，生成小球
    if(nextSecond != curSecond){
        // 改变时间
        curShowTimeSecond = nextShowTimeSecond;
        // 生成小球，分别判断时，分，秒的十位与个位是不是都有变化
        var curHourTens     = parseInt(curHour/10),
            curMinuteTens   = parseInt(curMinute/10),
            curSecondTens   = parseInt(curSecond/10),
            curHourUnits    = parseInt(curHour%10),
            curMinuteUnits  = parseInt(curMinute%10),
            curSecondUnits  = parseInt(curSecond%10),
            nextHourTens    = parseInt(nextHour/10),
            nextMinuteTens  = parseInt(nextMinute/10),
            nextSecondTens  = parseInt(nextSecond/10),
            nextHourUnits   = parseInt(nextHour%10),
            nextMinuteUnits = parseInt(nextMinute%10),
            nextSecondUnits = parseInt(nextSecond%10);
        // 判断hour的十位，个位有没有变化
        if(nextHourTens != curHourTens){
            addBalls(MARGIN_LEFT, MARGIN_TOP, curHourTens);
        }
        if(nextHourUnits != curHourUnits){
            addBalls(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, curHourUnits);
        }
        // 判断minute的十位，个位有没有变化
        if(nextMinuteTens != curMinuteTens){
            addBalls(MARGIN_LEFT + (2*15+9)*(RADIUS+1), MARGIN_TOP, curMinuteTens);
        }
        if(nextMinuteUnits != curMinuteUnits){
            addBalls(MARGIN_LEFT + (3*15+9)*(RADIUS+1), MARGIN_TOP, curMinuteUnits);
        }
        // 判断second的十位，个位有没有变化
        if(nextSecondTens != curSecondTens){
            addBalls(MARGIN_LEFT + (4*15+9*2)*(RADIUS+1), MARGIN_TOP, curSecondTens);
        }
        if(nextSecondUnits != curSecondUnits){
            addBalls(MARGIN_LEFT + (5*15+9*2)*(RADIUS+1), MARGIN_TOP, curSecondUnits);
        }
    }

    updateBalls();
    console.log(balls.length);
};

function updateBalls(){
    // 更新新增小球状态
    for(var i=0; i<balls.length; i++){
        balls[i].x  += balls[i].vx;
        balls[i].y  += balls[i].vy;
        balls[i].vy += balls[i].a;
        // 上下碰撞检测，改变速度方向
        if(balls[i].y >= WINDOW_HEIGHT - RADIUS){
            balls[i].y  = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    };
    //删除多余小球
    var cnt = 0;
    for(var j=0; j<balls.length; j++){
        // 左右检测，
        if(balls[j].x + balls[j].r > 0  && balls[j].x - balls[j].r < WINDOW_WIDTH){
            balls[cnt++] = balls[j];
        }
    };
    // 取300和cnt两者最小值
    while(balls.length > Math.min(300,cnt)){
        balls.pop();
    };
    // while(balls.length > cnt){
    //     balls.pop();
    // };
};

function addBalls(x,y,num){
    for(var i=0; i<digit[num].length; i++){
        for(var j=0; j<digit[num][i].length; j++){
            if(digit[num][i][j]===1){
                var aBall = {
                    x  : x+j*2*(RADIUS+1)+(RADIUS+1), // 球球起始位置 
                    y  : y+i*2*(RADIUS+1)+(RADIUS+1), // 球球起始位置
                    r  : RADIUS,
                    a  : 1.5+Math.random(),
                    vx : Math.pow(-1, Math.ceil(Math.random()*1000))*4,     //取 4 或 -4
                    vy : -5,     //-6 ~ -4 
                    color : 'rgba(' + (Math.random()*255).toFixed(0) + ', ' +
                                    (Math.random()*255).toFixed(0) + ', ' +
                                    (Math.random()*255).toFixed(0) + ', 1)' 
                }
                balls.push(aBall);
            }
        }
    }
};

function getCurrentShowTimeSeconds(){
    // 当前时间
    var curTime = new Date();
    // 时间差
    var ret = endTime.getTime() - curTime.getTime();
    // 将毫秒变为秒
    ret = Math.round(ret/1000);
    return ret >= 0 ? ret : 0;
}; 

function render(ctx){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    var hour   = parseInt(curShowTimeSecond/3600),
        minute = parseInt((curShowTimeSecond-hour*3600)/60),
        second = curShowTimeSecond%60;
  
    renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hour/10),ctx); // hour十位
    renderDigit(MARGIN_LEFT + 15*(RADIUS+1),MARGIN_TOP,parseInt(hour%10),ctx); // hour个位
    renderDigit(MARGIN_LEFT + 2*15*(RADIUS+1),MARGIN_TOP,10,ctx); // 冒号
    renderDigit(MARGIN_LEFT + (2*15+9)*(RADIUS+1),MARGIN_TOP,parseInt(minute/10),ctx); // minute十位
    renderDigit(MARGIN_LEFT + (3*15+9)*(RADIUS+1),MARGIN_TOP,parseInt(minute%10),ctx); // minute个位
    renderDigit(MARGIN_LEFT + (4*15+9)*(RADIUS+1),MARGIN_TOP,10,ctx); // 冒号
    renderDigit(MARGIN_LEFT + (4*15+9*2)*(RADIUS+1),MARGIN_TOP,parseInt(second/10),ctx); // second十位
    renderDigit(MARGIN_LEFT + (5*15+9*2)*(RADIUS+1),MARGIN_TOP,parseInt(second%10),ctx); // second个位

    for(var i=0; i<balls.length; i++){
        ctx.fillStyle = balls[i].color;
        ctx.beginPath();
        ctx.arc(balls[i].x, balls[i].y, balls[i].r, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
};

function renderDigit(x,y,num,ctx){
    ctx.fillStyle = 'rgba(0,102,153,0.5)';
    
    for(var i=0; i<digit[num].length; i++){
        for(var j=0; j<digit[num][i].length; j++){
            if(digit[num][i][j]===1){
                ctx.beginPath();
                ctx.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI)
                ctx.closePath();
                ctx.fill();
            }
        }
    }
}