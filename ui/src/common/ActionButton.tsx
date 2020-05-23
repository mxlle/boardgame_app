import React from 'react';
import { CircularProgress } from '@material-ui/core';

type ActionButtonProps = {
	loading: boolean;
    children: React.ReactNode
}

export class ActionButton extends React.Component<ActionButtonProps> {

    render() {
    	const { children, loading } = this.props;

        return (
            <div className="buttonWithLoading">
                { children }
                { loading && <CircularProgress size={24} className="loadingInButton" /> }
            </div>
        );
    }

}