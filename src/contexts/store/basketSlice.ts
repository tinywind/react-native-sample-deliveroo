import { createSlice } from '@reduxjs/toolkit';

export type BasketProps = { restaurantId?: string; dishes: Record<number, number> };

const basketSlice = createSlice({
  name: 'basket',
  initialState: { restaurantId: undefined, dishes: {} } as BasketProps,
  reducers: {
    changeRestaurantId: (state, action: { payload: { restaurantId: string }; type: string }) => {
      state.restaurantId = action.payload.restaurantId;
      state.dishes = {};
    },
    addDish: (state, action: { payload: { dishId: number }; type: string }) => {
      state.dishes[action.payload.dishId] = 1;
      return state;
    },
    removeDish: (state, action: { payload: { dishId: number }; type: string }) => {
      delete state.dishes[action.payload.dishId];
      return state;
    },
    changeDishQuantity: (state, action: { payload: { dishId: number; quantity: number }; type: string }) => {
      state.dishes[action.payload.dishId] = action.payload.quantity;
      if (action.payload.quantity <= 0) delete state.dishes[action.payload.dishId];
      return state;
    },
  },
});

export const { changeRestaurantId, addDish, removeDish, changeDishQuantity } = basketSlice.actions;

export default basketSlice.reducer;
