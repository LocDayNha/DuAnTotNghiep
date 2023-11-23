import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useCallback, useRef, useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/index';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Pressable } from 'react-native';
import AxiosInstance from '../../components/ultil/AxiosInstance';
import { UIActivityIndicator } from 'react-native-indicators';
import noImageAvailable from '../../assets/images/no_image_available.jpg';
import { AppContext } from '../../components/ultil/AppContext';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ToastAndroid } from 'react-native';

const SearchDetail = () => {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (searchText.trim() !== '') {
      handleSearch(searchText);
    } else {
      setNoResults(true);
      setSearchResults([]);
    }
  }, [searchText]);

  const handleBlur = () => {
    setNoResults(false);
  };

  const handleFocus = () => {
    setSearchText('');
  };

  const handleSearch = async (name) => {
    try {
      // Gọi hàm tìm kiếm từ AxiosInstance
      const response = await AxiosInstance().get(`/product/search-by-name?query=${name}`);
      if (response?.products) {
        setSearchResults(response?.products);
        setNoResults(response.products.length === 0);
      } else {
        setNoResults(true);
        ToastAndroid.show('Lấy dữ liệu thất bại', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setNoResults(true);
      ToastAndroid.show('Lỗi kết nối', ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={styles.cartDetailTitle}>TÌM KIẾM</Text>
        </View>
      </SafeAreaView>
      <View>
        <View
          style={{
            paddingLeft: 7,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 0.5,
            borderTopWidth: 0.5,
            borderBottomColor: COLORS.gray2,
            borderTopColor: COLORS.gray2,
            height: 50,
            width: '100%',
          }}
        >
          <TouchableOpacity>
            <Ionicons style={{ marginRight: 5 }} name="search" size={22} color="black" />
          </TouchableOpacity>
          <TextInput
            style={{ fontSize: 16 }}
            placeholder="Tìm sản phẩm..."
            onChangeText={(text) => setSearchText(text)}
            onBlur={handleBlur}
            onFocus={handleFocus}
          />
        </View>
        {noResults && (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
            Không tìm thấy sản phẩm.
          </Text>
        )}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={searchResults}
          renderItem={({ item, index }) => (
            <View
              style={{
                // backgroundColor: COLORS.gray2,
                padding: 15,
                borderWidth: 0.2,
                borderColor: COLORS.gray2,
              }}
            >
              <View>
                <Pressable
                  style={{ width: 180, height: 180 }}
                  onPress={() => {
                    navigation.navigate('ProductDetail', {
                      id: item._id,
                    });
                  }}
                >
                  {item?.variances[0]?.images[0]?.url ? (
                    <Image
                      style={{ flex: 1 }}
                      source={{
                        uri: item?.variances[0].images[0].url,
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image resizeMode="contain" source={noImageAvailable} />
                  )}
                </Pressable>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item?.title}</Text>
                <Text style={{ fontSize: 16, color: COLORS.primary }}>
                  đ{item?.price.toLocaleString()}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
  );
};

export default SearchDetail;

const styles = StyleSheet.create({
  cartDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 26,
  },
  placeToShip: {
    fontSize: 18,
    fontWeight: 'normal',
  },
});
