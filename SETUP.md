# WStore Setup Guide

## 1. Google Sheets Configuration
The app uses Google Sheets as a database.
Sheet ID: `1skDZxz6N1g1o7P4nUAD5vuufA2YXkIghOAsv3mrrabM`

### Authentication (Required for "Write" access)
To allow the app to create stores and add products, you must set up a **Google Service Account**:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select existing).
3. Enable the **Google Sheets API**.
4. Go to **Credentials** > **Create Credentials** > **Service Account**.
5. Give it a name (e.g., "wstore-admin").
6. Click **Done**.
7. Click on the newly created Service Account email.
8. Go to the **Keys** tab > **Add Key** > **Create new key** > **JSON**.
9. A JSON file will download. Open it.
10. Copy the `client_email` and `private_key` from the JSON.

### Update `.env.local`
Open the `.env.local` file in the root directory and fill in the values:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

**IMPORTANT**:
- Share the Google Sheet (`1skDZxz6N1g1o7P4nUAD5vuufA2YXkIghOAsv3mrrabM`) with the `client_email` you just created. Give it **Editor** access.

## 2. Running the App
To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 3. How to Use

### Create a Store
1. Go to the home page.
2. Click **Create Your Store**.
3. Fill in the details (Store Name, WhatsApp, Username, Password).
4. "Pay" (Simulated) and Create.
5. You will be redirected to your new store page: `http://localhost:3000/@yourstore`.

### Manage Store (Dashboard)
1. Go to `/login` or click "Login" in the header.
2. Enter your username and password.
3. In the Dashboard, click **+ Add Product**.
4. Enter product details (Name, Price, Category, Image URL).
   - *Tip*: Use a public image URL (e.g., from Unsplash) for testing.
5. The product will appear on your Store Page (`/@yourstore`) immediately or after a refresh.

### WhatsApp Ordering
1. Visit your store page.
2. Click **Order on WhatsApp** on any product.
3. It will open WhatsApp with a pre-filled message containing the product details.
