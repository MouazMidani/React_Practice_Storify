import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Colors, { util as stUtil } from "../../../../Styleguide"
import { getFiles } from "../../../../lib/hooks/useFiles"
import { useEffect, useState } from 'react'
import { parseStringify } from '../../../../lib/util'
import Card from '../../../components/Card'
import { getCurrentUser } from '../../../../lib/hooks/userHook'
import { useQueryStore } from '../../../../lib/stores/QueryStore'
import { usePathname } from 'expo-router'
import SortDropdown from '../../../components/SortDropdown'
export default function Index() {
    const [files, setFiles] = useState([])
    const [user, setUser] = useState()
    const setQueries = useQueryStore(state => state.setQueries)
    const setSort = useQueryStore(state => state.setSort)
    const queries = useQueryStore(state => state.queries)
    const type = usePathname().split('/')[1]
    useEffect(() => {
      user && setQueries(type)
    }, [type])
    
    useEffect(() => {
      const _getFiles = async () => {
        const _files = await getFiles()
        setFiles(parseStringify(_files.documents))
        const _user = await getCurrentUser()
        setUser(_user)
      }
      _getFiles()
    }, [queries])
    
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}> 
          <View style={{flex: 1}}>
            <Text style={styles.title}>{ (type as string).charAt(0).toUpperCase() + type.slice(1) + (!["dashboard", "media"].includes(type as string)  ? "s" : "") }</Text>
            <Text style={styles.totalStorag}>Total: <Text style={{fontWeight: 500}}>0.0 MB</Text></Text>
          </View>
          <SortDropdown onSortChange={(key) => {
            setSort(key)
            setQueries(type)
          }}/>
        </View>

        {/* Body */}
        <ScrollView style={{height: '100%', width: '100%'}}> 
          <View style={{display: 'flex', flexDirection: "row", justifyContent: 'flex-start', flexWrap: 'wrap', height: '100%', width: '100%'}}>
            { 
              !(files.length > 0) 
              ? (<Text>No files availble</Text>)
              : (files.map((f) => 
                <Card 
                  key={f.$id || f.name} 
                  file={f}
                  user={user}
                />
              ))
            }
          </View>
        </ScrollView>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: "column"
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: 25
  },
  title: {
    color: Colors.oxfordBlue,
    ...stUtil.h1
  },
  totalStorag:{
    ...stUtil.body1,
    fontWeight: 400
  }
})