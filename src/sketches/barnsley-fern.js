import { matrix, add, multiply, index } from 'mathjs'
export default function (s) {
    s.state = { }
    s.dispatch = () => { }

    var patterns = {
        random: { init: true, img: undefined },
        fern: {
            init: false,
            img: undefined,
            transformations: {
                bounds: [
                    {
                        f1: { m11: 0.00, m12: 0.00, m21: 0.00, m22: 0.16, b11: 0.00, b21: 0.00, p: 0.01},
                        f2: { m11: 0.85, m12: 0.04, m21: -0.04, m22: 0.85, b11: 0.00, b21: 1.60, p: 0.85},
                        f3: { m11: 0.20, m12: -0.26, m21: 0.23, m22: 0.22, b11: 0.00, b21: 1.60, p: 0.07},
                        f4: { m11: -0.15, m12: 0.28, m21: 0.26, m22: 0.24, b11: 0.00, b21: 0.44, p: 0.07},
                    },
                    {
                        f1: { m11: 0.00, m12: 0.00, m21: 0.00, m22: 0.16, b11: 0.00, b21: 0.00, p: 0.01},
                        f2: { m11: 0.85, m12: 0.04, m21: -0.04, m22: 0.85, b11: 0.00, b21: 1.60, p: 0.85},
                        f3: { m11: 0.20, m12: -0.26, m21: 0.23, m22: 0.22, b11: 0.00, b21: 1.60, p: 0.07},
                        f4: { m11: -0.15, m12: 0.28, m21: 0.26, m22: 0.24, b11: 0.00, b21: 0.44, p: 0.07},
                    },
                ],
                params: {
                    f1: { m11: 0.00, m12: 0.00, m21: 0.00, m22: 0.16, b11: 0.00, b21: 0.00, p: 0.01},
                    f2: { m11: 0.85, m12: 0.04, m21: -0.04, m22: 0.85, b11: 0.00, b21: 1.60, p: 0.85},
                    f3: { m11: 0.20, m12: -0.26, m21: 0.23, m22: 0.22, b11: 0.00, b21: 1.60, p: 0.07},
                    f4: { m11: -0.15, m12: 0.28, m21: 0.26, m22: 0.24, b11: 0.00, b21: 0.44, p: 0.07},
                },
                ratio: 0,
                direction: 1,
            },
            numPts: 100000,
            oldPts: [],
        },
    }

    s.preload = () => {
        patterns.fern.img = s.createImage(s.windowWidth/2, s.windowHeight/2)
        patterns.random.img = s.createImage(s.windowWidth, s.windowHeight)
    }

    s.setup = () => {
        s.createCanvas(s.windowWidth, s.windowHeight)
        s.colorMode(s.HSB)
        s.pixelDensity(1)
        s.background(91)
        console.log('::: fern sketch has been initialized')
    }

    s.windowResized = () => {
        patterns.fern.img.resize(s.windowWidth/2, s.windowHeight/2)
        patterns.random.img.resize(s.windowWidth, s.windowHeight)
        s.resizeCanvas(s.windowWidth, s.windowHeight)
    }

    function drawPointFern(px, py, img) {
        let index = (px + py * img.width) * 4;
        img.pixels[index + 0] = 0
        img.pixels[index + 1] = s.random(255)
        img.pixels[index + 2] = 0
        img.pixels[index + 3] = 255
    }

    function nextPointFern(x, y, transformations) {
        let nextX, nextY

        let r = s.random(1)

        let f1P = transformations.params.f1.p
        let f2P = transformations.params.f2.p + f1P
        let f3P = transformations.params.f3.p + f2P
        //let f4P = transformations.params.f4.p + f3P
        if (r < f1P) {
            nextX = transformations.params.f1.m11*x + transformations.params.f1.m12*y + transformations.params.f1.b11
            nextY = transformations.params.f1.m21*x + transformations.params.f1.m22*y + transformations.params.f1.b21
        } else if (r < f2P) {
            nextX = transformations.params.f2.m11*x + transformations.params.f2.m12*y + transformations.params.f2.b11
            nextY = transformations.params.f2.m21*x + transformations.params.f2.m22*y + transformations.params.f2.b21
        } else if ( r < f3P) {
            nextX = transformations.params.f3.m11*x + transformations.params.f3.m12*y + transformations.params.f3.b11
            nextY = transformations.params.f3.m21*x + transformations.params.f3.m22*y + transformations.params.f3.b21
        } else {
            nextX = transformations.params.f4.m11*x + transformations.params.f4.m12*y + transformations.params.f4.b11
            nextY = transformations.params.f4.m21*x + transformations.params.f4.m22*y + transformations.params.f4.b21
        }
        return [nextX, nextY]
    }

    function varyFernParams(transformations) {
        if (transformations.ratio > 0.03 || transformations.ratio < 0) {
            transformations.direction = transformations.direction * -1
        }

        transformations.params.f1.m11 = transformations.bounds[0].f1.m11 +
            transformations.ratio*(transformations.bounds[1].f1.m11-transformations.bounds[0].f1.m11)
        transformations.params.f1.m12 = transformations.bounds[0].f1.m12 +
            transformations.ratio*(transformations.bounds[1].f1.m12-transformations.bounds[0].f1.m12)
        transformations.params.f1.m21 = transformations.bounds[0].f1.m21 +
            transformations.ratio*(transformations.bounds[1].f1.m21-transformations.bounds[0].f1.m21)
        transformations.params.f1.m22 = transformations.bounds[0].f1.m22 +
            transformations.ratio*(transformations.bounds[1].f1.m22-transformations.bounds[0].f1.m22)

        transformations.params.f2.m11 = transformations.bounds[0].f2.m11 +
            transformations.ratio*(transformations.bounds[1].f2.m11-transformations.bounds[0].f1.m11)
        transformations.params.f2.m12 = transformations.bounds[0].f2.m12 +
            transformations.ratio*(transformations.bounds[1].f2.m12-transformations.bounds[0].f2.m12)
        transformations.params.f2.m21 = transformations.bounds[0].f2.m21 +
            transformations.ratio*(transformations.bounds[1].f2.m21-transformations.bounds[0].f2.m21)
        transformations.params.f2.m22 = transformations.bounds[0].f2.m22 +
            transformations.ratio*(transformations.bounds[1].f2.m22-transformations.bounds[0].f2.m22)

        transformations.params.f3.m11 = transformations.bounds[0].f3.m11 +
            transformations.ratio*(transformations.bounds[1].f3.m11-transformations.bounds[0].f3.m11)
        transformations.params.f3.m12 = transformations.bounds[0].f3.m12 +
            transformations.ratio*(transformations.bounds[1].f3.m12-transformations.bounds[0].f3.m12)
        transformations.params.f3.m21 = transformations.bounds[0].f3.m21 +
            transformations.ratio*(transformations.bounds[1].f3.m21-transformations.bounds[0].f3.m21)
        transformations.params.f3.m22 = transformations.bounds[0].f3.m22 +
            transformations.ratio*(transformations.bounds[1].f3.m22-transformations.bounds[0].f3.m22)

        transformations.params.f4.m11 = transformations.bounds[0].f4.m11 +
            transformations.ratio*(transformations.bounds[1].f4.m11-transformations.bounds[0].f4.m11)
        transformations.params.f4.m12 = transformations.bounds[0].f4.m12 +
            transformations.ratio*(transformations.bounds[1].f4.m12-transformations.bounds[0].f4.m12)
        transformations.params.f4.m21 = transformations.bounds[0].f4.m21 +
            transformations.ratio*(transformations.bounds[1].f4.m21-transformations.bounds[0].f4.m21)
        transformations.params.f4.m22 = transformations.bounds[0].f4.m22 +
            transformations.ratio*(transformations.bounds[1].f4.m22-transformations.bounds[0].f4.m22)

        transformations.ratio += 0.002 * transformations.direction
    }

    function cleanFern(fern) {
        for (let i=0; i<fern.oldPts.length; i++) {
            let pt = fern.oldPts[i]
            let index = (pt[0] + pt[1] * fern.img.width) * 4;
            fern.img.pixels[index + 0] = 0
            fern.img.pixels[index + 1] = 0
            fern.img.pixels[index + 2] = 0
            fern.img.pixels[index + 3] = 0
        }
    }

    function drawFern(fern) {
        fern.img.loadPixels()

        cleanFern(fern)

        let x=0, y=0, px=0, py=0
        for (let i=0; i<fern.numPts; i++) {
            drawPointFern(px, py, fern.img)
            let nextP = nextPointFern(x, y, fern.transformations)
            x = nextP[0]
            y = nextP[1]
            px = Math.round(s.map(x, -2.1820, 3.15, 0, fern.img.width))
            py = Math.round(s.map(y, 0, 10.1, fern.img.height, 0))
            fern.oldPts[i] = [px, py]
        }

        varyFernParams(fern.transformations)

        fern.img.updatePixels()
    }

    function initFern(fern) {
        fern.oldPts = new Array(fern.numPts)
        for (let i=0; i<fern.numPts; i++) {
            fern.oldPts[i] = [0,0]
        }
        fern.init = true
    }

    function drawRandomNextPoint(x, y, img) {
        let index = (x + y * img.width) * 4;
        img.pixels[index + 0] = x
        img.pixels[index + 1] = s.random(255)
        img.pixels[index + 2] = y
        img.pixels[index + 3] = 100
    }

    function drawRandom(img) {
        img.loadPixels()
        let x=0, y=0
        for (let i=0; i<s.height; i++) {
            for (let j=0; j<s.width; j++) {
                x = Math.round(s.random(s.width))
                y = Math.round(s.random(s.height))
                drawRandomNextPoint(x, y, img)
            }
        }
        img.updatePixels()
    }

    s.draw = () => {

        s.clear()
        if (!patterns.fern.init) { initFern(patterns.fern) }
        drawFern(patterns.fern)
        s.image(patterns.fern.img, s.width/3, s.height/3)

        drawRandom(patterns.random.img)
        s.image(patterns.random.img, 0, 0)
    }
}
