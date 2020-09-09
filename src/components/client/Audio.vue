<template>
  <div>
    <h1>Audio</h1>
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

export default {
  name: "Client",
  data: () => ({
    peer: null,
    
    peerId: "audio_2",
    peerConnectTo: "audio_1",
    
  }),
  created() {
    this.initPeer();
  },
  methods: {
    initPeer() {
      this.peer = new Peer(this.peerId);
    },
    
    
    connectPeer() {
      //this.initPeer();
      let conn = this.peer.connect(this.peerConnectTo);
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

      this.peer.on("call", this.peerCall);
    },

    async peerCall(call) {
        // await this.checkForVideoAudioAccess()
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        let video = this.$refs["video"];
        video.srcObject = remoteStream;
        video.play();
        
      });
      
    },
    
  },
};
</script>
