export const requestInvoiceSearch = async (invoiceNum: string[]) => {
    try {
        const response = await fetch(
            process.env.REACT_APP_API_URL + 'api/invoicesearch',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ invoice_number: invoiceNum })
            }
        )

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was an error!", error);
    }
}