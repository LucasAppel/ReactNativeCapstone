import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import {
  createTable,
  getMenuItems,
  saveMenuItems,
  filterByQueryAndCategories,
} from '../utils/database';
import Filters from '../components/Filters';
import { getMenuItemsImages, useUpdateEffect } from '../utils';

const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
const sections = ['Starters', 'Mains', 'Desserts', 'Drinks'];

const Item = ({ title, desc, price, img }) => (
  <View style={styles.item}>
    <View style={{flex: 0.7}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text} numberOfLines={2}>{desc}</Text>
        <Text style={styles.title}>${price}</Text>
    </View>
    <View style={{flex: 0.25, justifyContent: 'center', alignContent: 'center'}
}>
        <Image source={{uri: img}} style={styles.image} />
    </View>
  </View>
);

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState('');
  const [query, setQuery] = useState('');
  const [filterSelections, setFilterSelections] = useState(
    sections.map(() => false)
  );


  const fetchData = async() => {
    // 1. Implement this function
    let menuItems;
    try {
      let response = await fetch(API_URL);
      // Fetch the menu from the API_URL endpoint. You can visit the API_URL in your browser to inspect the data returned
      // The category field comes as an object with a property called "title". You just need to get the title value and set it under the key "category".
      // So the server response should be slighly transformed in this function (hint: map function) to flatten out each menu item in the array,
      menuItems = (await response.json()).menu;
      menuItems = menuItems.map((item)=>({...item}));
    }
    catch (e) {
      menuItems = [];
      console.error("Could not fetch menu items!")
    }
    return menuItems;
  }

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();

        // The application only fetches the menu data once from a remote URL
        // and then stores it into a SQLite database.
        // After that, every application restart loads the menu from the database
        if (!menuItems.length) {
          menuItems = await fetchData();
          await saveMenuItems(menuItems);

        }

        const menuItemsWithImages = await getMenuItemsImages(menuItems);
        setData(menuItemsWithImages);
      } catch (e) {
        // Handle error
        Alert.alert(e.message);
      }
    })();
  }, []);

  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        // If all filters are deselected, all categories are active
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
      });
      try {
        const menuItems = await filterByQueryAndCategories(
          query,
          activeCategories
        );
        const menutItemsWithImgs = await getMenuItemsImages(menuItems);       
        setData(menutItemsWithImgs);
      } catch (e) {
        Alert.alert(e.message);
      } 
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
        <View style={styles.banner}>
            <Text style={styles.header}>Little Lemon</Text>
            <Text style={[styles.title, {color: 'white'}]}>Chicago</Text>
            <Text style={[styles.text, {color: 'white'}]}>We are family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
        </View>
        <View style={{flex: 1, backgroundColor: 'white'}}>
            <Searchbar
                placeholder="Search"
                placeholderTextColor="white"
                onChangeText={handleSearchChange}
                value={searchBarText}
                style={styles.searchBar}
                iconColor="white"
                inputStyle={{ color: 'white' }}
                elevation={0}
            />
            <Filters
                selections={filterSelections}
                onChange={handleFiltersChange}
                sections={sections}
            />
            <FlatList
                style={styles.sectionList}
                data={data}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                <Item title={item.name} price={item.price} desc={item.description} img={item.image} key={item.name} />
                )}
                ItemSeparatorComponent={<View style={{borderBottomColor: 'grey', borderBottomWidth: 1}}></View>}
            />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 130,
    backgroundColor: '#495E57',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
    
  },
  sectionList: {
    paddingHorizontal: 16,
    color: 'black'
  },
  searchBar: {
    width: '90%',
    marginBottom: 24,
    backgroundColor: '#495E57',
    shadowRadius: 0,
    shadowOpacity: 0,
    alignSelf: 'center',
    marginTop: 20
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 10
  },
  header: {
    fontSize: 24,
    paddingTop: 8,
    color: '#F4CE14',
    backgroundColor: '#495E57',
    fontWeight: 'bold',
    fontFamily: 'MarkaziText_700Bold'
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    paddingBottom: 10
  },
  text: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'light'
  },
  image: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 10,
    resizeMode: 'cover',
  },
});
