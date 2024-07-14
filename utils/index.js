import { useRef, useEffect } from 'react';

export const SECTION_LIST_MOCK_DATA = [
    {
      title: 'Appetizers',
      data: [
        {
          id: '1',
          title: 'Pasta',
          price: '10',
        },
        {
          id: '3',
          title: 'Pizza',
          price: '8',
        },
      ],
    },
    {
      title: 'Salads',
      data: [
        {
          id: '2',
          title: 'Caesar',
          price: '2',
        },
        {
          id: '4',
          title: 'Greek',
          price: '3',
        },
      ],
    },
  ];

/**
 * 3. Implement this function to transform the raw data
 * retrieved by the getMenuItems() function inside the database.js file
 * into the data structure a SectionList component expects as its "sections" prop.
 * @see https://reactnative.dev/docs/sectionlist as a reference
 */

export async function getMenuItemsImages(data){
  async function getImage(imgURL){
    let img = await fetch(imgURL);
    return img.url;
  }
  const dataWithImages = data.map(async (item)=>{
    try {
      let imageURL = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;
      let image = await getImage(imageURL);
      return {...item, image: image}
    }
    catch (e){
      console.error("Could not fetch image for menuitem: " + item.name + " ERROR: " + e);
      return {...item}
    }
  })
  return await Promise.all(dataWithImages);
}

export function getSectionListData(data) {
  // SECTION_LIST_MOCK_DATA is an example of the data structure you need to return from this function.
  // The title of each section should be the category.
  // The data property should contain an array of menu items. 
  // Each item has the following properties: "id", "title" and "price"
  let sectionListDict = {};
  for (let item of data){
    sectionListDict[item.category] = sectionListDict[item.category] ?? [];
    sectionListDict[item.category].push({
      id: item.name,
      name: item.name,
      price: item.price,
      image: item.image
    })
  }

  let sectionListData = [];
  for (let key in sectionListDict){
    sectionListData.push({
      title: key,
      data: sectionListDict[key]
    })
  }
  return sectionListData;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
