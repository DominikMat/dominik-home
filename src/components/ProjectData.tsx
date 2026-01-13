

export interface LinkInfo {
    title: string;
    url: string;
    filePath: string;
}
export interface StatInfo {
    label: string;
    value: string;
}

export interface ImageData {
    path: string,
    aspect: number
}

export interface ProjectInfo {
    title: string;
    tag: string;
    startDate: string;
    endDate:string;
    description: string;
    images: ImageData[];
    details: string;
    stats: StatInfo[];
    links: LinkInfo[];
    galleryAspectMult: number;
}

export const ProjectData: ProjectInfo[] = [
    // drifty roads
    {
    title: 'drifty roads',
    tag: 'Computer Game',
    startDate: '2026',
    endDate: '2026',
    description: 'a simple driving game with (somewhat) real physics',
    images: [
        { path: '/dominik-home/images/drifty/driftyroads_logo.png', aspect: 1 },
        { path: '/dominik-home/images/drifty/screenie_1.png', aspect: 1778/916 },
        { path: '/dominik-home/images/drifty/drift.png', aspect: 602/553 },
        { path: '/dominik-home/images/drifty/title.png', aspect: 602/932 },
        { path: '/dominik-home/images/drifty/crash.png', aspect: 602/932 },
    ],
    details: `
        A 2D top-down driving game made in Godot Game Engine.
        The physics system is inspired by a article by Marco Monster:
        https://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html?hl=en-GB

        The controls were made with mobile in mind, you can download the game for Andoid and Windows.
    `,
    stats: [
    ],
    links: [
        {title: "Windows download", url:'https://drive.google.com/drive/folders/1c6WdGF-vC6XJMYsy7sslEceoSIJOMPc2?usp=sharing', filePath:''},
        {title: "Android download", url:'https://drive.google.com/drive/folders/1c6WdGF-vC6XJMYsy7sslEceoSIJOMPc2?usp=sharing', filePath:''},
        {title: "Github repo", url:'https://github.com/DominikMat/drifty-roads', filePath:''},
    ],
        galleryAspectMult: 10,
    },
    // simple gear calculator
    {
    title: 'Simple Gear Calculator',
    tag: 'Website',
    startDate: '2025',
    endDate: '2025',
    description: 'a website to visually display meshing gears of different sizes',
    images: [
        { path: '/dominik-home/images/gears/title.png', aspect: 500/56 },
        { path: '/dominik-home/images/gears/gears.png', aspect: 1 },
        { path: '/dominik-home/images/gears/tether.png', aspect: 951/790 },
        { path: '/dominik-home/images/gears/new_gear.png', aspect: 776/730 },
        { path: '/dominik-home/images/gears/info.png', aspect: 891/512 },
        { path: '/dominik-home/images/gears/big_gear.png', aspect: 1058/651 },
    ],
    details: `
        support modifing gear data dynamically: size, number of teeth, module, speed
        automatically aligned gears so they mesh correcly,
        you can 'tether' gears - which copies over their rotation speed, 
        supports changing the simulation scale, so you can put in sizes of gears you are working with, 
        to calculate the data for any connected gear
        build in React for fun.
    `,
    stats: [
    ],
    links: [
        {title: "Live website on gh pages", url:'https://dominikmat.github.io/simple-gear-calculator/', filePath:''},
        {title: "Github repo", url:'https://github.com/DominikMat/simple-gear-calculator', filePath:''},
    ],
        galleryAspectMult: 12,
    },
    // string art robot
    {
    title: 'String art Robot',
    tag: 'Engineering',
    startDate: '2025',
    endDate: '2025',
    description: 'a robot that creates string art on a circular ring of nails',
    images: [
        { path: '/dominik-home/images/string-robot/assembled.jpg', aspect: 2083/2011 },
        { path: '/dominik-home/images/string-robot/parts.jpg', aspect: 2777/2083 },
        { path: '/dominik-home/images/string-robot/prints.jpg', aspect: 1344/756 },
        { path: 'https://youtu.be/TUs5X3Doydk', aspect: 1.777 },
        { path: 'https://youtu.be/Qxbhm3yw1Us', aspect: 1.777 },
        { path: 'https://youtu.be/gw7TlqKRpaU', aspect: 1.777 },
        { path: '/dominik-home/images/string-robot/tinker.jpg', aspect: 3968/2976 },
        { path: '/dominik-home/images/string-robot/result.jpg', aspect: 3968/2976 },
    ],
    details: `
        the robot consists of a servo and a stepper motor, the frame is 3D printed.
        It has been built for the Intro to Robotics class at the University of the Aegean in 2025 winter semester,
        that's why it does not work very well, we only had one shot at printing.
        The robot is controlled with a raspberry pi pico with a c++ program, we wrote an additional 
        string visuallizer program in python.
    `,
    stats: [
    ],
    links: [
        {title: "Video presentation", url:'https://youtu.be/TUs5X3Doydk', filePath:''},
        {title: "Slideshow", url:'https://docs.google.com/presentation/d/1VIfVSTO9Wcaq9Rl0Zi-_Bw-y_5G3Nwj30t2qu21ZTrM/edit?usp=sharing', filePath:''},
        {title: "Github repo", url:'https://github.com/DominikMat/string-art-robot', filePath:''},
    ],
        galleryAspectMult: 12,
    },
    // portfolio
    {
    title: 'Home & Portfolio website',
    tag: 'Website',
    startDate: '2025',
    endDate: '2025',
    description: 'a website to nicley display all the amazing things Ive done',
    images: [
        { path: '/dominik-home/images/portfolio/main.png', aspect: 1.817734 },
        { path: '/dominik-home/images/portfolio/full.png', aspect: 2.06028 },
        { path: '/dominik-home/images/portfolio/popup.png', aspect: 2.26087 },
        { path: '/dominik-home/images/portfolio/art.png', aspect: 2.094276 },
        { path: '/dominik-home/images/portfolio/art-2.png', aspect: 1.22155 },
        { path: '/dominik-home/images/portfolio/work-cards.png', aspect: 1.989899 },
    ],
    details: `
        project cards with working popups for details,
        supports images, embedded videos, yt videos and downloadable files.

        work cards are lacklaster because I dont have much to fill it with.

        art gallery is dynamically sized to a css grid, to fill out most space and preserve aspect ratios.

        built with React.

        then i made this site as well, built in react and typescript.
    `,
    stats: [
    ],
    links: [
        {title: "This site git repo", url:'https://github.com/DominikMat/dominik-home.git', filePath:''},
        {title: "Old portfolio git repo", url:'https://github.com/DominikMat/portfolio_website.git', filePath:''},
        {title: "OLD SITE: https://dominikmat.github.io/portfolio_website/", url:'https://dominikmat.github.io/portfolio_website/', filePath:''},
    ],
        galleryAspectMult: 12,
    },
    // rubiks
    {
    title: 'Rubiks Solver',
    tag: 'Application',
    startDate: '2025',
    endDate: '2025',
    description: 'an app to automatically solve Rubiks cubes, and show moves and animations',
    images: [
        { path: '/dominik-home/images/rubiks/rubiks-logo.png', aspect: 0.966038 },
        { path: '/dominik-home/images/rubiks/app.png', aspect: 1.700141 },
        { path: '/dominik-home/images/rubiks/py-logo.png', aspect: 1.0 },
        { path: '/dominik-home/images/rubiks/image-creator.png', aspect: 1.700141 },
    ],
    details: `
        build with Python and OpenGL rendering,
        uses Kociemba as well as our own implementation of LBL algorythm.
        Supports solving to custom faces to make pictures.

    `,
    stats: [
    ],
    links: [
        {title: "Github Repository", url:'https://github.com/filip-zolnierczyk/PythonCubeProject.git', filePath:''},
    ],
        galleryAspectMult: 12,
    },
    // online shop
    {
    title: 'Prestissimo.com',
    tag: 'Website',
    startDate: '2024',
    endDate: '2024',
    description: 'a school project website, mock online shop',
    images: [
        { path: '/dominik-home/images/online_shop/logo.png', aspect: 3.690909 },
        { path: '/dominik-home/images/online_shop/homepage.png', aspect: 2.055734 },
        { path: '/dominik-home/images/online_shop/produkty.png', aspect: 1.331849 },
        { path: '/dominik-home/images/online_shop/recenzje.png', aspect: 1.902606 },
        { path: '/dominik-home/images/online_shop/logowanie.png', aspect: 1.02 },
        { path: '/dominik-home/images/online_shop/tech.png', aspect: 3.322807 },
    ],
    details: `
        a school project website, average online shopping experience

        built in React.
    `,
    stats: [
    ],
    links: [
        {title: "Github Repository", url:'https://github.com/AdrianSuliga/OnlineShop.git', filePath:''},
    ],
        galleryAspectMult: 12,
    },
    // stargazing
    {
    title: 'Stargazing Website',
    tag: 'Website',
    startDate: '2024',
    endDate: '2024',
    description: 'a school project website, displays constallation with star info',
    images: [
        { path: '/dominik-home/images/stargaze-site/main_site-2.png', aspect: 1.789346 },
        { path: '/dominik-home/images/stargaze-site/main_site.png', aspect: 2.045016 },
        { path: '/dominik-home/images/stargaze-site/gallery.png', aspect: 1.647189 },
        { path: '/dominik-home/images/stargaze-site/contact-form.png', aspect: 1.542697 },
        { path: '/dominik-home/images/stargaze-site/drawing.jpg', aspect: 1.466428 },
        { path: '/dominik-home/images/stargaze-site/drawing-2.jpg', aspect: 1.454868 },
    ],
    details: `
        a school project website, displays constallation with star info

        project had to include a gallery and a contact form.
        built in pure HTML
    `,
    stats: [
    ],
    links: [
        {title: "Github Repository (under projekt1)", url:'https://github.com/DominikMat/Apki-Internetowe.git', filePath:''},
    ],
        galleryAspectMult: 12,
    },
    // evolution
    {
    title: 'Evolution Engine',
    tag: 'Application',
    startDate: '2024',
    endDate: '2024',
    description: 'a school project app, simulates grazing animals with genetic code',
    images: [
        { path: '/dominik-home/images/evolution/evo-logo.png', aspect: 1.189293 },
        { path: '/dominik-home/images/evolution/sim.png', aspect: 1.915301 },
        { path: '/dominik-home/images/evolution/params.png', aspect: 1.129274 },
    ],
    details: `
        a school project app, simulates grazing animals with genetic code.

        built with Java.
    `,
    stats: [
    ],
    links: [
        {title: "Github Repository", url:'https://github.com/tomaszmol/projekt_PO.git', filePath:''},
    ],
        galleryAspectMult: 12,
    },
    // giraffean
    {
    title: 'The Giraffean Campaign',
    tag: 'Computer Game',
    startDate: '2022-03-29',
    endDate: '2022-04-15',
    description: 'canonballs versus giraffe',
    images: [
        { path: '/dominik-home/images/giraffe/giraffe  (1).png', aspect: 1.143737 },
        { path: '/dominik-home/images/giraffe/giraffe  (2).png', aspect: 1.230519 },
        { path: '/dominik-home/images/giraffe/giraffe  (3).png', aspect: 1.063425 },
        { path: '/dominik-home/images/giraffe/giraffe  (1).JPG', aspect: 1.052953 },
    ],
    details: `
        Progress:
        day 1 - IK (3h)
        day 2 - boat and shooting (2h)
        day 3 - Water Interaction (2.5h)
        day 4 - mental breakdown
        day 5 - buoyancy system (3h)
        day 6 - utter laziness
        day 7 - empire ship, dialogue, timeline (3h)
        day 8 - basic sound FX (1h)
        day 9 - giraffe health, damage and defense systems (2.5h)
        day 10 - basically nothing
        day 11 - finished damage and limb severing system (2h)
        day 12 - gameplay (3h)
        day 13 - intro sequence (4h)
        day 14 - bugs, background, boss outro sequence, more audio, retexturing (7h)
        day 15 - pondering build bug (1h)
        day 16 - fixed build bug, no more mobile,  music, credits sequence (3.5h)
        day 17 - finished credits, ending touches (9h)
    `,
    stats: [
        { label: 'Total Time spent', value: "17days, 46.5h, ~2.75h a day" },
    ],
    links: [
        {title: "The Giraffen Campaign PC version", url:'https://drive.google.com/file/d/1h3rdz3KpPmPdXKzXBId05vOXWw41Er4M/view?usp=sharing', filePath:''},
        {title: "Devlog Videos (YT Playlist)", url:'https://www.youtube.com/playlist?list=PLJX6VUSvLT5RVY-xhGaSjj7B042wMYZIM', filePath:''}
    ],
        galleryAspectMult: 12,
    },
    // gong
    {
        title: 'Gong Alarm',
        tag: 'Engineering',
        startDate: '2022',
        endDate: '2022',
        description: 'a miniature and motorized chinese gong to wake me up',


        images: [
            { path: '/dominik-home/images/gong/DSC_0705.JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/gong/DSC_0753.JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/gong/Gong Alarm (1).jpg', aspect: 0.75 },
            { path: '/dominik-home/images/gong/Gong Alarm (4).jpg', aspect: 1.333333 },
            { path: '/dominik-home/images/gong/Gong Alarm (5).jpg', aspect: 1.333333 },
            { path: '/dominik-home/images/gong/Gong Alarm (6).jpg', aspect: 0.75 },
            { path: 'https://youtu.be/zPBFU7ZbkVs', aspect: 1.7777},
        ],
        details: `
        a miniature and motorized chinese gong to wake me up

        I wanted to fall asleep watching youtube but be forced to get out
        of bed to turn off the alarm to wake up, thus a gong was born.

        Fitted with an OLED display, and internet connection (for clock updates),
        when disabled in the morning it shows the weather for the day :)

        One time we went on vacation and i left it on, it gonged for at least a couple 
        hours when a family friend came over to turn it off.

        it is VERY loud.

        also the hammer is from a kalimba.
        `,
        stats: [],
        links: [],
        galleryAspectMult: 6,
    },
    // fluid sims
    {
    title: 'Fluid Simulations',
    tag: 'Simulation',
    startDate: '2021-12-10',
    endDate: '2022-XX-XX',
    description: 'fluid simulation, cell-based and SPH',
    images: [
        { path: '/dominik-home/images/fluid/fluid (5).png', aspect: 1.628846 },
        { path: '/dominik-home/images/fluid/fluid (6).png', aspect: 1.646341 },
        { path: '/dominik-home/images/fluid/fluid (7).png', aspect: 1.708861 },
        { path: '/dominik-home/images/fluid/fluid (8).png', aspect: 1.815279 },
        { path: '/dominik-home/images/fluid/fluid (9).png', aspect: 1.646288 },
        { path: '/dominik-home/images/fluid/fluid (10).png', aspect: 1.111111 },
        { path: '/dominik-home/images/fluid/DSC_0237.JPG', aspect: 1.772512 },
        { path: 'https://youtu.be/8v7jRq7eyCQ', aspect: 1.7777},
        { path: 'https://youtu.be/Ra7vjeXGca4', aspect: 1.7777},
    ],
    details: `
    First I created a cell based simulation in Unity, but it was slow,
    then i experimented with particle based simulation (SPH). I wrote a compute shader 
    for the particle calculations, but still manages at most 4k particles.

    After that I wanted to create something to use the simulation the idea was a fishing game.
    I also implemented a fluid collision system, and a buoyancy algorythm.
    `,
    stats: [
        {label: "Time spent", value: "~1 year on and off"}
    ],
    links: [
        {title: "Fluid Engine Videos (YT Playlist)", url:'https://www.youtube.com/playlist?list=PLJX6VUSvLT5RnLE8cEcDfddoYloI3ZBgT', filePath:''},
        {title: "SPH Fluid Videos (YT Playlist)", url:'https://www.youtube.com/playlist?list=PLJX6VUSvLT5RpJeCM139PUpdwGMB6E-0r', filePath:''},
        {title: "SPH Fluid Simulation - HTML", url:'https://drive.google.com/file/d/1X7boNwWbTHN7smb6Bz7bNeCsBvWzxY0O/view?usp=sharing', filePath:''},
    ],
        galleryAspectMult: 10,
    },
    // softbodies
    {
    title: 'Softbody Simulation',
    tag: 'Simulation',
    startDate: '2021-11-27',
    endDate: '2021-11-27',
    description: 'Simulation of squishy objects',
    images: [
        { path: '/dominik-home/images/soft/softbody-1.png', aspect: 1.394737 },
        { path: '/dominik-home/images/soft/softbody-2.png', aspect: 0.955457 },
        { path: 'https://youtu.be/jLjjc2Xi09k', aspect: 1.7777},
        { path: 'https://youtu.be/Z3psJtYVMjo', aspect: 1.7777},
        { path: 'https://youtu.be/1YUxuCOjEdw', aspect: 1.7777},
    ],
    details: `
    Simulation of squishy objects

    2 simulation built in SFML and HTML.
    `,
    stats: [
    ],
    links: [
        {title: "Softbody Simulation SFML - PC", url:'https://drive.google.com/file/d/1JsPKmjE6ILm1fNppHuHoclQEhjUEIPkf/view?usp=sharing', filePath:''},
        {title: "Softbody Simulation HTML - PC", url:'https://drive.google.com/file/d/1VMwr1ccoLVnojJbPXA4FvKxlqpe52lCn/view?usp=sharing', filePath:''},
        {title: "Abstract Softness - Android", url:'https://drive.google.com/file/d/1P7MzJqBDNhVHBO0WR_cFF6cDa7FZYd-s/view?usp=sharing', filePath:''},
    ],
        galleryAspectMult: 20,
    },
    // disquiet
    {
        title: 'Disquiet',
        tag: 'Engineering',
        startDate: '2022-05-14',
        endDate: '2022-07-06',
        description: 'a controllable led array to show constallations',


        images: [
            { path: '/dominik-home/images/disquiet/DSC_0569.JPG', aspect: 1.773006 },
            { path: '/dominik-home/images/disquiet/DSC_0572.JPG', aspect: 1.773006 },
            { path: '/dominik-home/images/disquiet/DSC_0574.JPG', aspect: 1.773006 },
            { path: '/dominik-home/images/disquiet/DSC_0575.JPG', aspect: 1.773006 },
            { path: '/dominik-home/images/disquiet/DSC_0577.JPG', aspect: 1.773006 },
            { path: '/dominik-home/images/disquiet/DSC_0578.JPG', aspect: 1.773006 },
            { path: '/dominik-home/images/disquiet/DSC_0584.JPG', aspect: 1.773006 },
            { path: '/dominik-home/images/disquiet/DSC_0587.JPG', aspect: 1.773006 },
            { path: '/dominik-home/images/disquiet/image (1).png', aspect: 1.929465 },
            { path: '/dominik-home/images/disquiet/DSC_0629.JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/disquiet/DSC_0633.JPG', aspect: 1.772512 },
            { path: 'https://youtu.be/EY59PGJ3V_k', aspect: 1.7777},
            { path: 'https://youtu.be/t4FgBQqmSNA', aspect: 1.7777},
            { path: 'https://youtu.be/cWjqUiSvsFg', aspect: 1.7777},
            { path: 'https://youtu.be/CmKlTLSAyps', aspect: 1.7777},
        ],
        details: `
        a controllable led array to show constallations

        born after i found that individually controllabel LEDs are very cheap,
        the holes in the backboard are arranges to display as many real constallations 
        as possible, also has modes for different sky views and a speaker for sound effects.

        internet connection to control via a website online

        this project taught me to solder, every led of which there are 40-50 had 3 connection either side,
        so 45 * 3 * 2 = 270 soldering points, i think it took like 10h

        originally i thought about a spinning device to make a display but this was better.
        `,
        stats: [
            {label: "Time spent", value: "3 weeks"}
        ],
        links: [],
        galleryAspectMult: 3,
    },
    // chaos
    {
        title: 'Chaos Pendulum',
        tag: 'Engineering',
        startDate: '2022',
        endDate: '2022',
        description: 'a small project to gaze upon the beauty of chaos',


        images: [
            { path: '/dominik-home/images/chaos/Chaos Pendulum (1).jpg', aspect: 0.75 },
            { path: '/dominik-home/images/chaos/Chaos_Pendulum_(2).jpg', aspect: 1.202655 },
            { path: 'https://youtu.be/9DSRXqGEiEk', aspect: 1.7777},
            { path: 'https://youtu.be/kRcW76c-ZZk', aspect: 1.7777},
            { path: 'https://youtu.be/CMGnyCtR5CA', aspect: 1.7777},
            { path: 'https://youtu.be/AO2fhzG1B2w', aspect: 1.7777},
        ],
        details: `
        a small project to gaze upon the beauty of chaos

        A motorized double pendulum, made out of wood, a 3d printed plastic casing,
        a servo motor and arduino. Fitted with dynamic lighting.
        `,
        stats: [
            {label: "Time spent", value: "1 month 11 days"}
        ],
        links: [],
        galleryAspectMult: 20,
    },
    // gravity
    {
        title: 'Gravity Simulation',
        tag: 'Simulation',
        startDate: '2021-04-15',
        endDate: '2021-04-24',
        description: 'playing around with newtonian gravity simulations',


        images: [
            { path: '/dominik-home/images/gravity/gravity (2).png', aspect: 1.014806 },
            { path: '/dominik-home/images/gravity/gravity (3).png', aspect: 0.95679 },
            { path: '/dominik-home/images/gravity/gravity (4).png', aspect: 0.967638 },
            { path: '/dominik-home/images/gravity/gravity (2).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/gravity/gravity (3).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/gravity/gravity (4).JPG', aspect: 1.772512 },
            { path: 'https://youtu.be/hCfsjraMaRc', aspect: 1.7777},
        ],
        details: `
        Taking a break while doing the DAES

        Solar Sim: April 15-24, 9 days (i think)

        Three Body: August 12, 2021, 1 day
        `,
        stats: [],
        links: [
            {title: "Solar System Simulation - PC", url:'https://drive.google.com/file/d/1ZdceGFTvNG5vzDfEH3bzUkn3TIHVSudB/view?usp=sharing', filePath:''},
            {title: "Three body - Android", url:'https://drive.google.com/file/d/1q-ejeIB6ihqUH9df4pHX36R8dH87KhoH/view?usp=sharing', filePath:''},
            {title: "Gravity Simulation - HTML", url:'https://drive.google.com/file/d/1YDdSvx3ummSVUOzJJsfr70oLFfTmBlYP/view?usp=sharing', filePath:''}
        ],
        galleryAspectMult: 20,
    },
    // polygon ninja
    {
        title: 'Polygon ninja',
        tag: 'Computer Game',
        startDate: '2021-07-02',
        endDate: '2021-08-12',
        description: 'game(s) about slicing 3d objects',


        images: [
            { path: '/dominik-home/images/polygon/polygon (1).png', aspect: 0.999092 },
            { path: '/dominik-home/images/polygon/polygon (2).png', aspect: 1.151125 },
            { path: '/dominik-home/images/polygon/polygon (3).png', aspect: 1.102041 },
            { path: '/dominik-home/images/polygon/Polygon Ninja (2).png', aspect: 1.136201 },
            { path: '/dominik-home/images/polygon/Polygon Ninja (3).png', aspect: 1.03908 },
            { path: '/dominik-home/images/polygon/polygon (4).png', aspect: 1.0 },
        ],
        details: `
            VR Slicer: started 2-9 July, 7 days

            Polygon Ninja: started 12 August. 1 day

            Notka: szybka gierki aby pokazac moj genialny algorytm, 
                ktory dziala tylko 60% czasu, i przetestowac Unity XR`,
        stats: [],
        links: [
            {title: "Polygon Ninja PC version", url:'https://drive.google.com/file/d/1X0ShvZyV7d8lqo0nokJ7bIQMlMBBwq-J/view?usp=sharing', filePath:''},
            {title: "Polygon Ninja Android version", url:'https://drive.google.com/file/d/1pAk2RWLG3H_Qq2dR-1e5q4GR5AaiiXR5/view?usp=sharing', filePath:''},
            {title: "Physics VR", url:'https://drive.google.com/file/d/1SrFLOy8KgSO8PDlgPXApOMVPgI_D9PVo/view?usp=sharing', filePath:''}
        ],
        galleryAspectMult:8,
    }, 
    // xmasDOS
    {
        title: 'christmasDOS',
        tag: 'Engineering',
        startDate: '2021-11-19',
        endDate: '2021-12-06',
        description: 'a wooden christmas tree that playes music and changes lights',


        images: [
            { path: '/dominik-home/images/dos/_20211119_002240.JPG', aspect: 1.341279 },
            { path: '/dominik-home/images/dos/_20211121_132457.JPG', aspect: 0.731239 },
            { path: '/dominik-home/images/dos/_20211124_120810.JPG', aspect: 0.723573 },
            { path: '/dominik-home/images/dos/_20211124_120841.JPG', aspect: 0.898518 },
            { path: '/dominik-home/images/dos/_20211125_101059.JPG', aspect: 0.633146 },
            { path: '/dominik-home/images/dos/DSC_0265.JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/dos/DSC_0270.JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/dos/DSC_0271.JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/dos/DSC_0275.JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/dos/DSC_0277.JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/dos/IMG_20221014_131555.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/dos/IMG_20221013_211955.jpg', aspect: 1.333333 },
            { path: 'https://youtu.be/3Dx9uBcoolM', aspect: 1.7777},
            { path: 'https://youtu.be/FyOHxBz1YqE?si=J6o-pDji89J4I1Lq', aspect: 1.7777},
            { path: 'https://youtu.be/8Y-52JqTwEc?si=SdqqXLbhfiVG73wr', aspect: 1.7777},
            { path: 'https://youtu.be/rGNJDvKczU4?si=k3cUHvmzFjQ3aahs', aspect: 1.7777},
        ],
        details: `
            a wooden christmas tree that playes music and changes lights

            made out of slightly offset and decreasing in size pieces of plywood,
            controlled by arduino, music is from a piezo buzzer, with a volume knob.

            later i undertook an upgrade, i bought a slip ring, bearings and 3d printed 
            gearing to make the entire tree continuously spin (in one direction), my 
            only project that uses both dc and ac power. 

            The current track and glowing pattern is controllable with a IR remote.
        `,
        stats: [
            {label: "Time spent", value: "v1 - 9days, v2 - longer..."}
        ],
        links: [],
        galleryAspectMult: 3.5,
    },
    // calc.io
    {
        title: 'Calc.io',
        tag: 'Engineering',
        startDate: '2022-12',
        endDate: '2023-01',
        description: 'a self-build calculator, do NOT divide by zero',


        images: [
            { path: '/dominik-home/images/calc/IMG_20221203_020153.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20221204_231024.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20221207_175215.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20221207_231605.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20221207_231712.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20221208_231021.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20221214_233935.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20221214_234016.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20221227_004918.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20221229_232231.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20230106_220229.jpg', aspect: 0.75 },
            { path: '/dominik-home/images/calc/IMG_20230125_174154.jpg', aspect: 0.75 },
            { path: 'https://youtu.be/5EYUNZrHSXc', aspect: 1.7777},

        ],
        details: `
            made out of wood panels, some plexi in the back,
            3d printed buttons and a paper display.
            Supports basic operations + - * / sqrt pow and i think unit conversion?
            fitted with rechargeable battery
        `,
        stats: [
        ],
        links: [],
        galleryAspectMult: 8,
    },
    // particles
    {
        title: 'Particle Simulations',
        tag: 'Simulation',
        startDate: '2021-09',
        endDate: '2021-09',
        description: 'playing around with particles',


        images: [
            { path: '/dominik-home/images/particles/Particles V.JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/particles/Particles VII.JPG', aspect: 1.668574 },
            { path: 'https://youtu.be/Wavc3CdgrGE', aspect: 1.7777},
            { path: 'https://youtu.be/cTLkQZIiiEs', aspect: 1.7777},
            { path: 'https://youtu.be/I6bxJUzhSXw', aspect: 1.7777},
            { path: 'https://youtu.be/nL1JxKPHErQ', aspect: 1.7777},
        ],
        details: `
            simulating gravity, collision, molecule life
        `,
        stats: [
        ],
        links: [],
        galleryAspectMult: 20,
    },
    // fishing
    {
        title: 'Fishing in 2417',
        tag: 'Computer Game',
        startDate: '2022-05',
        endDate: '2022-05',
        description: 'a game about fishing in the future',


        images: [
            { path: '/dominik-home/images/fishing/fishing (1).png', aspect: 1.261364 },
            { path: '/dominik-home/images/fishing/fishing (2).png', aspect: 2.05 },
            { path: '/dominik-home/images/fishing/fishing (3).png', aspect: 1.52349 },
            { path: '/dominik-home/images/fishing/fishing (4).png', aspect: 1.065517 },
            { path: '/dominik-home/images/fishing/fishing (5).png', aspect: 1.827869 },
            { path: '/dominik-home/images/fishing/fishing (6).png', aspect: 1.690167 },
            { path: '/dominik-home/images/fishing/fishing (7).png', aspect: 1.617647 },
            { path: '/dominik-home/images/fishing/fishing (8).png', aspect: 1.698901 },
            { path: '/dominik-home/images/fishing/fishing (1).jpg', aspect: 1.772512 },
            { path: '/dominik-home/images/fishing/fishing (2).jpg', aspect: 1.106522 },
            { path: '/dominik-home/images/fishing/fishing (3).JPG', aspect: 1.773006 },
            { path: 'https://youtu.be/zBdteTejxA4', aspect: 1.7777},
            { path: 'https://youtu.be/fCfxW-BThqU', aspect: 1.7777},
            { path: 'https://youtu.be/_lRl5IoEr8w', aspect: 1.7777},
        ],
        details: `
            i wanted to make a pixel art sci-fi game with fishing elements 
            using a real-time fluid simulation but I never managed to make it performant enough to handle 
            a large map.
            The idea was a game where you can use mini-submarines and cameras to look at fish and ocean water.
            I also implemented a dynamic simulation of fish boids, 
            Finally I made a game with the simualtion - the Giraffean Campaign (different project).
        `,
        stats: [
        ],
        links: [],
        galleryAspectMult: 4.3,
    },
    // chasm
    {
        title: 'Crossed Chasm',
        tag: 'Model',
        startDate: '2022-10',
        endDate: '2022-10',
        description: 'a model of a concrete bridge',


        images: [
            { path: '/dominik-home/images/chasm/Crossed Chasm (1).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (2).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (3).JPG', aspect: 0.78585 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (4).JPG', aspect: 0.869655 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (5).JPG', aspect: 0.763628 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (6).JPG', aspect: 0.913914 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (7).JPG', aspect: 0.852095 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (8).JPG', aspect: 0.836057 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (9).JPG', aspect: 0.81037 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (10).JPG', aspect: 0.902545 },
            { path: '/dominik-home/images/chasm/Crossed Chasm (11).png', aspect: 0.991543 },
        ],
        details: `
            i never replaced the batteries and they died after like 2 weeks, 
            the case is made from some leftover wood pices and leftover plexi.
        `,
        stats: [
        ],
        links: [],
        galleryAspectMult: 4.7,
    },
    //confinement
    {
        title: 'Confinement',
        tag: 'Model',
        startDate: '2020-12',
        endDate: '2020-12',
        description: 'a styrofoam model of a confined tent',


        images: [
            { path: '/dominik-home/images/confinement/Confinement (0).png', aspect: 2.102941 },
            { path: '/dominik-home/images/confinement/Confinement (1).JPG', aspect: 3.912709 },
            { path: '/dominik-home/images/confinement/Confinement (2).JPG', aspect: 2.53821 },
            { path: '/dominik-home/images/confinement/Confinement (2).png', aspect: 4.273381 },
            { path: '/dominik-home/images/confinement/Confinement (3).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (4).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (5).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (6).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (7).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (8).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (9).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (10).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (11).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (12).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (13).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (14).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (15).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (16).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (17).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/confinement/Confinement (18).JPG', aspect: 1.772512 },
        ],
        details: `
            the world isnt bent on the right, it was a design choice to
            make some underground terrain but fit it in the space ;)
        `,
        stats: [
        ],
        links: [],
        galleryAspectMult: 3.5,
    },
    // scalar
    {
        title: 'Scalar',
        tag: 'Computer Game',
        startDate: '2020-08-16',
        endDate: '2020-11-16',
        description: 'first complete game, a typical pixel-art platformer (with guns obviously)',


        images: [
            { path: '/dominik-home/images/scalar/scalar (1).png', aspect: 1.94959 },
            { path: '/dominik-home/images/scalar/scalar (2).png', aspect: 1.09375 },
            { path: '/dominik-home/images/scalar/scalar (3).png', aspect: 1.819615 },
            { path: '/dominik-home/images/scalar/scalar (4).png', aspect: 1.701863 },
            { path: '/dominik-home/images/scalar/scalar (5).png', aspect: 1.672666 },
            { path: '/dominik-home/images/scalar/scalar (6).png', aspect: 1.582245 },
            { path: '/dominik-home/images/scalar/scalar (7).png', aspect: 1.521848 },
            { path: '/dominik-home/images/scalar/scalar (8).png', aspect: 1.369253 },
        ],
        details: `
        First finished game, a platformaer where you battle new york mafia in
        fedoras while being a banana-man i guess. Pixel art and guns.
        Actually feels almost finished and somewhat fun to play so there is that :)
        `,
        stats: [
            {label: "Time spent", value: "3 months"}
        ],
        links: [
            {title: "Scalar PC version", url:'https://drive.google.com/file/d/1UY55g5vfPRTrlDunAN6socQnu9LB02k3/view?usp=sharing', filePath:''}
        ],
        galleryAspectMult: 20,
    },
    // daes
    {
        title: 'DAES Console',
        tag: 'Engineering',
        startDate: '2021-05',
        endDate: '2021-05',
        description: 'a game console with a matrix display',


        images: [
            { path: '/dominik-home/images/daes/DAES (1).jpg', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (2).jpg', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (3).jpg', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (4).jpg', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (5).jpg', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (6).jpg', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (7).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (8).jpg', aspect: 0.564171 },
            { path: '/dominik-home/images/daes/DAES (9).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (10).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (11).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (12).JPG', aspect: 1.772512 },
            { path: '/dominik-home/images/daes/DAES (13).JPG', aspect: 1.772512 },
            { path: 'https://youtu.be/Ls85uMQ-O8I', aspect: 1.7777},
        ],
        details: `
            I scripted all the games I could think of and then filed the rest of the 
            arduino memory with 8bit tunes. You can play: space invaders, pong, flappy bird,
            tetris, snake, sand simulation, music player, temperature display, Conway's game of life,
            asteroids.
        `,
        stats: [
        ],
        links: [],
        galleryAspectMult: 4,
    },
        // post guide
    {
        title: 'The Post Guide',
        tag: 'Computer Game',
        startDate: '2021-03-07',
        endDate: '2021-03-31',
        description: 'playing around with procedural generation',


        images: [
            { path: '/dominik-home/images/post/post (1).png', aspect: 1.0 },
            { path: '/dominik-home/images/post/post (2).png', aspect: 1.757709 },
            { path: '/dominik-home/images/post/post (3).png', aspect: 1.798371 },
            { path: '/dominik-home/images/post/post (1).JPG', aspect: 1.445916 },
            { path: '/dominik-home/images/post/post (4).png', aspect: 1.777778 },
        ],
        details: `
        Little game to play around with procedurally generated terrain,
        complete with multiple biomes, random trees, rocks, lakes, oceans,
        volcanoes, and so on.

        Also a inverse kinematics system for procedural walking.

        Game is jank though xd.
        `,
        stats: [
            {label: "Time spent", value: "3 weeks and 3 days"}
        ],
        links: [
            {title: "The Post Guide PC version", url:'https://drive.google.com/file/d/1BYKGIjRZb4ZTDGTTBrvpA7a30rOLetNw/view?usp=sharing', filePath:''},
            {title: "The Post Guide Android version", url:'https://drive.google.com/file/d/1m73LjLtqI6OTcIL6LBKIRzzQVNenNR37/view?usp=sharing', filePath:''}
        ],
        galleryAspectMult: 20
    },
]