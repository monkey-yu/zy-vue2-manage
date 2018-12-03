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

