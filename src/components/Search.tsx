import {FC, useRef} from 'react'
import { Image, StyleSheet, TextInput, View } from 'react-native'
import { useQueryStore } from '../../lib/stores/QueryStore';
import { usePathname } from 'expo-router';
const Search: FC = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setQueries = useQueryStore(state => state.setQueries)
  const setSearch = useQueryStore(state => state.setSearch)
  const type = usePathname().split('/')[1]
  const handleSearch = (params: string) => {
    setSearch(params)
    if(timeoutRef.current)
      clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setQueries(type)
      clearTimeout(timeoutRef.current)
    }, 500)
  }
  return (
    <View style={style.searchBar}>
        <Image
            source={require("../../assets/Search.png")}
        />
        <TextInput
            style={style.input}
            placeholder='search for a file'
            placeholderTextColor={"#00000080"}
            onChange={(e) => handleSearch(e.target.value)}
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