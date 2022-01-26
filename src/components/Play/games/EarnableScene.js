import Phaser from "phaser";

export class EarnableScene extends Phaser.Scene {
    gameUser() {
        return this.game.registry.values?.avatar?.user;
    }

    currentXPBalance() {
        return this.gameUser().get('mglXP');
    }

    async updateXP() {
        if (this.score === 0) return;
        // TODO add if demo avatar return;
        const inMiniGameScore = this.score;
        const usr = this.gameUser();
        if (usr && usr.set && usr.get) {
            const xpSoFar = usr.get('mglXP');
            const inMiniGameXP = inMiniGameScore * 0.1;
            const newXP = xpSoFar + inMiniGameXP;
            usr.set('mglXP', newXP);
            const saveMglXPResult = await usr.save();
            console.log('saveMglXPResult', saveMglXPResult);
        }
    }
}
