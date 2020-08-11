import { red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#767676',
            dark: '#000000',
        },
        secondary: {
            main: '#b8b8b8',
            inner: '#cccccc',
        },
        error: {
            main: red.A400,
        },
        background: {
            default: '#323232',
            popup: '#fff',
        },
    },
})

export default theme
