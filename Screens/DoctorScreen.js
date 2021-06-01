import React,{useState,useEffect} from 'react';
import { Button, View, Text,Image, TouchableOpacity, RefreshControl,StyleSheet,TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {db} from '../Configdb';
import * as firebase from 'firebase';


  
  export default function HomeScreen(props) {
    const [isLoading, setLoading] = useState(false)
    const [listData, setListData] = useState([]);
    const [query, onChange] =useState('');

    useEffect(() => {
        fetchFeed();
    }, [])

    const fetchFeed = async () => {
        const res = await firebase.database().ref("/doctors/").once("value")
        // {key:[], key:[], key:[]}
        var tempData = []
        Object.keys(res.val()).sort((a, b) => { return (b - a) }).forEach(keys => {
            tempData = [
                ...tempData,
                res.val()[keys]
            ]
        })
        setListData(tempData)
      
    }

    const getDoctors =()=>{
        const res = firebase.database().ref("/doctors/").orderByChild('name')
                    .startAt(query)
                    .endAt(query+"\uf8ff")
                    .on('value',snapshot => {
            let responselist = Object.values(snapshot.val())
            setListData(responselist)
            console.log(snapshot.val())
        });
        // const res = ref.orderByChild('name')
        //             .startAt(query)
        //             .endAt(query+"\uf8ff")
        //             .once("value")
        
        // var tempData = []
        // Object.keys(res.val()).sort((a, b) => { return (b - a) }).forEach(keys => {
        //     tempData = [
        //         ...tempData,
        //         res.val()[keys]
        //     ]
        // })
        // setListData(tempData)
    }

    return (
        <View style={{flex:1, }}>


        <View style={{paddingHorizontal: 20}}>
            <View style={styles.SearchContainer}>
            <TextInput
                style={styles.input}
                onChangeText={text => onChange(text)}
                value={query}
                placeholder={'Search ...'}
                clearButtonMode={'always'}
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize={'none'}
            />
            <TouchableOpacity
                style={styles.MagnifyButton}
                onPress={getDoctors}>
                    <Text><FontAwesome name="search" size={25} color="#00BCD4" /></Text>
            </TouchableOpacity>
        </View>
        </View>
           


           <FlatList
              refreshControl={
               <RefreshControl refreshing={isLoading} onRefresh={async () => {
                   setLoading(true)
                   //console.log("loading")
                   await fetchFeed()
                   setLoading(false)
               }} />
               
           }

           
            

             data={listData}
             renderItem={({item}) =>
               <TouchableOpacity style={{margin:10,borderRadius:7,elevation:5,backgroundColor:"white",shadowColor: '#333',
               shadowOffset: { width: 0, height: 1 },
               shadowOpacity: 0.5,
               shadowRadius: 2}}
               onPress={() => {
                 props.navigation.navigate('Appointment',{
                    name:item.name,
                    specialist:item.Specialist,
                    time: item.Slots,

                })}} 
               >
 
                 <View style={{flexDirection:"row", alignItems:"center", padding:10}} >
                   <Image 
                   source={{uri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM1q99ZLLIiDZYf8MAogmyxW8q_Y4wXC127w&usqp=CAU"}} 
                   style={{height:50,borderRadius:50,width:50}}/>
                   <View style={{ marginLeft: 10 }}>
                       <Text style={{ fontSize: 20 }}>{item.name}</Text>
                      
                           <Text style={{ fontSize: 12 }}> {item.Specialist} </Text>{/*{new Date(item.createdOn).toString().substring(0, 16)}*/}
                       <View style={{ flexDirection: 'row' }}>
                           <Text style={{ fontSize: 12, marginLeft: 5,flex: 1, flexWrap: 'wrap'}}>{item.Description}</Text>
                       </View>
                    </View>             
                 </View>
                     {/* {
                         item.isImage ? <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/youcook-5eb7e.appspot.com/o/feed%2F" + item.createdOn + "?alt=media&token=5239e414-4df6-4cc8-ae7a-b66105a68a1d" }} style={{ height: 200 }} />
                             : null
                     } */}
 
                     <Text style={{ margin: 10, color: "#333", fontSize: 12, marginTop: 5 }}>{item.text}</Text>
               
                 <View style={{ height: 1, width: "100%", backgroundColor: "#3333" }} />
 
                 <View style={{ flexDirection: "row", }}>
                     <TouchableOpacity style={{ flex: 1, margin: 10 }}>
                         <Text style={{ textAlign: "center", fontWeight: "bold" }}>Contact</Text>
                     </TouchableOpacity>
 
                     <View style={{ backgroundColor: "#3333", height: "100%", width: 1 }} />
 
                     <TouchableOpacity style={{ flex: 1, margin: 10 }} 
                        onPress={()=>props.navigation.navigate('Appointment',{
                          name:item.name,
                          specialist:item.Specialist,
                          time: item.Slots,
      
                     })}>
                         <Text style={{ textAlign: "center", fontWeight: "bold" }}>Make an Appointment</Text>
                     </TouchableOpacity>
                 </View>
               
               </TouchableOpacity>}   
             keyExtractor={(item)=>(item)}        
           />
         
           
        </View>
       
     )
   }

   const styles = StyleSheet.create({
    input: {
        height: 60,
        borderWidth: 1,
        padding: 10,
        marginVertical: 20,
        borderRadius: 5,
        width: '80%',
        backgroundColor:'#FFF',
        borderColor: '#00BCD4',
        borderWidth:1.5
    },
    SearchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    MagnifyButton:{
        backgroundColor: 'white',
        padding:15,
        marginHorizontal: 10,
        alignItems: 'center',
        borderRadius: 5
    },
});

   
 