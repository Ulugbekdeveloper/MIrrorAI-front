import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform } from 'react-native';

export function useBirthdayPicker(value: Date, onPick: (date: Date) => void) {
  const [isIOSPickerVisible, setIsIOSPickerVisible] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') return;
    if (selectedDate) onPick(selectedDate);
  };

  const openPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'date',
        maximumDate: new Date(),
        onChange: handleChange,
      });
    } else {
      setIsIOSPickerVisible(true);
    }
  };

  const closeIOSPicker = () => setIsIOSPickerVisible(false);

  return { isIOSPickerVisible, openPicker, closeIOSPicker, handleChange };
}
