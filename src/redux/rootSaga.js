import { all } from 'redux-saga/effects';
import { cartSaga } from './cart/cartSaga';
import { productSaga } from './products/productSaga';
import { favoritesSaga } from './favorites/favoritesSaga';
import { userSaga } from './user/userSaga';
import { orderSaga } from './orders/orderSaga';
import { authSaga } from './auth/authSaga';
import { drawerSaga } from './drawer/drawerSaga';

export default function* rootSaga() {
 yield all([
  cartSaga(),
  productSaga(),
  favoritesSaga(),
  userSaga(),
  orderSaga(),
  authSaga(),
  drawerSaga(),
 ]);
}
