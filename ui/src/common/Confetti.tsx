import React from 'react';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import {create, CreateTypes} from 'canvas-confetti';
import {allColors} from "../shared/color-util";

const styles = (_theme: Theme) => createStyles({
    root: {
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: "none",
        zIndex: 9999,
        "& canvas": {
            height: "100%",
            width: "100%"
        }
    }
});

type ConfettiProps = {
    colors: string[],
    getTrigger: (triggerConfetti: ()=>void)=>void
}&WithStyles<typeof styles>;

class Confetti extends React.Component<ConfettiProps> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private confettiCannon: CreateTypes|undefined;

    constructor(props: ConfettiProps) {
        super(props);

        this.canvasRef = React.createRef<HTMLCanvasElement>();

        props.getTrigger(this.triggerConfetti.bind(this));

    }

    getConfettiCannon() {
        if (!this.confettiCannon && this.canvasRef.current) {
            this.confettiCannon = create(this.canvasRef.current, {
                resize: true
            });
        }
        return this.confettiCannon;
    }

    triggerConfetti (colors: string[] = allColors, amount: number = 1) {
        const confettiCannon = this.getConfettiCannon();
        if (!confettiCannon) return;
        let particleCount = Math.floor(amount*60)+10; // 70 when 100%
        const CONFETTI_BASE_OPTIONS = {
            colors: colors,
            startVelocity: 70,
            particleCount,
            spread: 60
        }
        confettiCannon({
            ...CONFETTI_BASE_OPTIONS,
            angle: 125,
            origin: { x: 1, y: 1 },
        });
        confettiCannon({
            ...CONFETTI_BASE_OPTIONS,
            angle: 55,
            origin: { x: 0, y: 1 }
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <canvas ref={this.canvasRef}/>
            </div>
        );
    }

}

export default withStyles(styles)(Confetti);
