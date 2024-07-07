import Domain from './domain'
import OButton from './OButton'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { View, StyleSheet, ImageBackground } from 'react-native'

export default function StartMenu({navigation}) {
    const SignIn  = () => { navigation.navigate("LogIn") }
    const Orderls  = () => { navigation.navigate("OrderList") }
    const GoOrder = () => { navigation.navigate('OrderChatAI') }
    const goprofile = () => { navigation.navigate('UserProfile') }
    const SignUp = () => { navigation.navigate("Register") }
    const toContactUs = () => { navigation.navigate('Contact') }
    const editProducts = () => { navigation.navigate('Products') }
    const gomenu = () => { navigation.navigate('Menu') }
    const isFocused = useIsFocused()
    const [sbtn, setsbtn] = useState('')
    const [obtn, setobtn] = useState('')
    const [adminbtn, setadminbtn] = useState('none')

    const getdata = async () => {
        const user = await AsyncStorage.getItem("user")
        const val = await AsyncStorage.getItem("LoggedIn")
        setsbtn(val)
        if(val === 'none' || val === '')
        {
            setobtn('block')
        }
        else
        {
            setobtn('none')
        }
        const token = await AsyncStorage.getItem('token')
        await fetch(Domain() + '/isadmin/', { method: 'Get', headers: { 'Authorization': `Token ${token}` } }).
        then(result => result.json()).
        then(data => {
            if(data.response == 'true')
            {
                setadminbtn('block')
            }
            else
            {
                setadminbtn('none')
            }
        })
    }
    useEffect(() => { if(isFocused) { getdata() } }, [isFocused, sbtn])

    return(
        <View style={{ flex: 1 }}>
            {/* <ImageBackground source={require('./assets/background2.png')} style={styles.bckimg}> */}
                <View style={styles.upper}>

                    <View style={styles.left}>
                        <OButton title={'Chat Order'} backgroundimg={require("./assets/background2.png")} disabled={sbtn=='block'?true:false} onPress={GoOrder} />
                    </View>

                    <View style={styles.right}>
                        <OButton title={'Menu'} backgroundimg={require("./assets/background2.png")} disabled={sbtn=='block'?true:false} onPress={gomenu} />
                        <View style={{ flex: 0.03 }}/>
                        <OButton title={'Order List'} backgroundimg={require("./assets/background2.png")} disabled={sbtn=='block'?true:false} onPress={Orderls} />
                    </View>

                </View>


                <View style={styles.lower}>

                    <View style={styles.right} display={sbtn}>
                        <OButton title={'Login'} backgroundimg={require("./assets/background2.png")} onPress={SignIn} />
                        <View style={{ flex: 0.03 }} ></View>
                        <OButton title={'Register'} backgroundimg={require("./assets/background2.png")} onPress={SignUp} />
                    </View>

                    <View style={styles.right} display={obtn}>
                        <OButton title={'Profile'} backgroundimg={require("./assets/background2.png")} onPress={goprofile} />
                        <View style={{ flex: 0.03 }} ></View>
                        <OButton title={'Product List'} display={adminbtn} backgroundimg={require("./assets/background2.png")} onPress={editProducts} />
                    </View>

                    <View style={styles.left}>
                        <OButton title={'Contact us'} backgroundimg={require("./assets/contactus.jpg")} onPress={toContactUs} />
                    </View>
                </View>
            {/* </ImageBackground> */}
        </View>)
}

const styles = StyleSheet.create({
    upper: {
        flex: 0.5,
        padding: 5,
        paddingBottom: 1,
        marginTop: 2,
        flexDirection: 'row',
    },
    lower: {
        flex: 0.5,
        padding: 2,
        marginBottom: 15,
        flexDirection: 'row',
    },
    right: {
        flex: 1,
        padding: 2,
        flexDirection: 'column',
    },
    left: {
        flex: 1,
        padding: 2,
        paddingTop: 1,
    },
    bckimg: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});