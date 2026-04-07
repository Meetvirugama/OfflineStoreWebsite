#!/bin/bash

BASE="http://localhost:5001/api"

echo "🚀 START FULL ERP TEST"

# -------------------------
# 1. REGISTER USERS
# -------------------------

echo "👤 Register Admin"
curl -s -X POST $BASE/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Admin","email":"admin@test.com","password":"123456","role":"ADMIN"}'

echo -e "\n👤 Register Staff"
curl -s -X POST $BASE/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Staff","email":"staff@test.com","password":"123456","role":"STAFF"}'

# -------------------------
# 2. LOGIN ADMIN
# -------------------------

echo -e "\n🔐 Login Admin"
TOKEN=$(curl -s -X POST $BASE/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@test.com","password":"123456"}' | jq -r '.token')

echo "TOKEN: $TOKEN"

# -------------------------
# 3. CREATE SUPPLIER
# -------------------------

echo -e "\n🏭 Create Supplier"
curl -s -X POST $BASE/suppliers \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"name":"Supplier A","mobile":"9999999999"}'

# -------------------------
# 4. CREATE PRODUCTS
# -------------------------

echo -e "\n📦 Create Product 1"
curl -s -X POST $BASE/products \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"name":"Rice","supplier_id":1,"mrp":100,"selling_price":90,"quantity":50,"created_by":1}'

echo -e "\n📦 Create Product 2 (LOW STOCK)"
curl -s -X POST $BASE/products \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"name":"Oil","supplier_id":1,"mrp":200,"selling_price":180,"quantity":5,"created_by":1}'

# -------------------------
# 5. CREATE CUSTOMER
# -------------------------

echo -e "\n🧍 Create Customer"
curl -s -X POST $BASE/customers \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"name":"Meet","mobile":"8888888888"}'

# -------------------------
# 6. CREATE ORDER
# -------------------------

echo -e "\n🛒 Create Order"
curl -s -X POST $BASE/orders \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "customer_id":1,
  "created_by":1,
  "items":[
    {"product_id":1,"quantity":2},
    {"product_id":2,"quantity":1}
  ]
}'

# -------------------------
# 7. PAYMENT
# -------------------------

echo -e "\n💰 Payment"
curl -s -X POST $BASE/payments \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"order_id":1,"amount":200,"payment_mode":"CASH","created_by":1}'

# -------------------------
# 8. LOW STOCK CHECK
# -------------------------

echo -e "\n⚠️ Low Stock"
curl -s -H "Authorization: Bearer $TOKEN" \
$BASE/products/low-stock

echo -e "\n✅ TEST COMPLETE"