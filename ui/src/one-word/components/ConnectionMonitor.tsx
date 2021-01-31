import React from "react";

import {createStyles, Theme, WithStyles, withStyles} from "@material-ui/core/styles";
import {SocketEvent} from "../../types";
import {Trans} from "react-i18next";
import {
    CheckCircle as ConnectedIcon,
    CloudOff as DisconnectedIcon,
} from '@material-ui/icons'
import {Box, CircularProgress} from "@material-ui/core";


enum ConnectionStatus {
    Connected = 'CONNECTED',
    Disconnected = 'DISCONNECTED',
    Connecting = 'CONNECTING',
}


const styles = (theme: Theme) => createStyles({
    root: {
        position: 'fixed',
        bottom: 50,
        left: 0,
        borderRadius: ' 0 5px 5px 0',
        padding: theme.spacing(1, 2),
        transition: 'transform ease-in 300ms',
        transform: 'translateX(0)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        fontSize: 'smaller',
    },
    [ConnectionStatus.Connected]: {
        background: theme.palette.success.dark,
        transform: 'translateX(-100%)',
        transitionDelay: '1s',
    },
    [ConnectionStatus.Disconnected]: {
        background: theme.palette.error.dark,
    },
    [ConnectionStatus.Connecting]: {
        background: theme.palette.info.main,
    },
});

type ConnectionMonitorProps = {
    socket: any
} & WithStyles<typeof styles>;

type ConnectionMonitorState = {
    status: ConnectionStatus
};
class ConnectionMonitor extends React.Component<ConnectionMonitorProps, ConnectionMonitorState> {
    state = {
        status: ConnectionStatus.Connecting
    };
    componentDidMount () {
        const {socket} = this.props;

        for (let [,event] of Object.entries(SocketEvent)) {
            socket.on(event, (_data?: any) => {
                switch (event) {
                    case SocketEvent.Connect:
                    case SocketEvent.Reconnect:
                    case SocketEvent.Ping:
                    case SocketEvent.Pong:
                        this.setState({status: ConnectionStatus.Connected});
                        break;

                    case SocketEvent.ConnectError:
                    case SocketEvent.ConnectTimeout:
                    case SocketEvent.Disconnect:
                    case SocketEvent.Error:
                    case SocketEvent.ReconnectFailed:
                    case SocketEvent.ReconnectError:
                        this.setState({status: ConnectionStatus.Disconnected});
                        break;

                    case SocketEvent.Connecting:
                    case SocketEvent.ReconnectAttempt:
                    case SocketEvent.Reconnecting:
                        this.setState({status: ConnectionStatus.Connecting});
                        break;
                }
            })
        }
    }

    render() {
        const {classes} = this.props;
        const {status} = this.state;
        return (
            <div className={[classes.root, classes[status]].join(' ')}>
                {status === ConnectionStatus.Connected && <ConnectedIcon/>}
                {status === ConnectionStatus.Disconnected && <DisconnectedIcon/>}
                {status === ConnectionStatus.Connecting && <CircularProgress color="inherit" size={24}/>}
                <Box marginLeft={1.5}><Trans i18nKey={"CONNECTION." + status}>{status}</Trans></Box>
            </div>
        );
    }
}

export default withStyles(styles)(ConnectionMonitor);
