import { addNoiseToValue } from "./noise";
import { LuminosityClass, SpectralClass, Star } from "./star";

class LuminosityCrossReference {
    spectralClass: SpectralClass
    subSpectralClass: number;
    luminosityClass: LuminosityClass;
    luminosity: number;

    constructor(spectralClass: SpectralClass, subSpectralClass: number, luminosityClass: LuminosityClass, luminosity: number) {
        this.spectralClass = spectralClass;
        this.subSpectralClass = subSpectralClass;
        this.luminosityClass = luminosityClass;
        this.luminosity = luminosity;
    }

}

class LuminosityTableImpl {
    private values: LuminosityCrossReference[] = [
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.Ia, 560000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.Ib, 270000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.II, 170000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.III, 107000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.IV, 81000),
        new LuminosityCrossReference(SpectralClass.B, 0, LuminosityClass.V, 560000),

        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.Ia, 204000),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.Ib, 46700),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.II, 18600),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.III, 6700),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.IV, 2000),
        new LuminosityCrossReference(SpectralClass.B, 5, LuminosityClass.V, 1400),

        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.Ia, 60000),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.Ib, 4100),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.II, 3200),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.III, 2100),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.IV, 1200),
        new LuminosityCrossReference(SpectralClass.B, 9, LuminosityClass.V, 800),

        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.Ia, 107000),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.Ib, 15000),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.II, 2200),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.III, 280),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.IV, 156),
        new LuminosityCrossReference(SpectralClass.A, 0, LuminosityClass.V, 90),

        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.Ia, 81000),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.Ib, 11700),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.II, 850),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.III, 90),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.IV, 37),
        new LuminosityCrossReference(SpectralClass.A, 5, LuminosityClass.V, 16),

        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.Ia, 61000),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.Ib, 7400),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.II, 600),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.III, 53),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.IV, 19),
        new LuminosityCrossReference(SpectralClass.F, 0, LuminosityClass.V, 8.1),

        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.Ia, 51000),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.Ib, 5100),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.II, 510),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.III, 43),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.IV, 12),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.V, 3.5),
        new LuminosityCrossReference(SpectralClass.F, 5, LuminosityClass.VI, 0.97),

        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.Ia, 67000),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.Ib, 6100),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.II, 560),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.III, 50),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.IV, 6.5),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.V, 1.21),
        new LuminosityCrossReference(SpectralClass.G, 0, LuminosityClass.VI, .32),

        new LuminosityCrossReference(SpectralClass.G, 2, LuminosityClass.V, 1), // the sun (Sol)

        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.Ia, 89000),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.Ib, 8100),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.II, 740),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.III, 75),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.IV, 4.9),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.V, 0.67),
        new LuminosityCrossReference(SpectralClass.G, 5, LuminosityClass.VI, 0.186),

        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.Ia, 97000),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.Ib, 11700),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.II, 890),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.III, 95),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.IV, 4.65),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.V, 0.42),
        new LuminosityCrossReference(SpectralClass.K, 0, LuminosityClass.VI, 0.117),

        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.Ia, 107000),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.Ib, 20400),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.II, 2450),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.III, 320),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.IV, 4.75),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.V, 0.08),
        new LuminosityCrossReference(SpectralClass.K, 5, LuminosityClass.VI, 0.025),

        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.Ia, 117000),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.Ib, 46000),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.II, 4600),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.III, 470),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.IV, 4.9),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.V, 0.04),
        new LuminosityCrossReference(SpectralClass.M, 0, LuminosityClass.VI, 0.011),

        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.Ia, 129000),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.Ib, 89000),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.II, 14900),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.III, 2280),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.IV, 5.6),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.V, 0.007),
        new LuminosityCrossReference(SpectralClass.M, 5, LuminosityClass.VI, 0.002),

        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.Ia, 141000),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.Ib, 117000),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.II, 16200),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.III, 2690),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.IV, 6.2),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.V, 0.001),
        new LuminosityCrossReference(SpectralClass.M, 9, LuminosityClass.VI, 0.00006),
    ];

    public generateLuminosity(star: Star) {
        let options = this.values.filter(l => l.luminosityClass === star.luminosityClass.id && l.spectralClass === star.spectralClass.id);

        let exactMatch = this.selectOption(options, star.subClass);
        if (exactMatch != null) {
            return addNoiseToValue(exactMatch.luminosity);
        } else {
            let o9 = this.selectOption(options, 9);
            if (o9 == null) {
                let o5 = this.selectOption(options, 5);
                let o0 = this.selectOption(options, 0);

                let delta = o0.luminosity - o5.luminosity;

                let o9Value = o5.luminosity - (0.67) * delta;
                if (o9Value <= 0) {
                    o9Value = o5.luminosity * 0.1;
                }
                o9 = new LuminosityCrossReference(star.spectralClass.id, 9, star.luminosityClass.id, o9Value);
                options = [...options];
                options.push(o9);
            }

            if (star.subClass === 9) {
                return addNoiseToValue(o9.luminosity);
            } else {
                let result = this.interpolateSelection(options, star.subClass);
                return addNoiseToValue(result);
            }
        }
    }

    selectOption(options: LuminosityCrossReference[], value: number) {
        let match = options.filter(l => l.subSpectralClass === value);
        if (match.length === 1) {
            return match[0];
        } else {
            return null;
        }
    }

    interpolateSelection(options: LuminosityCrossReference[], subClass: number) {
        let lower = options[0];
        for (let i = 0; i < options.length; i++) {
            let o = options[i];
            if (o.subSpectralClass < subClass) {
                lower = o;
            } else {
                break;
            }
        }
        let upper = options[options.length - 1];
        for (let i = options.length - 1; i >= 0; i--) {
            let o = options[i];
            if (o.subSpectralClass > subClass) {
                upper = o;
            } else {
                break;
            }
        }

        let ratio =  1- ((subClass - lower.subSpectralClass) / (upper.subSpectralClass - lower.subSpectralClass));
        return addNoiseToValue(lower.luminosity + (upper.luminosity - lower.luminosity) * ratio);
    }

    tenabilityRadius(luminosityValue: number) {
        if (luminosityValue >= 3270) {
            return .5;
        } else if (luminosityValue >= 2090) {
            return .4;
        } else if (luminosityValue >= 1179) {
            return .3;
        } else if (luminosityValue >= 520) {
            return .2;
        } else if (luminosityValue >= 130) {
            return .1;
        } else {
            return 0;
        }
    }
}

export const LuminosityTable = new LuminosityTableImpl();