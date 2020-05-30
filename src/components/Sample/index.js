import React, { useState, useContext} from 'react'
import Modal from 'react-modal'
import styled from "styled-components"

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'
import Button from '../Button'
import UploadImg from '../UploadImg'
import BlockGrid from '../BlockGrid'

const Styles = styled.div`
    padding: 1rem;
    margin: "20px 0 40px"; 

    .boxed {
        display: inline-block;
        border: 3px solid #616161;
        border-radius: 4px;
        background: #DDDDDD;
    }

    .container {
        text-align: center;
        vertical-align: center;
        width: 100px;
        height: auto;
    }

    input {
        max-width: 100%;
        max-height: 100%;
    }

    .centered {
        margin: auto;
    }
`

const customStyles = {
    content : {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '60%',
        height: '36%',
    }
}

export default function Sample() {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const dispatch = useContext(AppDispatchContext)
    const {
        samples,
    } = useContext(AppStateContext)

    function openModal() {
        setModalIsOpen(true)
    }

    function closeModal() {
        setModalIsOpen(false)
    }

    function selectSample(s) {
        dispatch({
            type: 'SET_COMPRESSION_CANVAS',
            payload : {
                show: true,
                image: { file: undefined, path: s.static },
                showAnimation: true,
                animation: { file: undefined, path: s.animation },
            }
        })

        closeModal()
    }
    
    //TODO memoize this
    let sampleElements = undefined
    if (samples != undefined) {
        sampleElements = samples.map((s, idx) => {
            return (
                <div key={s.static} className="boxed container" data-grid={{x: 3*idx, y: 1, w: 1, h: 1}}>
                    <input
                        type="image"
                        src={s.static}
                        width="100%"
                        height="100%"
                        onClick={()=>{selectSample(s)}}
                    />
                </div>
            )
        })
    }

    return (
        <Styles>
            <div className="centered">
                <Button onClick={openModal} fontSize="42px">Sample</Button>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Sample compression"
                >
                    <Styles>
                        {sampleElements && 
                        <BlockGrid elements={sampleElements} cols={12} width={100} rowHeight={75}/>
                        }
                    </Styles>
                    <UploadImg closeModal={closeModal}/>
                </Modal>
            </div>
        </Styles>
    )
}
