
cc.Class({
    extends: cc.Component,

    properties: {
        countDown: cc.Label,
        reviveNum: cc.Label,
        killTip: cc.Label,

        nowRevive: cc.Node,
        shareRevive: cc.Node,
        adRevive: cc.Node
    },

    //打开游戏复活界面
    openReviveWindow(killTip, game) {
        this.game = game;
        //屏幕适配
        this.node.width = this.game.node.width;
        this.node.height = this.game.node.height;

        this.countDown.string = '20';
        this.reviveNum.string = this.game.reviveCoinNum + '';

        this.killTip.string = killTip;

        this.countDownTime = 20;
        this.schedule(this.countDownFunc, 1);

        //判断显示复活按钮
        if (this.game.reviveCoinNum > 0) {
            this.nowRevive.active = true;
            this.shareRevive.active = false;
            this.adRevive.active = false;
        } else {
            this.nowRevive.active = false;
            if (cc.sys.localStorage.getItem('reviveAdChange')) {
                this.adRevive.active = true;
                this.shareRevive.active = false;
            } else {
                this.shareRevive.active = true;
                this.adRevive.active = false;
            }
        }

        //复活的呼吸动画
        this.btnHuxi();
        this.unschedule(this.btnHuxi);
        this.schedule(this.btnHuxi, 4);

        if (!this.game.goodGame.active) {
            this.game.goodGame.active = true;
        }

    },

    //游戏复活界面倒计时
    countDownFunc() {
        this.countDownTime--;
        if (this.countDownTime === 0) {
            // this.closeReviveWindow();
            // if (this.game.killNum > 0) {
            //     this.game.openAwardWindow();
            // } else {
            //     this.game.openOverWindow();
            // }
            this.unschedule(this.countDownFunc);
        } else {
            //倒计时音效
            this.game.audio.onTimeAudio();
        }
        this.countDown.string = this.countDownTime + '';
    },

    //复活按钮呼吸动画
    btnHuxi() {
        let action1 = cc.scaleTo(2, 1.1);
        let action2 = cc.scaleTo(2, 1);
        if (this.nowRevive.active) {
            this.nowRevive.runAction(cc.sequence(action1, action2));
        }
        if (this.shareRevive.active) {
            this.shareRevive.runAction(cc.sequence(action1, action2));
        }
        if(this.adRevive.active){
            this.adRevive.runAction(cc.sequence(action1, action2));
        }
    },

    //跳过复活界面
    skipReviveWindow() {
        this.closeReviveWindow();
        if (this.game.killNum > 0) {
            this.game.openAwardWindow();
        } else {
            this.game.openOverWindow();
        }

        //按钮音效
        this.game.audio.onButtonAudio();
    },

    //关闭复活界面
    closeReviveWindow() {
        //取消倒计时
        this.unschedule(this.countDownFunc);
        this.node.parent.removeChild(this.node);

        //按钮音效
        this.game.audio.onButtonAudio();
    },


    //复活按钮
    onBtnRevive() {
        this.game.reviveGame();

        //按钮音效
        this.game.audio.onButtonAudio();
    }
});
