import React from 'react'
import OButton from './OButton'
import { MaterialIcons } from '@expo/vector-icons'
import { Text, View, StyleSheet, ImageBackground } from 'react-native'

export default function ContactUs() {
    const MyText = (props) => {
        return(
            <View style={ styles.TextStyle }>
                <MaterialIcons style={[styles.innerTextStyle, { flex: 0.25, textAlign: 'center' }]} name={props.name} size={props.size}/>
                <Text style={[styles.innerTextStyle, { flex: 0.25 }]}>{props.title}</Text>
                <Text style={[styles.innerTextStyle, { flex: 0.5 }]}>{props.detail}</Text>
            </View>
        )
    }
    return(
        <View style={{ flex: 1 }}>
            
            <View style={{ flex: 0.5 }}>
                <MyText name='info' size={30} title={'About Us'} />
                <Text style={styles.info}>write yourself here in detail and give the info about yor company and brand that is all to be given here</Text>
            </View>
            <View style={{ flex: 0.5 }}>
                <MyText name='phone' size={30} title={'Phone'} detail={'phone number here'} />
        
                <MyText name='location-on' size={30} title={'location'} detail={'your address'} />
        
                <MyText name='mail' size={30} title={'Email'} detail={'email here'} />
        
                <View style={styles.TextStyle}>
                    <MaterialIcons style={{ flex: 0.30, padding: 5, margin: 2, textAlign: 'center' }} name='facebook' size={30}/>
                    <OButton title={'Open Facebook'}/>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    TextStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },
    innerTextStyle: {
        padding: 5,
        margin: 2,
        alignSelf: 'center',
    },
    info: {
        flex: 1,
        margin: 10,
        marginHorizontal: 30,
        textAlign: 'justify',
        padding: 15,
        borderRadius: 15,
        backgroundColor: 'rgba(34, 51, 59, 0.7)',
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
})