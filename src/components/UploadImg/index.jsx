import React, { useState, useContext } from 'react'
import ImageUploader from 'react-images-upload'
import { saveAs } from 'file-saver'

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'

export default function UploadImg(props) {
    const dispatch = useContext(AppDispatchContext)

    async function onDrop(image) {
        props.closeModal()
        dispatch({
            type: 'SET_COMPRESSION_CANVAS',
            payload: {
                show: true,
                image: { file: image[0], path: URL.createObjectURL(image[0]) },
                showAnimation: true,
                animation: undefined,
            }
        })
        let formData = new FormData()
        formData.append('image', image[0])
        let response = await fetch("https://fractalooze.netlify.app/.netlify/functions/fractal-compress",{
            method: 'POST',
            mode: 'cors',
            /*
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            */
            body: formData,
        })
        let cryptoArr = new Uint8Array(16)
        let body = await response.json()
        console.log(body)
        let buf = new Buffer(body.Response.image, 'base64')
        let file = new File(
            [buf],
            'animation-' + Math.random().toString(36).substring(7) + '.gif',
            {type:'image/gif'}
        )
        console.log(file)
        let fileLink = URL.createObjectURL(file)
        let compressionAnimation = { file: file, path: fileLink }
        dispatch({
            type: 'SET_COMPRESSION_ANIMATION',
            payload: compressionAnimation
        })
    }

    return (
        <ImageUploader
            {...props}
            withIcon={false}
            withLabel={false}
            fileContainerStyle={{boxShadow: 'none'}}
            buttonStyles={{fontSize: "36px"}}
            buttonText={'create thumbnail'}
            onChange={onDrop}
            imgExtension={[".jpg",".gif",".png"]}
            maxFileSize={400000}
            singleImage={true}
        />
    )
}
