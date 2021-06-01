import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView,View, Text, TouchableOpacity, Image, Button, StatusBar  } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
function WelcomeScreen(props) {
    return (
      //  <ImageBackground source={require('../assets/Doc.jpg')}></ImageBackground>
        //safeareaview for phones with camera in the screen top cut outs
    <SafeAreaView style={[styles.container, styles.Button]}>
    {/*<Text>Hello this is a test</Text>*/}
    <Image source={require('../assets/Doc.png')}/>

    <View style={styles.button}>
              
                <TouchableOpacity
                    onPress={() => props.navigation.navigate('Signin')}
                    
                >
                    <LinearGradient
                    colors={['#29323c', '#485563']}
                    start={[0, 1]}
                    end={[1, 0]}  
                    style={styles.signIn}
      
                >
                    <Text style={[styles.textSign, {
                        color: '#FFF'
                    }]}>Get Started for Free</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
   
    <StatusBar style="auto" />
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container:{
    flex: 1, //takes the entire screen to fill either vertical or horizontal
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: 'center',
    marginTop: 50
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor:'#FFF',
    padding:25,
    paddingHorizontal:60

},
textSign: {
  fontSize: 18,
}
});

export default WelcomeScreen;
