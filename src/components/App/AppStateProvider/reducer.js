export default function (state, { type, payload }) {
    switch (type) {
        case 'SET_BGND_COLOR':
            return {
                ...state,
                bgndColor: payload,
            }

        case 'SET_COMPRESSION_CANVAS':
            return {
                ...state,
                compressionCanvas: {
                    show: payload.show,
                    image: payload.image,
                    showAnimation: payload.showAnimation,
                },
                compressionAnimation: payload.animation,
            }

        case 'SET_COMPRESSION_ANIMATION':
            return {
                ...state,
                compressionAnimation: payload,
            }

        case 'PUSH_SAMPLES':
            if (state.samples == undefined) {
                state.samples = payload
            } else {
                state.samples = state.samples.concat(payload)
            }

            return {
                ...state,
                samples: payload,
            }

        default:
            return state
    }
}
