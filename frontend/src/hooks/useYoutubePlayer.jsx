"use client"

import { useCallback, useEffect, useState, useRef } from "react";

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

const useYouTubePlayer = (videoId, elementId, startTime=0, interval=5000) => {
    const playerElementId = elementId || "video-player"
    const playerRef = useRef(null)
    const readyRef = useRef(false)
    const [playerState, setPlayerState] = useState({
        isReady: false,
        current_time: 0,
        video_title: '',
        video_state_label: '',
        video_state_value: -10,
    })

    const handleOnStateChange = useCallback(() => {
        if (!playerRef.current || !playerRef.current.getPlayerState) return;
        const YTPlayerStateObj = window.YT.PlayerState
        const playerInfo = playerRef.current.playerInfo
        const videoData = playerRef.current.getVideoData()
        const currentTimeSeconds = playerRef.current.getCurrentTime()
        const videoStateValue = playerInfo.playerState
        const videoStateLabel = getKeyByValue(YTPlayerStateObj, videoStateValue)
        setPlayerState(prevState => ({
            ...prevState,
            video_title: videoData.title,
            current_time: currentTimeSeconds,
            video_state_label: videoStateLabel,
            video_state_value: videoStateValue,
        }))
    }, [])

    const handleOnReady = useCallback(() => {
        readyRef.current = true
        setPlayerState(prevState => ({...prevState, isReady: true}))
        handleOnStateChange()
    }, [handleOnStateChange])

    useEffect(() => {
        const el = document.getElementById(playerElementId)
        if (el) el.innerHTML = ''
        readyRef.current = false

        const load = () => {
            playerRef.current = new window.YT.Player(playerElementId, {
                height: '390',
                width: '640',
                videoId: videoId,
                playerVars: { playsinline: 1, start: startTime },
                events: {
                    onReady: handleOnReady,
                    onStateChange: handleOnStateChange
                }
            })
        }

        if (window.YT && window.YT.Player) {
            load()
        } else {
            const tag = document.createElement('script')
            tag.src = "https://www.youtube.com/iframe_api"
            document.head.appendChild(tag)
            window.onYouTubeIframeAPIReady = load
        }
    }, [videoId])

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (readyRef.current && playerRef.current && playerRef.current.getPlayerState) {
                handleOnStateChange()
            }
        }, interval)
        return () => clearInterval(intervalId)
    }, [handleOnStateChange, interval])

    return playerState
}

export default useYouTubePlayer;
