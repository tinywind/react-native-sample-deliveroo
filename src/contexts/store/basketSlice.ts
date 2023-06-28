import { createSlice } from '@reduxjs/toolkit';

export type BasketProps = { restaurantId?: string; dishes: { dishId: number; dishPrice: number; quantity: number }[] };

const basketSlice = createSlice({
  name: 'basket',
  initialState: { restaurantId: undefined, dishes: {} } as BasketProps,
  reducers: {
    changeRestaurantId: (state, action: { payload: { restaurantId: string }; type: string }) => {
      state.restaurantId = action.payload.restaurantId;
      state.dishes = [];
    },
    addDish: (state, action: { payload: { dishId: number; dishPrice: number }; type: string }) => {
      const dish = state.dishes.find(e => e.dishId === action.payload.dishId);
      if (dish) dish.quantity++;
      else state.dishes.push({ dishId: action.payload.dishId, dishPrice: action.payload.dishPrice, quantity: 1 });
      return state;
    },
    removeDish: (state, action: { payload: { dishId: number }; type: string }) => {
      const index = state.dishes.findIndex(e => e.dishId === action.payload.dishId);
      if (index >= 0) state.dishes.splice(index, 1);
      return state;
    },
    changeDishQuantity: (state, action: { payload: { dishId: number; dishPrice: number; quantity: number }; type: string }) => {
      const dish = state.dishes.find(e => e.dishId === action.payload.dishId);
      if (dish) dish.quantity = action.payload.quantity;
      else state.dishes.push({ dishId: action.payload.dishId, dishPrice: action.payload.dishPrice, quantity: action.payload.quantity });
      return state;
    },
  },
});

export const { changeRestaurantId, addDish, removeDish, changeDishQuantity } = basketSlice.actions;

export default basketSlice.reducer;
