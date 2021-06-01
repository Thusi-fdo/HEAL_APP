import React,{Component} from 'react';
import CheckBox from '@react-native-community/checkbox';
import { View, Text, TouchableOpacity,FlatList,StyleSheet,Clipboard} from 'react-native';
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";


export default class FrCreateScreen extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
        timeSlots: [
            { id: '1', time: '10am - 11am' },
            { id: '2', time: '11am - 12pm' },
            { id: '3', time: '12pm - 1pm' },
            { id: '4', time: '1pm - 2pm' },
            { id: '5', time: '2pm - 3pm' },
            { id: '6', time: '3pm - 4pm' },
            { id: '7', time: '4pm - 5pm' },
            { id: '8', time: '5pm - 6pm' },
        ],
  

        selectedValue: {},
        conferenceID:null,
    }
  }

  toggleItem = (itemId) => {
    const { selectedValue } = this.state;
    const isSelected = selectedValue[itemId];
    selectedValue[itemId] = !isSelected;

    this.setState({
      selectedValue: {...selectedValue},
    })
  }

  getConferenceID =() =>{
    this.setState ({conferenceID:uuid()})
  }

  getCopiedID=()=>{
    Clipboard.setString(this.state.conferenceID)
    this.props.navigation.pop()
  }

  render() {

      /* 1. Get the props */
      const {navigation,route}=this.props
      /* 2. Get the param */
      const {name,specialist,time} = this.props.route.params;
      console.log(time);
      const {timeSlots, 
        selectedValue,conferenceID } = this.state;
    

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
           <Text style={[styles.title, { marginTop: 20 }]}>Select Appointment Time:</Text>
           <Text>Dr.{name} - {specialist}</Text>
        </View>
         <FlatList
          data={timeSlots}
          keyExtractor={(times) => times.id}
          renderItem={({ item }) => {
            const isSelected = selectedValue[item.id];
              return (
                <View style={styles.containerTime}>
                  
                  <CheckBox
                    value={isSelected}
                    onChange={() => this.checkBox(item.id)}
                  />
                  <Text style={styles.textTime}>{item.time}</Text>
                </View>
              );
          }}
          extraData={[selectedValue]}
        /> 
         
        {/* {time && time.map(slot=>(
          
            <View style={styles.containerTime}>
              
              <CheckBox
                value={isSelected}
                onChange={() => this.checkBox(slot)}
              />
              <Text style={styles.textTime}>{new Date(slot)}</Text>
            </View>
     
        
        ))} */}
         {conferenceID && 
         <View>
                <Text style={{fontSize:20,textAlign:'center'}}>Your conferenceID is :{"\n"} {conferenceID}</Text>
                <View style={styles.button}>
                    <TouchableOpacity style={styles.signIn} onPress={this.getCopiedID}>
                        <Text style={styles.textSign}>Copy and Exit</Text>
                    </TouchableOpacity>
               </View>
         </View>
         }
         {!conferenceID && <View style={styles.button}>
            <TouchableOpacity style={styles.signIn} onPress={this.getConferenceID}>
                <Text style={styles.textSign}>Add Appointment</Text>
            </TouchableOpacity>
        </View>}
      </View>
    );
  };
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent:'center',
        padding: 30,
      },
    titleContainer: {
        flex: 1, 
        alignItems: 'center',
        justifyContent:'center'
      },
      
    containerTime:{
        flexDirection: 'row',
        alignItems:'stretch'
    },
    button: {
        alignItems: 'center',
        marginTop: 50,
        padding:20,
      },
      signIn: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor:'#00BCD4',
        padding:20,
    
    },
    textSign: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
      }

});

   
 