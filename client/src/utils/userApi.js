import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Become a host
export const becomeHost = async () => {
    try {
        const response = await axios.post(
            `${API_URL}/become-host`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};

// Get current user profile
export const getUserProfile = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`, { withCredentials: true });
        // console.log(response.data.role);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
};