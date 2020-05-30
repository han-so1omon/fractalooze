import monkeySampleStatic from '../../../assets/samples/monkey-init.gif'
import monkeySampleAnimated from '../../../assets/samples/monkey-grayscale-animated.gif'
import leafbugSampleStatic from '../../../assets/samples/leafbug_palomino-init-reduced.gif'
import leafbugSampleAnimated from '../../../assets/samples/leafbug_palomino-grayscale-animated.gif'
import errcsoolSampleStatic from '../../../assets/samples/errcsool-init-reduced.gif'
import errcsoolSampleAnimated from '../../../assets/samples/errcsool-grayscale-animated.gif'
import southamericaSampleStatic from '../../../assets/samples/south_america_map-init-reduced.gif'
import southamericaSampleAnimated from '../../../assets/samples/south_america_map-grayscale-animated.gif'

export default {
    compressionCanvas: {
        show: true,
        image: { file: undefined, path: monkeySampleStatic },
        showAnimation: true,
    },
    compressionAnimation: { file: undefined, path: monkeySampleAnimated },
    samples: [
        { static: monkeySampleStatic, animation: monkeySampleAnimated },
        { static: leafbugSampleStatic, animation: leafbugSampleAnimated },
        { static: errcsoolSampleStatic, animation: errcsoolSampleAnimated },
        { static: southamericaSampleStatic, animation: southamericaSampleAnimated },
    ],
    bgndColor: '#ddd',
}
