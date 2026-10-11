"use client";

import Image from "next/image";
import { useState } from "react";

export function AgenticSreRecording() {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className="sre-recording">
      <div className="sre-recording-frame">
        <Image
          src={`/projects/agentic-sre/${playing ? "investigation-canvas.gif" : "investigation-canvas-dark.png"}`}
          width={1080}
          height={675}
          unoptimized={playing}
          alt={
            playing
              ? "Testbed recording: selecting a causal node opens its evidence, then scopes the Evidence view while the investigation canvas stays visible"
              : "Investigation canvas preview; play the recording to see shared selection across views"
          }
          sizes="(max-width: 800px) 100vw, 1000px"
        />
      </div>
      <figcaption>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => setPlaying(!playing)}
          aria-pressed={playing}
        >
          {playing ? "Stop recording" : "Play testbed recording (~30 s)"}
        </button>
        <p>
          Recorded on a copy of a held-out lab run: packet loss on
          payment-service. The engine identifies the NetworkChaos experiment as
          a supported possible cause and keeps the diagnosis AMBIGUOUS. This is
          testbed evidence, not a customer incident.
        </p>
      </figcaption>
    </figure>
  );
}
