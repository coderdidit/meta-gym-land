import Phaser from "phaser";
import { TextBox, BBCodeText, RoundRectangle } from 'phaser3-rex-plugins/templates/ui/ui-components';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

const GetValue = Phaser.Utils.Objects.GetValue;

export const createTextBox = function (scene, x, y, config) {
    var wrapWidth = GetValue(config, 'wrapWidth', 0);
    var fixedWidth = GetValue(config, 'fixedWidth', 0);
    var fixedHeight = GetValue(config, 'fixedHeight', 0);


    const tBoxCfg = {
        x: x,
        y: y,
        // with: 500,
        background: getRoundRectangle(scene),

        // icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

        // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
        text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

        // action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),
        // draggable: true,
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 0,
            text: 10,
        }
    }
    const textBox = new TextBox(scene, tBoxCfg);
    scene.add.existing(textBox);
    textBox.setOrigin(0).layout();

    // textBox
    //     .setInteractive()
    //     .on('pointerdown', function () {
    //         alert('I will take us to next mini game scene!!!');
    //         var icon = this.getElement('action').setVisible(false);
    //         this.resetChildVisibleState(icon);
    //         if (this.isTyping) {
    //             this.stop(true);
    //         } else {
    //             this.typeNextPage();
    //         }
    //     }, textBox)

    // .on('pageend', function () {
    //     if (this.isLastPage) {
    //         return;
    //     }

    //     var icon = this.getElement('action').setVisible(true);
    //     this.resetChildVisibleState(icon);
    //     icon.y -= 30;
    //     var tween = scene.tweens.add({
    //         targets: icon,
    //         y: '+=30', // '+=100'
    //         ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
    //         duration: 500,
    //         repeat: 0, // -1: infinity
    //         yoyo: false
    //     });
    // }, textBox)
    //.on('type', function () {
    //})

    return textBox;
}
const getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    return scene.add.text(0, 0, '', {
        align: 'center',
        fontSize: '18px',
        wordWrap: {
            width: wrapWidth
        },
        maxLines: 10
    })
        .setFixedSize(fixedWidth, fixedHeight);
}

const getRoundRectangle = function (scene) {
    const rect = new RoundRectangle(scene, 0, 0, 2, 2, 20, COLOR_PRIMARY);
    rect.setStrokeStyle(4, COLOR_LIGHT);
    scene.add.existing(rect);
    return rect;
};

const getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
    const bbTextCfg = {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,
        align: 'left',
        fontSize: '18px',
        wrap: {
            mode: 'word',
            width: wrapWidth
        },
        padding: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        },
        maxLines: 10
    }
    const txt = new BBCodeText(scene, 0, 0, '', bbTextCfg);
    scene.add.existing(txt);
    return txt;
}