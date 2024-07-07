import Domain from './domain'
import OButton from './OButton'
import React, { useState } from 'react'
import { Text, View, StyleSheet, Alert, TextInput, KeyboardAvoidingView, ScrollView} from 'react-native'

export default function Register({navigation}) {
    const [phone, setphone] = useState('')
    const [fname, setf] = useState('')
    const [lname, setl] = useState('')
    const [address, seta] = useState('')
    const [pass, setpass] = useState('')
    const [email, setemail] = useState('')
    const [btnhid, setbtnhid] = useState('block')
  
    const cancel = () => {
      navigation.navigate("StartHome")
    }
  
    const Register = async () => {
      if( phone.length < 12 )
      { Alert.alert('Number is not correct') }
  
      else if(pass.length < 8)
      { Alert.alert('Password must atleast 8 letters long') }

      else
      {
        const user = {
          "user": {
            "username": `${phone}`,
            "password": `${pass}`,
            "email": `${email}`,
            "first_name": `${fname}`,
            "last_name": `${lname}`
          },
          "address": `${address}`
        }
        console.log(user)
        await fetch(Domain() + '/signup/', { method: 'POST', headers: {"Content-Type": "application/json"}, body: JSON.stringify(user) }).
        then(res => res.json()).
        then(data => {
          console.log(data)
          if(data.user.email != email)
          {
            Alert.alert('Email: ' + data.user.email[0])
          }
          else
          {
            Alert.alert('Account Created')
            setphone(''); setpass(''); seta(''); setf(''); setl('')
            navigation.navigate("StartHome")
          }
        })
      }
    }
  
    return (
      <View style={{ flex: 1, backgroundColor: '#50615E' }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior='height'>
          <ScrollView>

          <View style={{ flex: 1, margin: 5, paddingBottom: '85%' }}>

            <View style={styles.inner}>
              <Text style={styles.fieldtext}>Phone #:</Text>
              <TextInput style={[styles.field, phone.length<12?{borderColor:'red'}:{borderColor:'black'}]} value={phone} onChangeText={(u) => setphone(u)} inputMode='numeric' maxLength={12} placeholder='Format 923012345678'></TextInput>
            </View>

            <View style={styles.inner}>
              <Text style={styles.fieldtext}>First Name:</Text>
              <TextInput style={[styles.field, fname.length<3?{borderColor:'red'}:{borderColor:'black'}]} value={fname} onChangeText={(f) => setf(f)} placeholder='Must contain atleast 3 letters'></TextInput>
            </View>

            <View style={styles.inner}>
              <Text style={styles.fieldtext}>Last Name:</Text>
              <TextInput style={[styles.field, lname.length<3?{borderColor:'red'}:{borderColor:'black'}]} value={lname} onChangeText={(l) => setl(l)} placeholder='Must contain atleast 3 letters'></TextInput>
            </View>

            <View style={styles.inner}>
              <Text style={styles.fieldtext}>Email:</Text>
              <TextInput style={styles.field} value={email} onChangeText={(e) => setemail(e)} placeholder='enter email address'></TextInput>
            </View>

            <View style={styles.inner}>
              <Text style={styles.fieldtext}>Address:</Text>
              <TextInput style={[styles.field, { textAlignVertical: 'top', paddingTop: 10, maxHeight: 65 }]} multiline={true} numberOfLines={4} value={address} onChangeText={(a) => seta(a)} placeholder='Enter Your Address'></TextInput>
            </View>

            <View style={styles.inner}>
              <Text style={styles.fieldtext}>Password:</Text>
              <TextInput style={[styles.field, pass.length<3?{borderColor:'red'}:{borderColor:'black'}]} secureTextEntry={true} value={pass} onChangeText={(p) => setpass(p)} placeholder='Password must contain 8 letters'></TextInput>
            </View>

          </View>

          <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>

            <OButton title='Cancel' onPress={cancel} />
            <OButton title='Sign Up' onPress={Register} />
      
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
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