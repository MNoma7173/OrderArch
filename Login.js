import Domain from './domain'
import OButton from './OButton'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text, View, StyleSheet, Alert, TextInput } from 'react-native'

export default function Login({navigation}) {
  const [username, setusrnm] = useState('')
  const [pass, setpass] = useState('')

  const cancel = () => {
    navigation.navigate("StartHome")
  }

  const SignIn = async () => {
    if(!username)
    {
      Alert.alert('enter username')
    }

    else if(!pass)
    {
      Alert.alert('please enter password')
    }

    else {
      await fetch(Domain() + '/login/', { method: "POST", headers: { "Content-Type": "application/json" },
                                                                    body: JSON.stringify({"username": username, "password": pass}) }).
      then(result => result.json()).
      then(data => {
        if(data.error != null)
        {
          Alert.alert(data.error)
        }
        else
        {
          AsyncStorage.setItem('token', `${data.TOKEN}`)
          console.log(data.TOKEN)
          fetch(Domain() + '/Profile/', { method: 'GET', headers: { 'Authorization': `Token ${data.TOKEN}` } }).
          then(result => result.json()).
          then(data => {
            AsyncStorage.setItem("user" , JSON.stringify({ phone: data.user.username,
                                            fname: data.user.first_name,
                                            lname: data.user.last_name,
                                            address: data.address
                                          }), (err, result) => {
                                              Alert.alert("Welcome " + data.user.first_name + " " + data.user.last_name)
                                              AsyncStorage.setItem("LoggedIn", 'none')
                                              navigation.navigate('StartHome')
                                            })
          })
        }
      })
    }
  }

  return(
    <View style={{ flex: 1, backgroundColor: '#50615E' }}>

      <View style={{ flex: 1, margin: 5 }}>

        <View style={styles.inner}>
          <Text style={styles.fieldtext}>Phone #:</Text>
          <TextInput style={[styles.field, username.length<12?{borderColor:'red'}:{borderColor:'black'}]} value={username} onChangeText={(u) => setusrnm(u)} placeholder='Format 9230xxxxxxxx'></TextInput>
        </View>

        <View style={styles.inner}>
          <Text style={styles.fieldtext}>Password:</Text>
          <TextInput style={[styles.field, pass.length<8?{borderColor:'red'}:{borderColor:'black'}]} secureTextEntry={true} value={pass} onChangeText={(p) => setpass(p)} placeholder='Password must contain 8 letters'></TextInput>
        </View>

      </View>

      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <OButton title='Cancel' onPress={cancel} />
        <OButton title='Sign In' onPress={SignIn} />
      </View>

    </View>
  )
}

const regfC = {back: 'white', border: 'skyblue', Text: 'steelblue'}
const btnC = {borderLT: '87cbff', borderRB: 'powderblue', back: 'steelblue'}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  field: {
    flex: 1,
    minHeight: 40,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 12,
    color: 'black',
    backgroundColor: 'white',
    fontSize: 16,
  },
  fieldtext: {
    color: 'white',
    width: '30%',
    fontSize: 20,
  },
});
