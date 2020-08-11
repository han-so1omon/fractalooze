import React, { useState, useContext } from 'react'
import ImageUploader from 'react-images-upload'
import { saveAs } from 'file-saver'

import { AppDispatchContext, AppStateContext } from '../App/AppStateProvider'

export default function UploadImg(props) {
    const dispatch = useContext(AppDispatchContext)

    async function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }

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
        const imgBase64 = await toBase64(image[0])
        if (imgBase64 instanceof Error) {
        let compressionAnimation =
            dispatch({
                type: 'SET_COMPRESSION_ANIMATION',
                payload: { file: undefined, path: undefined, isError: true }
            })
            return
        }
        let response = await fetch(
            //"http://192.168.1.23:4567/restapis/ighr1bypdx/test/_user_request_/fractal-compress-func",
            "https://fractalooze.netlify.app/.netlify/functions/fractal-compress",
            {
                method: 'POST',
                mode: 'cors',
                body: imgBase64,
            }
        )
        console.log(response)
        let cryptoArr = new Uint8Array(16)
        let body = await response.text()
        let buf = new Buffer(body, 'base64')
        let file = new File(
            [buf],
            'animation-' + Math.random().toString(36).substring(7) + '.gif',
            {type:'image/gif'}
        )
        let fileLink = URL.createObjectURL(file)
        let compressionAnimation = { file: file, path: fileLink, isError: false }
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
            buttonStyles={{
                fontSize: 'medium',
            }}
            buttonText={'create thumbnail'}
            onChange={onDrop}
            imgExtension={[".jpg",".gif",".png"]}
            maxFileSize={400000}
            singleImage={true}
        />
    )
}
