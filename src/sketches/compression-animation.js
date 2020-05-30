export default function (s) {
    s.state = { }
    s.dispatch = () => { }

    var patterns = {
        animation : {
            img : undefined,
            compressionImages : undefined,
        }
    }

    s.preload = () => {
        patterns.animation.img = s.createImage(250, 250)
    }

    s.setup = () => {
        s.createCanvas(600, 600)
        s.colorMode(s.HSB)
        s.pixelDensity(1)
        s.background(91)
        console.log('::: animation sketch has been initialized')
    }

    /*
    s.windowResized = () => {
        s.resizeCanvas(s.windowWidth, s.windowHeight)
    }
    */

    function drawNextImage(img) {
        img.loadPixels()
        img.updatePixels()
    }

    s.draw = () => {

        if (s.state.animation) {
            console.log('whaaaaaa!')
        }
        s.clear()
        drawNextImage(patterns.animation.img)
        s.image(patterns.animation.img, 0, 0)
    }
}
