import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'
import Colors, { util as stUtil } from "../../Styleguide"
import { formatFileSize } from '../../lib/util'

interface StorageInfoProps {
    usedBytes: number
    totalBytes: number
}

const CircularProgress = ({ percentage }: { percentage: number }) => {
    const size = 140
    const strokeWidth = 12
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    return (
        <View style={styles.gaugeContainer}>
            <Svg width={size} height={size} style={styles.svgCircle}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={Colors.white}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            <View style={styles.gaugeTextContainer}>
                <Text style={styles.percentageText}>{percentage}%</Text>
                <Text style={styles.gaugeLabel}>Space used</Text>
            </View>
        </View>
    )
}

const StorageInfo: React.FC<StorageInfoProps> = ({ usedBytes, totalBytes }) => {
    const spaceUsedPercentage = Math.round((usedBytes / totalBytes) * 100)
    const usedGB = formatFileSize(usedBytes)
    const totalGB = formatFileSize(totalBytes)

    return (
        <View style={styles.container}>
            <CircularProgress percentage={spaceUsedPercentage} />
            <View style={styles.storageTextSection}>
                <Text style={styles.storageTitle}>Available Storage</Text>
                <Text style={styles.storageValue}>
                    {usedGB} / {totalGB}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.orangeWeb,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    gaugeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    svgCircle: {
        transform: [{ rotate: '0deg' }],
    },
    gaugeTextContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.white,
    },
    gaugeLabel: {
        fontSize: 12,
        color: Colors.white,
        opacity: 0.8,
    },
    storageTextSection: {
        flex: 1,
        paddingLeft: 20,
        alignItems: 'flex-start',
    },
    storageTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 5,
    },
    storageValue: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.white,
    },
})

export default StorageInfo