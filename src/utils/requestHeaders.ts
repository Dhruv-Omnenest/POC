

export const getHeaders = () =>{
    const now = Date.now().toString();
    const deviceId = "2abe6bee-768f-4714-ab8d-2da64540bda8";
    return {
         "Content-Type": "application/json",
        "appName": "NVantage - Middleware Qa",
        "buildNumber": "10005",
        "packageName": "com.coditas.omnenest.omnenest_mobile_app.middlewareqa",
        "appVersion": "1.0.6",
        "os": "android",
        "deviceId": deviceId,
        "deviceIp": "10.0.2.16",
        "source": "MOB",
        "appInstallId": deviceId,
        "timestamp": now,
        "xRequestId": `${deviceId}-${now}`,
        "userAgent": "com.coditas.omnenest.omnenest_mobile_app.middlewareqa/1.0.6 (Android 15)"
    }
}