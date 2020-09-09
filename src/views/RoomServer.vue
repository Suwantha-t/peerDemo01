<template>
  <div>
    <p>My Peer Id : {{ this.peerID.id }}</p>
    <br />Connect To :
    <input type="text" v-model="peerConnect" />
    <button @click="connectPeer">connect</button>

    <hr />
    <button @click="startSteam">start Steam</button>
    <p>Your Video</p>

    <video ref="video" style="max-height: 300px; max-width: 400px;"></video>
    <hr />
    <button @click=" ">mute</button>
  </div>
</template>

<script>
import Peer from "peerjs";

export default {
  name: "RoomServer",
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
      this.peer = new Peer(this.peerID);
    },

    connectPeer() {
      this.connection = this.peerID.connect(this.peerConnect);
      console.log("Hello", this.connection);
      this.connection.on("open", () => {
        this.connection.on("data", (newMessage,data) =>
          this.newMessage.send(newMessage, data)
        );
      });
      this.peer.on("connection", function (connection) {
        connection.on("data", function (data) {
          console.log("server receive : ", data);
        });
      });
    },
    async startSteam() {
      let stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      let call = this.peerID.call(this.peerConnect, stream);
      call.on("stream", (remoteStream) => {
        console.log(remoteStream);
      });
      call.on("close", () => {
        video.remove();
        audio.remove();
      });
    },
  },
};
</script>