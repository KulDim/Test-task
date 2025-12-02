import axios from "axios";

const API_BASE_URL = "https://app.tablecrm.com/api/v1";

export const createApiClient = (token) => {
	const client = axios.create({
		baseURL: API_BASE_URL,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	return {
		checkToken: async () => {
			try {
				const response = await client.get(`/organizations/?token=${token}`);
				return { isValid: true, data: response.data };
			} catch (error) {
				return {
					isValid: false,
					error: error.response?.data || error.message,
				};
			}
		},
        contragents: async () =>{
            const response = await client.get(`/contragents/?token=${token}`);
            return response.data
        },
        payboxes: async () =>{
            const response = await client.get(`/payboxes/?token=${token}`);
            return response.data
        },
        warehouses: async () =>{
            const response = await client.get(`/warehouses/?token=${token}`);
            return response.data
        },
        organizations: async () =>{
            const response = await client.get(`/organizations/?token=${token}`);
            return response.data
        },
        price_types: async () =>{
            const response = await client.get(`/price_types/?token=${token}`);
            return response.data
        },
        webapps: async () =>{
            const response = await client.get(`/nomenclature/?token=${token}&limit=100`);
            return response.data
        },
        alt_prices: async (id) =>{           
            const response = await client.get(`/alt_prices/${id}/?token=${token}`);
            return response.data
        }
	}
}




