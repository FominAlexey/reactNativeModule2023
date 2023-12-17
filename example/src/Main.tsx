import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  PermissionsAndroid,
  Platform,
  TextInput,
} from 'react-native';
import { NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import App from './App';

const { NotificationModule, PinCodeModule } = NativeModules;

export default function Main() {
  const navigation = useNavigation();
  const [pinCodeInput, setPinCodeInput] = React.useState('');
  const [message, setMessage] = React.useState('');

  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS!
        );
      } catch (error) {}
    }
  };

  React.useEffect(() => {
    checkApplicationPermission().then(() => {
        NotificationModule.sendNotification(
          'Добро пожаловать!',
          ''
        );
    });
  }, []);

  const handleSavePinCode = () => {
    PinCodeModule.savePinCode(pinCodeInput);
    checkApplicationPermission().then(() => {
      NotificationModule.sendNotification(
        'Пин-код сохранен',
        ''
      );
    });
    setMessage('Пин-код сохранен');
    setPinCodeInput('');
  };

  const logout = () => {
    setMessage('Выполнен выход');
    setPinCodeInput('');
    navigation.navigate('App'); // TODO скорее всего не работает
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setPinCodeInput}
        value={pinCodeInput}
        placeholder="Введите пин-код"
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
      />
      <View style={styles.buttonsContainer}>
        <Button onPress={handleSavePinCode} title="Сохранить пин-код" />
        <Button onPress={logout} title="Выйти" />
      </View>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
  },
});
