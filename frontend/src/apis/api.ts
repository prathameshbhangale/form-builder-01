const BASE_URL: string = String(import.meta.env.VITE_API_BASE_URL)

export const signin_url = `${BASE_URL}/auth/register`
export const login_url = `${BASE_URL}/auth/login`
export const form_create_url = `${BASE_URL}/form/create`
export const form_get_all_of_user = `${BASE_URL}/form/forms`
export const form_add_fields = `${BASE_URL}/field/insertmany`
export const form_response_url = `${BASE_URL}/form/accessurl`
export const form_response_init = `${BASE_URL}/resp/init`
export const form_response_submit = `${BASE_URL}/resp/submit`