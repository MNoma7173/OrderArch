import Domain from './domain'
import OButton from './OButton'
import { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native'

export default function Profile({navigation}) {
    const [user, setuser] = useState('')
    const [phone, setphone] = useState('')
    const [fname, setf] = useState('')
    const [lname, setl] = useState('')
    const [address, seta] = useState('')
    const isFocused = useIsFocused()
    const [editf, seteditf] = useState(true)

    const [logbtn, setlogbtn] = useState({"btn1" : 'block', "btn2": 'none'})
    const [upbtn, setup] = useState({"btn1" : 'block', "btn2": 'none'})

    const getdata = () =>
    {
        AsyncStorage.getItem('user', (err, result) => {
            setuser(result.trim())
            if(user == '')
            {
                console.log('no user')
                return
            }
            const tmp = JSON.parse(user)
            setphone(tmp.phone); seta(tmp.address); setf(tmp.fname); setl(tmp.lname)
        })
    }

    const logout = () => {
        AsyncStorage.setItem("LoggedIn", 'block')
        AsyncStorage.setItem("user", '')
        AsyncStorage.setItem('token', '')
        Alert.alert("Logged Out")
        navigation.navigate('StartHome')
    }

    const updateuser = async () => {
        setlogbtn({"btn1" : 'block', "btn2": 'none'})
        setup({"btn1" : 'block', "btn2": 'none'})
        const token = await AsyncStorage.getItem('token')
        await fetch(Domain() + '/Profile/', { method: 'PUT', headers: { 'Authorization' : `Token ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({"fname": fname, "lname": lname, "address": address}) })
        await fetch(Domain() + '/Profile/', { method: 'GET', headers: { 'Authorization': `Token ${token}` } }).
        then(result => result.json()).
        then(data => {
                AsyncStorage.setItem('user', JSON.stringify({ phone: data.user.username,
                                                              fname: data.user.first_name,
                                                              lname: data.user.last_name,
                                                              address: data.address})
                                        )
        })
        seteditf(true)
        getdata()
    }

    useEffect( () => getdata(), [isFocused, user])

    return(
        <View style={{ flex: 1, padding: 5, backgroundColor: '#50615E' }}>
            <View style={{ flex: 1 }}>

                <View style={styles.inner}>
                    <Text style={styles.fieldtext}>Phone #:</Text>
                    <TextInput readOnly={true} style={!editf?styles.field:styles.fieldreadable} value={phone}></TextInput>
                </View>

                <View style={styles.inner}>
                    <Text style={styles.fieldtext}>First Name:</Text>
                    <TextInput readOnly={editf} style={!editf?styles.field:styles.fieldreadable} value={fname} onChangeText={(val) => { setf(val) }}></TextInput>
                </View>

                <View style={styles.inner}>
                    <Text style={styles.fieldtext}>Last Name:</Text>
                    <TextInput readOnly={editf} style={!editf?styles.field:styles.fieldreadable} value={lname} onChangeText={(val) => { setl(val) }}></TextInput>
                </View>

                <View style={[styles.inner, { alignItems: 'flex-start' }]}>
                    <Text style={[styles.fieldtext, {textAlignVertical: 'bottom'}]}>Address:</Text>
                    <TextInput readOnly={editf} multiline numberOfLines={4} onChangeText={(val) => { seta(val) }} style={[!editf?styles.field:styles.fieldreadable, { textAlignVertical: 'top', paddingTop: 5, }]} value={address}></TextInput>
                </View>

            </View>

            <View style={{ marginBottom: 0 }}>

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                    <OButton title={'Log Out'} display={logbtn.btn1} onPress={() => {
                                                            setlogbtn({"btn1" : 'none', "btn2": 'block'})
                                                            setup({"btn1" : 'none', "btn2": 'none'})
                                                         }} />

                    <OButton title={'Confirm Log Out'} display={logbtn.btn2} onPress={logout} />

                    <OButton title={'Cancel'} display={logbtn.btn2} onPress={() => {
                                                            setlogbtn({"btn1" : 'block', "btn2": 'none'})
                                                            setup({"btn1" : 'block', "btn2": 'none'})
                                                         }} />

                    <OButton title={'Update Profile'} display={upbtn.btn1} onPress={() => {
                                                            setlogbtn({"btn1" : 'none', "btn2": 'none'})
                                                            setup({"btn1" : 'none', "btn2": 'block'})
                                                            seteditf(false)
                                                         }} />

                    <OButton title={'Confirm Update'} display={upbtn.btn2} onPress={updateuser} />

                    <OButton title={'Cancel'} display={upbtn.btn2} onPress={() => {
                                                            setlogbtn({"btn1" : 'block', "btn2": 'none'})
                                                            setup({"btn1" : 'block', "btn2": 'none'})
                                                            getdata()
                                                            seteditf(true)
                                                         }} />

                </View>
                
            </View>
        </View>
    )
}


const btnsC = {back: '#22333B', border: '#C6AC8F'}
const PinnerC = {back: '#8D785E', border: '#C6AC8F'}
const fieldC = {back: '#22333B',border: '#C6AC8F'}
//'#52ab98'

const styles = StyleSheet.create({
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },
    fieldtext: {
        width: '35%',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    field: {
        flex: 1,
        minHeight: 40,
        borderWidth: 4,
        borderRadius: 10,
        paddingHorizontal: 12,
        color: 'black',
        backgroundColor: 'white',
        borderColor: 'gray'
    },
    fieldreadable: {
        flex: 1,
        minHeight: 40,
        paddingLeft: 15,
        borderBottomWidth: 4,
        borderLeftWidth: 2,
        borderRadius: 10,
        color: 'black',
        backgroundColor: 'white',
        borderColor: 'gray'
    },
});
