import React, { useState, useContext } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Modal from '@material-ui/core/Modal'

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'
import UploadImg from '../UploadImg'

const useStyles = makeStyles(theme => ({
    flex: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'space-around',
        justifyContent: 'center',
        '& > *': {
            margin: theme.spacing(1),
        }
    }
}))

export default function Sample() {
    const classes = useStyles()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const dispatch = useContext(AppDispatchContext)
    const {
        samples,
    } = useContext(AppStateContext)
    const theme = useTheme()

    function openModal() {
        setModalIsOpen(true)
    }

    function closeModal() {
        setModalIsOpen(false)
    }

    function selectSample(s) {
        dispatch({
            type: 'SET_COMPRESSION_CANVAS',
            payload: {
                show: true,
                image: { file: undefined, path: s.static },
                showAnimation: true,
                animation: { file: undefined, path: s.animation }
            }
        })

        closeModal()
    }

    //TODO memoize this
    let sampleElements
    if (samples !== undefined) {
        sampleElements = (
            <Box
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    position: 'absolute',
                    backgroundColor: theme.palette.background.popup,
                    boxShadow: theme.shadows[5],
                    padding: theme.spacing(2),
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <Box
                    className={classes.flex}
                >
                    {samples.map(s => (
                        <Paper
                            key={s.static}
                        >
                            <input
                                type="image"
                                src={s.static}
                                width="100%"
                                height="100%"
                                onClick={() => {
                                    selectSample(s)
                                }}
                                alt="select image"
                            />
                        </Paper>
                    ))}
                </Box>
                <Box>
                    <UploadImg closeModal={closeModal}/>
                </Box>
            </Box>
        )
    }

    return (
        <Box
            className={classes.flex}
        >
            <Button variant="contained" onClick={openModal}>Sample</Button>
            <Modal
                open={modalIsOpen}
                onClose={closeModal}
                aria-labelledby="Sample compression"
                aria-describedby="Perform image compression"
            >
                {sampleElements}
            </Modal>
        </Box>
    )
}
