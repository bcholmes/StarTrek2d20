import { Button } from "../components/button";

export const LoadingButton = ({loading, onClick, children}) => {

    const spinner = loading ? (<div className="spinner-border text-dark" role="status">
        <span className="sr-only">Loading...</span>
    </div>) : null;
    return (<Button onClick={() => onClick()} buttonType={true} className="btn btn-primary mt-4">{spinner} {children}</Button>);
}
