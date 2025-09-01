// /structs.js
import * as s from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';

/* ========== User ========== */
export const CreateUser = s.object({
  email: s.define('Email', isEmail),
  firstName: s.size(s.string(), 1, 30),
  lastName: s.size(s.string(), 1, 30),
  address: s.string(),
  userPreference: s.object({
    receiveEmail: s.boolean(),
  }),
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

/* ========== Order ========== */
const STATUSES = ['PENDING', 'COMPLETE'];

const Uuid = s.define('Uuid', (value) => isUuid.v4(value));

export const CreateOrder = s.object({
  userId: Uuid,
  orderItems: s.size(
    s.array(
      s.object({
        productId: Uuid,
        unitPrice: s.min(s.number(), 0),
        quantity: s.min(s.integer(), 1),
      })
    ),
    1,
    Infinity
  ),
});

export const PatchOrder = s.object({
  status: s.enums(STATUSES),
});

export const PostSavedProduct = s.object({
  productId: Uuid,
});
