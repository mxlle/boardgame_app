import React from 'react';
import { Trans } from 'react-i18next';
import {Button} from '@material-ui/core';
import ActionButton from "../common/ActionButton";

const DEFAULT_CONFETTI_AMMO = 5;
const CONFETTI_AMMO_RELOADING_TIME = 3000;

type ConfettiButtonProps = {
    onConfetti: ()=>void,
};
type ConfettiButtonState = {
    confettiAmmo: number,
};
class ConfettiButton extends React.Component<ConfettiButtonProps,ConfettiButtonState> {
    public state: ConfettiButtonState = {
        confettiAmmo: DEFAULT_CONFETTI_AMMO,
    };
    private _isMounted: boolean = false;

    componentDidMount() {
        this._isMounted = true;
        this.reduceConfettiAmmo = this.reduceConfettiAmmo.bind(this);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    reduceConfettiAmmo() {
        this.setState((state) => {
            const reducedAmmo = state.confettiAmmo - 1;

            if (reducedAmmo === 0) {
                setTimeout(() => {
                    if (this._isMounted) {
                        this.setState({
                            confettiAmmo: DEFAULT_CONFETTI_AMMO
                        })
                    }
                }, CONFETTI_AMMO_RELOADING_TIME);
            }

            return {
                confettiAmmo: reducedAmmo
            }
        });
    }

    render() {
        const { onConfetti } = this.props;
        const { confettiAmmo } = this.state;

        const onClick = () => {
            onConfetti();
            this.reduceConfettiAmmo();
        }

        return (
            <ActionButton loading={!confettiAmmo}>
                <Button variant="outlined" onClick={onClick} disabled={!confettiAmmo}>
                    <Trans i18nKey={confettiAmmo ? 'COMMON.CONFETTI' : 'COMMON.RELOAD_CONFETTI'} tOptions={{confettiAmmo}}>Confetti!</Trans>
                </Button>
            </ActionButton>
        );
    }
}

export default ConfettiButton;
