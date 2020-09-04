export default function({store, redirect, route}) {
  if(route.name == 'organizations-organizationId-documents-id' 
    || route.name == 'organizations-organizationId-documents-create' || route.name == 'organizations-organizationId-documents' 
    || route.name == 'details' 
    || route.name == 'auth-login' || route.name == 'auth-forgot-password' || route.name == 'reset-password' || route.name == 'auth-register' 
    || route.name == 'organizations'  || route.name == 'organizations-create' || route.name == 'organizations-id' 
    || route.name == 'organizations-organizationId-admins-create' || route.name == 'organizations-organizationId-admins-id' 
    || route.name == 'profile' 
    || route.name == 'settings' 
    || route.name == 'permissions' 
    || route.name == 'holidays' || route.name == 'holidays-create' || route.name == 'holidays-id'
    || route.name == 'statuses' || route.name == 'statuses-create' || route.name == 'statuses-id'
    || route.name == 'units' || route.name == 'units-create' || route.name == 'units-id'
    || route.name == 'categories' || route.name == 'categories-create' || route.name == 'categories-id'
    || route.name == 'categories-categoryId-sub-categories' || route.name == 'categories-categoryId-sub-categories-create' || route.name == 'categories-categoryId-sub-categories-id'
    || route.name == 'categories-categoryId-sub-categories-subCategoryId-sub-2-categories' || route.name == 'categories-categoryId-sub-categories-subCategoryId-sub-2-categories-create' || route.name == 'categories-categoryId-sub-categories-subCategoryId-sub-2-categories-id'
    || route.name == 'categories-categoryId-sub-categories-subCategoryId-sub-2-categories-sub2CategoryId-sub-3-categories' || route.name == 'categories-categoryId-sub-categories-subCategoryId-sub-2-categories-sub2CategoryId-sub-3-categories-create' || route.name == 'categories-categoryId-sub-categories-subCategoryId-sub-2-categories-sub2CategoryId-sub-3-categories-id'
    || route.name == 'tags' || route.name == 'tags-create' || route.name == 'tags-id'
    || route.name == 'notifications' || route.name == 'notifications-create' || route.name == 'notifications-id'
    || route.name == 'cities' || route.name == 'cities-create' || route.name == 'cities-id'
    || route.name == 'offers' || route.name == 'offers-create' || route.name == 'offers-id'
    || route.name == 'delivery-users' || route.name == 'delivery-users-create' || route.name == 'delivery-users-id'
    || route.name == 'delivery-users-userId-documents' || route.name == 'delivery-users-userId-documents-create' || route.name == 'delivery-users-userId-documents-id'
    || route.name == 'customers' || route.name == 'customers-create' || route.name == 'customers-id'
    || route.name == 'orders' || route.name == 'orders-create' || route.name == 'orders-id'
    || route.name == 'orders-orderId-delivery-boys' || route.name == 'orders-orderId-delivery-boys-create' || route.name == 'orders-orderId-delivery-boys-id'
    || route.name == 'orders-orderId-order-statuses' || route.name == 'orders-orderId-order-statuses-create' || route.name == 'orders-orderId-order-statuses-id'

  )
    return;
  
  let user = store.getters['auth/user'];
  let organizations = user ? user.companies : ''
  let id = organizations.length ? organizations[0].id : '';
  let name = organizations.length ? organizations[0].name : '';
  let logo_path = organizations.length ? organizations[0].logo_path : '';
  let time_zone = organizations.length ? organizations[0].time_zone : 'Asia/Calcutta';
  if(!id) 
    id = store.getters['settings/organization'].value
  else
    store.dispatch('settings/setOrganization', {
      text: name,
      value: id,
      time_zone: time_zone,
      logo_path: logo_path
    })
  if(!id)
  {
    redirect('/settings')
  }
}