import Domain from './domain'
import OButton from './OButton'
import { useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GiftedChat, Bubble, Time, Day } from 'react-native-gifted-chat'
import { StyleSheet, TextInput, TouchableOpacity, View, ImageBackground } from 'react-native'


// https://api.openai.com/v1/chat/completions
// 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

// https://api.pawan.krd/v1/completions
// https://api.pawan.krd/v1/chat/completions
// pk-yqEKRqvYbmXzTfZHMXpYblLMAWEJpligoiEThbJxXQkoENyc

// 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
// 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

// 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

export function myBub(props) {
  return (
    <Bubble
      {...props}

      textStyle={{
        right: {
          color: 'white',
        },
        left: {
          color: 'white',
        },
      }}
      wrapperStyle={{
        left: {
          flex: 1,
          backgroundColor: '#44A4AB',
          borderRadius: 5,
        },
        right: {
          flex: 1,
          backgroundColor: "#3e84d3",
          minWidth: 75,
          borderRadius: 5,
        },
      }}
    />
  )
}

export function MyTimeBub(props) {
  return(
    <Time
      {...props}
      timeTextStyle={{
        left: {
          fontWeight: 'bold',
          color: 'white',
        },
        right: {
          fontWeight: 'bold',
         color: 'white',
        },
      }}
    />
  )
}

export function MyDate(props) {
  return(
    <Day 
      {...props}
      textStyle={{ 
          color: 'white',
          fontWeight: 'bold',
          fontSize: 15,
        }
      }
    />
  )
}

export default function OrderChat({navigation}) {

  const [msg, setmsg] = useState('')
  const [allmsgs, setallmsgs] = useState([])
  const [wrk, setw] = useState(false)
  
  const [nobtn, setnobtn] = useState({btn1: 'none', btn2: 'block', btn3: 'none'})
  const [context, setcon] = useState([])

  addcon = (c) => {
    let tcon = context
    tcon.push(c)
    setcon(tcon)
  }

  const getproducts = async () =>{
    const result = await AsyncStorage.getItem('user')
    const tmp = await JSON.parse(result.trim())
    console.log(tmp)
    const token = await AsyncStorage.getItem('token')
    await fetch(Domain() + '/create_products/', { method: 'GET', headers: { "Authorization": `Token ${token}` } })
    .
    then(response => response.json())
    .
    then(products => {
      let pfs = ''
      let ap = ''
      let nap = ''
      let allprod = ''
      for(let i = 0; i < products.length; i++)
      {
        pfs += products[i].pname + " : " + products[i].pprice + ", "
        allprod += products[i].pname + ', '
        if(products[i].available === 'yes')
        {
           ap += products[i].pname + products[i].pprice + ", "
        }
        else
        {
           nap += products[i].pname + ", "
        }
     }
     console.log(products)
     console.log(ap + "\tavailable\n")
     console.log(pfs + "\n")
     console.log(nap + "\tnot available\n")
       addcon({
         "role" : "user",
         "content" : `I am your customer and you are my waiter take order details from me. One question at time. I strictly order you don't diverse from taking ORDER and ONLY talk in Urdu or English no other language. Also check what product is being ordered and if product is not in the menu then tell that product is not available. Keep track of whole order. generate summary first then ask if anything needed to be revised after confirming generate json. You must ask for order details after confirming details generate json like this after confirming order: {"name": name, "contact": contact, "address": address, items:[{product: string, quantity:  integer}]}. Some details are given: name: ${ tmp.fname + ' ' + tmp.lname }, contact: ${ tmp.phone }, address: ${ tmp.address }
         Menu: ${ap}
         only accept products which are in the menu`
        });
        addcon({"role": "system", "content" : `Of course, I'm here to help you place your order. Let's get started! 

        1. What would you like to order from our menu? Please provide the name of the product.`})
    })
  }

  const newchatbtn = async () => {
    let tmp = await getproducts()
    setnobtn({btn1: 'block', btn2: 'none', btn3: 'none'})
  }

  const GJO = async (TOrder) => {
    if(/{/.test(TOrder))
    {
      for(let i = 0; i < TOrder.length; i++)
      {
        if(TOrder[i] === "{")
        {
          let nmsg = ''
          let b = 0
          for(let j = i; ; j++, i++)
          {
            nmsg += TOrder[j]
            if(TOrder[j] == '{')
            { b++ }
            if(TOrder[j] == '}')
            { b-- }
            if(b == 0)
            {
              let tmp = await JSON.parse(nmsg)
              tmp.chat = allmsgs
              console.log(tmp)
              console.log(allmsgs)
              const token = await AsyncStorage.getItem('token')
              const msg = await fetch(Domain() + '/create_order/', { method: "POST", headers:{ "Content-Type": "application/json", "Authorization": `Token ${token}`  }, body: JSON.stringify(tmp) }).
              then(result => result.json()).
              then(data => {
                console.log(data)
                setnobtn({btn1: 'none', btn2: 'none', btn3: 'block'})
                let tmp1 = 'items:\n'
                for(let j = 0; j < data.items.length; j++)
                {
                  tmp1 += `\t\t${data.items[j].product} Q: ${data.items[j].quantity} price: ${data.items[j].price}\n`
                }
                return `name: ${data.name}\ntotal: ${data.total}\n${tmp1}\nyour order is confirmed and processing will be delivered shortly.`
              })
              return msg
            }
          }
        }
        else
        {
          continue
        }
      }
    }
    return TOrder
  }
  
  const BtnAction = async () => {

    if(msg.length <= 0)
    {
      return;
    }

    setw(true)
    let t = msg
    setmsg('')
    console.log(t)
    addcon({"role" : "user", "content" : t})

    const tmsg = {
      _id: Math.random().toString(36).substring(7),
      text: t,
      createdAt: new Date(),
      user: { _id: 1, avatar: require("./assets/icon.png")},
    }
    setallmsgs((pmsgs) => GiftedChat.append(pmsgs, [tmsg]))

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
      },
      body:JSON.stringify({
        "model": "gpt-3.5-turbo-16k-0613",
        "messages": context,
        "temperature": 0.1,
      })
    })
    .
    then((answer)=>answer.json()).then( async (result)=>{
      //console.log(result)
      if(result.error != null)
      {
        console.log(result)
        const tmsg = {
          _id: Math.random().toString(36).substring(7),
          text: "rate limit reached.\nLimit: 3 request per minute.".trim(),
          createdAt: new Date(),
          user: { _id: 2, name: "SaneAI", avatar: require("./assets/icon.png") },
        }
        setallmsgs((pmsgs) => GiftedChat.append(pmsgs, [tmsg]))
        setw(false)
        return
      }
      console.log(result.choices[0].message.content)

      result.choices[0].message.content = await GJO(result.choices[0].message.content)

      addcon({"role" : "system", "content" : result.choices[0].message.content})
      
      const tmsg = {
        _id: Math.random().toString(36).substring(7),
        text: result.choices[0].message.content.trim(),
        createdAt: new Date(),
        user: { _id: 2, name: "SaneAI", avatar: require("./assets/icon.png") },
      }
      setallmsgs((pmsgs) => GiftedChat.append(pmsgs, [tmsg]))
      setw(false)
    })
  }

  const orderlistbtn = () => {
    navigation.navigate("OrderList")
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require("./assets/background.png")} style={styles.bckimg}>
  
        <View style={{flex: 1}}>
  
          <View style={styles.chatbox}>
            <GiftedChat minInputToolbarHeight={0} renderDay={MyDate} renderTime={MyTimeBub} messages={allmsgs} showUserAvatar={true} renderInputToolbar={()=>{}} renderBubble={myBub} renderChatFooter={()=>{}} user={{ _id:1 }}/>
          </View>
  
          <View style={styles.inputarea} display={nobtn.btn1}>
          
            <TextInput placeholder='enter your message' multiline style={styles.inputbox} onChangeText={(m) => setmsg(m)} value={ msg }></TextInput>
        
            <TouchableOpacity style={styles.inputbtn} onPress={BtnAction} disabled={wrk}>
              <MaterialIcons name='send' size={20} color='white' />
            </TouchableOpacity>
            
          </View>
          
          <View style={styles.inputarea}>
            <OButton title={'New Order'} display={nobtn.btn2} onPress={newchatbtn} />
            <OButton title={'Go to Order List'} display={nobtn.btn3} onPress={orderlistbtn} />
          </View>
  
        </View>
      </ImageBackground>
    </View>
  );
}

const boxC = {back: 'white', border: '#80ebc8'}
const btnC = {back: '#80ebc8', border: 'steelblue'}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  bckimg: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  },
  chatbox: {
    flex: 1,
    paddingTop: 0,
    justifyContent: 'center',
  },
  inputarea: {
    bottom: 0,
    padding: 5,
    maxHeight: 125,
    flexDirection: 'row',
  },
  inputbox: {
    flex: 1,
    padding: 10,
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderStyle: 'solid',
    paddingLeft: 15,

    borderColor: boxC.border,
    backgroundColor: boxC.back,
  },
  inputbtn: {
    padding: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: btnC.back,
  },
});