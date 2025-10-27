import { FC, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { navItems } from '../constants/NavItems';

const { width } = Dimensions.get('window');

const MobileNavigation: FC = () => {
  const [visible, setVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width * 0.8));
  const router = useRouter();

  const openMenu = () => {
    setVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 90,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.8,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const handleNavigation = (route: string) => {
    closeMenu();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  return (
    <>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
          <View style={styles.hamburger}>
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require("../../assets/favicon.png")}
            style={styles.logoImage}
          />
        </View>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <View style={styles.modalContainer}>
          <Pressable style={styles.overlay} onPress={closeMenu} />
          
          <Animated.View
            style={[
              styles.sheet,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <View style={styles.header}>
              <View style={styles.userProfile}>
                <Image 
                  style={{width: 50, height: 50, borderRadius: "100%"}} 
                  source={"https://www.shutterstock.com/image-vector/vector-bright-portrait-beautiful-brunette-600nw-2452267975.jpg"}
                />
                <View style={{display: "flex", gap: 2}}>
                  <Text style={{color: "white"}}>asd</Text>
                  <Text style={{color: "white"}}>asd@gmail.com</Text>
                </View>
              </View>
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              {navItems.concat({
                name: "Logout",
                icon: require("../../assets/logout.png"),
                url: "/logout"
              }).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.navItem}
                  onPress={() => handleNavigation(item.url)}
                  activeOpacity={0.7}
                >
                  <Image 
                    source={item.icon as ImageSourcePropType} 
                    style={styles.navIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.navLabel}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <Text style={styles.footerText}>v1.0.0</Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#14213dff',
  },
  menuButton: {
    padding: 12,
    borderRadius: 8,
  },
  logoContainer: {
    paddingHorizontal: 12,
  },
  logoImage: {
    width: 50, height: 50
  },
  hamburger: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#ffffffff',
    borderRadius: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#ffffffff',
    shadowColor: '#000000ff',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5ff',
    backgroundColor: '#14213dff',
  },
  userProfile: {
    display: "flex", 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10, 
    borderRadius: 30
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#ffffffff',
    fontWeight: '300',
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5ff',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: '#14213dff',
  },
  navLabel: {
    fontSize: 18,
    color: '#14213dff',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5ff',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#14213dff',
    opacity: 0.6,
  },
});

export default MobileNavigation;