interface LogData {
    userId: string | null;
    message: string;
    level: string;
    timeStamp: string;
    environment: string;
    service: string;
    version: string | undefined;
}

export const sendCustomTraceLog = async (user: { email?: string | null } | null, message: string, logLevel: string, fileName: string) => {
    try {
        const requestBody: LogData = {
            userId: user?.email ?? null,
            message: message,
            level: logLevel,
            timeStamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            service: fileName,
            version: process.env.REACT_APP_VERSION
        }

        const response = await fetch(
            process.env.REACT_APP_API_URL + "api/sendlog",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)  
            }
        )

        const responseData = await response.json();

        if (!response.ok) {
            console.error('Network response was not ok', responseData);
        }
    } catch (error) {
        console.error("There was an error!", error);
    }
}