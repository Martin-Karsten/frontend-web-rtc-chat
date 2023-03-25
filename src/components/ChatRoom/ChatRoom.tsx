import { MutableRefObject, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080/chat', {
  path: `/chat`,
});

export function ChatRoom() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection>(new RTCPeerConnection());
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [offerVisible, setOfferVisible] = useState(true);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [status, setStatus] = useState(`Make a call now`);

  useEffect(() => {
    socket.on(`connection-success`, (success) => {
      console.log(success);
    });

    socket.on(`sdp`, (data) => {
      console.log(data);

      pc.current.setRemoteDescription(new RTCSessionDescription(data.sdp));

      if (data.sdp.type === `offer`) {
        setOfferVisible(false);
        setAnswerVisible(true);
        setStatus(`Incoming Call.....`);
      } else {
        setStatus(`Call Established`);
      }
    });

    socket.on(`candidate`, (candidate) => {
      pc.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    const constrains = {
      audio: false,
      video: true,
    };

    navigator.mediaDevices
      .getUserMedia(constrains)
      .then((stream) => {
        if (localVideoRef?.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          _pc.addTrack(track, stream);
        });
      })
      .catch((e) => {
        console.log(e);
      });

    const _pc = new RTCPeerConnection();
    _pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log(JSON.stringify(e.candidate));

        sendToPeer(`candidate`, e.candidate);
      }
    };

    _pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    _pc.ontrack = (e) => {
      if (remoteVideoRef?.current) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };

    pc.current = _pc;
  }, []);

  const sendToPeer = (eventType: string, payload: unknown) => {
    socket.emit(eventType, payload);
  };

  const processSdp = (sdp: RTCLocalSessionDescriptionInit) => {
    pc.current.setLocalDescription(sdp);

    sendToPeer(`sdp`, { sdp });
  };

  const createOffer = () => {
    pc.current
      .createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
      .then((sdp) => {
        processSdp(sdp);
        setOfferVisible(false);
        setStatus(`Calling`);
      })
      .catch((e) => console.log(e));
  };

  const createAnswer = () => {
    pc.current
      .createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
      .then((sdp) => {
        console.log(`THEN`);
        processSdp(sdp);
        setAnswerVisible(false);
        setStatus(`Call Established`);
      })
      .catch((e) => console.log(e));
  };

  const showHideButtons = () => {
    if (offerVisible) {
      return <button onClick={createOffer}>Call</button>;
    } else if (answerVisible) {
      return <button onClick={createAnswer}>Answer</button>;
    }
  };

  return (
    <div>
      <div className="flex">
        <video
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: 'black',
          }}
          ref={localVideoRef}
          autoPlay
        ></video>

        <video
          style={{
            width: 240,
            height: 240,
            margin: 5,
            backgroundColor: 'black',
          }}
          ref={remoteVideoRef}
          autoPlay
        ></video>
      </div>

      {showHideButtons()}

      <div>{status}</div>
    </div>
  );
}
