import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import HeaderConfig from '@/components/HeaderConfig';

interface Student {
  id: string;
  name: string;
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'select';

const students: Student[] = [
  { id: '1', name: 'Ava Samantha Arce' },
  { id: '2', name: 'Aaron Josh Baon' },
  { id: '3', name: 'Jorell Andrei Finez' },
  { id: '4', name: 'Julia Ansherina Mendoza' },
  { id: '5', name: 'Gabriel Roberto Cayetano' },
  { id: '6', name: 'Allyza Marielle Goyon' },
  { id: '7', name: 'Josiah Mark Garcia' },
  { id: '8', name: 'Ma. Elizabeth Baltazar' },
  { id: '9', name: 'Ava Samantha Arce' },
  { id: '10', name: 'Aaron Josh Baon' },
  { id: '11', name: 'Jorell Andrei Finez' },
  { id: '12', name: 'Julia Ansherina Mendoza' },
];

const statusOptions: AttendanceStatus[] = ['present', 'absent', 'late'];

const attendanceDetails = () => {
  HeaderConfig('Add Attendance');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [dropdownStudentId, setDropdownStudentId] = useState<string | null>(null);

  const handleStatusSelect = (studentId: string, status: AttendanceStatus) => {
    setStatuses((prev) => ({ ...prev, [studentId]: status }));
    setDropdownStudentId(null);
  };

  const onChangeDate = (_: any, date?: Date) => {
    if (date) setSelectedDate(date);
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>Attendance</Text>
        <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
          <Text>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginBottom: 10, top: -35, color: '#aaa' }}>
        {selectedDate.toDateString()}
      </Text>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}

      <View
        style={{
          backgroundColor: '#f0f0f0',
          height: 3,
          top: -25,
          left: -20,
          width: '113%',
        }}
      />

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        renderItem={({ item }) => {
          const status = statuses[item.id];
          const isDropdownOpen = dropdownStudentId === item.id;

          return (
            <View style={{ marginBottom: 20 }}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={{ position: 'relative' }}>
                  <TouchableOpacity
                    style={[styles.statusButton, status ? styles[status] : styles.select]}
                    onPress={() =>
                      setDropdownStudentId((prev) => (prev === item.id ? null : item.id))
                    }
                  >
                    <Text>
                      {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Select'}{' '}
                      {isDropdownOpen ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  {isDropdownOpen && (
                    <View style={styles.dropdown}>
                      {statusOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.dropdownOption}
                          onPress={() => handleStatusSelect(item.id, option)}
                        >
                          <Text>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                </View>  
              </View>
            </View>
          );
        }}
      />
        <TouchableOpacity>
          <View style={styles.submit}>
            <Text style={{color:"#fff", fontWeight:"bold", textAlign:"center", fontSize:16}}>
              Submit
            </Text>
          </View>
        </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  datePicker: {
    elevation: 3,
    backgroundColor: '#eee',
    padding: 13,
    borderRadius: 8,
    marginBottom: 25,
    width: '45%',
    top: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  name: {
    fontSize: 16,
    top:10
  },
  statusButton: {
    padding: 10,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
    marginBottom:-5
  },
  present: {
    backgroundColor: '#b4e197',
    borderWidth: 1,
    borderColor: '#4E944F',
  },
  absent: {
    backgroundColor: '#f4b4b4',
    borderWidth: 1,
    borderColor: '#E55050',
  },
  late: {
    backgroundColor: '#fce9b2',
    borderWidth: 1,
    borderColor: '#F3C623',
  },
  select: {
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#999',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    zIndex: 999,
    width:90
  },
  dropdownOption: {
    padding: 10,
    minWidth: 90,
    left:5
  },
  submit: {
    backgroundColor:"#ffbf18",
    padding:12,
    borderRadius:50,
    top:5,
    elevation:3,
    marginTop:10

  }
});

export default memo(attendanceDetails);