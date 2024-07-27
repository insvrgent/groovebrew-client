import React, { useState, useEffect, useRef } from "react";
import API_BASE_URL from "../config.js";
import "./MusicPlayer.css";
import MusicComponent from "./MusicComponent";

export function MusicPlayer({ socket, shopId, user, isSpotifyNeedLogin }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [trackLength, setTrackLength] = useState(0);
  const [expanded, setExpanded] = useState(false); // State for expansion

  const [songName, setSongName] = useState("");
  const [debouncedSongName, setDebouncedSongName] = useState(songName);
  const [currentSong, setCurrentSong] = useState([]);
  const [songs, setSongs] = useState([]);
  const [queue, setQueue] = useState([]);
  const [paused, setPaused] = useState([]);

  const [lyrics, setLyrics] = useState([]);
  const [currentLines, setCurrentLines] = useState({
    past: [],
    present: [],
    future: [],
  });
  const [lyric_progress_ms, setLyricProgressMs] = useState(0);

  const [subtitleColor, setSubtitleColor] = useState("black");
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const getDominantColor = async (imageSrc) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          ).data;
          const length = imageData.length;
          let totalR = 0,
            totalG = 0,
            totalB = 0;

          for (let i = 0; i < length; i += 4) {
            totalR += imageData[i];
            totalG += imageData[i + 1];
            totalB += imageData[i + 2];
          }

          const averageR = Math.round(totalR / (length / 4));
          const averageG = Math.round(totalG / (length / 4));
          const averageB = Math.round(totalB / (length / 4));

          resolve({ r: averageR, g: averageG, b: averageB });
        };

        img.onerror = (error) => {
          reject(error);
        };
      });
    };

    const fetchColor = async () => {
      if (
        currentSong.item &&
        currentSong.item.album &&
        currentSong.item.album.images[0]
      ) {
        const imageUrl = currentSong.item.album.images[0].url;
        try {
          const dominantColor = await getDominantColor(imageUrl);
          // Calculate luminance (YIQ color space) to determine if subtitle should be black or white
          const luminance =
            (0.299 * dominantColor.r +
              0.587 * dominantColor.g +
              0.114 * dominantColor.b) /
            255;
          if (luminance > 0.5) {
            setSubtitleColor("black");
          } else {
            setSubtitleColor("white");
          }
          setBackgroundImage(imageUrl);
        } catch (error) {
          console.error("Error fetching or processing image:", error);
        }
      }
    };

    fetchColor();
  }, [currentSong]);

  useEffect(() => {
    if (!socket) return;

    socket.on("searchResponse", (response) => {
      console.log(response);
      setSongs(response);
    });

    socket.on("updateCurrentSong", (response) => {
      setCurrentSong(response);
      setCurrentTime(response.progress_ms / 1000); // Convert milliseconds to seconds
      setLyricProgressMs(response.progress_ms);
      setTrackLength(response.item.duration_ms / 1000);
    });

    socket.on("updateQueue", (response) => {
      setQueue(response);
      console.log(response);
    });

    socket.on("updatePlayer", (response) => {
      setPaused(response.decision);
    });

    socket.on("updateLyrics", (response) => {
      setLyrics(response);
      console.log(response);
      setCurrentLines({
        past: [],
        present: [],
        future: [],
      });
    });

    return () => {
      socket.off("searchResponse");
    };
  }, [socket]);

  useEffect(() => {
    // Simulate progress every 100ms
    const interval = setInterval(() => {
      setLyricProgressMs((prevProgress) => prevProgress + 100);
    }, 100);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  useEffect(() => {
    if (lyrics == null) return;
    const pastLines = lyrics.filter(
      (line) => line.startTimeMs < lyric_progress_ms,
    );
    const presentLines = lyrics.filter(
      (line) => line.startTimeMs > lyric_progress_ms,
    );
    const futureLines = lyrics.filter(
      (line) => line.startTimeMs > lyric_progress_ms,
    );

    setCurrentLines({
      past: pastLines.slice(-2, 1), // Get the last past line
      present: pastLines.slice(-1),
      future: futureLines.slice(0, 1), // Get the first future line
    });
  }, [lyrics, lyric_progress_ms]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSongName(songName);
    }, 300);

    // Cleanup function to clear the timeout if songName changes
    return () => {
      clearTimeout(handler);
    };
  }, [songName]);

  useEffect(() => {
    if (socket != null && debouncedSongName) {
      socket.emit("searchRequest", { shopId, songName: debouncedSongName });
    }
  }, [debouncedSongName, shopId, socket]);

  const handleInputChange = (event) => {
    setSongName(event.target.value);
  };

  const onRequest = (trackId) => {
    const token = localStorage.getItem("auth");
    if (socket != null && token) {
      socket.emit("songRequest", { token, shopId, trackId });
      setSongName("");
    }
  };

  const onDecision = (trackId, vote) => {
    const token = localStorage.getItem("auth");
    if (socket != null && token)
      socket.emit("songVote", { token, shopId, trackId, vote });
  };

  const handlePauseOrResume = (trackId, vote) => {
    const token = localStorage.getItem("auth");
    if (socket != null && token) {
      socket.emit("playOrPause", {
        token,
        shopId,
        action: paused ? "pause" : "resume",
      });
      console.log(paused);
      setPaused(!paused);
    }
  };

  const handleSpotifyAuth = () => {
    const token = localStorage.getItem("auth");
    let nextUrl = ""; // Use 'let' since the value will change
    if (isSpotifyNeedLogin) {
      nextUrl = API_BASE_URL + `/login?token=${token}&cafeId=${shopId}`;
    } else {
      nextUrl = API_BASE_URL + `/logout?token=${token}&cafeId=${shopId}`;
    }
    window.location.href = nextUrl;
  };

  const handleLogin = () => {
    // navigate(`/login/${shopId}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prevTime) =>
        prevTime < trackLength ? prevTime + 1 : prevTime,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [trackLength]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    // Ensure seconds and milliseconds are always displayed with two and three digits respectively
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${minutes}:${formattedSeconds}`;
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const expandableContainerRef = useRef(null);

  useEffect(() => {
    if (expanded && expandableContainerRef.current) {
      expandableContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [expanded]);

  return (
    <div className={`music-player ${expanded ? "expanded" : ""}`}>
      <div
        className="current-bgr"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        {currentLines.past.map((line, index) => (
          <div className="past" style={{ color: subtitleColor }} key={index}>
            <p>{line.words}</p>
          </div>
        ))}
        {currentLines.present.map((line, index) => (
          <div className="present" style={{ color: subtitleColor }} key={index}>
            <p>{line.words}</p>
          </div>
        ))}
        {currentLines.future.map((line, index) => (
          <div className="future" style={{ color: subtitleColor }} key={index}>
            <p>{line.words}</p>
          </div>
        ))}
      </div>

      <div className="current-info">
        <div className="current-name">
          {currentSong.item && currentSong.item.name
            ? currentSong.item.name
            : "Awaiting the next hit"}
        </div>
        <div className="current-artist">
          {currentSong.item &&
          currentSong.item.album &&
          currentSong.item.album.images[0] &&
          currentSong.item.artists[0].name
            ? currentSong.item.artists[0].name
            : "Drop your hits below"}
        </div>
        <div className="progress-container">
          <div
            className="current-time"
            style={{ visibility: currentSong.item ? "visible" : "hidden" }}
          >
            {formatTime(currentTime)}
          </div>
          <input
            type="range"
            min="0"
            max={trackLength}
            value={currentTime}
            className="progress-bar"
            style={{ visibility: currentSong.item ? "visible" : "hidden" }}
            disabled
          />
          <div
            className="track-length"
            style={{ visibility: currentSong.item ? "visible" : "hidden" }}
          >
            {formatTime(trackLength)}
          </div>
        </div>
      </div>
      <div
        className={`expandable-container ${expanded ? "expanded" : ""}`}
        ref={expandableContainerRef}
      >
        {user.cafeId != null && user.cafeId == shopId && (
          <div className="auth-box">
            <input
              type="text"
              placeholder={
                isSpotifyNeedLogin ? "Login Spotify" : "Logout Spotify"
              }
              onClick={handleSpotifyAuth}
            />
          </div>
        )}
        <div className="search-box">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="search-icon"
          >
            <path d="M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={songName}
            onChange={handleInputChange}
          />
        </div>

        {songName != "" &&
          songs.map((song, index) => (
            <MusicComponent
              key={index}
              song={song}
              min={0}
              max={100}
              onDecision={(e) => onRequest(song.trackId)}
            />
          ))}
        {songName == "" &&
          queue.length > 0 &&
          queue.map((song, index) => (
            <MusicComponent
              key={index}
              song={song}
              min={-100}
              max={100}
              onDecision={(vote) => onDecision(song.trackId, vote)}
            />
          ))}
        {songName == "" && queue.length < 1 && (
          <div className="rectangle">
            <div className="diagonal-text">No Beats Ahead - Drop Your Hits</div>
          </div>
        )}
        {songName == "" && queue.length > 0 && queue.length < 3 && (
          <div className="rectangle">
            <div className="diagonal-text">Drop Your Hits</div>
          </div>
        )}
      </div>
      <div className="expand-button" onClick={toggleExpand}>
        <h5>
          {expanded
            ? "collapse"
            : currentSong.item &&
                currentSong.item.album &&
                currentSong.item.album.images[0] &&
                currentSong.item.artists[0]
              ? "expand"
              : "request your song"}
        </h5>
      </div>
    </div>
  );
}
