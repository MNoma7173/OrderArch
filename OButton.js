import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';

export default function OButton (props) {

    if(props.display == null)
    {
        props.display = 'block'
    }
    if(props.onPress == null)
    {
        props.onPress = () => {}
    }
    if(props.disabled == null)
    {
      props.disabled = false
    }
    if(props.backgroundimg==null)
    {
      return(
        <View style={{ flex: 1 }} display={props.display}>
            <TouchableOpacity style={props.style==null?styles.btn:props.style} disabled={props.disabled} onPress={props.onPress}>
              <Text style={[props.TextStyle==null?{ fontSize: 15, color: 'white' }:props.TextStyle]}>{props.title}</Text>
            </TouchableOpacity>
        </View>
      )
    }
    else
    {
      return(
        <View style={{ flex: 1 }} display={props.display}>
          <ImageBackground source={props.backgroundimg} style={styles.bckimg} imageStyle={{ borderRadius: 10 }}>
            <TouchableOpacity style={styles.btnimg} disabled={props.disabled} onPress={props.onPress}>
              <Text style={[props.TextStyle==null?{ fontSize: 15, color: 'white' }:props.TextStyle]}>{props.title}</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  btn: {
    margin: 2,
    padding: 10,
    borderWidth: 3,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#22333B',
    borderColor: 'gray',
  },
  btnimg: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bckimg: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});