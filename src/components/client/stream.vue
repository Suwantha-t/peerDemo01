<template>
  <div>
    <h1>Client</h1>
    <br />Server id:
    <input type="text" v-model="peerConnectTo" disabled />
    <br />My id:
    <input type="text" v-model="peerId" />
    <br />
    <button @click="connectPeer">connect</button>

    <hr />
    
    <p>Server's Video</p>
    <video ref="video" style="max-height: 300px; max-width: 400px;"></video>
    
  </div>
</template>

<script>
import Peer from "peerjs";
export const createEmptyAudioTrack = () => {
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const dst = oscillator.connect(ctx.createMediaStreamDestination());
  oscillator.start();
  const track = dst.stream.getAudioTracks()[0];
  return Object.assign(track, { enabled: false });
};

export const createEmptyVideoTrack = ({ width, height }) => {
  const canvas = Object.assign(document.createElement("canvas"), {
    width,
    height,
  });
  canvas.getContext("2d").fillRect(0, 0, width, height);

  const stream = canvas.captureStream();
  const track = stream.getVideoTracks()[0];

  return Object.assign(track, { enabled: false });
};

export default {
  name: "Client",
  data: () => ({
    peer: null,
    
    peerId: "Stream_2",
    peerConnectTo: "Stream_1",
    
  }),
  created() {
    //this.initPeer();
  },
  methods: {
    initPeer() {
      this.peer = new Peer(this.peerId);
    },
    
    
    connectPeer() {
      this.initPeer();
      let conn = this.peer.connect(this.peerConnectTo);
      console.log('conn',conn)

      // on open will be launch when you successfully connect to PeerServer
      conn.on("open", function () {
        // here you have conn.id
        conn.send("hi! i'm client");
      });

      this.peer.on("connection", function (conn) {
        conn.on("data", function (data) {
          console.log("client receive : ", data);
        });
      });

      this.peer.on("call",  (call) =>  {
            this.peerCall(call)
      })
    },
    

    async peerCall(call) {
      
      let audioTrack = createEmptyAudioTrack();
      let videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
      let stream = new MediaStream([audioTrack, videoTrack]);
      // let stream = await navigator.mediaDevices.getDisplayMedia({
      //   video: false,
      // });
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        console.log(remoteStream,"vioe");
        let video = this.$refs["video"];
        video.srcObject = remoteStream;
        video.play();
        
      });
      
    },
    
  },
};
</script>
