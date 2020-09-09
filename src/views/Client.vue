<template>
  <div>
    <h1>Client</h1>
    <stream></stream>
    <hr />
    <webcam></webcam>
  </div>
</template>

<script>
import Peer from "peerjs";
import stream from "../components/client/stream";
import webcam from "../components/client/Audio"


export default {
  name: "Client",
  components:{
    stream,
    webcam
  },
  data: () => ({
    
  }),
  created() {
    //this.initPeer();
  },
  methods: {
    
    },
  
};
</script>
