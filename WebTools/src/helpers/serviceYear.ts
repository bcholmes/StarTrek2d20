
class ServiceYear {
    private static _instance?: ServiceYear;

    private years = {
        2024: "The Bell Riots, the Irish Reunification, the Europa Mission is launched",
        2053: "World War III ends",
        2063: "First contact between Humans and Vulcans",
        2064: "After first contact between Humans and Vulcans, but before Star Trek: Enterprise",
        2151: "First season of Star Trek: Enterprise",
        2152: "Second season of Star Trek: Enterprise",
        2153: "Third season of Star Trek: Enterprise",
        2154: "Fourth season of Star Trek: Enterprise",
        2155: "After the fourth season of Star Trek: Enterprise",
        2156: "The Earth-Romulan War begins",
        2157: "During the Earth-Romulan War",
        2160: "The Earth-Romulan War ends",
        2161: "The founding of the United Federation of Planets",
        2162: "After the events of Star Trek: Enterprise",
        2254: "The events of The Cage",
        2256: "First season of Star Trek: Discovery",
        2257: "First/second season of Star Trek: Discovery",
        2258: "Second season of Star Trek: Discovery",
        2259: "First season of Star Trek: Strange New Worlds",
        2260: "Second season of Star Trek: Strange New Worlds",
        2261: "After the second season of Star Trek: Strange New Worlds",
        2265: "The USS Enterprise is damaged at the galactic barrier; death of Gary Mitchell, Lee Kelso and others",
        2266: "First season of Star Trek: The Original Series",
        2267: "Second season of Star Trek: The Original Series",
        2268: "Third season of Star Trek: The Original Series",
        2269: "First season of Star Trek: The Animated Series",
        2270: "Second season of Star Trek: The Animated Series",
        2271: "After the end of the original five year mission",
        2273: "The events of Star Trek: The Motion Picture",
        2274: "After the events of Star Trek: The Motion Picture",
        2285: "The events of Star Trek: The Wrath of Khan and The Search for Spock",
        2286: "The events of Star Trek: The Voyage Home",
        2287: "The events of Star Trek: The Final Frontier",
        2288: "After the events of Star Trek: The Final Frontier",
        2293: "The events of Star Trek: The Undiscovered Country, and launching of the Enterprise-B",
        2294: "After the launching of the Enterprise-B and the \"death\" of Kirk",
        2344: "The destruction of the Enterprise-C at Nerendra III",
        2345: "After the destruction of the USS Enterprise-C",
        2347: "During the Cardassian-Federation War",
        2353: "During the Cardassian-Federation War, death of Jack Crusher",
        2354: "During the Cardassian-Federation War",
        2355: "The destruction of the USS Stargazer in the Maxia-Zeta System",
        2356: "After the destruction of the USS Stargazer",
        2364: "First season of Star Trek: The Next Generation",
        2365: "Second season of Star Trek: The Next Generation",
        2366: "Third season of Star Trek: The Next Generation",
        2367: "Fourth season of Star Trek: The Next Generation, Klingon Civil War begins",
        2368: "Fifth season of Star Trek: The Next Generation, Klingon Civil War ends",
        2369: "Sixth season of Star Trek: The Next Generation, first season Star Trek: Deep Space Nine",
        2370: "Seventh season of Star Trek: The Next Generation, second season Star Trek: Deep Space Nine",
        2371: "The events of Star Trek: Generations (24th century), third season Star Trek: DS9, first season Star Trek: VOY",
        2372: "Fourth season Star Trek: DS9, second season Star Trek: VOY. Federation-Klingon War begins",
        2373: "Fifth season Star Trek: DS9, third season Star Trek: VOY, Star Trek: First Contact. Federation-Klingon War ends. Dominion War begins.",
        2374: "Sixth season Star Trek: DS9, fourth season Star Trek: VOY",
        2375: "Seventh season Star Trek: DS9, fifth season Star Trek: VOY, Star Trek: Insurrection",
        2376: "Post Dominion War, sixth season Star Trek: VOY",
        2377: "Seventh season Star Trek: VOY",
        2378: "After the return of Voyager to the Alpha Quadrant",
        2379: "The events of Star Trek: Nemesis, the Romulan coup, death of Data",
        2380: "First season of Star Trek: Lower Decks",
        2381: "Second, third and fourth seasons of Star Trek: Lower Decks",
        2382: "After the fourth season of Star Trek: Lower Decks",
        2383: "First season of Star Trek: Prodigy",
        2384: "After the first season of Star Trek: Prodigy",
        2385: "The attack on the Utopia Planitia shipyards by artificial life forms",
        2386: "After the ban on artificial life forms",
        2387: "The destruction of Romulus",
        2388: "After the destruction of Romulus",
        2399: "First season of Star Trek: Picard",
        2400: "After the events of the first season of Star Trek: Picard",
        2401: "Second and third season of Star Trek: Picard",
        2402: "Epilogue of Star Trek: Picard season 3, lauching of the Enterprise-G",
        2403: "After the events of season 3 of Star Trek: Picard",
        2409: "After the events of season 3 of Star Trek: Picard; events of Star Trek Online begin",
        2410: "After the events of season 3 of Star Trek: Picard",
        3069: "The Burn destroys much of the galaxy's dilithium",
        3070: "After the events of the Burn",
        3188: "Third season of Star Trek: Discovery. Michael Burnham arrives in 32nd century",
        3189: "Third season of Star Trek: Discovery. The USS Discovery arrives in the 32nd century",
        3190: "Fourth season of Star Trek: Discovery",
        3191: "After the fourth season of Star Trek Discovery",
    }


    public static instance() {
        if (ServiceYear._instance == null) {
            ServiceYear._instance = new ServiceYear();
        }
        return ServiceYear._instance;
    }

    public getTextHint(serviceYear: number) {
        let result = this.years[serviceYear];
        while (result == null && serviceYear > 2063) {
            result = this.years[--serviceYear];
        }
        return result;
    }
}

export default ServiceYear;
