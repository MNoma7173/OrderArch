import Domain from './domain'
import OButton from './OButton'
import { useState, useEffect } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StyleSheet, Text, FlatList, View, TouchableOpacity, TextInput } from 'react-native';

export default function ProductList({navigation}) {
    const [PL, setPL] = useState([])
    const Product = (props) => {
        const [po, setpo] = useState('none')
        const [updte, setupd] = useState({"btnU": 'block', "btnC": 'none'})
        const [TFread, setTF] = useState(true)

        const [n, setname] = useState(props.name)
        const [p, setprice] = useState(props.price)

        const [open, setOpen] = useState(false);
        const [a, setav] = useState(props.avail)
        const [items, setItems] = useState([{label: 'No', value: 'no'}, {label: 'Yes', value: 'yes'}]);

        const opbtn = () => {
            if(po === 'none')
            {
                setpo('block')
            }
            else
            {
                setpo('none')
            }
        }

        const confrm = async () => {
            if(updte.btnU === 'block')
            {
                setupd({btnU: 'none', btnC: 'block'})
                setTF(false)
            }
            else
            {
                setupd({btnU: 'block', btnC: 'none'})
                setTF(true)
                const token = await AsyncStorage.getItem('token')
                await fetch(Domain() + '/update_products/', { method: "PUT", headers:{ "Content-Type": "application/json", "Authorization": `Token ${token}` },
                body: JSON.stringify({ "name": props.id, "newname": n, "price": p, "available": a }) })
                getlist()
            }
        }
        return(
            <View>
                <TouchableOpacity style={styles.Pinner} onPress={opbtn}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: 'white' }}>{props.name}</Text>
                        <Text style={{ color: 'white' }}>Rs.{props.price}</Text>
                    </View>
                </TouchableOpacity>

                <View display={po} style={styles.Pinner}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Text style={ styles.textfield }>Available: </Text>
                        <View style={styles.picker}>
                            <DropDownPicker disabled={TFread} open={open} value={a} items={items} setOpen={setOpen} setValue={setav} setItems={setItems}/>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Text style={ styles.textfield }>Name: </Text>
                        <TextInput readOnly={TFread} textAlign='center' style={ styles.field } onChangeText={(m) => setname(m) }>{props.name}</TextInput>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Text style={ styles.textfield }>Price: </Text>
                        <TextInput readOnly={TFread} inputMode='numeric' textAlign='center' style={ styles.field } onChangeText={(m) => setprice(m)}>{props.price}</TextInput>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <OButton style={styles.btns} title='Update' display={updte.btnU} onPress={confrm} />
                        <OButton style={styles.btns} title='Confirm' display={updte.btnC} onPress={confrm} />
                        <OButton style={styles.btns} title='Cancel' display={updte.btnC} onPress={() => { setupd({btnU: 'block', btnC: 'none'}); setTF(true) }} />
                    </View>
    
                </View>
            </View>
        )
    }

    const getlist = async () => {
        const token = await AsyncStorage.getItem('token')
        await fetch(Domain() + '/create_products/', { method: 'GET', headers: {'Authorization': `Token ${token}`} })
        .
        then(res => res.json())
        .
        then(prodlist => {
            setPL(prodlist)
            console.log(PL)
        })
    }

    useEffect( () => { getlist() }, []);

    return(
        <View style={{ flex:1, backgroundColor: '#22333B' }}>
            <View style={{ flex: 1 }}>
                <FlatList data={PL} renderItem={({item}) => <Product
                                                                    id={item.pname}
                                                                    name={item.pname}
                                                                    price={item.pprice}
                                                                    avail={item.available}/>}
                                                            />
            </View>
        </View>
    )

}

const btnsC = {back: '#22333B', border: '#C6AC8F'}
const PinnerC = {back: '#8D785E', border: '#C6AC8F'}
const fieldC = {back: '#22333B',border: '#C6AC8F'}
//'#52ab98'

const styles = StyleSheet.create({
    Pinner: {
        flex: 1,
        margin: 5,
        padding: 15,
        borderWidth: 3,
        borderRadius: 10,
        flexDirection: 'column',

        borderColor: PinnerC.border,
        backgroundColor: PinnerC.back,
    },
    field: {
        flex: 1,
        margin: 10,
        borderWidth: 2,
        borderRadius: 10,
        alignContent: 'center',
        textAlignVertical: 'center',

        color: fieldC.text,
        borderColor: fieldC.border,
        backgroundColor: fieldC.back,
        color: 'white'
    },
    textfield: {
        width: '20%',
        color: 'white',
        marginLeft: 10,
    },
    btns: {
        flex: 1,
        margin: 5,
        borderWidth: 3,
        borderRadius: 10,
        marginVertical: 5,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'column',
        
        borderColor: btnsC.border,
        backgroundColor: btnsC.back,
    },
    picker: {
        flex: 1,
        borderRadius: 10,
    },
});