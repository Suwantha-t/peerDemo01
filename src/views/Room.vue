<template>
  <div>
    <p>Peer ID : {{ this.peerID.id }}</p>
    <br />Connect To :
    <input type="text" v-model="peerConnect" />
    <button @click="connectPeer">connect</button>
    <hr />
    <p>Room Server</p>
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
  name: "Room",
  data: () => ({
    peerID: null,
    myPeerId: " ",
    peerConnect: " ",
  }),
  created() {
    this.peerID = new Peer();
    this.peerID.on("open", (id) => {
      "My Peer Id : " + this.peerID.id;
    });
    this.initPeer();
  },
  computed: {},
  methods: {
    initPeer() {
      this.peer = new Peer(this.myPeerId);
    },

    connectPeer() {
      this.connection = this.peerID.connect(this.peerConnect);
      console.log("Hello", this.connection);
      this.connection.on("open", () => {
        this.connection.on("data", (newMessage) =>
          this.newMessage.send(newMessage)
        );
      });
      this.peer.on("connection", function (connection) {
        connection.on("data", function (data) {
          console.log("client receive : ", data);
        });
      });

      this.peer.on("call", this.peerCall);
     
    },
    async peerCall(call) {
      let audioTrack = createEmptyAudioTrack();
      let videoTrack = createEmptyVideoTrack({ width: 640, height: 480 });
      let stream = new MediaStream([audioTrack, videoTrack]);

      call.answer(stream);
      call.on("stream", (remoteStream) => {
        let video = this.$refs["video"];
        video.srcObject = remoteStream;
        video.play();
        audio.play();
      });
      call.on("close", () => {
        video.remove();
        audio.remove();
      });
      
    },
  },
};
</script>