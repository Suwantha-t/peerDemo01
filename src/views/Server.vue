<template>
  <div>
    <h1>Server</h1>
    <stream></stream>
    <hr />
    <webcam></webcam>
  </div>
</template>
<script>
import Peer from "peerjs";
import stream from "../components/server/Stream";
import webcam from "../components/server/Audio"
export default {
  name: "Server",
  components: {
    stream,
    webcam
  },
  data: () => ({
    

  }),
  created() {
    
    
  },
  methods: {
    
    
  },
};
</script>
