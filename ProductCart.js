import Domain from './domain'
import OButton from './OButton'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { Text, View, StyleSheet, TextInput, FlatList, Alert, ImageBackground } from 'react-native'

export default function ProductCart () {
    const navigation = useNavigation()

    const [ProductList, setList] = useState([])
    const isFocused = useIsFocused()

    const [total, setTotal] = useState(0)
    const [Phone, setphone] = useState('')
    const [Address, setAddress] = useState('')
    const [user, setuser] = useState({})
    const [token, setToken] = useState('')

    const [btnuse, setuse] = useState(false)
    const [items, setitems] = useState([])

    useEffect(() => { async function getlist() {
        const token = await AsyncStorage.getItem('token')
        setToken(token)
        let tmp = await fetch(Domain() + '/create_products/', { method: 'GET', headers: {'Authorization': `Token ${token}`} }).
        then(result => result.json()).
        then( (data) => {
            setList(data)
            for(let i = 0; i < data.length; i++)
            {
                data[i].quantity = 0
            }
            setList(data)
            console.log(ProductList)
        })
        let tmpuser = await AsyncStorage.getItem('user')
        setuser(JSON.parse(tmpuser))
    }; getlist() }, [isFocused])
    
    const Productitem = (props) => {
        const [quantity, setQuantity] = useState(ProductList[props.index].quantity==null?0:ProductList[props.index].quantity)
        const add = () => {
            let tmp = ProductList
            tmp[props.index].quantity += 1
            setList(tmp)
            setQuantity(tmp[props.index].quantity)
        }

        const drop = () => {
            let tmp = ProductList
            if (tmp[props.index].quantity > 0)
            {
                tmp[props.index].quantity -= 1
                setList(tmp)
                setQuantity(tmp[props.index].quantity)
            }
        }

        const keyin = (val) => {
            let q = parseInt(val)
            let tmp = ProductList
            if(q != NaN && q != null && q > 0)
            {
                tmp[props.index].quantity = q
                setList(tmp)
                setQuantity(tmp[props.index].quantity)
            }
            else
            {
                tmp[props.index].quantity = 0
                setList(tmp)
                setQuantity(0)
            }
        }
        
        return(
            <View style={[styles.Productitem, ProductList[props.index].quantity>0?{ borderWidth: 2, borderColor: 'red'}:null]}
                  display={(ProductList[props.index].quantity==0)&&(btnuse==true)?'none':'block'}>

                    <ImageBackground source={{ uri : Domain() + ProductList[props.index].image }} style={styles.bckimg} imageStyle={[{ borderRadius: 10 }]}>
                        <View style={[styles.titlebox, ProductList[props.index].available=='yes'?{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }:{backgroundColor: 'rgba(40, 40, 40, 0.8)'}, ProductList[props.index].available=='yes'?{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }:null]}>
                            <Text style={{ fontSize: 18, color: 'white' }}>{ProductList[props.index].pname}</Text>
                            <Text style={{ fontSize: 18, color: 'white' }}>Price: {ProductList[props.index].pprice}</Text>
                        </View>
                        
                        <View style={[styles.btns, { flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]} display={btnuse?'block':'none'}>
                            <Text style={{ fontSize: 16, flex: 1, textAlign: 'center', color: 'white' }}>Quantity</Text>
                            <Text style={{ fontSize: 16, flex: 1, textAlign: 'center', color: 'white' }}>{quantity}</Text>
                        </View>

                        <View style={[styles.btns, { backgroundColor: 'rgba(0, 0, 0, 0.5)', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]} display={(ProductList[props.index].available=='yes')&&(!btnuse)?'block':'none'}>
                            <OButton title={'+'} style={styles.Obtns} TextStyle={{ fontSize: 15, color: 'white', fontSize: 16, fontWeight: 'bold' }} onPress={add}/>
                            <TextInput style={{ fontSize: 16, flex: 1, textAlign: 'center', color: 'white' }} inputMode='numeric' value={JSON.stringify(quantity)} onChangeText={(qty) => keyin(qty)}></TextInput>
                            <OButton title={'-'} style={styles.Obtns} TextStyle={{ fontSize: 15, color: 'white', fontSize: 16, fontWeight: 'bold' }} onPress={drop}/>
                        </View>
                    </ImageBackground>


                </View>
        )
    }

    const confirmbtn = async () => {
        let tmp = []
        let total = 0
        let data = ProductList
        for(let i = 0; i < data.length; i++)
        {
            if(data[i].quantity > 0)
            {
                total += data[i].pprice * data[i].quantity
                tmp.push({ product: data[i].pname, quantity: data[i].quantity})
                setuse(true)
            }
        }
        let p = await user.phone
        let a = await user.address
        setphone(p)
        setAddress(a)
        setTotal(total)
        setitems(tmp)
    }

    const postorder = async () => {
        console.log(user)
        let tmpuser = user
        if(Phone != tmpuser.phone)
        {
            if(Phone.length == 12)
            {
                tmpuser.phone = Phone
            }
            else
            {
                Alert.alert(Phone.length)
            }
        }
        if(Address != tmpuser.address)
        {
            if(Address.length > 5)
            {
                tmpuser.address = Address
            }
            else
            {
                Alert.alert(Address.length)
            }
        }
        setuser(tmpuser)
        let tmporder = {
                    "name": `${user.fname + ' ' + user.lname}`,
                    "contact": user.phone,
                    "address": user.address,
                    "items": items
        }
        console.log(tmporder)
        await fetch(Domain() + '/create_order/', { method: "POST", headers:{ "Content-Type": "application/json", "Authorization": `Token ${token}`  }, body: JSON.stringify(tmporder) })
        setuse(false)
        setitems([])
        navigation.navigate("OrderList")
    }

    return(
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <FlatList data={ProductList} renderItem={({_, index}) => <Productitem
                                                                           list={ProductList}
                                                                           index={index}
                                                                           />} />
            </View>

            <View style={styles.UserBox} display={btnuse?'block':'none'}>

                    <View style={styles.inner}>
                        <Text style={styles.fieldtext}>Phone #:</Text>
                        <TextInput style={styles.field} value={Phone} maxLength={12} onChangeText={(phone) => setphone(phone)} inputMode='numeric'></TextInput>
                    </View>

                    <View style={styles.inner}>
                        <Text style={styles.fieldtext}>Address:</Text>
                        <TextInput style={[styles.field, { textAlignVertical: 'top', paddingTop: 10, minHeight: 60, maxHeight: 60 }]} value={Address} multiline={true} numberOfLines={2} onChangeText={(address) => setAddress(address)}></TextInput>
                    </View>

                    <View style={styles.inner}>
                        <Text style={styles.fieldtext}>Total Bill:</Text>
                        <Text style={styles.fieldtext}>{total}</Text>
                    </View>

            </View>
        
            <View>
                <View style={{ flexDirection: 'row' }} display={!btnuse?'block':'none'}>
                    <OButton title="Confirm Order" onPress={confirmbtn}/>
                </View>
                <View style={{ flexDirection: 'row' }} display={btnuse?'block':'none'}>
                    <OButton title={"Cancel"} onPress={() => { setuse(false) }}/>
                    <OButton title={"Confirm"} onPress={postorder}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Productitem: {
        flex: 1,
        margin: 10,
        borderRadius: 10,
        borderColor: 'gray',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#22333B',
    },
    btns: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        padding: 5,
    },
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
        borderColor: 'gray',
        paddingHorizontal: 10
    },
    UserBox: {
        maxHeight: '50%',
        padding: 10,
        borderWidth: 3, margin: 10,
        borderRadius: 10,
        backgroundColor: '#22333B',
        borderColor: 'gray',
    },
    bckimg: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    titlebox: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        padding: 10,
        paddingTop: 50,
        borderRadius: 10,
    },
    Obtns: {
        margin: 15,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#22333B',
        borderColor: 'gray',
    },
})