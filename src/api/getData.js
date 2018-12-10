import fetch from '@/config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/admin/login', data, 'POST');

export const userCount = date => fetch('/statis/user/' + date + '/count');

export const orderCount = date => fetch('/statis/order/' + date + '/count');

export const adminCount = date => fetch('/statis/admin/' + date + '/count');

export const allUserCount = data => fetch('/v1/users/count', data);

export const allOrderCount = data => fetch('/bos/orders/count', data);

export const allAdminCount = () => fetch('/admin/count');

export const getAdminInfo = () => fetch('/admin/info');

//退出
export const singout = () => fetch('/admin/singout');

export const getUserCount = data => fetch('/v1/users/count',data);
export const getUserList = data => fetch('/v1/users/list', data);

export const cityGuess =() => fetch('/v1/cities',{
  type:'guess'
});

export const getResturantsCount = () => fetch('/shopping/restaurants/count');
export const getResturants = data => fetch('/shopping/restaurants', data);
export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category');
export const updateResturant = data => fetch('/shopping/updateshop', data, 'POST');

/**
 * 删除餐馆
 */

export const deleteResturant = restaurant_id => fetch('/shopping/restaurant/' + restaurant_id, {}, 'DELETE');
export const searchplace = (cityid, value) => fetch('/v1/pois', {
  type: 'search',
  city_id: cityid,
  keyword: value
});
