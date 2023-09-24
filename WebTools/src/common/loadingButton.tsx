import { Button } from "../components/button";

export const LoadingButton = ({loading, onClick, children, className = "mt-4", enabled = true}) => {

    const spinner = loading ? (<div className="spinner-border text-dark" role="status">
        <span className="sr-only">Loading...</span>
    </div>) : null;
    return (<Button onClick={() => onClick()} buttonType={true} className={'btn btn-primary ' + (className ?? "")} enabled={enabled}><>{spinner} {children}</></Button>);
}
