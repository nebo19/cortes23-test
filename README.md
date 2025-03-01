# Project Setup and Running Instructions

## Prerequisites

- Node.js and npm
- AWS account (for SST deployment)
- Database access credentials

## Getting Started

### 1. Clone and Install Dependencies

After cloning the project, install the required dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
DB_HOST=                           -- leave empty will add this later when sst deploys the app
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

### 3. Deploy with SST

Make sure first to have aws profile set. If you don't have it run:

```bash
aws configure
```

And fill in all the information needed.

Deploy the application to AWS using SST:

```bash
npm run dev
```

After deployment, the SST console will display the database host. Update your `.env` file with this value as `DB_HOST` to enable migrations and seeds.

### 4. Set Up Database Access Tunnel

To connect to the database locally, you need to set up an SST tunnel:

1. Install the SST tunnel (requires sudo):

```bash
sudo sst tunnel install
```

2. Run the tunnel to connect to your VPC:

```bash
sst tunnel
```

This will establish a connection that allows your local environment to access the remote database.

### 5. Database Migrations and Seeding

Once the tunnel is active, run the following commands to set up your database:

1. Run migrations:

```bash
npm run sequelize:migrate
```

2. Seed the database with test data:

```bash
npm run sequelize:seed
```

**Note:** If any of these commands timeout, you may need to restart the SST tunnel by running `sst tunnel` again.

## Additional Resources

- [SST Documentation](https://sst.dev/docs/)
- [Sequelize Documentation](https://sequelize.org/)

## API Documentation

This section provides details about the available API endpoints, request/response formats, and examples.

### Base URL

When deployed, your API will be accessible at the URL provided by AWS API Gateway. During local development with SST, the API URL will be displayed in the console.

### Endpoints

#### 1. Get Quote

Returns a quote based on the provided input parameters.

- **URL**: `/quote`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:

```json
{
  "productId": "string",
  "state": "string",
  "sex": "string",
  "dateOfBirth": "string",
  "amount": "number",
  "benefitType": "string",
  "mode": "string",
  "riders": "array",
  "annualIncome": "number",
  "smoker": "boolean",
  "eliminationPeriod": "string"
}
```

**Successful Response** (200 OK):

```json
{
  "rates": [
    {
      "rate_class": "string",
      "term10": "number",
      "term15": "number",
      "term20": "number",
      "term30": "number"
    }
  ]
}
```

**Error Responses**:

- `400 Bad Request`: Invalid payload format

  ```json
  {
    "message": "Invalid payload"
  }
  ```

- `404 Not Found`: No rates found

  ```json
  {
    "message": "Rates not found"
  }
  ```

- `500 Internal Server Error`: Server-side error
  ```json
  {
    "message": "Internal server error"
  }
  ```

#### 2. Validate Rate

Validates if a selected premium rate is valid for a given rate class and coverage period.

- **URL**: `/validate`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:

```json
{
  "rateClass": "string",
  "coveragePeriod": "string",
  "selectedPremium": "number"
}
```

**Successful Response** (200 OK):

```json
{
  "message": "Success"
}
```

**Error Responses**:

- `400 Bad Request`: Invalid payload format

  ```json
  {
    "message": "Invalid payload"
  }
  ```

- `404 Not Found`: Rate not valid

  ```json
  {
    "message": "Rate not valid"
  }
  ```

- `500 Internal Server Error`: Server-side error
  ```json
  {
    "message": "Internal server error"
  }
  ```

### Example Usage

#### Quote Request Example

```bash
curl -X POST https://your-api-url/quote \
  -H "Content-Type: application/json" \
  -d '{
        "productId": "term-life",
        "state": "PA",
        "sex": "M",
        "dateOfBirth": "1970-01-01"
      }'
```

#### Validate Rate Request Example

```bash
curl -X POST https://your-api-url/validate \
  -H "Content-Type: application/json" \
  -d '{
    "rateClass": "standard",
    "coveragePeriod": "term15",
    "selectedPremium": 6215
  }'
```

## Database Schema

The application uses a MySQL database with the following schema:

### Products Table

Stores information about insurance products.

| Column     | Type         | Description                     |
| ---------- | ------------ | ------------------------------- |
| product_id | VARCHAR(50)  | Primary key, product identifier |
| name       | VARCHAR(100) | Product name                    |
| created_at | DATETIME     | Creation timestamp              |
| updated_at | DATETIME     | Last update timestamp           |

### Quotes Table

Stores quote requests with input parameters.

| Column           | Type        | Description                        |
| ---------------- | ----------- | ---------------------------------- |
| quote_id         | UUID        | Primary key, quote identifier      |
| product_id       | VARCHAR(50) | Foreign key to products.product_id |
| input_parameters | JSON        | Quote request parameters           |
| created_at       | DATETIME    | Creation timestamp                 |
| updated_at       | DATETIME    | Last update timestamp              |

### Rates Table

Stores rate options for different rate classes.

| Column       | Type        | Description                         |
| ------------ | ----------- | ----------------------------------- |
| rate_id      | UUID        | Primary key, rate identifier        |
| quote_id     | UUID        | Foreign key to quotes.quote_id      |
| rate_class   | VARCHAR(50) | Rate class                          |
| rate_options | JSON        | Available rate options and premiums |
| created_at   | DATETIME    | Creation timestamp                  |
| updated_at   | DATETIME    | Last update timestamp               |

### Relationships

- A **Product** can have multiple **Quotes**
- A **Quote** belongs to one **Product**
- A **Quote** can have multiple **Rates**
- A **Rate** belongs to one **Quote**
