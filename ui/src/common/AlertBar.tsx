import React from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

type AlertBarProps = {
    show: boolean,
    alertText: string,
    onClose: ()=>void
};

export class AlertBar extends React.Component<AlertBarProps> {

    render() {
        const {show,alertText,onClose} = this.props;

        return (
            <Snackbar open={show} autoHideDuration={6000} onClose={onClose}>
                <MuiAlert elevation={6} variant="filled" severity="info" onClose={onClose}>
                    {alertText}
                </MuiAlert>
            </Snackbar>
        );
    }
}