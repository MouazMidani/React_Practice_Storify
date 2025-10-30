import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native'
import Colors, { util as stUtil } from "../../../../Styleguide"
import { getFiles, getAllFiles, getTotalSpaceUsed } from "../../../../lib/hooks/useFiles"
import { useEffect, useState } from 'react'
import { parseStringify } from '../../../../lib/util'
import Card from '../../../components/Card'
import { getCurrentUser } from '../../../../lib/hooks/userHook'
import { useQueryStore } from '../../../../lib/stores/QueryStore'
import { usePathname } from 'expo-router'
import SortDropdown from '../../../components/SortDropdown'

import RecentFilesList from '../../../components/RecentFilesList' 
import StorageInfo from '../../../components/StorageInfo' 
import FileTypeCategories from '../../../components/FileTypeCategories' 

interface TotalSpaceData {
    used: number
    total: number
}

interface UsageSummaryItem {
    title: string
    size: number
    latestDate: string
}

export default function Index() {
    const [files, setFiles] = useState([])
    const [user, setUser] = useState()

    const [totalSpaceData, setTotalSpaceData] = useState<TotalSpaceData | null>(null);
    const [usageSummary, setUsageSummary] = useState<UsageSummaryItem[]>([]);

    const setQueries = useQueryStore(state => state.setQueries)
    const setSort = useQueryStore(state => state.setSort)
    const queries = useQueryStore(state => state.queries)
    
    const isWeb = Dimensions.get('window').width > 768; 
    const type = usePathname().split('/')[1] as string;
    const isDashboard = type === 'dashboard';

    useEffect(() => {
      if (!isDashboard) {
        user && setQueries(type)
      }
    }, [type, isDashboard, user, setQueries])
    
    useEffect(() => {
      const _getData = async () => {
        const _user = await getCurrentUser()
        setUser(_user)

        if (isDashboard) {
            try {
              console.log("-> heree")
                const [recentFilesResponse, totalSpaceResponse] = await Promise.all([
                    getAllFiles(),
                    getTotalSpaceUsed(),
                ])
                console.log("-> heree then")

                setFiles(parseStringify(recentFilesResponse.documents));

                setTotalSpaceData({
                    used: totalSpaceResponse.used,
                    total: totalSpaceResponse.all
                })
                
                const summary: UsageSummaryItem[] = [
                    {
                        title: 'document',
                        size: totalSpaceResponse.document.size,
                        latestDate: totalSpaceResponse.document.latestDate || new Date().toISOString()
                    },
                    {
                        title: 'image',
                        size: totalSpaceResponse.image.size,
                        latestDate: totalSpaceResponse.image.latestDate || new Date().toISOString()
                    },
                    {
                        title: 'video',
                        size: totalSpaceResponse.video.size,
                        latestDate: totalSpaceResponse.video.latestDate || new Date().toISOString()
                    },
                    {
                        title: 'audio',
                        size: totalSpaceResponse.audio.size,
                        latestDate: totalSpaceResponse.audio.latestDate || new Date().toISOString()
                    },
                    {
                        title: 'other',
                        size: totalSpaceResponse.other.size,
                        latestDate: totalSpaceResponse.other.latestDate || new Date().toISOString()
                    }
                ];
                
                setUsageSummary(summary);

            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            }
        } else {
            const _files = await getFiles()
            setFiles(parseStringify(_files.documents))
        }
      }
      _getData()
    }, [queries, isDashboard])

    if (isDashboard) {
      console.log("-> ", totalSpaceData)
        const storageProps = totalSpaceData 
            ? { 
                usedBytes: totalSpaceData.used, 
                totalBytes: totalSpaceData.total 
              } 
            : null;
        
        return (
            <View style={styles.dashboardWrapper}>
                <ScrollView style={styles.dashboardContainer} contentContainerStyle={isWeb ? styles.dashboardContentWeb : styles.dashboardContentMobile}>
                    {/* Left Side: Storage Info and Categories */}
                    <View style={isWeb ? styles.dashboardLeftWeb : styles.dashboardLeftMobile}>
                        {storageProps && <StorageInfo {...storageProps} />}
                        <FileTypeCategories summary={usageSummary} /> {/* full summary */}
                    </View>
                    
                    {/* Right Side: Recent Files */}
                    <View style={isWeb ? styles.dashboardRightWeb : styles.dashboardRightMobile}>
                        <RecentFilesList files={files} /> {/* recent files */}
                    </View>
                </ScrollView>
            </View>
        )
    }

    // --- Default File List View  ---
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}> 
          <View style={{flex: 1}}>
            <Text style={styles.title}>{ type.charAt(0).toUpperCase() + type.slice(1) + (!["dashboard", "media"].includes(type) ? "s" : "") }</Text>
            <Text style={styles.totalStorag}>Total: <Text style={{fontWeight: '500'}}>0.0 MB</Text></Text>
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
        flexDirection: "column",
      },
      // --- Dashboard Styles ---
      dashboardWrapper: {
        flex: 1,
        height: Dimensions.get('window').height,
      },
      dashboardContainer: {
        flex: 1,
        padding: 25,
      },
      dashboardContentWeb: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: '100%',
      },
      dashboardContentMobile: {
        flexDirection: 'column',
      },
      dashboardLeftWeb: {
        flex: 0.6,
        marginRight: 25,
      },
      dashboardRightWeb: {
        flex: 0.4,
      },
      dashboardLeftMobile: {
        marginBottom: 25,
        height: "100%"
      },
      dashboardRightMobile: {
        marginBottom: 25,
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
      }
})