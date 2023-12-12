export const getUserInfo = () => {
    try {
        const value = sessionStorage.getItem("user");
        if (value === null) {
            return null;
        }
        return JSON.parse(value);
    }
    catch (error) {
        console.error("There was an error while getting session storage: " + error);
    }
};

export const setUserInfo = (value: any) => {
    try {
        sessionStorage.setItem("user", JSON.stringify(value));
    } catch (error) {
        console.error("There was an error while setting session storage: " + error);
    }
};