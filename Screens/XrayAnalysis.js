import React from 'react'
import { Text, View, StyleSheet,StatusBar, ActivityIndicator, TouchableOpacity, Image, Alert,Dimensions, } from 'react-native'
import * as tf from '@tensorflow/tfjs'
import { fetch } from '@tensorflow/tfjs-react-native'
import * as tf_rn from "@tensorflow/tfjs-react-native";
import Constants from 'expo-constants'
import * as jpeg from 'jpeg-js'
import * as Permissions from 'expo-permissions'
//import * as mobilenet from '@tensorflow-models/mobilenet'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import labels from '../assets/Model/HealthLabels.json';

import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

class ImageSearchScreen extends React.Component {
   state = {
     isTfReady: false,
     isModelReady:false,
     //model: false,
    
     predictions: null,
     image: null,
     modelJson : require('../assets/Model/model.json'),
     modelWeights : require('../assets/Model/weights.bin'),
     mostConfidentLabel: null,
   }

    
   

   getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    }
  }

    async componentDidMount() {
        await tf.ready()
        this.setState({
        isTfReady: true
        })
       // this.model = await mobilenet.load()
       
      // Use the bundleResorceIO IOHandler to load the model

       
        this.model = await tf.loadGraphModel(  //tf.loadLayersModel
          bundleResourceIO(this.state.modelJson, this.state.modelWeights)); 
        
        this.setState({ isModelReady: true })


        // add this
        this.getPermissionAsync()
    }



   imageToTensor(rawImageData) {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3]).expandDims();
  }

  classifyImage = async () => {
    try {
     

      const imageAssetPath = Image.resolveAssetSource(this.state.image)
  

      console.log(imageAssetPath.uri);
      const imgB64 = await FileSystem.readAsStringAsync(imageAssetPath.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer)   

      const tfImg = tf.browser.fromPixels(jpeg.decode(raw, true)).expandDims(0);
      const smallImg = await tf.image.resizeBilinear(tfImg, [224, 224]);
      const resized = tf.cast(smallImg, 'float32');
      const t4d = tf.tensor4d(Array.from(resized.dataSync()), [1, 224, 224, 3]);


      //const imageTensor = this.imageToTensor(raw);
      //console.log('imageTensor: ', imageTensor);



      const pre_image = tf.browser.fromPixels(jpeg.decode(raw, true), 3)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()
      .reverse(-1); 

      const predict_result = await this.model.predict(pre_image).data();
      console.log(predict_result);

    
      let order = Array.from(predict_result)
                      .map(function (p, i) { 
                        return {
                          probability: p,
                          className: labels[i] 
                        };
                      }).sort(function (a, b) {
                        return b.probability - a.probability;
                      }).slice(0, 2);
      var result='';
      order.forEach(function (p) {
        result +=`${p.className}: ${parseInt(Math.trunc(p.probability * 100))}% `
      });
   
      //let input = tf.zeros([1,224,224,3])
      //input[0] = imageTensor
      const predictions = await this.model.predict(t4d)

      const data = predictions.dataSync() //arraySync()

      console.log(data)
      console.log(predictions.as1D().argMax().print()) //most confident prediction
      const labelPrediction = predictions.as1D().argMax().dataSync()[0];
      this.state.mostConfidentLabel = (labels[labelPrediction]);
      this.setState({ predictions: result}) //predictions: data
     
     

    } catch (error) {
      console.log(error)
    }
  }

  selectImage = async () => {
    try {
      let response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 3]
      })
  
      if (!response.cancelled) {
        const source = { uri: response.uri }
        this.setState({ image: source })
        this.classifyImage()
      }
    } catch (error) {
      console.log(error)
    }
  }
  renderPrediction = prediction => {
    return (
      <Text key={prediction.className} style={styles.text}>
        {prediction.className}
      </Text>
    )
  }




  render() {
    const { isTfReady, isModelReady, predictions, image, mostConfidentLabel } = this.state

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <View style={styles.loadingContainer}>
          <Text style={styles.text}>
            TFJS ready? {isTfReady ? <Animatable.View
                    animation="bounceIn">
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View> : ''}
          </Text>

          <View style={styles.loadingModelContainer}>
            <Text style={styles.text}>Model ready? </Text>
            {isModelReady ? (
              <Animatable.View
              animation="bounceIn">
              <Feather 
                  name="check-circle"
                  color="green"
                  size={20}
              />
          </Animatable.View>
            ) : (
              <ActivityIndicator size='small' />
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? this.selectImage : undefined}>
          {image && <Image source={image} style={styles.imageContainer} />}

          {isModelReady && !image && (
            <Text style={styles.transparentText}>Tap to choose image</Text>
          )}
        </TouchableOpacity>
        <View style={styles.predictionWrapper}>
          {isModelReady && image && (
            <Text style={styles.text}>
                Results: {predictions ? '' : 'Analysing...'}
            </Text>
          )}
          {isModelReady &&
            predictions &&
            <Text style={styles.text}>
              {predictions}
            </Text>
             
          }
        </View>
      

        

      </View>
    )
  }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center'
    },
    loadingContainer: {
      marginTop: 80,
      justifyContent: 'center'
    },
    text: {
      color: 'black',
      fontSize: 16
    },
    loadingModelContainer: {
      flexDirection: 'row',
      marginTop: 10
    },
    imageWrapper: {
      width: 280,
      height: 280,
      padding: 10,
      borderColor: '#00BCD4',
      borderWidth: 5,
      borderStyle: 'dashed',
      marginTop: 40,
      marginBottom: 10,
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center'
    },
    imageContainer: {
      width: 250,
      height: 250,
      position: 'absolute',
      top: 10,
      left: 10,
      bottom: 10,
      right: 10
    },
    predictionWrapper: {
      height: 100,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center'
    },
    transparentText: {
      color: 'black',
      opacity: 0.7
    }
    
  })

export default ImageSearchScreen