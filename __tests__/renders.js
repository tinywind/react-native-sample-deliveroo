import React from 'react';
import renderer from 'react-test-renderer';
import { FlatList, Text } from 'react-native';

test('renders correctly', () => {
  const tree = renderer.create(<FlatList data={['item1', 'item2', 'item3']} keyExtractor={e => e} renderItem={({ item }) => <Text>{item}</Text>} />).toJSON();
  expect(tree).toMatchSnapshot();
});
