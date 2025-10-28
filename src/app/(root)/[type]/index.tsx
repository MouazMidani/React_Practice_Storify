import {  useLocalSearchParams } from 'expo-router'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import Colors, { Colors as stColors, util as stUtil } from "../../../../Styleguide";
import { getFiles } from "../../../../lib/hooks/useFiles";
import { useEffect, useState } from 'react';
import { parseStringify } from '../../../../lib/util';
import Card from '../../../components/Card';
export default function Index() {
    const { type } = useLocalSearchParams()
    const [files, setFiles] = useState([])
    useEffect(() => {
      const _getFiles = async () => {
        const _files = await getFiles();
        setFiles(parseStringify(_files.documents));
        console.log("-> ", files)
      };
    
      _getFiles();
    }, []);
    
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}> 
          <View style={{flex: 1}}>
            <Text style={styles.title}>{ (type as string).charAt(0).toUpperCase() + type.slice(1) }</Text>
            <Text style={styles.totalStorag}>Total: <Text style={{fontWeight: 500}}>0.0 MB</Text></Text>
          </View>
          <Text> Sorting here </Text>
        </View>

        {/* Body */}
        <ScrollView style={{height: '100%', width: '100%'}}> 
          <View style={{display: 'flex', flexDirection: "row", justifyContent: 'space-evenly', flexWrap: 'wrap', height: '100%', width: '100%'}}>
            { 
              !(files.length > 0) 
              ? (<Text>No files availble</Text>)
              : (files.map((f) => 
                <Card 
                  file={f}
                  onPress={() => console.log('Card pressed')}
                  onRename={() => console.log('Rename')}
                  onDetails={() => console.log('Details')}
                  onShare={() => console.log('Share')}
                  onDownload={() => console.log('Download')}
                  onMoveToTrash={() => console.log('Move to trash')}
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
    paddingHorizontal: 10
  },
  title: {
    color: Colors.oxfordBlue,
    ...stUtil.h1
  },
  totalStorag:{
    ...stUtil.body1,
    fontWeight: 400
  }
});