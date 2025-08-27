// e-commerce/structs.js
import * as s from 'superstruct';
import isEmail from 'is-email';
// 지금은 is-uuid가 필요하지 않다.

/* ========== User ========== */
export const CreateUser = s.object({
  // 예를 들어 email 문자열이 실제 이메일 주소인지 검사하고, firstName과 lastName은 영어 이름까지 고려해서 1~30글자 사이인지 확인해보겠다.
  email: s.define('Email', isEmail),
  firstName: s.size(s.string(), 1, 30),
  lastName: s.size(s.string(), 1, 30),
  address: s.string(),
});

export const PatchUser = s.partial(CreateUser);

/* ========== Product ========== */
const category = ['FASHION', 'SPORTS', 'ELECTRONICS', 'HOME_INTERIOR', 'HOUSEHOLD_SUPPLIES', 'KITCHENWARE'];
export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 60),
  description: s.string(),
  category: s.enums(category),
  // category: s.enums(['FASHION', 'SPORTS', 'ELECTRONICS', 'HOME_INTERIOR', 'HOUSEHOLD_SUPPLIES', 'KITCHENWARE']),
  price: s.min(s.number(), 0),
  stock: s.min(s.number(), 0),
});

export const PatchProduct = s.partial(CreateProduct);
