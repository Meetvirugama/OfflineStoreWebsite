-- =========================
-- CLEAN DROP (SAFE ORDER)
-- =========================
DROP TABLE IF EXISTS cart_item CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS ledger CASCADE;
DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS supplier CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- =========================
-- ENUMS
-- =========================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'STAFF', 'CUSTOMER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =========================
-- USERS (MATCHED WITH SEQUELIZE)
-- =========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT,
    auth_provider VARCHAR(20) DEFAULT 'LOCAL',

    role user_role DEFAULT 'CUSTOMER',

    is_verified BOOLEAN DEFAULT FALSE,

    otp VARCHAR(10),
    otp_expiry TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CUSTOMER
-- =========================
CREATE TABLE customer (
    id SERIAL PRIMARY KEY,

    user_id INT UNIQUE,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    mobile VARCHAR(15) UNIQUE NOT NULL,

    village VARCHAR(100),
    gst VARCHAR(20),

    credit_limit DECIMAL(10,2) DEFAULT 0,
    total_purchase DECIMAL(10,2) DEFAULT 0,
    total_paid DECIMAL(10,2) DEFAULT 0,
    total_due DECIMAL(10,2) DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0,

    tag VARCHAR(20) DEFAULT 'REGULAR',
    credit_score INT DEFAULT 100,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================
-- SUPPLIER
-- =========================
CREATE TABLE supplier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15)
);

-- =========================
-- PRODUCT
-- =========================
CREATE TABLE product (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),

    mrp DECIMAL(10,2),
    selling_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),

    unit VARCHAR(20),
    batch_number VARCHAR(50),
    expiry_date DATE,

    image VARCHAR(255),
    description TEXT,
    stock INT DEFAULT 0,

    supplier_id INT,
    created_by INT NOT NULL,

    FOREIGN KEY (supplier_id) REFERENCES supplier(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- =========================
-- INVENTORY
-- =========================
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,

    product_id INT NOT NULL,
    quantity_change INT NOT NULL,

    type VARCHAR(10) CHECK (type IN ('IN','OUT')),

    reference_type VARCHAR(50),
    reference_id INT,

    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,

    customer_id INT NOT NULL,

    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    total_amount DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,

    cgst DECIMAL(10,2) DEFAULT 0,
    sgst DECIMAL(10,2) DEFAULT 0,
    igst DECIMAL(10,2) DEFAULT 0,
    gst_total DECIMAL(10,2) DEFAULT 0,

    final_amount DECIMAL(10,2) DEFAULT 0,
    paid_amount DECIMAL(10,2) DEFAULT 0,

    invoice_number VARCHAR(50) UNIQUE,

    status VARCHAR(20) DEFAULT 'PENDING',
    due_date DATE,

    created_by INT NOT NULL,

    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customer(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,

    order_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity INT NOT NULL,
    price DECIMAL(10,2),
    total DECIMAL(10,2),

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- =========================
-- PAYMENT
-- =========================
CREATE TABLE payment (
    id SERIAL PRIMARY KEY,

    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,

    payment_mode VARCHAR(10)
        CHECK (payment_mode IN ('CASH','UPI','CARD','BANK')),

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    reference_no VARCHAR(100),

    created_by INT NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- =========================
-- LEDGER
-- =========================
CREATE TABLE ledger (
    id SERIAL PRIMARY KEY,

    customer_id INT NOT NULL,

    type VARCHAR(10) CHECK (type IN ('DEBIT','CREDIT')),

    amount DECIMAL(10,2) NOT NULL,
    balance DECIMAL(10,2),

    reference_type VARCHAR(50),
    reference_id INT,

    description TEXT,

    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

-- =========================
-- CART
-- =========================
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,

    customer_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

-- =========================
-- CART ITEM
-- =========================
CREATE TABLE cart_item (
    id SERIAL PRIMARY KEY,

    cart_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity INT DEFAULT 1,

    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- =========================
-- MANDI PRICES (MIST)
-- =========================
CREATE TABLE mandi_prices (
    id SERIAL PRIMARY KEY,

    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    market VARCHAR(100) NOT NULL,
    commodity VARCHAR(100) NOT NULL,

    min_price FLOAT NOT NULL,
    max_price FLOAT NOT NULL,
    modal_price FLOAT NOT NULL,
    
    arrival_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (market, commodity, arrival_date)
);

CREATE INDEX idx_mandi_state ON mandi_prices(state);
CREATE INDEX idx_mandi_district ON mandi_prices(district);
CREATE INDEX idx_mandi_commodity ON mandi_prices(commodity);
CREATE INDEX idx_mandi_date ON mandi_prices(arrival_date);