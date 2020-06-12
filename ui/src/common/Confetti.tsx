import React from 'react';
import { createStyles, withStyles, WithStyles, Theme } from '@material-ui/core/styles';
import { create, CreateTypes } from 'canvas-confetti';
import {allColors} from "./ColorPicker";

const styles = (theme: Theme) => createStyles({
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

    triggerConfetti (colors?: string[]) {
        const confettiCannon = this.getConfettiCannon();
        if (!confettiCannon) return;
        const CONFETTI_BASE_OPTIONS = {
            colors: colors || allColors,
            startVelocity: 70,
            particleCount: 70,
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