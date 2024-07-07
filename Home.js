import ProductCart from './ProductCart'
import React from 'react'
import { View } from 'react-native'

export default function Home({navigation}) {
  return(
    <View style={{ flex: 1, marginBottom: 10 }}>
      <ProductCart/>
    </View>
  )
}