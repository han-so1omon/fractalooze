export default function (s) {
    s.state = {}
    s.dispatch = () => { }

    s.setup = () => {
        s.createCanvas(640, 600)
        s.colorMode(s.HSB)
        s.pixelDensity(1)
        s.background(51)

        /*
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < s.width; j++) {
                const hue = s.map(j, 0, s.width - 1, 0, 360)
                const sat = 100 * (i + 1) / 6
                s.stroke(hue, sat, 100)

                const top = s.height * i / 6
                const bottom = top + s.height / 6

                s.line(j, top, j, bottom)
            }
        }

        s.noLoop()
        */

        console.log('::: sketch-2 has been initialized')
    }

    s.draw = () => {
        s.loadPixels()
        for (let y=0; y<s.height; y++) {
            for (let x=0; x<s.width; x++) {
                let index = (x + y * s.width) * 4;
                s.pixels[index + 0] = x
                s.pixels[index + 1] = s.random(255)
                s.pixels[index + 2] = y
                s.pixels[index + 3] = 255
            }
        }
        s.updatePixels()
    }

    s.mouseClicked = () => {
        if (s.mouseX > 0 && s.mouseX < s.width && s.mouseY > 0 && s.mouseY < s.height) {
            const [r, g, b] = s.get(s.mouseX, s.mouseY)
            const comb = (r << 16) | (g << 8) | b
            let hex = comb.toString(16)
            while (hex.length < 6) {
                hex = '0' + hex
            }
            s.dispatch({
                type: 'SET_BGND_COLOR',
                payload: '#' + hex,
            })
        }
    }
}
