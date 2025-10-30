import { View, Text, StyleSheet } from 'react-native'
import Colors, { util as stUtil } from "../../Styleguide"
import { Feather } from '@expo/vector-icons'
import { formatDateTime, formatFileSize } from '../../lib/util'
interface CategorySummary {
    title: string
    size: number
    latestDate: string
}

interface FileTypeCategoriesProps {
    summary: CategorySummary[]
}

const CategoryCard = ({ title, size, latestDate }: CategorySummary) => {

    const mapProps = (title: string) => {
        switch (title.toLowerCase()) {
            case 'document':
                return { name: 'Documents', avatar: 'M', color: '#D9537E' }
            case 'image':
                return { name: 'Images', avatar: 'I', color: '#7CCCF1' } 
            case 'video':
            case 'audio':
                return { name: 'Video, Audio', avatar: 'V', color: '#3BE698' }
            case 'other':
                return { name: 'Others', avatar: 'O', color: '#C189F3' } 
            default:
                return { name: title, avatar: title.charAt(0), color: Colors.gray }
        }
    }

    const props = mapProps(title)
    
    const date = new Date(latestDate)
    const formattedDate = formatDateTime(date?.toISOString())

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                {/* Avatar Icon */}
                <View style={[styles.avatar, { backgroundColor: props.color }]}>
                    <Text style={styles.avatarText}>{props.avatar}</Text>
                </View>
                {/* File Size */}
                <Text style={styles.cardSize}>{formatFileSize(size)}</Text>
            </View>
            <Text style={styles.cardName}>{props.name}</Text>
            <Text style={styles.cardUpdate}>Last update</Text>
            <Text style={styles.cardTime}>{formattedDate}</Text>
        </View>
    )
}

const FileTypeCategories: React.FC<FileTypeCategoriesProps> = ({ summary }) => {
    const aggregatedSummary = summary.reduce((acc: CategorySummary[], item) => {
        if (item.title.toLowerCase() === 'video' || item.title.toLowerCase() === 'audio') {
            const videoAudioIndex = acc.findIndex(a => a.title === 'video')
            if (videoAudioIndex !== -1) {
                acc[videoAudioIndex].size += item.size
                if (new Date(item.latestDate) > new Date(acc[videoAudioIndex].latestDate)) {
                    acc[videoAudioIndex].latestDate = item.latestDate
                }
            } else {
                acc.push({...item, title: 'video'})
            }
        } else {
            acc.push(item)
        }
        return acc
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.cardRow}>
                {aggregatedSummary.map((cat, index) => (
                    <CategoryCard key={index} {...cat} />
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    cardRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%', 
        backgroundColor: Colors.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontWeight: 'bold',
        color: Colors.white,
    },
    cardSize: {
        ...stUtil.h3,
        color: Colors.oxfordBlue,
    },
    cardName: {
        ...stUtil.body1,
        color: Colors.oxfordBlue,
        marginBottom: 5,
    },
    cardUpdate: {
        ...stUtil.body2,
        color: Colors.orangeWeb,
    },
    cardTime: {
        ...stUtil.body2,
        color: Colors.orangeWeb,
    }
})

export default FileTypeCategories