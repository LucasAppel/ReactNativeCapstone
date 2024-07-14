import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Filters = ({ onChange, selections, sections }) => {
  return (
    <View style={styles.filtersContainer}>
      {sections.map((section, index) => (
        <TouchableOpacity key={index}
          onPress={() => {
            onChange(index);
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: selections[index] ? '#495E57' : '#ecf2e9',
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 15
          }}>
          <View>
            <Text style={{ color: selections[index] ? 'white' : '#495E57' }}>
              {section}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    width: '90%',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    marginBottom: 16,
    gap: 5,
    alignSelf: 'center'
  },
});

export default Filters;
