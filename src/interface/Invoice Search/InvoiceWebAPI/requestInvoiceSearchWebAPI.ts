import { sendCustomTraceLog } from "src/interface/Axiom Log/sendCustomTraceLog";
import { getUserInfo } from "src/interface/requestSessionStorage";

export const requestInvoiceSearchWebAPI = async (invoiceNum: string[]) => {
    const user = getUserInfo();
    try {
        const requestBody = {
            userId: user.email,
            invoice_number: invoiceNum
        }

        const response = await fetch(
            process.env.REACT_APP_API_URL + "api/invoicesearch_webapi",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody)
            }
        )

        if (!response.ok) {
            sendCustomTraceLog(user, "Network response was not ok: " + response.text, "ERROR", "requestInvoiceSearch.ts");
            return;
        }

        sendCustomTraceLog(user, "requestInvoiceSearch succeeded.", "INFO", "requestInvoiceSearch.ts");

        const data = await response.json();
        return data;
    } catch (error) {
        sendCustomTraceLog(user, "There was an error while requesting invoice search: " + error, "ERROR", "requestInvoiceSearch.ts");
        return;
    }
}