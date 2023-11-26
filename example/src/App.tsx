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

const { NotificationModule, PinCodeModule } = NativeModules;

export default function App() {
  const [pinCodeInput, setPinCodeInput] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    // Здесь ваш useEffect
  }, []);

  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS!
        );
      } catch (error) {}
    }
  };

  const handleSavePinCode = () => {
    PinCodeModule.savePinCode(pinCodeInput);
    setMessage('Пин-код сохранен');
    setPinCodeInput('');
  };

  const handleCheckPinCode = () => {
    PinCodeModule.checkPinCode(pinCodeInput)
      .then((isCorrect: any) => {
        if (isCorrect) {
          setMessage('Пин-код верный');
          // Разблокируйте приложение или выполните другие необходимые действия
        } else {
          setMessage('Неверный пин-код');
          // Обработка неверного пин-кода
        }
        setPinCodeInput('');
      })
      .catch((error: any) => {
        setMessage('Ошибка проверки пин-кода: ' + error);
        console.error('Ошибка проверки пин-кода:', error);
        setPinCodeInput('');
      });
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          checkApplicationPermission().then(() => {
            NotificationModule.sendNotification(
              'Заголовок123',
              'Текст уведомления'
            );
          });
        }}
        title="call native function"
      />
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
        <Button onPress={handleCheckPinCode} title="Проверить пин-код" />
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
