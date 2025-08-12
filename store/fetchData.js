
const BASE_URL = "https://api.itbook.store/1.0/"

export async function getData (endpoint) {
    const res = await fetch(BASE_URL + endpoint);
    const data = await res.json()
    console.log(data);
    return data
    
}