export default function({ $axios, store }) {
  $axios.onError(error => {
    if (error && error.response) console.log(error.response.status);
    store.dispatch(
      "validation/setErrors",
      error && error.response && error.response.data && error.response.data.errors
        ? error.response.data.errors
        : {}
    );
  });

  $axios.onRequest(config => {
    const user = store.getters["auth/user"];
    const organizations = user && user.companies ? user.companies : [];
    let id = organizations.length ? organizations[0].id : "";
    if (!id) {
      const org = store.getters["settings/organization"];
      id = org ? org.value : "";
    }
    // headers.common can be missing (server-side / newer axios), so make sure it exists
    if (!config.headers) config.headers = {};
    if (config.headers.common) config.headers.common["company-id"] = id;
    config.headers["company-id"] = id;
    store.dispatch("validation/clearErrors");
    return config;
  });
}
