<template>
  <div>
    <h1>Audio</h1>
    <br />Connect To :
    <input type="text" v-model="peerConnectTo" />
    <button @click="connectPeer">connect</button>
    <button @click="Mute = !Mute">Mute</button>

    <hr />

    <button @click="peerCall">start Steam</button>

    <p>Your Video</p>

    <video ref="video" style="max-height: 300px; max-width: 400px;"></video>
  </div>
</template>
<script>
import Peer from "peerjs";
export default {
  name: "Server",
  data: () => ({
    peer: null,
    Mute: false,
    peerId: "audio_1",
    peerConnectTo: "audio_2",
  }),
  created() {
    this.initPeer();
  },
  methods: {
    initPeer() {
      this.peer = new Peer(this.peerId);
      this.peer.on("open", function (id) {
        let peerId = id;
        console.log("Ask your friend to join using your peer ID: " + peerId);
      });
      this.peer.on("error", function (err) {
        console.log("" + err);
      });
    },

    connectPeer() {
      let conn = this.peer.connect(this.peerConnectTo);
      // on open will be launch when you successfully connect to PeerServer
      conn.on("open", function () {
        // here you have conn.id
        conn.send("hi! i'm server");
      });

      this.peer.on("connection", function (conn) {
        conn.on("data", function (data) {
          console.log("server receive : ", data);
        });
      });
      this.peer.on("call", this.peerCall);
    },
     async checkForVideoAudioAccess (){
         try {
             const cameraResult = await navigator.permissions.query({ name: 'camera' });
          // The state property may be 'denied', 'prompt' and 'granted'
          this.isCameraAccessGranted = cameraResult.state !== 'denied';

          const microphoneResult = await navigator.permissions.query({ name: 'microphone' });
          this.isMicrophoneAccessGranted = microphoneResult.state !== 'denied';
        } catch(e) {
          console.error('An error occurred while checking the site permissions', e);
        }

        return true;
        

     },

    async peerCall() {
        await this.checkForVideoAudioAccess()
      let stream = await navigator.mediaDevices.getUserMedia({
        video: !this.isCameraAccessGranted,
        audio: !this.isMicrophoneAccessGranted,
      });
      let call = this.peer.call(this.peerConnectTo, stream);

      call.on("stream", (remoteStream) => {
        let video = this.$refs["video"];
        video.srcObject = remoteStream;
        video.play();
      });
    },
  },
};
</script>
