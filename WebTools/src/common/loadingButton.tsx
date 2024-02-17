import { Button } from "../components/button";

export const LoadingButton = ({loading, onClick, children, className = "mt-4", enabled = true}) => {

    const spinner = loading ? (<div className="spinner-border text-dark" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>) : null;
    return (<Button onClick={() => onClick()} className={'btn btn-primary ' + (className ?? "")} enabled={enabled}><>{spinner} {children}</></Button>);
}
