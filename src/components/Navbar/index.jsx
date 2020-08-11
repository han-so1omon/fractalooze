import React from "react"
import { useTheme, makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import HomeIcon from '@material-ui/icons/Home'
import GitHubIcon from '@material-ui/icons/GitHub'

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    toolbar: {
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(0),
        background: theme.palette.primary.dark
    }
}))

export default function Navbar() {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.toolbar}>
                    <Typography variant="regular" component="h2">
                        <Link href="https://errcsool.com/portfolio" color="inherit">
                            <HomeIcon />
                        </Link>
                    </Typography>
                    <Typography variant="regular" component="h2">
                        <Link
                            href="https://errcsool.com/portfolio/fractal-image-compression"
                            color="inherit"
                            style={{
                                textDecoration: 'none'
                            }}
                        >
                            Fractal Image Compression
                        </Link>
                    </Typography>
                    <Typography variant="regular" component="h2">
                        <Link href="https://github.com/han-so1omon/fractalooze" color="inherit">
                            <GitHubIcon />
                        </Link>
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}
