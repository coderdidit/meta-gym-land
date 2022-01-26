import Phaser from "phaser";

const columnName = 'mglXP';

export class EarnableScene extends Phaser.Scene {
    gameUser() {
        return this.game.registry.values?.avatar?.user;
    }

    currentXPBalance() {
        return this.gameUser()?.get(columnName);
    }

    async updateXP() {
        if (this.score === 0) return;
        const inMiniGameScore = this.score;
        const usr = this.gameUser();
        if (usr && usr.set && usr.get) {
            const xpSoFar = usr.get(columnName);
            const inMiniGameXP = inMiniGameScore * 0.1;
            const newXP = xpSoFar + inMiniGameXP;
            usr.set(columnName, newXP);
            const saveMglXPResult = await usr.save();
            console.log('saveMglXPResult', saveMglXPResult);
        }
    }
}
