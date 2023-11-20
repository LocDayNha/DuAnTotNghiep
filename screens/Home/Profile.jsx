import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SIZES } from '../../constants/index';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/index';
import { AppContext } from '../../components/ultil/AppContext';
import AxiosIntance from '../../components/ultil/AxiosIntance';
import { launchCameraAsync, launchImageLibraryAsync } from 'expo-image-picker';
import { ToastAndroid } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Profile = () => {
  const navigation = useNavigation();
  const { inforuser, setinforuser } = useContext(AppContext);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [dob, setDob] = useState(inforuser.dob);
  const updateprofile = async () => {
    const response = await AxiosIntance().put('/user/update/' + inforuser._id, {
      name: inforuser.name,
      email: inforuser.email,
      address: inforuser.address,
      phoneNumber: inforuser.phoneNumber,
      dob: dob,
      image: inforuser.image,
      gender: inforuser.gender,
    });
    if (response.result) {
      ToastAndroid.show('Cập nhật thành công', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Cập nhật không thành công', ToastAndroid.SHORT);
    }
  };
  const dialogImageChoose = () => {
    return Alert.alert('Thông báo', 'Chọn phương thức lấy ảnh', [
      {
        text: 'Chụp ảnh ',
        onPress: () => {
          capture();
        },
      },
      {
        text: 'Tải ảnh lên',
        onPress: () => {
          getImageLibrary();
        },
      },
      {
        text: 'Hủy',
      },
    ]);
  };
  const capture = async () => {
    const result = await launchCameraAsync();
    console.log(result.assets[0].uri);
    const formdata = new FormData();
    formdata.append('image', {
      uri: result.assets[0].uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    const response = await AxiosIntance('multipart/form-data').post('/user/upload-image', formdata);
    console.log(response.link);
    if (response.result) {
      setinforuser({ ...inforuser, image: response.link });
      ToastAndroid.show('Upload Image Success', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Upload Image Failed', ToastAndroid.SHORT);
    }
  };
  const getImageLibrary = async () => {
    const result = await launchImageLibraryAsync();
    console.log(result.assets[0].uri);
    const formData = new FormData();
    formData.append('image', {
      uri: result.assets[0].uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });
    const response = await AxiosIntance('multipart/form-data').post('/user/upload-image', formData);
    console.log(response.link);
    if (response.result) {
      setinforuser({ ...inforuser, image: response.link });
      ToastAndroid.show('Upload Image Success', ToastAndroid.SHORT);
    } else {
      ToastAndroid.show('Upload Image Failed', ToastAndroid.SHORT);
    }
  };
  const onChange = ({ type }, selectedDate) => {
    if (type == 'set') {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (Platform.OS === 'android') {
        toggleDatePicker();
        setDob(formatDate(currentDate));
      }
    } else {
      toggleDatePicker();
    }
  };
  const formatDate = (rawDate) => {
    let date = new Date(rawDate);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    //Bé hơn 10 thì thêm số 0
    month = month < 10 ? `0${month}` : `${month}`;
    day = day < 10 ? `0${day}` : `${day}`;
    return `${day}-${month}-${year}`;
  };
  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.profile}>
          <View>
            <TouchableOpacity onPress={()=>{ navigation.goBack() }}>
              <Ionicons name="arrow-back-outline" size={30} />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.title}>Thông tin người dùng</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={dialogImageChoose} style={styles.circle}>
            {inforuser.image == '' ? (
              <Image style={styles.image} source={require('../../assets/images/fn2.jpg')}></Image>
            ) : (
              <Image style={styles.image} source={{ uri: inforuser.image }} />
            )}
          </TouchableOpacity>
          <Image
            style={{ marginTop: 70, marginLeft: -10 }}
            source={require('../../assets/images/editing.png')}
          ></Image>
        </View>
        <KeyboardAvoidingView>
          <View style={styles.viewItem}>
            <TextInput
              style={styles.textHint}
              value={inforuser.email}
              onChangeText={(text) => setinforuser({ ...inforuser, email: text })}
              placeholder="Email"
              placeholderTextColor="gray"
            ></TextInput>
          </View>
          <View style={styles.viewItem}>
            <TextInput
              style={styles.textHint}
              value={inforuser.name}
              onChangeText={(text) => setinforuser({ ...inforuser, name: text })}
              placeholder="Martias Duarte"
              placeholderTextColor="gray"
            ></TextInput>
          </View>
          <View style={styles.viewItem}>
            <TextInput
              style={styles.textHint}
              value={inforuser.address}
              onChangeText={(text) => setinforuser({ ...inforuser, address: text })}
              placeholder="Address"
              placeholderTextColor="gray"
            ></TextInput>
          </View>
          <View style={styles.viewItem}>
            <TextInput
              style={styles.textHint}
              value={'0' + inforuser.phoneNumber}
              onChangeText={(text) => setinforuser({ ...inforuser, phoneNumber: text })}
              placeholder="Phone number"
              placeholderTextColor="gray"
            ></TextInput>
          </View>
          <View style={styles.viewItem}>
            <TextInput
              style={styles.textHint}
              placeholder="gender"
              value={inforuser.gender}
              onChangeText={(text) => setinforuser({ ...inforuser, gender: text })}
              placeholderTextColor="gray"
            ></TextInput>
          </View>
          <View>
            {showPicker && (
              <RNDateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
                positiveButton={{ label: 'OK', textColor: COLORS.black }}
                negativeButton={{ label: 'Cancel', textColor: COLORS.tertiary }}
              />
            )}
            <Pressable onPress={toggleDatePicker} style={[styles.viewItem, { marginBottom: 20 }]}>
              <TextInput
                style={styles.textHint}
                placeholder="Birthday"
                editable={false}
                value={dob}
                onChangeText={(text) => setDob({ dob: text })}
              ></TextInput>
            </Pressable>
          </View>
          <Pressable style={styles.btn} onPress={updateprofile}>
            <Text style={styles.btnUpdate}>CẬP NHẬT</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginStart: 10,
    marginEnd: 10,
    marginBottom: 20,
  },
  profile: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 70,
    marginBottom: 20,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  viewItem: {
    marginVertical: 0,
    marginHorizontal: 10,
    marginTop: 25,
    height: 50,
    backgroundColor: '#F5F7F8',
    borderRadius: 10,
    // borderWidth:1
  },
  textHint: {
    marginLeft: 10,
    lineHeight: 24,
    top: '20%',
    color: 'black',
    fontSize: 16,
  },
  btn: {
    backgroundColor: 'black',
    height: 50,
    borderRadius: 10,
  },
  btnUpdate: {
    color: 'white',
    textAlign: 'center',
    top: '20%',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
