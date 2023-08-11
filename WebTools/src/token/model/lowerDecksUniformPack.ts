import { BaseTngEraUniformPack } from "./baseTngEraUniformPack";
import { BodyType } from "./bodyTypeEnum";
import SpeciesRestrictions from "./speciesRestrictions";
import Swatch from "./swatch";
import { Token } from "./token";
import UniformCatalog, { DefaultRed } from "./uniformCatalog";
import { IUniformPack } from "./uniformPack";

const LowerDeckUniforms = {
    averageMale: `<g>
            <path id="path171958" style="fill:#2d2d2d;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" d="m 197.83789,194.625 -12.25,11.66016 -4.10742,2.73828 c -0.004,0.0179 -0.004,0.0349 -0.008,0.0527 -1.9873,1.1534 -4.82885,2.07076 -7.0625,2.23633 l -40.07813,18.65039 -39.423827,20.71289 -11.855469,6.04297 -6.742187,6.27734 -9.458985,6.82422 c -11.834766,12.45088 -19.196026,25.30384 -24.970703,40.91211 l -14.60893,78.69588 c 0,0 0.502529,10.5717 6.644087,10.5717 h 42.386718 c 18.742349,0 32.553466,-21.75306 45.613286,-31.41016 0,0 77.47877,-4.76073 153.33203,-3.1914 75.85191,1.56934 91.18554,2.91601 91.18554,2.91601 l 3.25963,1.11809 15.59343,14.54342 -1.4761,-41.44276 c -1.52533,-11.00266 -6.3445,-45.00027 -8.67383,-52.57226 -2.78933,-9.06532 -4.29199,-11.15773 -12.44531,-16.03906 -8.15467,-4.88133 -35.08884,-19.29515 -45.54883,-21.61915 -10.46133,-2.32533 -30.30508,-14.70807 -40.52907,-19.05074 l -3.55006,3.80279 c -1.63186,2.11143 -3.49131,5.03341 -4.77439,8.69327 l -5.22461,2.25781 -2.74023,0.0293 -3.75586,-0.875 c -10.87332,-1.412 -25.98221,-10.5912 -35.01953,-17.22852 -9.03866,-6.63733 -21.4668,-31.49023 -21.4668,-31.49023 l -0.38867,-2.38282 z" />
            <path id="path171962" style="fill:#d30000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" d="M 198.2832 194.3125 C 198.2832 194.3125 193.99156 198.06874 193.45508 198.39062 L 196.35156 203.75586 L 207.72461 221.67383 L 223.49805 237.98242 L 239.69922 248.17578 L 254.18359 252.14648 L 260.89844 252.03906 L 259.32227 273.13086 L 227.91211 298.16797 L 201.81445 317.74219 L 151.58789 348.84961 L 152.44336 365.95117 C 135.36973 366.34425 122.62305 366.69922 122.62305 366.69922 C 108.43232 374.99768 92.860859 390.95717 76.988281 399.99609 L 385.68945 399.9668 L 384.83203 382.1543 L 369.84375 369.88867 L 366.58594 368.76953 C 366.58594 368.76953 351.39146 365.62906 275.52539 364.91797 C 231.02649 364.50088 188.09877 365.17439 158.57422 365.8125 L 157.80859 353.55273 L 197.10938 328.21289 L 236.5625 297.71289 L 264.48242 273.89062 L 264.9375 251.73633 C 264.9375 251.73633 273.73739 245.66676 274.49609 245.36328 C 275.25479 245.0598 277.98633 239.44531 277.98633 239.44531 L 276.46875 233.52734 L 271.91797 240.05273 L 266.15039 245.66602 L 261.51367 246.94727 L 247.10352 245.17188 L 228.32617 235.51562 L 212.66016 219.41992 L 201.60938 201.93164 L 198.2832 194.3125 z M 76.988281 399.99609 L 37.300781 399.99805 L 37.302734 400 L 76.980469 400 C 76.982969 399.999 76.985781 399.99809 76.988281 399.99609 z M 37.300781 399.99805 C 31.570554 395.38512 25.769531 392.00391 25.769531 392.00391 L 25.664062 400 L 37.300781 399.99805 z "/>
            <path id="path4" style="fill:#ecfcfe;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 257.08203,364.37695 -98.41601,0.63477 0.71875,12.76367 52.63281,-0.52148 h 77.68164 l 76.82422,3.86132 18.88476,14.59375 0.42774,-11.16015 -18.45313,-16.73828 z M 124.67773,364.5918 75.585495,400 h 16.310547 l 32.781688,-22.10352 v -6.23242 l 0.64454,6.44727 28.02929,-0.27735 -0.97851,-12.78125 -27.69532,0.17969 z m -96.781053,16.95299 -2.360574,13.30513 4.715756,5.25738 L 44.068058,400 Z" />
            <path d="m 278.50114,243.12312 c 0.224,3.21333 -2.84501,5.14608 -4.44101,7.84075 -2.38667,4.032 -3.48134,9.40133 -4.94667,13.80933 -0.872,-2.21866 -1.20133,-3.37733 -1.008,-5.648 0.196,-2.31333 0.44933,-4.564 1.104,-6.844 0.46533,-1.62266 3.62267,-4.36666 4.41467,-5.74133 3.19193,-4.81649 3.34663,-7.96173 2.57223,-12.06378 0.6142,0.34683 1.2401,1.10906 1.39679,1.48077 0.52598,1.24773 0.82962,2.25899 0.90815,3.54236 0.0675,1.10231 -0.0828,2.4279 -1.6e-4,3.6239 z" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path172002" />
            <path d="m 367.95412,278.712 c 0,0 3.12934,28.84534 1.144,48.11334 0,0 3.30134,-23.672 0.824,-46.24134 z" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path172006"/>
            <path d="m 191.51296,235.92038 c -13.39668,-13.49331 -10.47132,-25.60927 -10.47132,-25.60927 l 16.79636,-15.6851 2.24533,3.81466 c 0.0533,13.20667 7.13866,22.95733 15.48266,31.18133 7.41067,7.304 11.40134,14.18934 24.04267,17.34934 4.20667,1.052 3.568,11.54666 3.352,13.924 -0.216,2.37733 -6.74919,5.1998 -23.44933,-3.14192 -5.20686,-2.60083 -14.97718,-8.71792 -27.99837,-21.83304 z" style="opacity:0.199997;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path172060" />
            <path d="m 176.07996,212.05676 -42.0821,18.07365 -39.090232,20.54573 -11.854667,6.044 -6.742666,6.276 -9.458667,6.824 -8.589333,6.69866 L 40.594354,313.84335 27.202663,391.62673 26.678065,400 h 29.32244 c 21.624703,-77.54889 34.366618,-92.52242 41.105648,-98.36756 6.739027,-5.84515 15.611687,-9.92638 23.283687,-12.71571 67.72267,-24.62667 97.21963,-26.98368 97.21963,-26.98368 0,0 -14.84032,-9.91577 -26.30316,-24.28175 -6.00556,-7.52656 -9.47002,-19.25866 -10.05305,-26.75155 z" style="display:inline;opacity:0.199997;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path172176" />
            <path style="opacity:0.2;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.911631px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 368.9541,353.5484 c 0,0 6.16873,24.64853 6.43777,33.1715 0.26904,8.52297 0.42919,13.2801 0.42919,13.2801 H 366.379 Z" id="path2" />
            <path id="path3" style="color:#000000;fill:#000000;-inkscape-stroke:none" d="M 125.17443,362.94638 72.300359,400 h 6.404719 l 48.236332,-33.23828 z m 0.67713,12.59268 L 89.025391,400 h 5.294921 l 32.818358,-20.93359 z m -96.653724,4.11939 -1.958984,2.27148 L 43.226562,400 h 4.234376 z m -1.481904,13.003 -1.692494,4.60723 L 29.083721,400 h 5.225462 z" />
            <path id="path5" style="color:#000000;fill:#000000;-inkscape-stroke:none" d="m 235.51758,375.14648 c -18.0253,-0.0273 -49.99234,0.22518 -76.04102,0.45313 l 0.26953,3.99805 c 26.03986,-0.22752 57.41286,-0.0946 75.31041,0.15578 30.58614,0.42783 43.39624,0.26918 65.41811,0.79432 21.40058,0.51032 63.71625,2.56712 64.77734,2.63388 l 18.82617,14.53906 2.44532,-3.16601 -19.79883,-15.28907 -0.61133,-0.0391 c 0,0 -43.67808,-2.75503 -65.51367,-3.43554 -21.78217,-0.67887 -36.02636,-0.6005 -65.08203,-0.64454 z m -82.4336,0.50977 c -11.362,0.10276 -26.92382,0.24023 -26.92382,0.24023 l 0.0391,4 c 0,0 15.62083,-0.13834 27.11719,-0.24218 z" />
            <path id="path172010" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" d="m 261.99167,248.75551 c 0.97107,-0.0793 2.08188,-0.25671 3.41458,-0.58363 1.37596,-0.33753 2.73122,-1.22679 3.63672,-2.11329 0.99983,-0.97883 1.55033,-1.62937 2.19141,-2.85351 1.19399,-2.27991 1.47605,-2.59996 1.9082,-3.39844 1.12915,-2.08634 2.03407,-3.04199 2.98047,-4.48828 0.14156,-0.006 0.28854,0.0232 0.43164,0.0273 0.0234,0.82028 0.0191,4.0591 -1.51563,6.91211 -1.19604,2.22337 -3.15158,4.47183 -4.14453,5.26367 -2.05199,1.6364 -3.40166,2.72059 -6.14815,3.27705 l -0.11133,2.23137 -0.93043,19.88523 c 0,0 -20.50546,19.60447 -35.72832,30.79319 -15.22286,11.18872 -33.35452,25.33634 -50.7556,36.96746 -6.60173,4.41269 -20.32226,12.42969 -20.32226,12.42969 L 159.51953,400 h 3.55827 l -1.79882,-32.36332 c 39.34477,-0.0103 100.57811,0.68447 105.37141,0.44531 6.97465,-0.34933 69.99568,1.49321 98.94244,2.88881 0,0 -1.24492,11.66399 -2.53424,28.99596 h 5.57422 c 0.484,-9.21597 1.13754,-22.40066 1.40821,-25.91797 l 12.56836,10.33594 c 0,0 0.36824,3.0114 0.15624,15.58203 h 4.79102 l -2.30469,-57.4336 c -0.0733,-1.01867 -0.18937,-1.86516 -0.33203,-2.5625 -2.15734,-16.44927 -7.67837,-54.12103 -13.76367,-60.81836 -7.53597,-8.29864 -41.54926,-23.28335 -51.86523,-26.61132 -8.256,-2.66267 -15.86906,-7.01273 -23.6504,-10.7754 -2.7573,-1.33197 -5.52419,-2.64478 -8.29882,-3.93945 -2.576,-1.20133 -4.79666,-3.113 -7.19532,-4.625 -1.40264,-0.87467 -3.83165,-1.67834 -5.29296,-0.54101 -1.98933,1.54664 -3.57578,3.56515 -4.84375,5.73046 -0.71733,1.224 -1.59658,2.33794 -2.25391,3.58594 -0.66533,1.26667 -1.57839,2.10396 -2.78906,2.89063 -0.59467,0.38667 -1.16772,0.68759 -1.87305,0.68359 -2.57225,0.1207 -4.0356,-0.17329 -5.67578,-0.35351 -40.2661,-4.42436 -57.30517,-51.29444 -57.42383,-51.75977 -0.14,-0.54934 -0.55633,-0.9863 -1.09766,-1.1543 -0.27267,-0.084 -0.55605,-0.0931 -0.82421,-0.0352 -2.47975,0.43024 -4.20147,2.03182 -4.86317,4.55415 -3.29403,3.33055 -7.86419,7.92471 -11.03137,10.98501 -1.554,0.879 -12.16978,5.21692 -17.09765,7.47656 -4.92834,2.25985 -17.4112,8.42719 -38.27149,19.41797 -17.16088,9.04164 -33.424362,16.38211 -37.429684,17.88477 -8.445306,3.16664 -14.804242,9.80901 -15.878906,11.40234 -1.07733,0.63733 -5.047703,1.38449 -8.318359,3.61914 C 55.3258,272.90049 42.351433,295.3486 36.703125,314.31446 31.054817,333.28031 24.036082,390.94614 23.314453,400 h 4.236328 l 1.353516,-13.88086 0.816406,-4.90234 c 1.510663,-11.19864 8.378269,-51.91779 11.955078,-66.44727 3.576811,-14.52946 17.764298,-36.14578 24.84961,-43.48242 7.085312,-7.33663 23.557387,3.63853 27.609375,9.20117 0.306664,-1.03467 -0.155259,-2.13012 -0.669922,-3.07812 -2.467994,-4.544 -6.364398,-7.99576 -10.761719,-10.6211 -1.478664,-0.88133 -3.620253,-1.56847 -4.65625,-2.98047 -0.306667,-0.42 11.426612,-7.80136 12.474609,-8.19336 4.258655,-1.59731 19.878506,-8.62143 37.916016,-18.11523 20.23414,-10.64998 33.37038,-17.05127 37.48242,-19.08984 5.6992,-2.82544 11.83314,-5.1327 12.98438,-5.49219 0.38442,3.75451 0.62738,7.41608 3.27734,12.68359 3.90537,7.76298 9.04588,18.80854 24.11918,29.18718 18.39594,12.66663 21.63666,14.29854 31.28767,17.40025 8.05365,2.58834 13.82074,1.91108 18.09748,1.84117 0,0 -17.59806,15.17354 -28.45053,23.59498 -10.85246,8.42144 -37.1163,26.66392 -37.1163,26.66392 l -39.82031,24.72461 0.76562,13.6875 -23.88672,-0.0273 c -3.00165,-11.22286 -12.01425,-44.55405 -18.80273,-55.66211 0,0 7.84244,18.71128 9.92969,34.44726 1.61522,9.79322 2.7867,19.67504 3.71289,29.56055 0.96073,10.63384 1.95516,15.70988 1.26953,28.98047 h 6.7168 c 0.49001,-13.11167 -1.52208,-26.66922 -2.01953,-31.76953 -0.0393,-0.40272 9.85143,-0.55334 23.35546,-0.60156 L 153.14648,400 h 3.10306 l -2.76563,-49.79623 38.0239,-23.83459 c 0,0 25.91595,-17.98704 37.23349,-26.7479 11.31755,-8.76087 30.7977,-25.55679 30.7977,-25.55679 0,0 1.81477,-13.73905 1.74925,-16.55751 -0.0655,-2.81846 0.76303,-7.1915 0.70342,-8.75147 z m -3.3075,2.33098 c -5.43497,0.38004 -9.82614,-0.7037 -19.30917,-4.65481 -9.16517,-3.81868 -21.18862,-14.8701 -28.56641,-23.22461 -6.64615,-7.52604 -14.38109,-21.80456 -15.64843,-24.17383 -0.18721,-2.37908 1.63941,-3.73252 2.80132,-3.38155 2.39782,5.83646 9.81093,23.40325 24.38529,36.18199 8.72764,7.65235 19.75399,14.10713 33.13666,16.51988 1.28151,0.23104 1.81231,0.14745 3.18166,0.20123 z m -65.36581,-50.19391 c 1.99651,3.72084 9.04413,16.52768 15.61523,23.96875 7.53692,8.53471 19.47802,19.71139 29.48047,23.8789 9.22156,3.84217 14.66682,5.02913 20.3605,4.78919 l -1.67111,19.27527 -0.4493,0.35776 c -2.17221,0.0568 -9.01248,-0.69976 -12.43931,-1.9144 -13.27398,-4.70499 -29.26015,-13.04482 -44.19005,-26.50288 -6.00964,-5.41719 -11.23501,-14.55109 -14.59901,-20.13775 -3.81597,-8.26931 -2.25406,-11.90259 -1.91406,-13.55859 3.03985,-3.02041 6.69066,-6.95449 9.80664,-10.15625 z m 83.37695,34.46289 c 3.40135,0.17362 7.19883,3.00223 10.50196,4.4707 10.63461,4.73067 19.85778,12.18915 31.09375,15.81445 9.48797,3.06 43.60865,18.04289 50.50195,25.63086 5.13197,5.64933 10.78207,42.52178 13.19141,61.26172 0.63863,5.392 0.82226,36.20703 0.82226,36.20703 L 370.13086,366.7832 c -0.64933,-15.30527 -1.44531,-30.8164 -1.44531,-30.8164 -1.2,9.9053 -1.74655,26.28882 -3.17188,30.13281 l -88.5039,-3.25391 -116.00618,-0.13476 c 0,0 -0.4972,-5.0385 -0.46289,-8.25391 4.76715,-2.75429 12.15382,-7.63427 18.06672,-11.69726 17.30299,-11.88958 35.65501,-25.89998 50.9099,-37.08075 15.25489,-11.18077 36.65214,-31.57249 36.65214,-31.57249 l 0.98903,-21.73874 c 0,0 3.2243,-1.60606 5.02879,-3.04508 1.82052,-1.4518 3.29914,-4.28072 4.42991,-6.68013 1.13077,-2.39941 1.14062,-4.73633 1.14062,-4.73633 z" />
            <path d="m 153.36983,364.20779 c -14.48934,1.07867 -13.59443,-0.006 -20.24243,0.63698 l -7.42021,1.16182 c 0,0 1.7051,10.65724 3.58559,33.99341 h 19.88169 c -0.0222,-22.69333 1.33314,-26.38932 3.43666,-30.17784" style="opacity:0.199997;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path172192" />
            <path style="color:#000000;fill:#000000;-inkscape-stroke:none" d="m 272.13492,260.0356 c -0.43568,1.86709 -1.32327,3.98541 -2.1176,5.13984 -0.76251,1.10819 -1.78318,2.54927 -3.03515,3.84255 -1.28722,1.32971 -2.28594,2.7849 -2.28594,2.7849 l 0.80257,2.07139 c 0,0 1.92823,-1.84932 3.10928,-3.34977 1.18106,-1.50045 2.42146,-3.69939 3.15833,-5.23491 0.73912,-1.5402 1.22544,-3.5742 1.62031,-6.08648 0.30647,-1.94984 -0.0949,-4.04936 -0.0949,-4.04936 0,0 -0.7212,3.01474 -1.15688,4.88184 z" id="path11" />
            <g>
                <path style="color:#000000;fill:#a6a6a6;stroke-width:0.913966;stroke-miterlimit:40;-inkscape-stroke:none" d="m 322.45991,394.18881 13.65899,-42.96978 15.15091,41.29461 c 0,0 -5.72514,-8.65272 -11.18302,-9.17301 -3.86588,-0.36852 -17.62688,10.84818 -17.62688,10.84818 z" id="path14" />
                <path style="color:#000000;fill:#000000;stroke-width:0.913966;stroke-miterlimit:40;-inkscape-stroke:none" d="m 336.09342,347.96428 -16.25172,49.34023 c 2.98367,-2.78441 6.3346,-5.05677 9.55348,-7.56396 3.25751,-2.5373 7.78274,-4.88311 10.72337,-4.83694 2.49538,0.0392 4.96571,2.01337 7.21484,4.30867 2.24914,2.29529 3.84303,4.5316 3.84303,4.5316 l 2.54996,3.21807 z m 0.20314,7.42215 11.65429,31.09162 c -2.35866,-2.37863 -4.69645,-4.12788 -7.90904,-4.43413 -2.90748,-0.27716 -7.72388,2.1453 -15.67803,8.45735 z" id="path15" />
            </g>
        </g>`,

    averageFemale: `<g>
            <path id="path283350" style="fill:#2d2d2d;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" d="m 198.90234,198.64258 c -4.18285,4.17387 -6.99524,9.83983 -10.23046,14.80859 -3.22718,5.3122 -4.82787,7.49107 -6.85938,11.01172 -14.34652,6.44948 -26.45648,10.66799 -50.14844,24.25195 -16.34717,4.40719 -36.791883,9.01532 -54.478513,19.41797 -3.369327,1.98133 -12.234867,6.10028 -15.736328,8.22657 -9.936666,13.29954 -9.372148,20.97017 -15.105469,36.71679 -0.656341,2.91272 -1.567847,6.39777 -3.566406,12.57227 -4.402761,16.19092 -7.37106,25.52686 -8.900391,40.02148 -0.958665,5.632 -0.927688,10.68979 -1.84375,18.00196 -0.31846,4.11345 -0.340612,11.04731 -0.964844,14.3789 0.552134,0.0642 1.23003,0.87839 1.951172,1.94922 h 50.462891 c 3.704218,-1.52068 7.373483,-3.13398 10.964844,-4.92773 4.298661,-2.148 11.447034,-7.69372 15.484374,-10.34571 2.42665,-1.59467 8.65333,-10.53464 11.228,-10.8253 0.009,-10e-4 77.2308,-5.16981 153.07864,-3.60048 28.86837,0.13315 50.12357,1.80596 80.4336,3.70703 0,0 14.14131,-0.11406 22.84765,3.25 0.97066,-10.13864 3.42392,-26.38969 1.14258,-34.06836 -1.22133,-4.10531 -3.55415,-13.66092 -4.77149,-17.76757 -6.20398,-24.60529 -15.37622,-42.72444 -34.79101,-53.43555 -12.89138,-3.90462 -24.5865,-9.43601 -36.99219,-10.875 -5.24832,-0.67437 -13.24175,-7.73496 -17.09375,-9.26563 l -8.25586,-6.82617 0.29688,-2.28515 -4.76758,-8.01172 -0.18555,0.15039 -3.8125,10.875 -5.22461,2.25781 -2.76367,-0.54297 -3.73242,-0.30273 c -10.87331,-1.412 -25.98222,-10.59121 -35.01953,-17.22852 -10.19471,-8.2966 -16.12866,-20.00358 -22.64649,-31.28906 z"/>
            <path id="path9" style="fill:#d30000;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1" d="M 197.74805 198.44141 L 194.10742 204.16016 L 197.22656 209.5332 L 210.57227 227.38281 C 210.57227 227.38281 220.97146 237.60898 222.53125 238.12891 C 224.09105 238.64884 233.27539 244.36719 233.27539 244.36719 L 254.76562 251.30078 L 256.82617 251.36914 L 256.5 273.31055 L 218.02539 304.33398 L 181.62891 328.59766 L 145.75391 351.82031 L 154.59375 377.12305 L 163.7793 376.25781 L 156.15234 354.41992 L 190.12109 332.58203 L 224.4375 308.14648 L 256.15234 282.15039 L 263.95117 272.96484 L 264.61328 251.62305 L 265.33789 251.64648 L 273.48438 246.44727 L 276.25781 239.3418 L 273.48438 236.39453 L 270.19141 241.76758 L 266.72461 246.44727 L 259.96484 247.14062 L 249.2207 245.23438 L 231.36914 237.95508 L 217.33203 226.34375 L 204.33398 210.57227 L 197.74805 198.44141 z "/>
            <path d="m 31.482052,395.28734 c 0.446666,2.49334 1.180614,2.08466 1.540614,4.67933 h 20.166666 c 0.196,-3.43334 -0.168,-7.00134 -0.09067,-10.296 0.142667,-6.028 1.809568,-11.8813 2.717568,-17.83597 1.664043,-10.89316 4.390792,-21.53944 8.717099,-31.40937 5.682623,-10.91971 7.04473,-14.96286 12.227828,-24.25379 8.061621,-9.83474 8.681112,-10.66445 17.276729,-16.04664 9.830784,-5.05831 15.433984,-7.8084 26.708774,-12.5209 12.06134,-4.93733 26.01867,-8.93733 38.75867,-12.128 2.82667,-0.80533 5.532,-1.54666 8.11733,-2.22666 28.43467,-7.48134 48.85975,-10.78844 48.85975,-10.78844 0,0 -11.6028,-5.51607 -20.87346,-16.6534 -3.08933,-3.71334 -5.02725,-4.512 -7.25392,-8.99734 -2.228,-4.484 -3.54315,-5.33167 -8.02103,-10.32829 -6.75333,2.5483 -26.119,9.03784 -47.707,21.33251 -18.69995,5.86575 -35.845712,11.49837 -55.441672,20.31762 -6.939001,2.88838 -12.359196,4.7333 -15.263196,7.33997 -9.815593,11.6216 -13.675677,21.85662 -18.57202,40.35778 -3.949413,17.25627 -7.765364,34.88594 -9.352248,49.71932 -1.108,6.50533 -0.995824,8.39911 -2.471784,17.39312 0.117676,5.33145 -0.859554,8.65545 -0.283552,11.86611" style="opacity:0.199997;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283392"/>
            <path d="m 383.91919,399.96653 c -0.144,-0.856 -0.384,-1.68666 -0.64133,-2.34666 -0.696,-1.77734 -2.25467,-3.46 -3.18534,-5.13067 -0.88666,-1.59467 -1.816,-3.20667 -2.61466,-4.83067 -1.45734,-2.968 -2.89867,-6.17733 -1.188,-9.324 l -4.61028,-3.63741 c -17.46003,-0.9856 -29.02072,-0.93838 -44.68407,-2.18062 -2.87733,-0.17734 -12.31788,-0.35067 -15.58455,-0.51467 -9.8,-0.49333 -23.19569,-1.6513 -37.41836,-1.94597 -75.85333,-1.56933 -154.23074,4.12032 -154.23074,4.12032 C 103.61678,385.47373 98.23261,392.09496 80.469944,400 Z" style="fill:#d30000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283402" />
            <path d="m 276.07346,242.23054 c 0.33067,0.75333 0.6,1.59333 0.68267,2.78933 0.224,3.21333 -1.1,3.24933 -2.696,5.944 -2.38667,4.032 -3.48134,9.40133 -4.94667,13.80933 -0.872,-2.21866 -1.20133,-3.37733 -1.008,-5.648 0.196,-2.31333 0.44933,-4.564 1.104,-6.844 0.46533,-1.62266 3.62267,-4.36666 4.41467,-5.74133 1.59866,-2.768 0.99466,-5.07867 0.372,-8.04267 0.23866,0.32 0.43733,0.32667 0.74,0.59334 0.36,1.30533 0.90133,2.14666 1.33733,3.14" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283442"/>
            <path d="m 185.98384,374.61422 c 4.165,0.11825 9.37049,-0.33021 13.63628,0.46587 5.35114,0.99893 11.1576,3.48471 16.46882,5.04406 4.78206,1.40428 9.8433,3.21797 14.70576,3.81087 5.31438,0.64975 9.52107,2.82334 14.73519,4.27857 8.86004,2.47375 17.57384,5.11811 26.38839,7.12639 8.8994,2.02671 15.32186,6.07193 23.5853,-0.0867 3.8796,-2.89107 7.55753,-6.47747 11.51138,-9.44646 4.63124,-3.47797 9.43718,-5.21695 14.92112,-6.87533 2.22129,-0.67189 4.4549,-1.30743 6.66518,-2.01433 0.88439,-0.28302 6.27602,-3.46082 7.11522,-3.27959 -7.42572,-1.59537 -31.31966,-1.93473 -39.13446,-3.26236 -9.80472,-1.66426 -18.98766,-1.78492 -28.94872,-1.84228 -11.48271,-0.0672 -22.97561,1.25782 -34.46783,1.47844 -11.79255,0.2281 -23.60484,-0.63412 -35.38747,-0.66185 -3.44381,-0.008 -9.12331,-0.76455 -11.68277,1.05955 -4.32659,3.08379 1.00405,3.77134 -0.11139,4.2052" style="opacity:0.199997;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283492" />
            <path id="path3" style="fill:#ecfcfe;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="M 276.94922 367.07227 L 161.21484 369.09766 L 165.68945 381.1875 L 281.80273 379.20312 L 376.08398 385.0957 L 370.88477 372.27148 L 276.94922 367.07227 z M 119.23828 367.41797 L 97.574219 381.62891 L 66.376953 400 L 88.214844 400 L 119.06445 382.32227 L 119.13086 376.67969 L 119.58398 381.97656 L 156.14258 381.35156 L 151.4707 369.26758 L 119.21094 369.83203 L 119.23828 367.41797 z "/>
            <path d="m 371.32146,366.88627 c -3,-6.6 -2.29913,-15.55053 -3.72046,-22.6332 -1.616,-8.052 -2.56261,-17.8694 -3.73194,-26.01207 -1.67467,-11.66667 -6.91897,-34.14933 -7.3683,-35.172 -0.94533,-2.14667 -4.50854,-3.80279 -6.1952,-5.43213 3.7804,11.63467 6.86863,23.93613 9.1033,35.48946 1.26267,6.528 2.13347,13.71074 3.0308,20.32941 1.07867,7.948 1.6371,14.54643 1.61274,23.00523 2.072,8.768 12.31572,35.10796 14.59172,43.5053 h 5.984 c -1.748,-8.07734 -9.2323,-23.98064 -14.83096,-36.29797" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283586" />
            <path id="path283446" style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" d="m 197.77148,196.28516 c -0.26366,0.0623 -0.51022,0.19708 -0.71289,0.39843 -6.70009,8.84515 -8.74684,15.59451 -15.15039,25.17188 -0.71981,1.07658 -4.56224,2.45161 -5.6289,3.09961 -1.47333,0.896 -4.02844,2.26358 -8.73438,4.4082 -4.7059,2.14462 -12.46307,6.36178 -21.5957,10.50195 -9.13263,4.1402 -17.97777,6.15144 -29.99024,10.17188 -12.01243,4.02044 -39.269537,15.33508 -51.14648,20.48633 -1.801458,1.21501 -3.931004,1.84123 -5.560547,3.04101 -15.771611,29.05006 -24.623218,71.03068 -28.144531,97.73828 -1.286848,11.80772 -1.337818,18.41265 -1.617188,28.14063 -0.03067,0.17466 -0.07629,0.34877 -0.126953,0.52344 h 4.427735 c -0.464966,-3.51134 6.20144,-88.23429 29.824218,-121.20508 2.24977,-0.30739 10.651895,0.27721 15.021485,3.86133 3.13004,2.81101 8.891033,8.71812 11.429687,11.38476 -3.599332,-6.23421 -6.747692,-10.29856 -11.697265,-14.91601 -5.483187,-3.3559 -7.511417,-4.20862 -11.900391,-3.90821 6.410488,-3.26284 36.20187,-15.30401 43.25781,-17.86718 7.05597,-2.5632 20.61947,-5.91788 28.88086,-8.82032 8.26138,-2.90241 12.88737,-5.68053 18.28516,-8.47461 5.39777,-2.79404 12.36903,-6.38706 15.81836,-8.39257 3.44931,-2.00553 6.79673,-3.53552 8.02065,-4.13836 0.62847,0.85738 2.00219,3.31375 2.94551,4.73876 3.73657,5.64455 8.08318,11.16304 12.43228,15.91913 4.34906,4.75605 11.87996,9.70344 15.9746,12.52344 7.89657,5.55321 20.31191,9.46961 25.61719,10.52343 2.84147,0.85461 15.81911,2.85892 17.6836,2.35547 0,0 -14.58247,-2.89867 -22.21289,-5.55859 -7.63044,-2.65996 -25.07036,-13.9432 -29.19623,-17.50865 -4.1259,-3.56541 -10.26108,-10.19368 -12.70508,-13.24701 -2.444,-3.05196 -5.9408,-9.21626 -7.62213,-12.10958 3.04445,-5.77506 10.44213,-18.30994 13.63086,-23.22656 0.46088,1.00197 1.76186,4.34527 6.98047,11.50977 5.03266,6.90923 9.89386,11.26343 15.53515,16.96875 7.51937,6.39644 14.98087,11.70312 23.77149,14.92578 4.1213,1.512 8.42298,2.49647 12.77734,3.04883 2.85363,0.36199 5.5587,1.34883 9.35742,0.23242 3.24632,-0.52665 4.15096,-2.73188 5.53321,-5.38282 0.85141,-1.6329 1.7853,-3.06895 1.9082,-3.39648 1.27148,-3.38842 2.07745,3.85762 2.14999,6.75431 1.67541,1.77443 4.09899,3.11198 4.55704,3.39022 0.31288,0.19006 4.92759,3.13141 7.94727,5.30274 3.12135,2.24443 7.50313,7.10958 10.50781,8.13671 16.65059,3.90377 26.95726,7.00348 42.03515,11.86329 7.90376,2.67402 10.66778,4.65814 14.37696,9.11718 3.53978,4.2897 7.93778,12.97098 11.8164,21.57227 3.29334,7.30529 5.71201,15.03102 7.13868,22.95898 1.14663,4.17067 2.12559,8.37326 2.93359,12.58789 0.048,0.25333 0.0909,0.50902 0.13086,0.76368 0.62934,4.01996 0.71003,8.15484 0.80469,12.21484 0.0427,1.83733 0.0668,3.67439 0.0508,5.51172 -0.0466,3.68898 -0.60491,7.34197 -1.55078,10.93359 -0.40666,1.48134 -0.97051,3.00511 -1.20118,4.53711 -0.31083,2.05399 -1.02417,5.05023 -0.23632,7.22266 -2.75567,-0.25087 -54.96827,-4.96984 -96.57227,-5.81641 -26.09866,-0.53105 -76.51397,0.69485 -113.29687,1.75 l 1.46874,3.96485 c 36.72454,-1.04556 86.19982,-2.23662 111.7461,-1.7168 42.48016,0.86439 97.25781,5.88476 97.25781,5.88476 l 0.24805,-2.69726 c 2.20603,2.70722 2.63325,0.70799 2.47265,-0.57422 -0.55333,-4.432 0.90163,-8.86737 1.54297,-11.08203 1.44266,-4.98267 2.10133,-9.23405 2.36133,-14.49805 0.588,-11.89996 -1.70703,-21.89412 -4.20703,-33.46875 -0.57333,-2.65466 -1.24238,-5.28733 -2.01172,-7.88867 -2.724,-9.22129 -6.71752,-18.02425 -11.88281,-26.04687 -2.75932,-4.28569 -7.75657,-11.55379 -9.57813,-13.17383 -15.43354,-6.77411 -37.40389,-13.58585 -54.74609,-17.56446 -7.14604,-5.82466 -12.73917,-9.59987 -20.99805,-14.09961 0.14985,-0.42649 0.48002,-0.81962 0.6836,-1.20703 1.3,-2.49329 -2.34652,-5.72892 -3.11719,-7.90625 l -2.51563,-4.48047 c -0.30533,0.392 -0.46298,0.86665 -0.68164,1.30665 -1.05734,2.11996 -2.21745,4.26006 -3.46679,6.30273 -1.17733,1.928 -2.35514,4.23612 -4.31446,5.4707 -2.24005,1.41149 -5.12239,0.32915 -7.57812,0.0645 -40.27505,-4.34308 -57.65478,-46.32115 -57.44727,-46.79493 l 0.80469,-1.83789 c -0.27333,-0.0907 -1.84865,-0.23556 -2.22461,-0.25 z M 99.759766,310.43555 c 0,0 1.962634,4.5119 4.289064,10.875 1.16395,3.1821 2.41191,6.82327 3.54297,10.59179 1.12973,3.76873 2.14262,7.66535 2.83008,11.35157 0.99187,7.65368 2.93934,20.13349 3.46874,23.51562 -5.41678,3.79926 -17.004808,11.86794 -23.494136,15.97266 C 81.362263,388.45662 60.792969,400 60.792969,400 h 8.927734 c 0,0 15.652824,-8.83771 23.392578,-13.68945 6.792641,-4.25805 16.882709,-11.10564 21.554689,-14.28711 0.38629,2.69213 0.86047,5.70422 1.38086,9.05664 -3.72678,2.40917 -10.54261,6.79824 -15.36719,9.7168 C 95.419516,393.98012 84.548828,400 84.548828,400 h 7.851563 c 0,0 7.090653,-3.89388 10.830079,-6.13672 4.23554,-2.54041 9.61451,-5.70808 13.4707,-7.97461 0.59681,4.53786 1.0816,9.30236 1.01367,14.11133 h 5.29297 c -0.14005,-4.7715 -0.23632,-11.00446 -0.33203,-16.11328 2.47892,-0.0845 16.6525,-0.53251 34.04102,-1.04688 l -1.53125,-3.96289 c -16.66522,0.49658 -30.13213,0.92564 -32.5918,1.00977 -0.006,-0.24467 -0.016,-0.83334 -0.0215,-1.04883 -0.11004,-4.34798 -0.1698,-2.27051 -0.25,-5.93359 8.23237,-0.63782 19.46927,-0.92104 30.09375,-1.18946 l -1.67969,-4.3457 c -9.09646,0.29527 -18.19238,0.60659 -27.28906,0.80859 0,0 -4.50294,-18.8254 -5.74024,-21.71875 -1.2373,-2.89334 -3.353,-10.86993 -7.67383,-19.1914 -1.62365,-3.12928 -3.32539,-6.20459 -5.05664,-9.06446 -1.73275,-2.861 -3.48925,-5.50688 -5.216794,-7.76757 z m 158.283204,54.17383 c -32.52673,0.022 -65.05024,1.3565 -97.57422,2.47265 l 1.61719,4.36719 c 1.04423,-0.0322 2.40951,-0.0589 3.38672,-0.0937 34.14923,-1.2195 69.25849,-2.76156 104.50586,-1.5625 33.52242,1.14038 71.01919,5.2124 102.01562,7.10351 -1.18126,-6.07187 -0.41998,-4.0656 -2.25,-4.68359 -12.64118,-1.37501 -27.6149,-2.67005 -39.99219,-3.49805 -16.56125,-1.10667 -34.96788,-3.65258 -52.47851,-3.95312 -6.41005,-0.11002 -12.82071,-0.15668 -19.23047,-0.15234 z" />
            <path id="path6" style="color:#000000;fill:#000000;-inkscape-stroke:none" d="m 195.58984,203.42578 -2.61718,1.46875 c 0,0 5.85503,10.50501 9.8457,15.45703 5.74898,7.13395 12.04627,14.19681 19.72266,19.5293 7.19767,4.99994 15.45338,8.24658 23.60937,10.9375 2.75862,0.91015 7.31739,1.67604 9.29102,1.98437 l -0.25782,20.12696 c -0.95342,0.77587 -35.459,28.84742 -50.83984,39.52929 -15.6765,10.88723 -30.40851,19.18828 -40.3418,25.62305 -6.56034,4.24978 -14.91152,9.55238 -20.75522,13.49897 L 161.3302,400 h 3.68295 l -17.26706,-47.58203 c 0.8676,-0.58449 8.55569,-5.77051 17.88868,-11.81641 9.78406,-6.3381 24.60726,-14.69596 40.41992,-25.67773 15.89544,-11.03928 51.56445,-40.10352 51.56445,-40.10352 l 0.54492,-0.44336 0.35547,-27.5625 -3,-0.0391 -0.0391,2.98438 c -2.15467,-0.35966 -6.27735,-1.09379 -8.39063,-1.79102 -8.04433,-2.65408 -16.02304,-5.82008 -22.83593,-10.55273 -7.28674,-5.06182 -13.41656,-11.89318 -19.09961,-18.94532 -3.57147,-4.43184 -9.56446,-15.04492 -9.56446,-15.04492 z m 79.05221,35.57188 c 0,0 -0.0867,2.27043 -0.62015,3.88128 -0.53343,1.61085 -2.28913,4.1631 -2.67424,4.54668 -0.64538,0.64281 -2.02583,1.97409 -3.59407,2.63764 -1.00262,0.42423 -2.27772,0.6676 -4.46062,0.89182 -0.0171,8.00906 -0.77309,19.39497 -1.13626,22.55415 -0.30439,0.37363 -3.79726,4.2665 -12.18995,11.65874 -9.57488,8.43349 -29.67623,24.36843 -45.45899,35.87695 -16.41767,11.63826 -33.29549,22.62608 -50.30469,33.37891 L 171.13867,400 h 2.82031 l -16.11523,-44.3418 c 1.73048,-1.09712 32.94115,-20.89403 48.43164,-32.18945 15.84674,-11.55518 36.07275,-27.25099 45.71875,-36.08789 1.78774,-1.63778 9.62635,-8.85543 13.04737,-13.1255 0.67215,-7.00725 1.12532,-14.24885 1.34523,-21.20263 0,0 1.00892,-0.18038 2.14489,-0.66103 1.70286,-0.72051 3.61053,-1.74026 4.93323,-3.05772 1.32421,-1.31893 1.96721,-3.26511 2.54883,-5.02148 0.58162,-1.75637 0.9375,-3.28516 0.9375,-3.28516 z" />
            <path d="m 199.85386,247.78521 c -2.956,-2.45467 -5.49586,-4.13921 -8.94786,-7.61521 -9.57334,-13.50887 -10.81672,-11.21418 -2.06274,-27.26703 3.5985,-6.47393 9.42644,-14.32449 9.42644,-14.32449 l 2.05459,4.26669 c 3.75062,13.68523 6.8977,18.55283 15.2417,26.77683 7.41067,7.304 11.40134,14.18934 24.04267,17.34934 4.20667,1.052 3.568,11.54666 3.352,13.924 -0.216,2.37733 -9.13063,10.73787 -23.27996,0.78187" style="display:inline;opacity:0.199997;fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:1.33333" id="path283456" />
            <g id="g10">
                <path style="color:#000000;fill:#a6a6a6;stroke-width:0.913966;stroke-miterlimit:40;-inkscape-stroke:none" d="m 323.74498,394.67901 9.14268,-42.96978 19.49115,41.29461 c 0,0 -6.63457,-8.65272 -12.14714,-9.17301 -3.90461,-0.36852 -16.48669,10.84818 -16.48669,10.84818 z" id="path14" />
                <path style="color:#000000;fill:#000000;stroke-width:0.913966;stroke-miterlimit:40;-inkscape-stroke:none" d="m 332.5201,348.45448 -11.06586,49.34023 c 2.69102,-2.78441 5.80312,-5.05677 8.75848,-7.56396 2.99083,-2.5373 7.2695,-4.88311 10.21499,-4.83694 2.4995,0.0392 5.17732,2.01337 7.6677,4.30867 2.49038,2.29529 4.31932,4.5316 4.31932,4.5316 l 3.75474,3.91131 z m 0.98324,7.42215 14.92215,31.09162 c -2.60867,-2.37863 -5.13031,-4.12788 -8.37509,-4.43413 -2.93661,-0.27716 -7.4984,2.1453 -14.78913,8.45735 z" id="path15" />
            </g>
            <path style="color:#000000;fill:#000000;fill-opacity:1;-inkscape-stroke:none" d="m 273.29708,260.57482 c -0.56721,2.13587 -2.36717,5.38928 -3.73067,7.19471 -1.32355,1.75253 -4.65235,3.81445 -4.65235,3.81445 l -0.0184,2.84527 c 0,0 4.47979,-3.08893 6.26642,-5.45464 1.74668,-2.3128 3.18139,-5.26437 3.46197,-7.97278 0.2617,-2.52614 -0.62056,-6.14923 -0.62056,-6.14923 0,0 -0.16388,3.67915 -0.70641,5.72222 z" id="path10" />
            <path id="path11" style="fill:#000000;fill-opacity:0.2;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m 256.98438,246.81445 -2.81836,0.49024 -1.4502,25.83203 c 0,0 -28.16782,22.43797 -46.82324,35.5293 -18.65542,13.09131 -64.99024,42.28711 -64.99024,42.2871 l 7.66211,19.89258 c -12.1414,0.57384 -23.61745,-0.17728 -29.22656,0.39258 l 0.10742,1.98438 c 0,0 0.25597,4.72793 0.47266,26.77734 h 24.39844 c 0.78556,-18.04348 1.62546,-22.2444 5.38476,-26.19922 L 159.79297,400 h 2.59961 l -10.3125,-28.43555 c 0.36676,-0.32165 0.75007,-0.65371 1.15625,-1.00586 -0.49504,0.0387 -0.98969,0.0701 -1.48438,0.10352 l -6.51757,-17.97461 47.48632,-30.33008 28.59766,-20.62304 34.85156,-28.59766 z" />
        </g>`
}


export class LowerDecksUniformPack extends BaseTngEraUniformPack implements IUniformPack {

    getUniformSwatches() {
        return [
            new Swatch(BodyType.AverageMale, "Average Male", (token) => UniformCatalog.decorateSwatch(this.getNeck(BodyType.AverageMale, token.skinColor) + LowerDeckUniforms.averageMale, BodyType.AverageMale, token), "BodyType.averageMale"),
            new Swatch(BodyType.AverageFemale, "Average Female", (token) => UniformCatalog.decorateSwatch(this.getNeck(BodyType.AverageFemale, token.skinColor) + LowerDeckUniforms.averageFemale, BodyType.AverageFemale, token), "BodyType.averageFemale"),
        ];
    }

    getUniformVariantSwatches(token: Token) {
        return [];
    }

    getUniformAndVariantBody(token: Token) {
        if (token.bodyType === BodyType.AverageMale) {
            return this.getNeck(token.bodyType, token.skinColor, token.species)
                + LowerDeckUniforms.averageMale.replace(DefaultRed, token.divisionColor).replace(SpeciesRestrictions.DEFAULT_SKIN_COLOR_REGEX, token.skinColor);
        } else {
            return this.getNeck(token.bodyType, token.skinColor, token.species)
                + LowerDeckUniforms.averageFemale.replace(DefaultRed, token.divisionColor).replace(SpeciesRestrictions.DEFAULT_SKIN_COLOR_REGEX, token.skinColor);
        }
    }

    getRankIndicator(token: Token) {
        let result = super.getRankIndicator(token);
        result = `<g transform="translate(3, 5)">` + result + `</g>`;
        return result;
    }
}