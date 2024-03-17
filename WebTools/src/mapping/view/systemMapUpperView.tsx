import React from "react";
import { SimpleColor } from "../../common/colour";
import { CompanionType } from "../table/starSystem";
import { AsteroidBeltDetails } from "../table/world";
import { SystemMapView } from "./systemMapView";
import {createRandomValue} from "../../common/randomValueGenerator";
import { WorldClass } from "../table/worldClass";

class SystemMapUpperView extends SystemMapView {

    render() {
        const { system } = this.props;
        const purple = "#906F9A";

        let r = Math.max(2, Math.sqrt(system.star?.spectralClass?.radius?.midpoint * 200));

        let star2 = null;
        let companionGradient = null;

        let orbits = this.findAllOrbits();

        if (system.companionStar) {
            if (system.companionType === CompanionType.Close) {
                let r2 = Math.max(2, Math.sqrt(system.companionStar?.spectralClass?.radius?.midpoint * 200));

                const coronaR = r2 + 4;
                const coronaRStop = r2 / coronaR;

                const y2 = this.calculateThirtyDegreeY(35 + r);

                star2 = system?.companionStar?.spectralClass?.isDwarf
                    ? (<g>
                        <circle cx={35 + r} cy={y2} r={coronaR} fill="url(#companionStarCoronaRadialGradientUp)" />
                        <circle cx={35 + r} cy={y2} r={r2} fill="url(#companionStarRadialGradientUp)" stroke="black" strokeWidth={0.5} />
                    </g>)
                    : (<g>
                        <circle cx={35 + r} cy={y2} r={coronaR} fill="url(#companionStarCoronaRadialGradientUp)" />
                        <circle cx={35 + r} cy={y2} r={r2} fill="url(#companionStarRadialGradientUp)" stroke="black" strokeWidth={0.5} />
                    </g>)
                companionGradient = (<>
                        <linearGradient id="companionStarCoronaLinearGradientUp">
                            <stop stopColor={system.companionStar.spectralClass?.colour?.asHex()} offset={0} />
                            <stop stopColor={system.companionStar.spectralClass?.colour?.asHex()} offset={coronaRStop.toFixed(2)} />
                            <stop stopColor={system.companionStar.spectralClass?.colour?.withAlpha(0).asHex()} offset={1} />
                        </linearGradient>
                        <radialGradient id="companionStarRadialGradientUp" xlinkHref="#companionStarLinearGradientUp"
                            cx={35+r-(0.4*r2)} cy={y2-(0.4*r2)} fx={35+r-(0.4*r2)} fy={y2-(0.4*r2)}  r={r2}
                            gradientUnits="userSpaceOnUse" />
                        <radialGradient id="companionStarCoronaRadialGradientUp" xlinkHref="#companionStarCoronaLinearGradientUp"
                            cx={35 + r} cy={y2} fx={35 + r} fy={y2} r={coronaR}
                            gradientUnits="userSpaceOnUse" />
                    </>);
            }
        }

        const starColour = system.star.spectralClass.colour.blend(new SimpleColor(255, 255, 255), 0.5);
        const darkerStarColour = system.star.spectralClass.colour.blend(new SimpleColor(0, 0, 0), 0.4);
        const worldColour = SimpleColor.from(purple).blend(new SimpleColor(255, 255, 255), 0.5);
        const darkerWorldColour = SimpleColor.from(purple).blend(new SimpleColor(0, 0, 0), 0.2);
        const companionColour = system.companionStar ? system.companionStar.spectralClass.colour.blend(new SimpleColor(255, 255, 255), 0.5) : null;
        const darkerCompanionColour = system.companionStar ? system.companionStar.spectralClass.colour.blend(new SimpleColor(0, 0, 0), 0.5) : null;

        const coronaR = r + 5;
        const coronaRStop = r / coronaR;

        let maxWorldDiameter = 50000;
        system.worlds?.filter(w => w.diameter != null).forEach(w => maxWorldDiameter = Math.max(w.diameter, maxWorldDiameter));
        let smallWorldDiameter = 5000;
        system.worlds?.filter(w => w.diameter != null).forEach(w => smallWorldDiameter = Math.min(w.diameter, smallWorldDiameter));
        let factor = 18 / Math.sqrt(maxWorldDiameter / 1000 - smallWorldDiameter / 1000);

        let verticalLines = system.worlds?.map((w, i) => {
            let x = this.calculateOrbitX(w.orbitalRadius, orbits);
            let y1 = this.calculateThirtyDegreeY(x);
            let y2 = 620;
            return (<path d={'M' + x.toFixed(2) + ',' + y1.toFixed(2) + ' L '+ x.toFixed(2) + ',' + y2} stroke="#888888" key={'line-' + i}/>);
        });

        let worldGradients = system.worlds?.filter(w => w.worldClass.id !== WorldClass.AsteroidBelt).map((w, i) =>{
            let r = Math.max(2, w.diameter == null ? 10 : (Math.sqrt(w.diameter / 1000 - smallWorldDiameter / 1000) * factor));
            let orbitalX = this.calculateOrbitX(w.orbitalRadius, orbits);
            let y = this.calculateThirtyDegreeY(orbitalX);

            return (<radialGradient id={'worldRadialGradientUp' + i} xlinkHref="#worldLinearGradientUp"
                cx={orbitalX-(0.4*r)} cy={y-(0.4*r)} fx={orbitalX-(0.4*r)} fy={y-(0.4*r)}  r={r}
                gradientUnits="userSpaceOnUse" key={'radialWorldGradientUp-' + i} />)
        });

        let orbitalArcs = system.worlds?.map((w, i) =>{
            let x = this.calculateOrbitX(w.orbitalRadius, orbits);
            let y = this.calculateThirtyDegreeY(x);

            let radiusY = this.calculateArcRadiusY(x - 35, y - 35);
            let radiusX = radiusY * 5;

            if (w.worldClass.id === WorldClass.AsteroidBelt) {
                let details = w.worldDetails as AsteroidBeltDetails;

                let beltWidth = details.depth;
                let beltStartX = this.calculateOrbitX(w.orbitalRadius - beltWidth * 0.5, orbits);
                let beltEndX = this.calculateOrbitX(w.orbitalRadius + beltWidth * 0.5, orbits);

                let allX = [beltStartX, beltEndX];
                if (beltEndX - beltStartX > 5) {
                    for (let i = beltStartX + 2; i < beltEndX; i += 2) {
                        allX.push(i);
                    }
                }

                let arcs = allX.map((x1, index) => {
                    let y1 = this.calculateThirtyDegreeY(x1);
                    let radiusY1 = this.calculateArcRadiusY(x1 - 35, y1 - 35);
                    let radiusX1 = radiusY1 * 5;

                    return (<path d={this.createArcPath(radiusX1, radiusY1)}
                        stroke="#ffffff" strokeWidth={2}
                        clipPath="url(#clipPath)" fill="none"
                        strokeDasharray={this.createRandomDashPattern()}
                        strokeDashoffset={0}
                        key={'segment-' + i + '-' + index}/>)
                });

                return (<g key={'arc=' + i}><path d={this.createArcPath(radiusX, radiusY)}
                    stroke="#ffffff" strokeWidth={2}
                    clipPath="url(#clipPath)" fill="none"
                    strokeDasharray={this.createRandomDashPattern()}
                    strokeDashoffset={0}/>
                    {arcs}
                    </g>)
            } else {
                return (<path d={this.createArcPath(radiusX, radiusY)}
                    stroke="#ffffff" strokeWidth={3}
                    clipPath="url(#clipPath)" fill="none" key={'arc=' + i}/>)
            }
        });

        let worldsCircles = system.worlds?.filter(w => w.worldClass.id !== WorldClass.AsteroidBelt).map((w, i) => {
            let x = this.calculateOrbitX(w.orbitalRadius, orbits);
            let y = this.calculateThirtyDegreeY(x);
            let r = Math.max(2, w.diameter == null ? 10 : (Math.sqrt(w.diameter / 1000 - smallWorldDiameter / 1000) * factor));
            return (<g key={'world-' + i}>
                <circle cx={x} cy={y} r={r+3} fill="#000000" />
                <circle cx={x} cy={y} r={r} fill={"url(#worldRadialGradientUp" + i + ")"} />
                <text x={x} y={y - r - 10} fontSize={20} fontFamily="lcars" fill="white" textAnchor="middle">{w.orbitLabel}</text>
            </g>);
        });


        return (<div className="starSystemUpperView">
                <svg viewBox="0 0 1110 630" xmlns="<http://www.w3.org/2000/svg>">
                    <defs>
                        <linearGradient id="primaryStarCoronaLinearGradientUp">
                            <stop stopColor={system.star.spectralClass?.colour?.asHex()} offset={0} />
                            <stop stopColor={system.star.spectralClass?.colour?.asHex()} offset={coronaRStop.toFixed(2)} />
                            <stop stopColor={system.star.spectralClass?.colour?.withAlpha(0).asHex()} offset={1} />
                        </linearGradient>
                        <linearGradient id="primaryStarLinearGradientUp">
                            <stop stopColor={starColour.asHex()} offset={0} />
                            <stop stopColor={darkerStarColour.asHex()} offset={1} />
                        </linearGradient>
                        {companionColour ? (<linearGradient id="companionStarLinearGradientUp">
                            <stop stopColor={companionColour.asHex()} offset={0} />
                            <stop stopColor={darkerCompanionColour.asHex()} offset={1} />
                        </linearGradient>) : null}
                        <linearGradient id="worldLinearGradientUp">
                            <stop stopColor={worldColour.asHex()} offset={0} />
                            <stop stopColor={darkerWorldColour.asHex()} offset={1} />
                        </linearGradient>
                        <radialGradient id="primaryStarRadialGradientUp" xlinkHref="#primaryStarLinearGradientUp"
                            cx={35-(0.4*r)} cy={35-(0.4*r)} fx={35-(0.4*r)} fy={35-(0.4*r)}  r={r}
                            gradientUnits="userSpaceOnUse" />
                        <radialGradient id="primaryStarCoronaRadialGradientUp" xlinkHref="#primaryStarCoronaLinearGradientUp"
                            cx={35} cy={35} fx={35} fy={35}  r={coronaR}
                            gradientUnits="userSpaceOnUse" />
                        {worldGradients}
                        {companionGradient}
                        <clipPath id="clipPath">
                            <rect x="10" y="10" height="610" width="995" fill="#000000" />
                        </clipPath>
                    </defs>
                    <path d="m 1025,420 v 200 h 85 V 420 Z" fill="#F89B24" />
                    <path d="m 1025,245 v 165 h 85 V 245 Z" fill="#F9AC76" />
                    <path d="m 1025,160 v 75 h 85 v -75 z" fill="#9999FF" />
                    <path d="m 1025,0 v 150 h 85 V 45 c 0.3169,-30.744136 -13.3546,-45.38249962 -45.4395,-45 z" fill="#F9AC76" />
                    <path d="m 35,35 970,560" stroke="#888888" />
                    <text x="1030" y="145" fontSize={16} fontFamily="lcars" fill="black" textAnchor="right">{createRandomValue(6)}</text>
                    <text x="1030" y="230" fontSize={16} fontFamily="lcars" fill="black" textAnchor="right">{createRandomValue(6)}</text>
                    <text x="1030" y="405" fontSize={16} fontFamily="lcars" fill="black" textAnchor="right">{createRandomValue(6)}</text>
                    <text x="1030" y="440" fontSize={16} fontFamily="lcars" fill="black" textAnchor="right">{createRandomValue(6)}</text>

                    <circle cx="35px" cy="35px" r={coronaR} fill="url(#primaryStarCoronaRadialGradientUp)" />
                    <circle cx="35px" cy="35px" r={r} fill="url(#primaryStarRadialGradientUp)" stroke="black" strokeWidth={0.5} />
                    {star2}

                    {verticalLines}
                    {orbitalArcs}
                    {worldsCircles}
                </svg>
            </div>);
    }

    createRandomDashPattern() {
        let dashCount = Math.round(Math.random() * 10) + 5;
        let dashNumbers = [];
        for (let i = 0; i < dashCount; i++) {
            dashNumbers.push(2);
            dashNumbers.push(Math.round(Math.random() * 19) * 3);
        }
        return dashNumbers.join(',');
    }

    calculateArcY(x: number, radiusX: number, radiusY: number) {
        let ySquared = radiusY * radiusY * (1 - (x * x / (radiusX * radiusX)));
        return Math.sqrt(ySquared);
    }

    calculateArcX(y: number, radiusX: number, radiusY: number) {
        let xSquared = radiusX * radiusX * (1 - (y * y / (radiusY * radiusY)));
        return Math.sqrt(xSquared);
    }

    createArcPath(radiusX: number, radiusY: number ) {
        let y = Math.abs(this.calculateArcY(7 - 35, radiusX, radiusY));
        let y2 = 9;
        let x2 = Math.abs(this.calculateArcX(y2 - 35, radiusX, radiusY)) + 35;

        if (x2 > 1006) {
            x2 = 1006;
            y2 = Math.abs(this.calculateArcY(x2 - 35, radiusX, radiusY)) + 35;
        }

        return 'M ' + (7).toFixed(2) + " " + (y + 35).toFixed(2)
                    + ' A ' + radiusX.toFixed(2) + "," + radiusY.toFixed(2) + " 0 0 0 " + (x2).toFixed(2) + ', ' + (y2).toFixed(2);
    }

    calculateArcRadiusY(x, y) {
        return Math.sqrt(x * x / 25 + y * y);
    }

    calculateThirtyDegreeY(x: number) {
        return (x - 35) / Math.sqrt(3) + 35;
    }
}

export default SystemMapUpperView;