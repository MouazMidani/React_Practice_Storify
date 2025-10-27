import {FC} from 'react'
import { Image, StyleSheet, TextInput, View } from 'react-native'

const Search: FC = () => {
  return (
    <View style={style.searchBar}>
        <Image
            source={require("../../assets/Search.png")}
        />
        <TextInput
            style={style.input}
            placeholder='search for a file'
            placeholderTextColor={"#00000080"}
        />
    </View>
  )
}

const style = StyleSheet.create({
  searchBar: {
    flex:1, 
    flexDirection: "row", 
    backgroundColor: "#e5e5e5ff",  
    alignItems: "center", 
    padding: 10, 
    borderRadius: 20, 
    width: "50%",
    elevation: 10
  },
  input: {
    width: '100%', 
    height: 30, 
    paddingHorizontal: 10, 
    fontSize: 16,
    outlineWidth: 0
  }
})

export default Search