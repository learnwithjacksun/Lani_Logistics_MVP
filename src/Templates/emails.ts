const welcomeEmailTemplate = (name: string, dashboardLink: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Lani Logistics!</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #555;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                background-color: #fa781d;
                color: white;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Lani Logistics, ${name}!</h1>
            <p>Thank you for registering with us! We are thrilled to have you on board.</p>
            <p>At Lani Logistics, we strive to provide you with the best experience possible. Whether you're looking to dispatch packages, order food, or explore our other services, we are here to make your life easier and more comfortable.</p>

            <p>To get started, click the button below to access your dashboard:</p>
            <a href="${dashboardLink}" class="button">Go to Dashboard</a>
            <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p>Welcome aboard!</p>
            <div class="footer">
                <p>Best Regards,<br>Lani Logistics Team</p>
            </div>
        </div>
    </body>

    </html>
    `;
};

// Export the template
export { welcomeEmailTemplate };
