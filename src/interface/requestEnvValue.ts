export const requestEnvValue = async() => {
    try {
        const response = await fetch(
            process.env.REACT_APP_API_URL + "api/helper",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error('Network response was not ok: ', response.text);
        };

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was an error while requesting environment variables: " + error);
    };
}