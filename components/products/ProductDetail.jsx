import { View, Text, TouchableOpacity, Image, StyleSheet, ToastAndroid } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import Icons from '@expo/vector-icons/MaterialIcons';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../constants';
import BottomSheet from '@gorhom/bottom-sheet';
import { SliderBox } from 'react-native-image-slider-box';
import AxiosIntance from '../../components/ultil/AxiosIntance';
import { useContext } from 'react';
import { AppContext } from '../ultil/AppContext';

const ProductDetail = (props) => {
  const { navigation } = props;
  const { route } = props;
  const { params } = route;
  const { cartItemCount, setCartItemCount } = useContext(AppContext);

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [count, setCount] = useState(1);
  const [imageHeight, setImageHeight] = useState();
  const [isImageFlex, setIsImageFlex] = useState();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [sliderImages, setSliderImages] = useState([]);
  const [colorVariances, setColorVariances] = useState([]);
  const { inforuser } = useContext(AppContext);
  const [sizeVariances, setSizeVariances] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sizesForSelectedColor, setSizesForSelectedColor] = useState([]);
  const [quantityVariences, setQuantityVariences] = useState([]);
  const [remainingQuantity, setRemainingQuantity] = useState(null);
  const [showSizes, setShowSizes] = useState(false);
  const [product, setProduct] = useState('');
  const [isColorSelected, setIsColorSelected] = useState(false);
  const [isSizeSelected, setIsSizeSelected] = useState(false);
  const [hasSelectedColor, setHasSelectedColor] = useState(false);

  const handleSizeSelect = (selectedSize) => {
    setSelectedSize(selectedSize);
    setCount(1);

    // Đặt biến isSizeSelected thành true khi chọn kích thước
    setIsSizeSelected(true);

    // Tìm kích thước tương ứng và lấy số lượng sản phẩm còn lại
    const index = sizesForSelectedColor.findIndex((size) => size.size === selectedSize.size);
    if (index !== -1) {
      setRemainingQuantity(sizesForSelectedColor[index].quantity);
    }
  };

  const handleColorSelect = (color) => {
    // Đặt biến isColorSelected thành true khi chọn màu mới
    setIsColorSelected(true);

    setIsSizeSelected(false);

    const sizesForSelectedColor = getSizesForColor(product?.variances, color);

    setSelectedSize(null); // Đặt kích thước đã chọn về null trước khi chọn màu mới
    setSelectedColor(color);
    setCount(1);
    setSizesForSelectedColor(sizesForSelectedColor);
    setShowSizes(true); // Hiển thị danh sách kích thước
    setHasSelectedColor(true);

    setRemainingQuantity(null);
  };

  function getSizesForColor(variances, color) {
    let sizesForColor = [];

    variances?.forEach((variance) => {
      if (variance?.color === color) {
        sizesForColor = variance?.varianceDetail;
      }
    });

    return sizesForColor;
  }
  // http://localhost:3000/api/cart/new-to-cart
  const addNewCart = async () => {
    const response = await AxiosIntance().post('/cart/new-to-cart', {
      idUser: inforuser._id,
      idProduct: product._id,
      color: selectedColor,
      size: parseInt(selectedSize.size),
      quantity: parseInt(count), //so luong san pham khi chon
    });
    // console.log(count);

    if (response.result) {
      ToastAndroid.show('Thêm vào giỏ hành thành công', ToastAndroid.SHORT);
      // navigation.navigate('Cart');
      setCartItemCount(cartItemCount + 1);
    } else {
      ToastAndroid.show('Thêm thất bại! Hãy kiểm tra lại?', ToastAndroid.SHORT);
    }
    // console.log(count); //so luong san pham user da chon
  };

  //Hiển thị chi tiết sản phẩm theo ID
  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await AxiosIntance().get('/product/get-by-id?id=' + params.id);
        if (response.result === true) {
          const productData = response.product;
          setProduct(productData);
          const imageUrls = [];
          const varianceShoes = [];
          const sizeOfShoes = [];
          const quantityOfShoes = [];

          productData?.variances?.forEach((variance) => {
            varianceShoes.push(variance);

            variance?.images?.forEach((image) => {
              imageUrls.push(image?.url);
            });

            variance?.varianceDetail.forEach((sizes) => {
              sizeOfShoes.push(sizes?.size);
            });
            variance?.varianceDetail.forEach((quantity) => {
              quantityOfShoes.push(quantity?.quantity);
            });
          });

          //lấy dữ liệu thành công
          setTitle(response.product?.title);
          setDescription(response.product.description);
          setPrice(response.product.price);
          setSliderImages(imageUrls);
          setColorVariances(varianceShoes);
          setSizeVariances(sizeOfShoes);
          setQuantityVariences(quantityOfShoes);
        } else {
          ToastAndroid.show('Lấy dữ liệu thất bại', ToastAndroid.SHORT);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        ToastAndroid.show('Lỗi kết nối', ToastAndroid.SHORT);
      }
    };

    getDetails();

    return () => {};
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SliderBox
        sliderBoxHeight={400}
        images={sliderImages}
        dotColor={COLORS.primary}
        dotStyle={{
          width: 15,
          height: 3,
          borderRadius: 5,
          marginHorizontal: 0,
          padding: 0,
          margin: 0,
        }}
        inactiveDotColor={COLORS.gray2}
        ImageComponentStyle={{ width: '100%' }}
      />

      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <StatusBar style="light" />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            gap: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 52,
              aspectRatio: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 52,
              borderWidth: 2,
              borderColor: COLORS.black,
            }}
          >
            <Icons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            style={{
              width: 52,
              aspectRatio: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 52,
              borderWidth: 2,
              borderColor: COLORS.black,
            }}
          >
            <Icons name="favorite-border" size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <BottomSheet
        // detached
        snapPoints={[64, 470]}
        index={1}
        // style={{ marginHorizontal: 20 }}
        // bottomInset={insets.bottom + 20}
        backgroundStyle={{
          borderRadius: 24,
          backgroundColor: colors.background,
        }}
        handleIndicatorStyle={{
          backgroundColor: colors.primary,
        }}
        onChange={() => {
          setImageHeight(imageHeight === '100%' ? '50%' : '100%');
          setIsImageFlex(isImageFlex === 1 ? undefined : 1);
        }}
      >
        <View style={{ padding: 16, gap: 16, flex: 1 }}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 24, color: COLORS.black }}>{title}</Text>

            <Text style={{ fontSize: 14, color: COLORS.red }}>
              {hasSelectedColor && selectedSize
                ? `Chỉ còn ${remainingQuantity} sản phẩm`
                : hasSelectedColor
                ? 'Vui lòng chọn size'
                : 'Vui lòng chọn màu'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: COLORS.black,
                padding: 6,
                borderRadius: 100,
              }}
            >
              <TouchableOpacity
                onPress={() => setCount((count) => Math.max(1, count - 1))}
                style={{
                  backgroundColor: COLORS.lightWhite,
                  width: 24,
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 24,
                }}
              >
                <Icons name="remove" size={20} color={COLORS.black} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: COLORS.white,
                }}
              >
                {count}
              </Text>
              <TouchableOpacity
                onPress={() => setCount((count) => Math.min(remainingQuantity, count + 1))}
                style={{
                  backgroundColor: COLORS.lightWhite,
                  width: 24,
                  aspectRatio: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 24,
                }}
              >
                <Icons name="add" size={20} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'column', gap: 18 }}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 6,
                  justifyContent: 'flex-end',
                }}
              >
                {product?.variances?.map((variance, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleColorSelect(variance?.color)}
                    style={{
                      width: selectedColor === variance?.color ? 34 : 28,
                      height: selectedColor === variance?.color ? 34 : 28,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: variance?.color,
                      borderWidth: selectedColor === variance?.color ? 3 : 1,

                      borderRadius: 44,
                    }}
                  ></TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {showSizes && (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // justifyContent: 'center',
                }}
              >
                {/* <Text style={{ color: colors.text, opacity: 0.5, fontSize: 10 }}>Kích cỡ</Text> */}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 5,
                  // alignSelf: 'center',
                }}
              >
                {sizesForSelectedColor?.map((varianceDetail, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => varianceDetail?.quantity > 0 && handleSizeSelect(varianceDetail)}
                    style={{
                      width: selectedSize === varianceDetail ? 34 : 34,
                      height: selectedSize === varianceDetail ? 34 : 34,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor:
                        selectedSize === varianceDetail ? COLORS.black : 'transparent',
                      borderRadius: 44,
                      opacity: varianceDetail?.quantity > 0 ? 1 : 0.3,
                      borderColor: varianceDetail?.quantity === 0 ? 'transparent' : 'black',
                      borderWidth: selectedSize === varianceDetail ? 2 : 0,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedSize === varianceDetail ? COLORS.white : COLORS.primary,
                        fontWeight: selectedSize === varianceDetail ? '600' : '100',
                        fontSize: selectedSize === varianceDetail ? 24 : 18,
                      }}
                    >
                      {varianceDetail?.size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                marginBottom: 6,
                marginTop: 16,
                color: COLORS.black,
              }}
            >
              Mô tả
            </Text>

            <Text
              style={{ color: COLORS.black, opacity: 0.75, letterSpacing: 0.5 }}
              numberOfLines={12}
            >
              {description}
            </Text>
          </View>
          <View style={{ flex: 1 }} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              justifyContent: 'space-between',
              // flex: 1,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '600', letterSpacing: 1 }}>
              đ{price?.toLocaleString()}
            </Text>

            <TouchableOpacity
              onPress={addNewCart}
              style={{
                backgroundColor: colors.primary,
                height: 64,
                borderRadius: 64,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flexDirection: 'row',
                padding: 12,
              }}
              disabled={!isColorSelected || !isSizeSelected}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '600',
                  color: colors.background,
                  paddingHorizontal: 10,
                }}
              >
                Thêm vào giỏ hàng
              </Text>

              <View
                style={{
                  backgroundColor: colors.card,
                  width: 40,
                  aspectRatio: 1,
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icons name="arrow-forward" size={24} color={colors.text} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default ProductDetail;
