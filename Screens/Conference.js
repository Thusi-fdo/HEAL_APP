import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
//import AgoraUIKit from "agora-rn-uikit";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity} from "react-native";
//import RtcEngine, {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora'
import { Share } from "react-native";
import { WebView } from 'react-native-webview';
import { Icon } from 'react-native-elements'
export default function Conference(props) {
 
  
  const rtcProps = {
    appId: "7c76a2a208c7466db60b37882b531072",
    channel: props.route.params.channel,
  };

  const PolicyHTML = require('../opentok.html');
  const navigation = useNavigation();

  const callbacks = {
    EndCall: () => navigation.goBack(),
    
    // FullScreen: () => { /* Function Body */ },
    // SwitchCamera: () => { /* Function Body */ },
    // SwapVideo: () => { /* Function Body */ },
    // UserMuteRemoteAudio: () => { /* Function Body */ },
    // UserMuteRemoteVideo: () => { /* Function Body */ },
    // LocalMuteAudio: () => { /* Function Body */ },
    // LocalMuteVideo: () => { /* Function Body */ },
  };
  
  const localButtonStyle = {
    backgroundColor: "#78b0ff",
    borderColor: "#78b0ff",
  };
  
  const styleProps = {
    localBtnStyles: {
      muteLocalAudio: localButtonStyle,
      muteLocalVideo: localButtonStyle,
      switchCamera: localButtonStyle,
      fullScreen: localButtonStyle,
    },
  };


  const onShare = async () => {
    try {
      await Share.share({ message: props.route.params.channel });
    } catch (error) {
      console.log(error.message);
    }
  };

  



  return (
    <>
  

    <WebView
      source={{ uri:'https://tokbox.com/embed/embed/ot-embed.js?embedId=c0e09a88-f8b7-43b7-bc74-36ddda329192&room=DEFAULT_ROOM' }}  //PolicyHTML
      style={{flex: 1}}
    />
 
 
      <TouchableOpacity style={styles.shareButton}  onPress={onShare}>
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
      <View style={{backgroundColor:'rgba(52, 52, 52, 0.8)',alignItems:'center'}}>
      <View style={{flexDirection:'row'}}>
      <Icon
        reverse
        name='microphone-slash'
        type='font-awesome'
        color='#517fa4'
        size={26}
      />
       <Icon
        reverse
        name='phone-off'
        type='feather'
        color='#EC7063'
        size={26}
        onPress={() => navigation.goBack()}
      />
         <Icon
        reverse
        name='video-camera'
        type='font-awesome'
        color='#85C1E9'
        size={26}
      />
      </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    right: 0,
    width: 80,
    height: 40,
    margin: 25,
    borderRadius: 8,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#78b0ff",
  },
  shareButtonText: {
    fontSize: 16,
  },
 

});