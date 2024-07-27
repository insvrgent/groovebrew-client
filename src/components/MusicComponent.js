import React, { useState, useEffect, useRef } from 'react';
import './MusicComponent.css'; // Import CSS file
// import VinylComponent from './VinylComponent';

const MusicComponent = ({ song, min, max, onDecision }) => {
    const [backgroundColor, setBackgroundColor] = useState('rgba(0, 0, 0, 0)');
    const [currentTime, setCurrentTime] = useState(0);
    const [positionX, setPositionX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(prevTime => prevTime + 1);
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []); // Empty dependency array to run the effect only once when the component mounts

    useEffect(() => {
        const handleResize = () => {
            setPositionX(0);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleMouseDown = (event) => {
        setDragging(true);
        setStartX(event.clientX);
    };

    const handleMouseMove = (event) => {
        if (dragging && !song.set) {
            const delta = event.clientX - startX;
            const newPositionX = positionX + delta;
            const minPos = 0;
            const maxPos = containerRef.current.offsetWidth - event.target.offsetWidth;
            const xpos = Math.min(Math.max(newPositionX, minPos), maxPos);

            setPositionX(xpos);
            handleDrag(xpos);
            setStartX(event.clientX);
        }
    };

    const handleMouseUp = () => {
        setDragging(false);

        setPositionX(0);
        setBackgroundColor('transparent');

        if (positionX > 99) {
            onDecision(true);
        }
        else if (positionX < -99) {
            onDecision(false);
        }
    };

    const handleTouchStart = (event) => {
        setDragging(true);
        setStartX(event.touches[0].clientX);
    };

    const handleTouchMove = (event) => {
        if (dragging && !song.set) {
            const delta = event.touches[0].clientX - startX;
            const newPositionX = positionX + delta;
            const minPos = min;
            const maxPos = max;
            const xpos = Math.min(Math.max(newPositionX, minPos), maxPos);

            setPositionX(xpos);
            handleDrag(xpos);
            setStartX(event.touches[0].clientX);
        }
    };

    const handleTouchEnd = () => {
        setDragging(false);

        setPositionX(0);
        setBackgroundColor('transparent');

        if (positionX > 99) {
            onDecision(true);
        }
        else if (positionX < -99) {
            onDecision(false);
        }
    };

    // Helper function to convert milliseconds to mm:ss format
    const formatDuration = (durationMs) => {
        const minutes = Math.floor(durationMs / 60000);
        const seconds = ((durationMs % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleDrag = (x) => {
        const alpha = Math.min(Math.abs(x) / 90, 1);
        if (x > 0)
            setBackgroundColor(`rgba(172, 255, 189, ${alpha})`);
        else if (x < 0)
            setBackgroundColor(`rgba(255, 99, 99, ${alpha})`);
    };

    return (
        <div className="song-item"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ transform: `translateX(${positionX}px)` }}
            ref={containerRef}>
            {/* {min === 0 && max === 0 &&
                <VinylComponent
                    album={songg.image || songg.album.images[0].url}
                />} */}
            {song.set && <div className="decisionbgrnd" style={{ backgroundColor: song.bePlayed ? "green": "red" }}>
                <h1 className="decision">{song.bePlayed ? "next up" : "skipped"}</h1></div>}
            <div className="bgrnd" style={{ backgroundColor: backgroundColor }}></div>
            <img src={song.image} alt={song.name} className="song-image" />
            <div className="song-details">
                <p className="song-name">{song.name}</p>
                <p className="artist-name">{song.artist}</p>
                {min < 0 && <p className="artist-name">&lt;--- {song.disagree} no - {song.agree} yes ---&gt;</p>}
            </div>
            <p className="song-duration">{formatDuration(song.duration_ms)}</p>
        </div>
    );
};

export default MusicComponent;
