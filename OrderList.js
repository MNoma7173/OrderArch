import Domain from './domain'
import OButton from './OButton'
import { useState, useEffect } from 'react'
import { enableScreens } from 'react-native-screens'
import { GiftedChat } from 'react-native-gifted-chat'
import { myBub, MyTimeBub, MyDate } from './OrderChat'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StyleSheet, Text, FlatList, View, ImageBackground } from 'react-native'

const OrderStack = createNativeStackNavigator()
enableScreens(false)

const themeheader = (t) => {
    return(
      {
        title: t,
        headerStyle: {
          backgroundColor: "#2e3334",
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    )
}

export default function OrderList({navigation}) {
    const [orders, setorders] = useState([])
    const [OrderScreens, setOrderscreens] = useState([])

    const Order = (props) => {
        let oitems = []
        for(let i = 0; i < props.items.length; i++)
        {
            let tmp = <View style={{ flexDirection: 'row', marginLeft: '10%', padding: 5 }} key={i}>
                        <Text style={{ fontSize: 17, color: 'white', width: '10%', borderBottomWidth: 1, borderColor: '#C6AC8F' }}>{props.items[i].quantity}</Text>
                        <Text style={{ fontSize: 17, color: 'white', width: '45%', borderBottomWidth: 1, borderColor: '#C6AC8F', fontWeight: 'bold' }}>{props.items[i].product}</Text>
                        <Text style={{ fontSize: 17, color: 'white', width: '20%', borderBottomWidth: 1, borderColor: '#C6AC8F' }}>{props.items[i].price}</Text>
                      </View>
            oitems.push(tmp)
        }

        const ViewOrderBtn = () => {
            navigation.navigate(`Order${props.id}`)
        }

        return(
            <View {...props.id} style={styles.Order}>

                <View style={[styles.OrderUPDN, { borderBottomWidth: 0, borderBottomStartRadius: 0, borderBottomEndRadius: 0 }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 17, color: 'white', paddingLeft: 15, width: '25%' }}>Order ID:</Text>
                        <Text style={{ fontSize: 17, color: 'white' }}>{props.id}</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 17, color: 'white', paddingLeft: 15, width: '25%' }}>Name:</Text>
                        <Text style={{ fontSize: 17, color: 'white' }}>{props.name}</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 17, color: 'white', paddingLeft: 15, width: '25%' }}>Contact:</Text>
                        <Text style={{ fontSize: 17, color: 'white' }}>{props.contact}</Text>
                    </View>
                </View>

                <View style={styles.OrderMID}>
                    <View>
                        <Text style={{ fontSize: 17, color: 'white', paddingLeft: 15, width: '25%' }}>items:</Text>
                        {oitems}
                    </View>

                    <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                        <Text style={{ fontSize: 17, color: 'white', paddingLeft: 15, width: '20%', fontWeight: 'bold' }}>Total:</Text>
                        <Text style={{ fontSize: 17, color: 'white', fontWeight: 'bold' }}>Rs. {props.total}</Text>
                    </View>
                </View>

                <View style={[styles.OrderUPDN, { flexDirection: 'column', borderTopWidth: 0, borderTopStartRadius: 0, borderTopEndRadius: 0 }]}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{ fontSize: 17, color: 'white', paddingLeft: 15, width: '25%' }}>Address:</Text>
                        <Text style={{ fontSize: 17, color: 'white' }}>{props.address}</Text>
                    </View>

                    <View style={{ paddingHorizontal: 25, paddingTop: 15 }}>
                        <OButton title='View Chat' onPress={ViewOrderBtn} />
                    </View>
                </View>


            </View>
        )
    }

    const OrderChatbyID = (props) => {
        if(!Array.isArray(props.chat))
        {
            props.chat = [{
                "_id": "slcpof",
                "user": {
                    "_id": 2,
                    "name": "SaneAI",
                    "avatar": 28
                }
            },
            {
                "_id": "brssui",
                "user": {
                    "_id": 1,
                    "avatar": 28
                }
            }]
        }
        return(
            <View style={{ flex: 1, backgroundColor: '#22333B' }}>
                <View style={{ flex: 1, padding: 15 }}>

                    <View style={{ paddingHorizontal: 15, paddingVertical: 5, borderWidth: 3, borderColor: 'gray', marginBottom: 10, borderRadius: 15 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Name: {props.name}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Contact: {props.phone}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Address: {props.address}</Text>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white' }}>Total Bill: {props.total}</Text>
                    </View>

                    <ImageBackground source={require("./assets/background.png")} style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }} imageStyle={{ borderRadius: 15 }}>
                        <View style={{ borderRadius: 15, padding: 5, flex: 1, borderWidth: 3, borderColor: 'gray' }}>
                            <GiftedChat minInputToolbarHeight={0} renderDay={MyDate} renderTime={MyTimeBub} messages={props.chat} renderInputToolbar={()=>{}} renderBubble={myBub} renderAvatar={() => {}} renderChatFooter={()=>{}} user={{ _id:1 }}/>
                        </View>
                    </ImageBackground>

                </View>
            </View>
        )
    }

    const getlist = async () => {
        const token = await AsyncStorage.getItem('token')
        await fetch(Domain() + '/create_order/', { method: 'GET', headers: { 'Authorization': `Token ${token}` } })
        .
        then(res => res.json())
        .
        then(ordrlist => {
            setorders(ordrlist)
            console.log(ordrlist[0])
            ordrlist.sort((a, b) => {return b.id-a.id})
            let tmp = []
            for(let i = 0; i < ordrlist.length; i++)
            {
                let Tmporder = () => <OrderChatbyID name={ordrlist[i].name} total={ordrlist[i].total} phone={ordrlist[i].contact} address={ordrlist[i].address} chat={ordrlist[i].chat} />
                tmp.push(<OrderStack.Screen
                                    id={ordrlist[i].id}
                                    key={ordrlist[i].id}
                                    component={Tmporder}
                                    name={`Order${ordrlist[i].id}`}
                                    options={themeheader(`Order ID ${ordrlist[i].id}`)} />)
            }
            setOrderscreens(tmp)
        })
    }

    useEffect( () => { getlist() }, []);

    const OrderListHome = () => {
        return(
        <ImageBackground source={require("./assets/background.png")} style={{ flex: 1, resizeMode: 'cover' }}>
            <View style={{ flex: 1, marginBottom: 10 }}>

                <View style={{ flex:1 }}>
                    <FlatList data={orders} renderItem={({item}) => <Order  
                                                                        id={item.id}
                                                                        name={item.name} 
                                                                        total={item.total}
                                                                        items={item.items}
                                                                        contact={item.contact}
                                                                        address={item.address}
                                                                    />} />
                </View>

            </View>
        </ImageBackground>
        )
    }


    return(
        <OrderStack.Navigator initialRouteName='OrderHome'>
            <OrderStack.Screen
                component={OrderListHome}
                name="OrderHome"
                options={themeheader("Order List")}
            />
            {OrderScreens}
        </OrderStack.Navigator>
    )
}

const orderC = {back: 'white'}

const styles = StyleSheet.create({
    Order: {
        margin: 5,
        borderRadius: 10,
        flexDirection: 'column',

        borderColor: orderC.back,
    },
    OrderMID: {
        flex: 1,
        backgroundColor: '#8D785E',
        paddingVertical: 10,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 7,
    },
    OrderUPDN: {
        borderWidth: 3,
        borderRadius: 7,
        marginHorizontal: 7,
        paddingVertical: 10,
        backgroundColor: '#22333B',
        borderColor: '#C6AC8F',
    },
});