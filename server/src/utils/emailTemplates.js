export const getOtpEmailTemplate = (otp, name = "Farmer") => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f8f5; padding: 20px;">

    <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

      <!-- 🌿 Header -->
      <div style="background: linear-gradient(135deg, #2e7d32, #66bb6a); padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">🌿 AgroMart</h2>
        <p style="margin: 5px 0 0;">Fresh. Natural. Trusted.</p>
      </div>

      <!-- 🌾 Body -->
      <div style="padding: 25px; text-align: center;">
        <h3 style="color: #2e7d32;">Hello, ${name} 👋</h3>

        <p style="color: #555;">
          Welcome to AgroMart! Please use the OTP below to verify your account.
        </p>

        <!-- OTP Box -->
        <div style="margin: 25px 0;">
          <span style="
            display: inline-block;
            background: #e8f5e9;
            color: #1b5e20;
            font-size: 28px;
            letter-spacing: 5px;
            padding: 12px 25px;
            border-radius: 8px;
            font-weight: bold;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #777; font-size: 14px;">
          This OTP is valid for 10 minutes.
        </p>

        <p style="color: #999; font-size: 12px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>

      <!-- 🌿 Footer -->
      <div style="background: #f1f8e9; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} AgroMart | Growing Together 🌱
      </div>

    </div>

  </div>
  `;
};

export const getNotificationEmailTemplate = (message, name = "Farmer") => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f8f5; padding: 20px;">

    <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

      <!-- 🌿 Header -->
      <div style="background: linear-gradient(135deg, #2e7d32, #66bb6a); padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">🌿 AgroMart</h2>
        <p style="margin: 5px 0 0;">Smart Farming. Smart Business.</p>
      </div>

      <!-- 🌾 Body -->
      <div style="padding: 25px; text-align: center;">
        <h3 style="color: #2e7d32;">Hello, ${name} 👋</h3>

        <p style="color: #555; font-size: 16px;">
          ${message}
        </p>

        <div style="margin-top: 20px; padding: 10px; background: #e8f5e9; border-radius: 6px;">
          🌱 Stay connected with AgroMart for latest updates
        </div>
      </div>

      <!-- 🌿 Footer -->
      <div style="background: #f1f8e9; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} AgroMart | Growing Together 🌱
      </div>

    </div>

  </div>
  `;
};

export const getPaymentDueEmailTemplate = (name = "Farmer", order_id, amount, due_date) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f8f5; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

      <!-- 🌿 Header -->
      <div style="background: linear-gradient(135deg, #ef5350, #e53935); padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">⚠️ Payment Due Notice</h2>
        <p style="margin: 5px 0 0;">AgroMart | Action Required</p>
      </div>

      <!-- 🌾 Body -->
      <div style="padding: 25px; text-align: center;">
        <h3 style="color: #333;">Hello, ${name} 👋</h3>

        <p style="color: #555; font-size: 15px;">
          This is a friendly reminder that your payment for <strong>Order #${order_id}</strong> is unfortunately past due or currently due.
        </p>

        <div style="margin: 20px 0; background: #fff3e0; border-left: 4px solid #ff9800; padding: 15px; text-align: left;">
          <p style="margin: 0 0 5px; color: #333;"><strong>Amount Due:</strong> <span style="color: #d32f2f; font-size: 18px;">₹${amount}</span></p>
          <p style="margin: 0; color: #666; font-size: 14px;"><strong>Due Date:</strong> ${new Date(due_date).toLocaleDateString()}</p>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.5;">
          To avoid any late fees or disruptions to your account standing, please complete your payment as soon as possible via your AgroMart Dashboard.
        </p>
      </div>

      <!-- 🌿 Footer -->
      <div style="background: #f1f8e9; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} AgroMart | Growing Together 🌱
      </div>
    </div>
  </div>
  `;
};

export const getInvoiceEmailTemplate = (name = "Farmer", order_id, final_amount) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f8f5; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

      <!-- 🌿 Header -->
      <div style="background: linear-gradient(135deg, #2e7d32, #43a047); padding: 25px; text-align: center; color: white;">
        <div style="font-size: 40px; margin-bottom: 10px;">🧾</div>
        <h2 style="margin: 0;">Invoice Generated</h2>
        <p style="margin: 5px 0 0; opacity: 0.9;">Thank you for shopping with AgroMart!</p>
      </div>

      <!-- 🌾 Body -->
      <div style="padding: 25px; text-align: center;">
        <h3 style="color: #2e7d32;">Hello, ${name} 👋</h3>

        <p style="color: #555; font-size: 15px;">
          Your order has been fully paid, and we have successfully generated your digital invoice.
        </p>

        <div style="margin: 20px 0; background: #f5f7f5; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px;">
          <p style="margin: 0 0 5px; color: #333;"><strong>Order Number:</strong> #${order_id}</p>
          <p style="margin: 0; color: #333;"><strong>Total Settled:</strong> <span style="color: #2e7d32; font-weight: bold;">₹${final_amount}</span></p>
        </div>

        <p style="color: #777; font-size: 14px;">
          Your <strong>Tax Invoice PDF</strong> is securely attached to this email.
        </p>

        <!-- DOWNLOAD PROMPT -->
        <div style="margin-top: 25px;">
          <a href="#attachment" style="display: inline-block; background: #2e7d32; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(46, 125, 50, 0.2);">
            ⬇ Download Attached PDF
          </a>
        </div>
      </div>

      <!-- 🌿 Footer -->
      <div style="background: #f1f8e9; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} AgroMart | Growing Together 🌱
      </div>
    </div>
  </div>
  `;
};

export const getOrderConfirmationTemplate = (name = "Farmer", order_id, final_amount) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f8f5; padding: 20px;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

      <!-- 🌿 Header -->
      <div style="background: linear-gradient(135deg, #2e7d32, #66bb6a); padding: 25px; text-align: center; color: white;">
        <div style="font-size: 40px; margin-bottom: 10px;">🛒</div>
        <h2 style="margin: 0;">Order Confirmed!</h2>
        <p style="margin: 5px 0 0; opacity: 0.9;">We've received your order and are processing it.</p>
      </div>

      <!-- 🌾 Body -->
      <div style="padding: 25px; text-align: center;">
        <h3 style="color: #2e7d32;">Hello, ${name} 👋</h3>

        <p style="color: #555; font-size: 15px;">
          Great news! Your order <strong>#${order_id}</strong> has been successfully placed at AgroMart. 🌿
        </p>

        <div style="margin: 20px 0; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 8px; padding: 15px;">
          <p style="margin: 0 0 5px; color: #333;"><strong>Order Number:</strong> #${order_id}</p>
          <p style="margin: 0; color: #333;"><strong>Total Amount:</strong> <span style="color: #2e7d32; font-weight: bold;">₹${final_amount}</span></p>
        </div>

        <p style="color: #666; font-size: 14px; line-height: 1.5;">
          Our team is now preparing your items for delivery. You will receive another update as soon as your order is dispatched.
        </p>

        <div style="margin-top: 25px;">
          <a href="http://localhost:5173/orders/${order_id}" style="display: inline-block; background: #2e7d32; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 100px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(46, 125, 50, 0.2);">
            View Order Status
          </a>
        </div>
      </div>

      <!-- 🌿 Footer -->
      <div style="background: #f1f8e9; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} AgroMart | Freshness Guaranteed 🌱
      </div>
    </div>
  </div>
  `;
};