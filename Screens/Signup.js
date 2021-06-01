import React, { useState } from 'react';
import {View, StyleSheet, Text, ScrollView, Image,Alert} from 'react-native';
import { Button } from 'react-native-elements';
import  firebase from "firebase";

import Input from '../constants/Inputs';
import Submit from '../constants/Submit';


function SignUp({ navigation }) {
  
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });


    const textInputChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
            console.log(username)
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
            console.log(username)
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }


    const CreateUser = () =>{
        
        const username = data.username; 
        const password = data.password;
       
         firebase.auth().createUserWithEmailAndPassword(username, password)
            .then((result) => {
                console.log(result)
                navigation.navigate('Bottombar')
            })
            .catch((error) => {
                console.log(error)
                Alert.alert(
                    "Error",
                    ""+error                    
                    );
            })
            
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }





    return (
        <ScrollView style={{backgroundColor: 'white'}}>
            <View style={styles.container}> 
                <Image source={require('../assets/images/signup.png')} resizeMode="center" style={styles.image} />
                <Text style={styles.textTitle}>Let's Get Started</Text>
                <Text style={styles.textBody}>Create an account to get all features</Text>
                <Input name="Full Name" icon="user" />
                <Input name="Email" icon="envelope" onChangeText={(val) => textInputChange(val)} />
                <Input name="Phone" icon="phone" />
                <Input name="Password" icon="lock" pass={true} onChangeText={(val) => handlePasswordChange(val)} />
                <Input name="Confirm Password" icon="lock" pass={true} onChangeText={(val) => handleConfirmPasswordChange(val)}/>
                <Button color="#00BCD4" title="CREATE" onPress={()=>CreateUser()}/>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textBody}>Aiready have an account</Text>
                    <Text style={[styles.textBody, {color: 'blue'}]} onPress={() => navigation.navigate('Signin')}> Login here</Text>

                </View>
            </View>
            
        </ScrollView>    
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    image: {
        width: 400,
        height: 250,
        marginVertical: 10,
    },
    textTitle: {
        fontSize: 40,
        fontFamily: 'Foundation',
        marginVertical: 5
    },
    textBody: {
        fontSize: 16,
        fontFamily: 'Foundation'
    }
});

export default SignUp;