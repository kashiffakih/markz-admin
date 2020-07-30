export default function({store, redirect, route}) {
  if(route.name == 'details' || route.name == 'auth-login' || route.name == 'auth-forgot-password' || route.name == 'reset-password' || route.name == 'auth-register' || route.name == 'organizations'  || route.name == 'organizations-create' || route.name == 'organizations-id' || route.name == 'organizations-organizationId-admins-create' || route.name == 'organizations-organizationId-admins-id' || route.name == 'profile' || route.name == 'settings' || route.name == 'permissions' || route.name == 'holidays' || route.name == 'holidays-create' || route.name == 'holidays-id')
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