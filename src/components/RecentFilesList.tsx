import { View, Text, StyleSheet, ScrollView } from 'react-native'
import Colors, { util as stUtil } from "../../Styleguide"
import { Feather } from '@expo/vector-icons'
import { formatDateTime } from '../../lib/util';

interface FileDocument {
    $id: string;
    name: string;
    $createdAt: string
    type: 'image' | 'document' | 'video' | 'audio' | 'other';
}

interface RecentFilesListProps {
    files: FileDocument[]
}

const RecentFilesList: React.FC<RecentFilesListProps> = ({ files }) => {

    const getFileProps = (type: string) => {
        switch (type) {
            case 'document':
                return { icon: 'file-text', color: '#D9537E' }
            case 'image':
                return { icon: 'image', color: '#7CCCF1' }
            case 'video':
            case 'audio':
                return { icon: 'video', color: '#3BE698' }
            default:
                return { icon: 'file', color: '#C189F3' }
        }
    }
    
    const FileListItem = ({ file }: { file: FileDocument }) => {
        const props = getFileProps(file.type)
        const date = new Date(file.$createdAt)
        const formattedTS = formatDateTime(date.toISOString())

        return (
            <View style={styles.fileItem}>
                <View style={[styles.iconCircle, { backgroundColor: props.color }]}>
                    <Feather name={props.icon as any} size={16} color={Colors.white} />
                </View>

                <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                    <Text style={styles.fileTimestamp}>{formattedTS}</Text>
                </View>
                
                <Feather name="more-vertical" size={20} color={Colors.gray} />
            </View>
        )
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={styles.title}>Recent files uploaded</Text>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.list}>
                        {files.length > 0 ? (
                            files.map((file) => (
                                <FileListItem key={file.$id} file={file} />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No recent files available.</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        height: 600,
        maxHeight: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white, 
        borderRadius: 15,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollView: {
        flex: 1,
    },
    title: {
        ...stUtil.h2,
        fontSize: 22,
        color: Colors.oxfordBlue,
        marginBottom: 15,
        fontWeight: '600'
    },
    list: {},
    fileItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.platinumShades[300],
    },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    fileDetails: {
        flex: 1,
        marginRight: 15,
    },
    fileName: {
        ...stUtil.body1,
        color: Colors.oxfordBlue,
    },
    fileTimestamp: {
        ...stUtil.body2,
        color: Colors.platinum,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.platinum,
        paddingVertical: 20,
    }
})

export default RecentFilesList