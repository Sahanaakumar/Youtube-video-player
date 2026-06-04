"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef } from "react"
import useWatchSession from "@/hooks/useWatchSession"
import MetricsTable from "./metricsTable"

const FASTAPI_ENDPOINT = `${process.env.NEXT_PUBLIC_API_URL}/api/video-events/`

function WatchContent() {
    const searchParams = useSearchParams()
    const video_id = searchParams.get('v')
    const startTime = parseInt(searchParams.get('t')) || 0
    const session_id = useWatchSession(video_id)
    const intervalRef = useRef(null)
    const iframeRef = useRef(null)

    useEffect(() => {
        if (!video_id || !session_id) return

        // send a basic event every 5 seconds while on the page
        intervalRef.current = setInterval(async () => {
            try {
                await fetch(FASTAPI_ENDPOINT, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Session-ID': session_id
                    },
                    body: JSON.stringify({
                        is_ready: true,
                        video_id: video_id,
                        video_title: "",
                        current_time: 0,
                        video_state_label: "PLAYING",
                        video_state_value: 1
                    })
                })
            } catch (e) {
                console.log(e)
            }
        }, 5000)

        return () => clearInterval(intervalRef.current)
    }, [video_id, session_id])

    if (!video_id) return <div>No video ID provided</div>

    return (
        <div className="w-[50vw] mx-auto h-full px-5 py-4">
            <div className="relative w-full pt-[56.25%] bg-black">
                <iframe
                    ref={iframeRef}
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video_id}?start=${startTime}&autoplay=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            <MetricsTable videoId={video_id} />
        </div>
    )
}

export default function WatchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <WatchContent />
        </Suspense>
    )
}
