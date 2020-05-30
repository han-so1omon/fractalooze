export default function (s) {
    s.state = { }
    s.dispatch = () => { }

    var patterns = {
        compressionImage: { init: true, path: undefined, img: undefined },
    }

    s.preload = () => {
        //patterns.compressionImage.img = s.createImage(250, 250)
    }

    s.setup = () => {
        s.createCanvas(600, 600)
        s.colorMode(s.HSB)
        s.pixelDensity(1)
        s.background(91)
        console.log('::: fern sketch has been initialized')
    }

    /*
    s.windowResized = () => {
        s.resizeCanvas(s.windowWidth, s.windowHeight)
    }
    */

    function drawImg(pattern, path) {
        pattern.path = path
        pattern.img = s.loadImage(path)
    }

    s.draw = () => {

        s.clear()

        if (s.state.imagePath && s.state.imagePath != patterns.compressionImage.path) {
            drawImg(patterns.compressionImage, s.state.imagePath)
        }
        if (patterns.compressionImage.img) {
            s.image(patterns.compressionImage.img, 0, 0)
        }
    }
}
